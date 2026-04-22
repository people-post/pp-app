import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const srcRoot = path.join(repoRoot, 'src');
const typesRoot = path.join(srcRoot, 'types');

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
      if (fullPath.startsWith(`${typesRoot}${path.sep}`)) {
        files.push(fullPath);
      }
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

function isTypesPath(relativePath) {
  return relativePath.startsWith('src/types/');
}

function getLayer(relativePath) {
  if (isTypesPath(relativePath)) {
    return null;
  }

  for (const layer of orderedLayers) {
    if (relativePath.startsWith(layer.prefix)) {
      return layer;
    }
  }

  return null;
}

/** First path segment under `src/sectors/` (e.g. `blog` for `src/sectors/blog/Foo.ts`), or null. */
function getSectorFolder(relativePath) {
  const prefix = 'src/sectors/';
  if (!relativePath.startsWith(prefix)) {
    return null;
  }
  const rest = relativePath.slice(prefix.length);
  const slash = rest.indexOf('/');
  if (slash === -1) {
    return null;
  }
  return rest.slice(0, slash);
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
const layerViolations = [];
const sectorCrossViolations = [];
const typesIndependenceViolations = [];
const unclassified = new Set();

for (const filePath of files) {
  const relativeFilePath = normalizePath(filePath);
  const sourceIsTypes = isTypesPath(relativeFilePath);
  const sourceLayer = getLayer(relativeFilePath);
  if (!sourceLayer) {
    if (!sourceIsTypes) {
      unclassified.add(relativeFilePath);
    }
    if (!sourceIsTypes) {
      continue;
    }
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
      const targetIsTypes = isTypesPath(relativeTargetPath);

      if (sourceIsTypes) {
        if (!targetIsTypes) {
          typesIndependenceViolations.push({
            source: relativeFilePath,
            line: getLineNumber(content, match.index),
            target: relativeTargetPath,
            specifier,
          });
        }
        continue;
      }

      const targetLayer = getLayer(relativeTargetPath);
      if (!targetLayer) {
        if (relativeTargetPath.startsWith('src/') && !targetIsTypes) {
          unclassified.add(relativeTargetPath);
        }
        continue;
      }

      if (sourceLayer.rank < targetLayer.rank) {
        layerViolations.push({
          source: relativeFilePath,
          line: getLineNumber(content, match.index),
          sourceLayer: sourceLayer.name,
          target: relativeTargetPath,
          targetLayer: targetLayer.name,
          specifier,
        });
      }

      const sourceSector = getSectorFolder(relativeFilePath);
      const targetSector = getSectorFolder(relativeTargetPath);
      if (
        sourceSector &&
        targetSector &&
        sourceSector !== targetSector
      ) {
        sectorCrossViolations.push({
          source: relativeFilePath,
          line: getLineNumber(content, match.index),
          sourceSector,
          target: relativeTargetPath,
          targetSector,
          specifier,
        });
      }
    }
  }
}

layerViolations.sort((left, right) => {
  const fileCompare = left.source.localeCompare(right.source);
  if (fileCompare !== 0) {
    return fileCompare;
  }
  return left.line - right.line;
});

sectorCrossViolations.sort((left, right) => {
  const fileCompare = left.source.localeCompare(right.source);
  if (fileCompare !== 0) {
    return fileCompare;
  }
  return left.line - right.line;
});

if (layerViolations.length === 0) {
  console.log('No layer violations found.');
} else {
  console.error(
    `Found ${layerViolations.length} layer violation${layerViolations.length === 1 ? '' : 's'}:`
  );
  for (const violation of layerViolations) {
    console.error(
      `${violation.source}:${violation.line} [${violation.sourceLayer}] -> ${violation.target} ` +
      `[${violation.targetLayer}] via ${violation.specifier}`
    );
  }
}

if (sectorCrossViolations.length === 0) {
  console.log('No sector cross-dependency violations found.');
} else {
  console.error(
    `Found ${sectorCrossViolations.length} sector cross-dependency violation` +
    `${sectorCrossViolations.length === 1 ? '' : 's'} ` +
    '(src/sectors/<folder> must not import from another sector folder):'
  );
  for (const violation of sectorCrossViolations) {
    console.error(
      `${violation.source}:${violation.line} [sectors/${violation.sourceSector}] -> ` +
      `${violation.target} [sectors/${violation.targetSector}] via ${violation.specifier}`
    );
  }
}

if (typesIndependenceViolations.length === 0) {
  console.log('No types independence violations found.');
} else {
  console.error(
    `Found ${typesIndependenceViolations.length} types independence violation` +
    `${typesIndependenceViolations.length === 1 ? '' : 's'} ` +
    '(src/types may only import from src/types or external packages):'
  );
  for (const violation of typesIndependenceViolations) {
    console.error(
      `${violation.source}:${violation.line} [types] -> ${violation.target} ` +
      `via ${violation.specifier}`
    );
  }
}

if (unclassified.size > 0) {
  console.warn('\nUnclassified src paths skipped:');
  for (const filePath of [...unclassified].sort()) {
    console.warn(`- ${filePath}`);
  }
}

process.exitCode =
  layerViolations.length > 0 ||
  sectorCrossViolations.length > 0 ||
  typesIndependenceViolations.length > 0
    ? 1
    : 0;