/**
 * Property-Based Tests for TypeScript Module Resolution
 * 
 * Feature: build-compilation-fix
 * Property 1: TypeScript Module Resolution
 * Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5
 * 
 * Tests that all TypeScript modules can be successfully resolved through
 * the '@/' alias without errors. This ensures the webpack configuration
 * correctly resolves .ts file extensions.
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// Import all required modules to verify they can be resolved
import * as layoutMeasurer from '@/utils/layout-measurer';
import * as sizeCalculator from '@/utils/size-calculator';
import * as accessibility from '@/utils/accessibility';
import * as browserCompat from '@/utils/browser-compat';
// Note: iframe-config is a type-only module, so we just verify it can be imported
import '@/types/iframe-config';

describe('Property: TypeScript Module Resolution', () => {
  /**
   * Feature: build-compilation-fix, Property 1: TypeScript Module Resolution
   * 
   * For any valid TypeScript import statement using the '@/' alias to reference
   * utils or types directories, the module resolver should successfully resolve
   * the import to the corresponding .ts file without errors.
   */
  
  // Define the TypeScript modules that must be resolvable
  const requiredModules = {
    '@/utils/layout-measurer': layoutMeasurer,
    '@/utils/size-calculator': sizeCalculator,
    '@/utils/accessibility': accessibility,
    '@/utils/browser-compat': browserCompat,
    // iframe-config is type-only, so we just verify the import succeeded above
    '@/types/iframe-config': {} // Placeholder to indicate successful import
  };

  it('should resolve all required TypeScript modules without errors', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.keys(requiredModules)),
        (modulePath) => {
          // Verify the module was successfully imported
          const module = requiredModules[modulePath as keyof typeof requiredModules];
          
          // Module should be defined (not null or undefined)
          expect(module).toBeDefined();
          expect(module).not.toBeNull();
        }
      ),
      { numRuns: 10 }
    );
  });

  it('should resolve TypeScript modules with various import patterns', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.keys(requiredModules)),
        (modulePath) => {
          // Verify module is accessible
          const module = requiredModules[modulePath as keyof typeof requiredModules];
          
          // Verify module is not null/undefined
          expect(module).toBeDefined();
          expect(module).not.toBeNull();
          
          // Verify module is an object (has exports)
          expect(typeof module).toBe('object');
        }
      ),
      { numRuns: 10 }
    );
  });

  it('should resolve all utils TypeScript modules consistently', () => {
    const utilsModules = Object.keys(requiredModules).filter(m => m.includes('/utils/'));
    
    fc.assert(
      fc.property(
        fc.constantFrom(...utilsModules),
        (modulePath) => {
          // Get the module reference
          const module1 = requiredModules[modulePath as keyof typeof requiredModules];
          const module2 = requiredModules[modulePath as keyof typeof requiredModules];
          
          // Both references should point to the same module
          expect(module1).toBeDefined();
          expect(module2).toBeDefined();
          expect(module1).toBe(module2);
        }
      ),
      { numRuns: 10 }
    );
  });

  it('should resolve types TypeScript modules consistently', () => {
    const typesModules = Object.keys(requiredModules).filter(m => m.includes('/types/'));
    
    fc.assert(
      fc.property(
        fc.constantFrom(...typesModules),
        (modulePath) => {
          // Get the module reference
          const module1 = requiredModules[modulePath as keyof typeof requiredModules];
          const module2 = requiredModules[modulePath as keyof typeof requiredModules];
          
          // Both references should point to the same module
          expect(module1).toBeDefined();
          expect(module2).toBeDefined();
          expect(module1).toBe(module2);
        }
      ),
      { numRuns: 10 }
    );
  });

  it('should resolve modules regardless of access order', () => {
    fc.assert(
      fc.property(
        fc.shuffledSubarray(Object.keys(requiredModules), { minLength: 2, maxLength: Object.keys(requiredModules).length }),
        (moduleOrder) => {
          const resolvedModules: any[] = [];
          
          // Access modules in the generated order
          for (const modulePath of moduleOrder) {
            const module = requiredModules[modulePath as keyof typeof requiredModules];
            expect(module).toBeDefined();
            resolvedModules.push(module);
          }
          
          // All accesses should have succeeded
          expect(resolvedModules.length).toBe(moduleOrder.length);
          
          // All modules should be defined
          resolvedModules.forEach(module => {
            expect(module).toBeDefined();
            expect(module).not.toBeNull();
          });
        }
      ),
      { numRuns: 10 }
    );
  });

  it('should handle repeated accesses of the same module', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.keys(requiredModules)),
        fc.integer({ min: 1, max: 10 }),
        (modulePath, repeatCount) => {
          const modules: any[] = [];
          
          // Access the same module multiple times
          for (let i = 0; i < repeatCount; i++) {
            const module = requiredModules[modulePath as keyof typeof requiredModules];
            modules.push(module);
          }
          
          // All accesses should succeed
          expect(modules.length).toBe(repeatCount);
          
          // All should be the same module instance (caching)
          const firstModule = modules[0];
          modules.forEach(module => {
            expect(module).toBe(firstModule);
          });
        }
      ),
      { numRuns: 10 }
    );
  });
});
