#!/usr/bin/env node

/**
 * Add SRI Hashes Script
 * 
 * Standalone script to add SRI hashes to external resources in HTML files
 * Usage: node build/addSRIHashes.js [file1.html] [file2.html] ...
 */

const fs = require('fs');
const path = require('path');
const sriHashGenerator = require('./sriHashGenerator');

/**
 * Process a single HTML file
 * @param {string} filePath - Path to HTML file
 * @param {Object} options - Processing options
 */
async function processFile(filePath, options = {}) {
  const { dryRun = false, algorithm = 'sha384' } = options;
  
  console.log(`\n📄 Processing: ${filePath}`);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.log(`   ✗ File not found: ${filePath}`);
    return false;
  }
  
  // Read HTML content
  const html = fs.readFileSync(filePath, 'utf-8');
  console.log(`   ✓ Read file (${html.length} bytes)`);
  
  // Process HTML for SRI
  try {
    const result = await sriHashGenerator.processHTMLForSRI(html, {
      algorithm,
      skipFetch: false
    });
    
    if (!result.modified) {
      console.log('   ℹ No external resources found or already have SRI hashes');
      return true;
    }
    
    // Show what would be changed
    console.log(`\n   📋 Summary:`);
    console.log(`   - Scripts: ${result.resources.scripts.length}`);
    console.log(`   - Stylesheets: ${result.resources.stylesheets.length}`);
    console.log(`   - SRI hashes generated: ${Object.keys(result.hashes).filter(k => result.hashes[k]).length}`);
    
    if (dryRun) {
      console.log('\n   ℹ Dry run mode - no changes written');
      console.log('\n   Generated hashes:');
      for (const [url, hash] of Object.entries(result.hashes)) {
        if (hash) {
          console.log(`   ${url}`);
          console.log(`   → ${hash}\n`);
        }
      }
      return true;
    }
    
    // Write updated HTML
    fs.writeFileSync(filePath, result.html, 'utf-8');
    console.log(`   ✓ Updated file with SRI hashes`);
    
    return true;
  } catch (error) {
    console.log(`   ✗ Failed to process file: ${error.message}`);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  
  // Parse options
  const options = {
    dryRun: args.includes('--dry-run') || args.includes('-d'),
    algorithm: 'sha384'
  };
  
  // Get file paths (filter out option flags)
  const filePaths = args.filter(arg => !arg.startsWith('-'));
  
  // Default to index.html and 404.html if no files specified
  if (filePaths.length === 0) {
    const defaultFiles = [
      path.join(__dirname, '../index.html'),
      path.join(__dirname, '../404.html')
    ];
    
    console.log('🔒 Adding SRI Hashes to HTML Files');
    console.log(`   Algorithm: ${options.algorithm}`);
    console.log(`   Dry run: ${options.dryRun ? 'Yes' : 'No'}`);
    console.log(`\n   Processing default files: index.html, 404.html`);
    
    let allSuccess = true;
    for (const filePath of defaultFiles) {
      const success = await processFile(filePath, options);
      if (!success) allSuccess = false;
    }
    
    if (allSuccess) {
      console.log('\n✨ All files processed successfully!');
    } else {
      console.log('\n⚠️  Some files failed to process');
      process.exit(1);
    }
  } else {
    console.log('🔒 Adding SRI Hashes to HTML Files');
    console.log(`   Algorithm: ${options.algorithm}`);
    console.log(`   Dry run: ${options.dryRun ? 'Yes' : 'No'}`);
    
    let allSuccess = true;
    for (const filePath of filePaths) {
      const success = await processFile(filePath, options);
      if (!success) allSuccess = false;
    }
    
    if (allSuccess) {
      console.log('\n✨ All files processed successfully!');
    } else {
      console.log('\n⚠️  Some files failed to process');
      process.exit(1);
    }
  }
}

// Show usage if --help flag is present
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Usage: node build/addSRIHashes.js [options] [files...]

Add Subresource Integrity (SRI) hashes to external resources in HTML files.

Options:
  -d, --dry-run    Show what would be changed without modifying files
  -h, --help       Show this help message

Examples:
  node build/addSRIHashes.js                    # Process index.html and 404.html
  node build/addSRIHashes.js index.html         # Process specific file
  node build/addSRIHashes.js --dry-run          # Preview changes without modifying
  node build/addSRIHashes.js -d index.html      # Dry run for specific file
  `);
  process.exit(0);
}

// Run main function
if (require.main === module) {
  main().catch(error => {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  });
}

module.exports = { processFile };
