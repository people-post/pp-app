import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const srcRoot = path.join(repoRoot, 'src');

const orderedLayers = [
  { name: 'lib/ext', prefix: 'src/lib/ext/', rank: 0 },
  { name: 'lib/framework', prefix: 'src/lib/framework/', rank: 1 },
  { name: 'lib/ui', prefix: 'src/lib/ui/', rank: 2 },
  { name: 'common/constants', prefix: 'src/common/constants/', rank: 3 },
  { name: 'common/datatypes', prefix: 'src/common/datatypes/', rank: 4 },
  { name: 'common/plt', prefix: 'src/common/plt/', rank: 5 },
  { name: 'common/dba', prefix: 'src/common/dba/', rank: 6 },
  { name: 'common/other', prefix: 'src/common/', rank: 7 },
  { name: 'misc', prefix: 'src/misc/', rank: 8 },
  { name: 'sectors', prefix: 'src/sectors/', rank: 8 },
  { name: 'session', prefix: 'src/session/', rank: 9 },
  { name: 'entry', prefix: 'src/', rank: 10 },
];

const sourceExtensions = new Set(['.ts', '.js']);
const importPatterns = [
  /(?:^|\n)\s*import\s+(?:type\s+)?(?:[^'"\n]*?\s+from\s+)?['"]([^'"]+)['"]/g,
  /(?:^|\n)\s*export\s+[^'"\n]*?\s+from\s+['"]([^'"]+)['"]/g,
  /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
];

function walk(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
      continue;
    }

    if (entry.name.endsWith('.d.ts')) {
      continue;
    }

    if (sourceExtensions.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

function normalizePath(filePath) {
  return path.relative(repoRoot, filePath).split(path.sep).join('/');
}

function getLayer(relativePath) {
  if (relativePath.startsWith('src/types/')) {
    return null;
  }

  for (const layer of orderedLayers) {
    if (relativePath.startsWith(layer.prefix)) {
      return layer;
    }
  }

  return null;
}

function resolveImport(fromFile, specifier) {
  if (!specifier.startsWith('.')) {
    return null;
  }

  const resolved = path.resolve(path.dirname(fromFile), specifier);
  const ext = path.extname(resolved);
  const candidates = [];

  if (ext) {
    candidates.push(resolved);
    if (ext === '.js') {
      candidates.push(resolved.slice(0, -3) + '.ts');
      candidates.push(resolved.slice(0, -3) + '.d.ts');
    }
    if (ext === '.ts') {
      candidates.push(resolved.slice(0, -3) + '.js');
      candidates.push(resolved.slice(0, -3) + '.d.ts');
    }
  } else {
    candidates.push(`${resolved}.ts`);
    candidates.push(`${resolved}.js`);
    candidates.push(`${resolved}.d.ts`);
    candidates.push(path.join(resolved, 'index.ts'));
    candidates.push(path.join(resolved, 'index.js'));
  }

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }

  if (resolved.startsWith(srcRoot)) {
    return resolved;
  }

  return null;
}

function getLineNumber(fileContent, matchIndex) {
  return fileContent.slice(0, matchIndex).split('\n').length;
}

const files = walk(srcRoot);
const violations = [];
const unclassified = new Set();

for (const filePath of files) {
  const relativeFilePath = normalizePath(filePath);
  const sourceLayer = getLayer(relativeFilePath);
  if (!sourceLayer) {
    if (!relativeFilePath.startsWith('src/types/')) {
      unclassified.add(relativeFilePath);
    }
    continue;
  }

  const content = fs.readFileSync(filePath, 'utf8');

  for (const pattern of importPatterns) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const specifier = match[1];
      const targetPath = resolveImport(filePath, specifier);
      if (!targetPath) {
        continue;
      }

      const relativeTargetPath = normalizePath(targetPath);
      const targetLayer = getLayer(relativeTargetPath);
      if (!targetLayer) {
        if (relativeTargetPath.startsWith('src/') &&
            !relativeTargetPath.startsWith('src/types/')) {
          unclassified.add(relativeTargetPath);
        }
        continue;
      }

      if (sourceLayer.rank < targetLayer.rank) {
        violations.push({
          source: relativeFilePath,
          line: getLineNumber(content, match.index),
          sourceLayer: sourceLayer.name,
          target: relativeTargetPath,
          targetLayer: targetLayer.name,
          specifier,
        });
      }
    }
  }
}

violations.sort((left, right) => {
  const fileCompare = left.source.localeCompare(right.source);
  if (fileCompare !== 0) {
    return fileCompare;
  }
  return left.line - right.line;
});

if (violations.length === 0) {
  console.log('No layer violations found.');
} else {
  console.error(`Found ${violations.length} layer violation${violations.length === 1 ? '' : 's'}:`);
  for (const violation of violations) {
    console.error(
      `${violation.source}:${violation.line} [${violation.sourceLayer}] -> ${violation.target} ` +
      `[${violation.targetLayer}] via ${violation.specifier}`
    );
  }
}

if (unclassified.size > 0) {
  console.warn('\nUnclassified src paths skipped:');
  for (const filePath of [...unclassified].sort()) {
    console.warn(`- ${filePath}`);
  }
}

process.exitCode = violations.length > 0 ? 1 : 0;