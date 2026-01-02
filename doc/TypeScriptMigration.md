# TypeScript Migration Guide

This document outlines the foundation setup for migrating the pp-app project from JavaScript to TypeScript.

## Foundation Setup

The TypeScript foundation has been set up with the following components:

### 1. Dependencies

- **TypeScript** (`typescript`): The TypeScript compiler
- **@types/node**: Type definitions for Node.js APIs

Install dependencies:
```bash
npm install
```

### 2. Configuration

#### `tsconfig.json`
The TypeScript configuration is set up for gradual migration:
- **`allowJs: true`**: Allows JavaScript and TypeScript files to coexist
- **`checkJs: false`**: JavaScript files are not type-checked initially (can be enabled later)
- **`strict: true`**: Enables strict type checking for TypeScript files
- **`noEmit: true`**: TypeScript only type-checks (esbuild handles compilation)
- **`moduleResolution: "bundler"`**: Optimized for bundler-based workflows

#### Global Types
- `src/types/global.d.ts`: Contains global type declarations (e.g., `window.G`)

### 3. Build System

The existing `build.js` already supports TypeScript:
- esbuild is configured with TypeScript loaders (`.ts`, `.tsx`)
- No changes needed to the build process
- TypeScript files will be automatically transpiled during bundling

### 4. Scripts

New npm scripts available:
- `npm run type-check`: Type-check all TypeScript files without emitting
- `npm run type-check:watch`: Watch mode for type checking

## Migration Strategy

### Gradual Migration Approach

1. **Start with new files**: Write new code in TypeScript
2. **Migrate incrementally**: Convert existing `.js` files to `.ts` one at a time
3. **Enable type checking**: Once comfortable, set `checkJs: true` in `tsconfig.json` to type-check JavaScript files
4. **Add types gradually**: Start with `any` types and refine as you go

### Migration Steps for Individual Files

1. **Rename file**: `.js` → `.ts`
2. **Add type annotations**: Start with function parameters and return types
3. **Fix type errors**: Address TypeScript errors incrementally
4. **Test**: Ensure functionality remains unchanged
5. **Commit**: Commit each file migration separately for easier review

### Recommended Migration Order

1. **Utility files**: Start with simple utility functions
2. **Data types**: Migrate type definitions and interfaces
3. **Business logic**: Core application logic
4. **UI components**: GUI and framework code
5. **Entry points**: Finally migrate `app.js` and `sw.js`

### Type Safety Levels

You can adjust strictness in `tsconfig.json`:

- **Current**: Strict mode enabled for TypeScript files
- **Relaxed**: Set `strict: false` if needed during migration
- **Progressive**: Enable `checkJs: true` once most files are migrated

## Best Practices

1. **Use JSDoc for gradual typing**: Add JSDoc comments to JavaScript files before converting:
   ```javascript
   /**
    * @param {string} userId
    * @param {string} primaryColor
    * @returns {void}
    */
   function init(userId, primaryColor) { ... }
   ```

2. **Leverage type inference**: Let TypeScript infer types where possible
3. **Create shared types**: Define common interfaces in `src/types/`
4. **Use `any` sparingly**: Only when necessary during migration, then refine

## Troubleshooting

### Common Issues

1. **Module resolution errors**: Ensure `moduleResolution: "bundler"` in `tsconfig.json`
2. **Global types not found**: Check that `src/types/global.d.ts` is included
3. **Build errors**: Verify esbuild TypeScript loader configuration in `build.js`

### Getting Help

- TypeScript Handbook: https://www.typescriptlang.org/docs/
- TypeScript Playground: https://www.typescriptlang.org/play

## Next Steps

1. Run `npm install` to install TypeScript dependencies
2. Run `npm run type-check` to verify the setup
3. Start migrating files incrementally
4. Update this document as you learn and refine the migration process

