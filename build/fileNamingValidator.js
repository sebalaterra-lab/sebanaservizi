/**
 * File Naming Validator Module
 * 
 * Validates that all files follow consistent naming conventions
 * Requirements: 8.2
 */

const fs = require('fs');
const path = require('path');

/**
 * Validate file naming conventions for a directory
 * @param {string} dirPath - Directory path to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation results
 */
function validateFileNaming(dirPath, options = {}) {
  const {
    recursive = true,
    excludeDirs = ['node_modules', '.git', '.kiro', '.vscode', 'dist'],
    excludeFiles = ['.DS_Store', '.gitignore', '.gitkeep'],
    allowUppercase = false
  } = options;

  const results = {
    valid: [],
    invalid: [],
    warnings: []
  };

  if (!fs.existsSync(dirPath)) {
    results.warnings.push(`Directory does not exist: ${dirPath}`);
    return results;
  }

  validateDirectory(dirPath, dirPath, results, {
    recursive,
    excludeDirs,
    excludeFiles,
    allowUppercase
  });

  return results;
}

/**
 * Recursively validate directory
 * @param {string} currentPath - Current directory path
 * @param {string} basePath - Base directory path
 * @param {Object} results - Results object to populate
 * @param {Object} options - Validation options
 */
function validateDirectory(currentPath, basePath, results, options) {
  const entries = fs.readdirSync(currentPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(currentPath, entry.name);
    const relativePath = path.relative(basePath, fullPath);

    // Skip excluded directories
    if (entry.isDirectory() && options.excludeDirs.includes(entry.name)) {
      continue;
    }

    // Skip excluded files
    if (entry.isFile() && options.excludeFiles.includes(entry.name)) {
      continue;
    }

    // Validate name
    const isValid = isValidFileName(entry.name, options.allowUppercase);

    if (isValid) {
      results.valid.push(relativePath);
    } else {
      results.invalid.push({
        path: relativePath,
        name: entry.name,
        reason: getInvalidReason(entry.name, options.allowUppercase)
      });
    }

    // Recurse into subdirectories
    if (entry.isDirectory() && options.recursive) {
      validateDirectory(fullPath, basePath, results, options);
    }
  }
}

/**
 * Check if a filename follows naming conventions
 * @param {string} filename - Filename to validate
 * @param {boolean} allowUppercase - Whether to allow uppercase letters
 * @returns {boolean} True if valid
 */
function isValidFileName(filename, allowUppercase = false) {
  // Allow certain special files
  const specialFiles = [
    'README.md',
    'LICENSE',
    'CNAME',
    'Dockerfile',
    '.env',
    '.env.local',
    '.env.production'
  ];

  if (specialFiles.includes(filename)) {
    return true;
  }

  // Check for spaces
  if (filename.includes(' ')) {
    return false;
  }

  // Check for special characters (except allowed ones)
  const allowedPattern = allowUppercase
    ? /^[a-zA-Z0-9._-]+$/
    : /^[a-z0-9._-]+$/;

  if (!allowedPattern.test(filename)) {
    return false;
  }

  // Check for consecutive hyphens or dots
  if (filename.includes('--') || filename.includes('..')) {
    return false;
  }

  // Check if starts or ends with hyphen or dot (except for dotfiles)
  if (!filename.startsWith('.')) {
    if (filename.startsWith('-') || filename.endsWith('-')) {
      return false;
    }
    if (filename.startsWith('.') || filename.endsWith('.')) {
      // Allow file extensions
      const parts = filename.split('.');
      if (parts.length < 2) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Get reason why a filename is invalid
 * @param {string} filename - Filename to check
 * @param {boolean} allowUppercase - Whether uppercase is allowed
 * @returns {string} Reason for invalidity
 */
function getInvalidReason(filename, allowUppercase = false) {
  if (filename.includes(' ')) {
    return 'Contains spaces (use hyphens instead)';
  }

  if (!allowUppercase && /[A-Z]/.test(filename)) {
    return 'Contains uppercase letters (use lowercase)';
  }

  if (filename.includes('--')) {
    return 'Contains consecutive hyphens';
  }

  if (filename.includes('..')) {
    return 'Contains consecutive dots';
  }

  if (!filename.startsWith('.') && (filename.startsWith('-') || filename.endsWith('-'))) {
    return 'Starts or ends with hyphen';
  }

  const allowedPattern = allowUppercase
    ? /^[a-zA-Z0-9._-]+$/
    : /^[a-z0-9._-]+$/;

  if (!allowedPattern.test(filename)) {
    return 'Contains invalid characters (only lowercase letters, numbers, dots, hyphens, and underscores allowed)';
  }

  return 'Unknown naming convention violation';
}

/**
 * Ensure all files in a directory follow naming conventions
 * @param {string} dirPath - Directory path to validate
 * @param {Object} options - Validation options
 * @returns {boolean} True if all files are valid
 */
function ensureValidFileNaming(dirPath, options = {}) {
  const results = validateFileNaming(dirPath, options);

  if (results.invalid.length > 0) {
    console.error('\n❌ File naming validation failed:');
    console.error(`   Found ${results.invalid.length} files with invalid names:\n`);

    for (const invalid of results.invalid) {
      console.error(`   ✗ ${invalid.path}`);
      console.error(`     Reason: ${invalid.reason}\n`);
    }

    return false;
  }

  console.log(`✅ File naming validation passed (${results.valid.length} files checked)`);
  return true;
}

/**
 * Suggest valid filename for an invalid one
 * @param {string} filename - Invalid filename
 * @returns {string} Suggested valid filename
 */
function suggestValidFileName(filename) {
  let suggested = filename;

  // Replace spaces with hyphens
  suggested = suggested.replace(/\s+/g, '-');

  // Convert to lowercase
  suggested = suggested.toLowerCase();

  // Remove invalid characters
  suggested = suggested.replace(/[^a-z0-9._-]/g, '');

  // Replace consecutive hyphens with single hyphen
  suggested = suggested.replace(/-+/g, '-');

  // Replace consecutive dots with single dot
  suggested = suggested.replace(/\.+/g, '.');

  // Remove leading/trailing hyphens
  suggested = suggested.replace(/^-+|-+$/g, '');

  return suggested;
}

module.exports = {
  validateFileNaming,
  isValidFileName,
  getInvalidReason,
  ensureValidFileNaming,
  suggestValidFileName
};
