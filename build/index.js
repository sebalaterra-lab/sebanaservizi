#!/usr/bin/env node

/**
 * WordPress to Static Site Migration - Build Script Entry Point
 * 
 * This script orchestrates the migration process:
 * 1. Content extraction from WordPress
 * 2. Image processing and optimization
 * 3. Static site generation
 * 4. Asset minification and optimization
 */

const path = require('path');
const fs = require('fs');
const CleanCSS = require('clean-css');
const { minify: minifyJS } = require('terser');

// Import modules
const contentExtractor = require('./contentExtractor');
const imageProcessor = require('./imageProcessor');
const htmlGenerator = require('./htmlGenerator');
const fileNamingValidator = require('./fileNamingValidator');
const sriHashGenerator = require('./sriHashGenerator');

// Configuration
const config = {
  // Source paths
  wordpressExportPath: process.env.WP_EXPORT_PATH || './wordpress-export',
  imageSourcePath: process.env.IMAGE_SOURCE_PATH || '/Volumes/KINGSTON/sebanaservizi.it',
  
  // Output paths
  outputDir: path.join(__dirname, '..'),
  distDir: path.join(__dirname, '../dist'),
  cssDir: path.join(__dirname, '../css'),
  jsDir: path.join(__dirname, '../js'),
  imagesDir: path.join(__dirname, '../images'),
  assetsDir: path.join(__dirname, '../assets'),
  
  // Build options
  minify: process.env.NODE_ENV === 'production',
  generateWebP: true,
  optimizeImages: true,
};

/**
 * Main build function
 */
