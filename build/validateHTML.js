#!/usr/bin/env node

/**
 * HTML Validation and Accessibility Checker
 * 
 * This script validates:
 * 1. HTML structure and syntax
 * 2. Semantic HTML5 usage
 * 3. Responsive design meta tags
 * 4. Accessibility features
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Configuration
const config = {
  distDir: path.join(__dirname, '../dist'),
  htmlFiles: ['index.html', '404.html']
};

/**
 * Main validation function
 */
function validateHTML() {
  console.log('🔍 Starting HTML Validation and Accessibility Check...\n');
  
  let allValid = true;
  
  for (const htmlFile of config.htmlFiles) {
    const filePath = path.join(config.distDir, htmlFile);
    
    if (!fs.existsSync(filePath)) {
      console.log(`❌ File not found: ${htmlFile}`);
      allValid = false;
      continue;
    }
    
    console.log(`\n📄 Validating ${htmlFile}...`);
    console.log('─'.repeat(60));
    
    const html = fs.readFileSync(filePath, 'utf-8');
    const $ = cheerio.load(html);
    
    // Run validation checks
    const results = {
      doctype: checkDoctype(html),
      semanticHTML: checkSemanticHTML($),
      viewport: checkViewportMeta($),
      responsiveBreakpoints: checkResponsiveDesign($),
      accessibility: checkAccessibility($),
      structure: checkHTMLStructure($)
    };
    
    // Display results
    displayResults(htmlFile, results);
    
    // Check if all validations passed
    const fileValid = Object.values(results).every(r => r.valid);
    if (!fileValid) {
      allValid = false;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  if (allValid) {
    console.log('✅ All HTML validation checks passed!');
  } else {
    console.log('⚠️  Some validation checks failed. Review the issues above.');
  }
  console.log('='.repeat(60) + '\n');
  
  return allValid;
}

/**
 * Check for proper DOCTYPE declaration
 */
function checkDoctype(html) {
  const hasDoctype = /^<!DOCTYPE html>/i.test(html.trim());
  
  return {
    valid: hasDoctype,
    name: 'DOCTYPE Declaration',
    message: hasDoctype 
      ? 'Valid HTML5 DOCTYPE found' 
      : 'Missing or invalid DOCTYPE declaration'
  };
}

/**
 * Check for semantic HTML5 elements
 */
function checkSemanticHTML($) {
  const semanticElements = [
    'header', 'nav', 'main', 'section', 'article', 
    'aside', 'footer', 'figure', 'figcaption'
  ];
  
  const foundElements = [];
  const missingElements = [];
  
  semanticElements.forEach(element => {
    if ($(element).length > 0) {
      foundElements.push(element);
    }
  });
  
  // Required semantic elements for this site
  const requiredElements = ['header', 'nav', 'main', 'section', 'footer'];
  requiredElements.forEach(element => {
    if (!foundElements.includes(element)) {
      missingElements.push(element);
    }
  });
  
  const valid = missingElements.length === 0;
  
  return {
    valid,
    name: 'Semantic HTML5 Elements',
    message: valid
      ? `Found ${foundElements.length} semantic elements: ${foundElements.join(', ')}`
      : `Missing required elements: ${missingElements.join(', ')}`,
    details: {
      found: foundElements,
      missing: missingElements
    }
  };
}

/**
 * Check for viewport meta tag
 */
function checkViewportMeta($) {
  const viewport = $('meta[name="viewport"]');
  const hasViewport = viewport.length > 0;
  const content = viewport.attr('content') || '';
  
  const hasWidthDevice = content.includes('width=device-width');
  const hasInitialScale = content.includes('initial-scale=1');
  
  const valid = hasViewport && hasWidthDevice && hasInitialScale;
  
  return {
    valid,
    name: 'Viewport Meta Tag',
    message: valid
      ? 'Proper viewport meta tag found'
      : 'Missing or incomplete viewport meta tag',
    details: {
      present: hasViewport,
      content: content
    }
  };
}

/**
 * Check responsive design implementation
 */
function checkResponsiveDesign($) {
  const checks = {
    viewport: $('meta[name="viewport"]').length > 0,
    responsiveImages: $('picture').length > 0 || $('img[srcset]').length > 0,
    fluidContainers: $('.container').length > 0,
    mediaQueries: false // Will check CSS separately
  };
  
  const valid = checks.viewport && (checks.responsiveImages || checks.fluidContainers);
  
  return {
    valid,
    name: 'Responsive Design Features',
    message: valid
      ? 'Responsive design features detected'
      : 'Limited responsive design features found',
    details: checks
  };
}

/**
 * Check accessibility features
 */
function checkAccessibility($) {
  const issues = [];
  const warnings = [];
  
  // Check for lang attribute
  if (!$('html').attr('lang')) {
    issues.push('Missing lang attribute on <html> element');
  }
  
  // Check images for alt text
  const imagesWithoutAlt = $('img:not([alt])').length;
  if (imagesWithoutAlt > 0) {
    warnings.push(`${imagesWithoutAlt} image(s) without alt attribute`);
  }
  
  // Check for ARIA labels on navigation
  const navWithoutLabel = $('nav:not([aria-label]):not([aria-labelledby])').length;
  if (navWithoutLabel > 0) {
    warnings.push(`${navWithoutLabel} navigation element(s) without ARIA label`);
  }
  
  // Check for heading hierarchy
  const h1Count = $('h1').length;
  if (h1Count === 0) {
    issues.push('No <h1> heading found');
  } else if (h1Count > 1) {
    warnings.push(`Multiple <h1> headings found (${h1Count})`);
  }
  
  // Check for skip links (optional but recommended)
  const hasSkipLink = $('a[href^="#"]').first().text().toLowerCase().includes('skip');
  if (!hasSkipLink) {
    warnings.push('No skip navigation link found (recommended for accessibility)');
  }
  
  // Check for form labels
  const inputsWithoutLabel = $('input:not([type="hidden"]):not([aria-label])').filter(function() {
    const id = $(this).attr('id');
    return !id || $(`label[for="${id}"]`).length === 0;
  }).length;
  
  if (inputsWithoutLabel > 0) {
    warnings.push(`${inputsWithoutLabel} input(s) without associated label`);
  }
  
  const valid = issues.length === 0;
  
  return {
    valid,
    name: 'Accessibility Features',
    message: valid
      ? `Accessibility checks passed (${warnings.length} warnings)`
      : `Accessibility issues found: ${issues.length}`,
    details: {
      issues,
      warnings
    }
  };
}

/**
 * Check overall HTML structure
 */
function checkHTMLStructure($) {
  const checks = {
    hasHead: $('head').length === 1,
    hasBody: $('body').length === 1,
    hasTitle: $('title').length === 1,
    hasCharset: $('meta[charset]').length > 0,
    hasDescription: $('meta[name="description"]').length > 0
  };
  
  const issues = [];
  if (!checks.hasHead) issues.push('Missing or multiple <head> elements');
  if (!checks.hasBody) issues.push('Missing or multiple <body> elements');
  if (!checks.hasTitle) issues.push('Missing or multiple <title> elements');
  if (!checks.hasCharset) issues.push('Missing charset meta tag');
  if (!checks.hasDescription) issues.push('Missing description meta tag');
  
  const valid = issues.length === 0;
  
  return {
    valid,
    name: 'HTML Structure',
    message: valid
      ? 'HTML structure is valid'
      : `Structure issues: ${issues.join(', ')}`,
    details: checks
  };
}

/**
 * Display validation results
 */
function displayResults(filename, results) {
  for (const [key, result] of Object.entries(results)) {
    const icon = result.valid ? '✅' : '❌';
    console.log(`\n${icon} ${result.name}`);
    console.log(`   ${result.message}`);
    
    if (result.details) {
      if (result.details.issues && result.details.issues.length > 0) {
        console.log('   Issues:');
        result.details.issues.forEach(issue => {
          console.log(`     • ${issue}`);
        });
      }
      
      if (result.details.warnings && result.details.warnings.length > 0) {
        console.log('   Warnings:');
        result.details.warnings.forEach(warning => {
          console.log(`     ⚠ ${warning}`);
        });
      }
    }
  }
}

// Run validation if executed directly
if (require.main === module) {
  const valid = validateHTML();
  process.exit(valid ? 0 : 1);
}

module.exports = { validateHTML };
