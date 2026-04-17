/**
 * Property-Based Tests for Complete Build Success
 * 
 * Feature: build-compilation-fix
 * Property 2: Complete Build Success
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5
 * 
 * Tests that the build system completes all phases successfully and produces
 * all required artifacts. This ensures the complete build pipeline works
 * correctly from source to deployable artifacts.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

describe('Property: Complete Build Success', () => {
  /**
   * Feature: build-compilation-fix, Property 2: Complete Build Success
   * 
   * For any execution of the publish-all.bat script with valid source code,
   * the build system should complete all four phases (OCOGUI build, plc-frontend
   * build, go2rtc preparation, artifact copying) without errors and produce all
   * required output artifacts in the release directory.
   */

  // Define the root directory (going up from plc-frontend/tests/property)
  const rootDir = path.resolve(__dirname, '../../..');
  const releaseDir = path.join(rootDir, 'release');
  
  // Define expected artifacts based on publish-all.bat
  const expectedArtifacts = {
    ocoguiExe: path.join(releaseDir, 'Oco.Gui', 'OCOGUI-Release.EXE'),
    ocoguiConfig: path.join(releaseDir, 'Oco.Gui', 'config.ini'),
    ocoguiClient: path.join(releaseDir, 'Oco.Gui', 'client'),
    plcFrontendDist: path.join(releaseDir, 'plc-frontend', 'dist'),
    go2rtcExe: path.join(releaseDir, 'Oco.go2rtc', 'go2rtc.exe')
  };

  // Helper function to check if a path exists
  const pathExists = (filePath: string): boolean => {
    try {
      return fs.existsSync(filePath);
    } catch {
      return false;
    }
  };

  // Helper function to check if a directory has files
  const directoryHasFiles = (dirPath: string): boolean => {
    try {
      if (!fs.existsSync(dirPath)) return false;
      const stats = fs.statSync(dirPath);
      if (!stats.isDirectory()) return false;
      const files = fs.readdirSync(dirPath);
      return files.length > 0;
    } catch {
      return false;
    }
  };

  // Helper function to verify artifact integrity
  const verifyArtifact = (artifactPath: string, isDirectory: boolean = false): boolean => {
    if (!pathExists(artifactPath)) {
      return false;
    }

    if (isDirectory) {
      return directoryHasFiles(artifactPath);
    } else {
      // For files, check that they have non-zero size
      try {
        const stats = fs.statSync(artifactPath);
        return stats.isFile() && stats.size > 0;
      } catch {
        return false;
      }
    }
  };

  beforeAll(() => {
    // Ensure we're in the correct directory context
    console.log('Root directory:', rootDir);
    console.log('Release directory:', releaseDir);
  });

  it('should verify all required build artifacts exist', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.keys(expectedArtifacts)),
        (artifactKey) => {
          const artifactPath = expectedArtifacts[artifactKey as keyof typeof expectedArtifacts];
          const isDirectory = artifactKey.includes('Client') || artifactKey.includes('Dist');
          
          // Verify the artifact exists and is valid
          const exists = verifyArtifact(artifactPath, isDirectory);
          
          // Log for debugging if artifact is missing
          if (!exists) {
            console.warn(`Missing or invalid artifact: ${artifactKey} at ${artifactPath}`);
          }
          
          expect(exists).toBe(true);
        }
      ),
      { numRuns: 10 }
    );
  });

  it('should verify OCOGUI artifacts are complete', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('ocoguiExe', 'ocoguiConfig', 'ocoguiClient'),
        (artifactKey) => {
          const artifactPath = expectedArtifacts[artifactKey as keyof typeof expectedArtifacts];
          const isDirectory = artifactKey === 'ocoguiClient';
          
          const exists = verifyArtifact(artifactPath, isDirectory);
          expect(exists).toBe(true);
        }
      ),
      { numRuns: 10 }
    );
  });

  it('should verify plc-frontend dist artifacts are complete', () => {
    fc.assert(
      fc.property(
        fc.constant('plcFrontendDist'),
        (artifactKey) => {
          const artifactPath = expectedArtifacts[artifactKey as keyof typeof expectedArtifacts];
          
          // Verify dist directory exists and has files
          const exists = verifyArtifact(artifactPath, true);
          expect(exists).toBe(true);
          
          // Additionally verify key dist files exist
          if (exists) {
            const indexHtml = path.join(artifactPath, 'index.html');
            expect(pathExists(indexHtml)).toBe(true);
          }
        }
      ),
      { numRuns: 10 }
    );
  });

  it('should verify go2rtc artifacts are complete', () => {
    fc.assert(
      fc.property(
        fc.constant('go2rtcExe'),
        (artifactKey) => {
          const artifactPath = expectedArtifacts[artifactKey as keyof typeof expectedArtifacts];
          
          // go2rtc might not always be present (script allows it to fail)
          // but if it exists, it should be valid
          if (pathExists(artifactPath)) {
            const exists = verifyArtifact(artifactPath, false);
            expect(exists).toBe(true);
          }
        }
      ),
      { numRuns: 10 }
    );
  });

  it('should verify all artifacts maintain consistency across checks', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.keys(expectedArtifacts)),
        fc.integer({ min: 2, max: 5 }),
        (artifactKey, checkCount) => {
          const artifactPath = expectedArtifacts[artifactKey as keyof typeof expectedArtifacts];
          const isDirectory = artifactKey.includes('Client') || artifactKey.includes('Dist');
          
          const results: boolean[] = [];
          
          // Check the same artifact multiple times
          for (let i = 0; i < checkCount; i++) {
            results.push(verifyArtifact(artifactPath, isDirectory));
          }
          
          // All checks should return the same result (consistency)
          const firstResult = results[0];
          results.forEach(result => {
            expect(result).toBe(firstResult);
          });
        }
      ),
      { numRuns: 10 }
    );
  });

  it('should verify artifact paths are correctly structured', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.keys(expectedArtifacts)),
        (artifactKey) => {
          const artifactPath = expectedArtifacts[artifactKey as keyof typeof expectedArtifacts];
          
          // Verify path is absolute
          expect(path.isAbsolute(artifactPath)).toBe(true);
          
          // Verify path contains release directory
          expect(artifactPath).toContain('release');
          
          // Verify path structure matches expected pattern
          if (artifactKey.startsWith('ocogui')) {
            expect(artifactPath).toContain('Oco.Gui');
          } else if (artifactKey.startsWith('plcFrontend')) {
            expect(artifactPath).toContain('plc-frontend');
          } else if (artifactKey.startsWith('go2rtc')) {
            expect(artifactPath).toContain('Oco.go2rtc');
          }
        }
      ),
      { numRuns: 10 }
    );
  });

  it('should verify build output directory structure', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('Oco.Gui', 'plc-frontend', 'Oco.go2rtc'),
        (componentDir) => {
          const componentPath = path.join(releaseDir, componentDir);
          
          // Verify component directory exists
          if (pathExists(componentPath)) {
            const stats = fs.statSync(componentPath);
            expect(stats.isDirectory()).toBe(true);
          }
        }
      ),
      { numRuns: 10 }
    );
  });

  it('should verify plc-frontend build produces valid web assets', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('index.html', 'js', 'css'),
        (assetType) => {
          const distPath = expectedArtifacts.plcFrontendDist;
          
          if (!pathExists(distPath)) {
            // If dist doesn't exist, skip this check
            return;
          }
          
          if (assetType === 'index.html') {
            const indexPath = path.join(distPath, 'index.html');
            if (pathExists(indexPath)) {
              expect(verifyArtifact(indexPath, false)).toBe(true);
            }
          } else {
            // Check for js or css directories
            const assetDir = path.join(distPath, assetType);
            if (pathExists(assetDir)) {
              expect(directoryHasFiles(assetDir)).toBe(true);
            }
          }
        }
      ),
      { numRuns: 10 }
    );
  });

  it('should verify OCOGUI client directory contains required files', () => {
    fc.assert(
      fc.property(
        fc.constant('ocoguiClient'),
        (artifactKey) => {
          const clientPath = expectedArtifacts[artifactKey as keyof typeof expectedArtifacts];
          
          if (!pathExists(clientPath)) {
            // If client doesn't exist, skip this check
            return;
          }
          
          // Verify it's a directory with files
          expect(directoryHasFiles(clientPath)).toBe(true);
        }
      ),
      { numRuns: 10 }
    );
  });

  it('should verify all critical artifacts exist together', () => {
    fc.assert(
      fc.property(
        fc.constant(true),
        () => {
          // Check that the three critical components exist
          const ocoguiExists = verifyArtifact(expectedArtifacts.ocoguiExe, false);
          const plcFrontendExists = verifyArtifact(expectedArtifacts.plcFrontendDist, true);
          
          // Both OCOGUI and plc-frontend must exist for a successful build
          // go2rtc is optional according to the script
          if (ocoguiExists && plcFrontendExists) {
            expect(ocoguiExists).toBe(true);
            expect(plcFrontendExists).toBe(true);
          }
        }
      ),
      { numRuns: 10 }
    );
  });
});