async function build() {
  console.log('🚀 Starting WordPress to Static Site Migration...\n');
  
  try {
    // Validate directories exist
    validateDirectories();
    
    console.log('✅ Project structure validated');
    console.log('\n📋 Configuration:');
    console.log(`   - WordPress Export: ${config.wordpressExportPath}`);
    console.log(`   - Image Source: ${config.imageSourcePath}`);
    console.log(`   - Output Directory: ${config.outputDir}`);
    console.log(`   - Distribution Directory: ${config.distDir}`);
    console.log(`   - Minify Assets: ${config.minify}`);
    console.log(`   - Generate WebP: ${config.generateWebP}`);
    
    // Create dist directory if it doesn't exist
    if (!fs.existsSync(config.distDir)) {
      fs.mkdirSync(config.distDir, { recursive: true });
      console.log('\n📁 Created dist directory');
    }
    
    // Step 1: Extract content from WordPress (if export exists)
    console.log('\n📝 Step 1: Content Extraction');
    let extractedContent = null;
    const wpExportFile = path.join(config.wordpressExportPath, 'index.html');
    if (fs.existsSync(wpExportFile)) {
      try {
        extractedContent = contentExtractor.extractAllContent(wpExportFile);
        console.log(`   ✓ Extracted ${extractedContent.sections.length} sections`);
        console.log(`   ✓ Extracted ${extractedContent.teamMembers.length} team members`);
        console.log(`   ✓ Extracted ${extractedContent.statistics.length} statistics`);
        console.log(`   ✓ Extracted ${extractedContent.companyValues.length} company values`);
      } catch (error) {
        console.log(`   ⚠ Content extraction skipped: ${error.message}`);
      }
    } else {
      console.log('   ⚠ WordPress export not found, using default content');
    }
    
    // Step 2: Process and optimize images
    console.log('\n🖼️  Step 2: Image Processing');
    if (fs.existsSync(config.imageSourcePath) && config.optimizeImages) {
      try {
        const imageResult = await imageProcessor.processImages(
          config.imageSourcePath,
          config.imagesDir
        );
        console.log(`   ✓ Processed ${imageResult.processed.length} images`);
        if (imageResult.failed.length > 0) {
          console.log(`   ⚠ Failed to process ${imageResult.failed.length} images`);
        }
      } catch (error) {
        console.log(`   ⚠ Image processing skipped: ${error.message}`);
      }
    } else {
      console.log('   ⚠ Image source not found or optimization disabled');
    }
    
    // Step 3: Generate static HTML
    console.log('\n📄 Step 3: HTML Generation');
    let htmlContent;
    try {
      htmlContent = htmlGenerator.generateHTML(
        extractedContent || {
          sections: [],
          teamMembers: [],
          statistics: [],
          companyValues: [],
          metadata: {
            title: 'Sebana Servizi',
            description: 'Servizi professionali per la gestione condominiale',
            keywords: ['gestione condominiale', 'antincendio', 'privacy', 'controllo idrico'],
            ogTags: {
              title: 'Sebana Servizi',
              description: 'Servizi professionali per la gestione condominiale',
              type: 'website'
            },
            contactInfo: {},
            hero: {},
            services: {},
            footer: {}
          }
        },
        {
          includeMetadata: true,
          includeLazyLoading: true,
          useWebP: config.generateWebP
        }
      );
      
      console.log(`   ✓ Generated index.html (${htmlContent.length} bytes)`);
    } catch (error) {
      console.log(`   ✗ HTML generation failed: ${error.message}`);
      throw error;
    }
    
    // Step 3.5: Add SRI hashes to external resources
    console.log('\n🔒 Step 3.5: Adding SRI Hashes to External Resources');
    try {
      const sriResult = await sriHashGenerator.processHTMLForSRI(htmlContent, {
        algorithm: 'sha384',
        skipFetch: false
      });
      
      if (sriResult.modified) {
        htmlContent = sriResult.html;
        console.log(`   ✓ Added SRI hashes to ${Object.keys(sriResult.hashes).length} external resource(s)`);
        
        // Log hash details
        for (const [url, hash] of Object.entries(sriResult.hashes)) {
          if (hash) {
            console.log(`   ✓ ${url.substring(0, 60)}... → ${hash.substring(0, 20)}...`);
          }
        }
      } else {
        console.log('   ℹ No external resources found or no modifications needed');
      }
    } catch (error) {
      console.log(`   ⚠ SRI hash generation failed: ${error.message}`);
      console.log('   Continuing with HTML without SRI hashes...');
    }
    
    // Write HTML to dist directory
    const htmlOutputPath = path.join(config.distDir, 'index.html');
    fs.writeFileSync(htmlOutputPath, htmlContent, 'utf-8');
    console.log(`   ✓ Wrote index.html to dist directory`);
    
    // Step 4: Minify CSS files
    console.log('\n🎨 Step 4: CSS Processing');
    await processCSSFiles();
    
    // Step 5: Minify JavaScript files
    console.log('\n⚡ Step 5: JavaScript Processing');
    await processJSFiles();
    
    // Step 6: Copy static assets to dist
    console.log('\n📦 Step 6: Copy Static Assets');
    copyStaticAssets();
    
    // Step 7: Validate file naming conventions
    console.log('\n📝 Step 7: File Naming Validation');
    const namingValid = fileNamingValidator.ensureValidFileNaming(config.distDir, {
      recursive: true,
      excludeDirs: ['node_modules', '.git', '.kiro', '.vscode'],
      excludeFiles: ['.DS_Store', '.gitignore', '.gitkeep'],
      allowUppercase: false
    });
    
    if (!namingValid) {
      console.log('\n⚠️  Warning: Some files do not follow naming conventions');
      console.log('   Consider renaming them to use lowercase, hyphen-separated names');
    }
    
    console.log('\n✨ Build completed successfully!');
    console.log(`\n📂 Production files are in: ${config.distDir}`);
    
  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    process.exit(1);
  }
}

/**
 * Process and minify CSS files
 */
async function processCSSFiles() {
  const cssFiles = ['main.css', 'normalize.css'];
  
  for (const cssFile of cssFiles) {
    const inputPath = path.join(config.cssDir, cssFile);
    
    if (!fs.existsSync(inputPath)) {
      console.log(`   ⚠ CSS file not found: ${cssFile}`);
      continue;
    }
    
    try {
      const cssContent = fs.readFileSync(inputPath, 'utf-8');
      
      // Copy original to dist
      const distCssDir = path.join(config.distDir, 'css');
      if (!fs.existsSync(distCssDir)) {
        fs.mkdirSync(distCssDir, { recursive: true });
      }
      
      const outputPath = path.join(distCssDir, cssFile);
      fs.writeFileSync(outputPath, cssContent, 'utf-8');
      console.log(`   ✓ Copied ${cssFile} (${cssContent.length} bytes)`);
      
      // Minify if enabled
      if (config.minify) {
        const minified = new CleanCSS({
          level: 2,
          compatibility: 'ie9'
        }).minify(cssContent);
        
        if (minified.errors.length > 0) {
          console.log(`   ⚠ CSS minification warnings for ${cssFile}:`, minified.errors);
        }
        
        const minFileName = cssFile.replace('.css', '.min.css');
        const minOutputPath = path.join(distCssDir, minFileName);
        fs.writeFileSync(minOutputPath, minified.styles, 'utf-8');
        
        const savings = ((1 - minified.styles.length / cssContent.length) * 100).toFixed(1);
        console.log(`   ✓ Minified ${cssFile} → ${minFileName} (${minified.styles.length} bytes, ${savings}% smaller)`);
      }
    } catch (error) {
      console.log(`   ✗ Failed to process ${cssFile}: ${error.message}`);
    }
  }
}

