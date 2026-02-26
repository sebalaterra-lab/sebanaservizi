#!/usr/bin/env node

/**
 * Comprehensive Validation Suite
 * 
 * Runs all validation checks for the static site:
 * 1. HTML structure and semantic elements
 * 2. Accessibility features
 * 3. Responsive design breakpoints
 * 4. File integrity (no PHP files)
 * 5. Image references
 */

const fs = require('fs');
const path = require('path');
const { validateHTML } = require('./validateHTML');
const { validateResponsive } = require('./validateResponsive');

// Configuration
const config = {
  distDir: path.join(__dirname, '../dist')
};

/**
 * Main validation runner
 */
async function runAllValidations() {
  console.log('🚀 Running Comprehensive Validation Suite\n');
  console.log('='.repeat(60));
  
  const results = {
    phpFiles: checkNoPHPFiles(),
    htmlValidation: null,
    responsiveDesign: null,
    fileStructure: checkFileStructure()
  };
  
  console.log('\n' + '='.repeat(60));
  console.log('HTML VALIDATION');
  console.log('='.repeat(60));
  results.htmlValidation = validateHTML();
  
  console.log('\n' + '='.repeat(60));
  console.log('RESPONSIVE DESIGN VALIDATION');
  console.log('='.repeat(60));
  results.responsiveDesign = validateResponsive();
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('VALIDATION SUMMARY');
  console.log('='.repeat(60));
  
  const checks = [
    { name: 'No PHP Files', passed: results.phpFiles },
    { name: 'HTML Structure & Accessibility', passed: results.htmlValidation },
    { name: 'Responsive Design Breakpoints', passed: results.responsiveDesign },
    { name: 'File Structure', passed: results.fileStructure }
  ];
  
  checks.forEach(check => {
    const icon = check.passed ? '✅' : '❌';
    console.log(`${icon} ${check.name}`);
  });
  
  const allPassed = checks.every(c => c.passed);
  
  console.log('\n' + '='.repeat(60));
  if (allPassed) {
    console.log('🎉 ALL VALIDATIONS PASSED!');
    console.log('The static site is ready for deployment.');
  } else {
    console.log('⚠️  SOME VALIDATIONS FAILED');
    console.log('Please review the issues above before deployment.');
  }
  console.log('='.repeat(60) + '\n');
  
  return allPassed;
}

/**
 * Check that no PHP files exist in dist
 */
function checkNoPHPFiles() {
  console.log('\n📋 Checking for PHP files...');
  
  const phpFiles = findFilesByExtension(config.distDir, '.php');
  
  if (phpFiles.length === 0) {
    console.log('✅ No PHP files found in dist directory');
    return true;
  } else {
    console.log(`❌ Found ${phpFiles.length} PHP file(s):`);
    phpFiles.forEach(file => {
      console.log(`   • ${file}`);
    });
    return false;
  }
}

/**
 * Check file structure
 */
function checkFileStructure() {
  console.log('\n📁 Checking file structure...');
  
  const requiredFiles = [
    'index.html',
    '404.html',
    'robots.txt',
    'sitemap.xml',
    'css/main.css',
    'js/main.js'
  ];
  
  const missingFiles = [];
  
  requiredFiles.forEach(file => {
    const filePath = path.join(config.distDir, file);
    if (!fs.existsSync(filePath)) {
      missingFiles.push(file);
    }
  });
  
  if (missingFiles.length === 0) {
    console.log(`✅ All ${requiredFiles.length} required files present`);
    return true;
  } else {
    console.log(`❌ Missing ${missingFiles.length} required file(s):`);
    missingFiles.forEach(file => {
      console.log(`   • ${file}`);
    });
    return false;
  }
}

/**
 * Find files by extension recursively
 */
function findFilesByExtension(dir, extension) {
  const files = [];
  
  function traverse(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.name.endsWith(extension)) {
        files.push(path.relative(config.distDir, fullPath));
      }
    }
  }
  
  if (fs.existsSync(dir)) {
    traverse(dir);
  }
  
  return files;
}

// Run validations if executed directly
if (require.main === module) {
  runAllValidations()
    .then(passed => {
      process.exit(passed ? 0 : 1);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { runAllValidations };