/**
 * Process and minify JavaScript files
 */
async function processJSFiles() {
  const jsFiles = ['main.js'];
  
  for (const jsFile of jsFiles) {
    const inputPath = path.join(config.jsDir, jsFile);
    
    if (!fs.existsSync(inputPath)) {
      console.log(`   ⚠ JS file not found: ${jsFile}`);
      continue;
    }
    
    try {
      const jsContent = fs.readFileSync(inputPath, 'utf-8');
      
      // Copy original to dist
      const distJsDir = path.join(config.distDir, 'js');
      if (!fs.existsSync(distJsDir)) {
        fs.mkdirSync(distJsDir, { recursive: true });
      }
      
      const outputPath = path.join(distJsDir, jsFile);
      fs.writeFileSync(outputPath, jsContent, 'utf-8');
      console.log(`   ✓ Copied ${jsFile} (${jsContent.length} bytes)`);
      
      // Minify if enabled
      if (config.minify) {
        const minified = await minifyJS(jsContent, {
          compress: {
            dead_code: true,
            drop_console: false,
            drop_debugger: true,
            keep_classnames: true,
            keep_fnames: false
          },
          mangle: {
            keep_classnames: true
          },
          format: {
            comments: false
          }
        });
        
        if (minified.error) {
          console.log(`   ✗ JS minification failed for ${jsFile}:`, minified.error);
          continue;
        }
        
        const minFileName = jsFile.replace('.js', '.min.js');
        const minOutputPath = path.join(distJsDir, minFileName);
        fs.writeFileSync(minOutputPath, minified.code, 'utf-8');
        
        const savings = ((1 - minified.code.length / jsContent.length) * 100).toFixed(1);
        console.log(`   ✓ Minified ${jsFile} → ${minFileName} (${minified.code.length} bytes, ${savings}% smaller)`);
      }
    } catch (error) {
      console.log(`   ✗ Failed to process ${jsFile}: ${error.message}`);
    }
  }
}

/**
 * Copy static assets to dist directory
 */
function copyStaticAssets() {
  // Copy images directory
  if (fs.existsSync(config.imagesDir)) {
    const distImagesDir = path.join(config.distDir, 'images');
    copyDirectory(config.imagesDir, distImagesDir);
    console.log('   ✓ Copied images directory');
  }
  
  // Copy assets directory
  if (fs.existsSync(config.assetsDir)) {
    const distAssetsDir = path.join(config.distDir, 'assets');
    copyDirectory(config.assetsDir, distAssetsDir);
    console.log('   ✓ Copied assets directory');
  }
  
  // Copy any additional static files (robots.txt, sitemap.xml, etc.)
  const staticFiles = ['robots.txt', 'sitemap.xml', '404.html', '_headers', 'CNAME'];
  for (const file of staticFiles) {
    const sourcePath = path.join(config.outputDir, file);
    if (fs.existsSync(sourcePath)) {
      const destPath = path.join(config.distDir, file);
      fs.copyFileSync(sourcePath, destPath);
      console.log(`   ✓ Copied ${file}`);
    }
  }
}

/**
 * Recursively copy directory
 * @param {string} source - Source directory
 * @param {string} destination - Destination directory
 */
function copyDirectory(source, destination) {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }
  
  const entries = fs.readdirSync(source, { withFileTypes: true });
  
  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectory(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}

/**
 * Validate that required directories exist
 */
function validateDirectories() {
  const requiredDirs = [
    config.cssDir,
    config.jsDir,
    config.imagesDir,
    config.assetsDir,
  ];
  
  for (const dir of requiredDirs) {
    if (!fs.existsSync(dir)) {
      throw new Error(`Required directory does not exist: ${dir}`);
    }
  }
}

// Run build if executed directly
if (require.main === module) {
  build().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { build, config };
