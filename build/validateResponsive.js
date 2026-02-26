#!/usr/bin/env node

/**
 * Responsive Design Validation
 * 
 * Validates that CSS includes proper media queries for all required breakpoints
 */

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  cssFile: path.join(__dirname, '../dist/css/main.css'),
  requiredBreakpoints: {
    mobile: { max: 767, description: 'Mobile (< 768px)' },
    tablet: { min: 768, max: 1023, description: 'Tablet (768-1024px)' },
    desktop: { min: 1024, description: 'Desktop (> 1024px)' }
  }
};

/**
 * Main validation function
 */
function validateResponsive() {
  console.log('📱 Validating Responsive Design Breakpoints...\n');
  
  if (!fs.existsSync(config.cssFile)) {
    console.log('❌ CSS file not found:', config.cssFile);
    return false;
  }
  
  const css = fs.readFileSync(config.cssFile, 'utf-8');
  
  // Extract all media queries
  const mediaQueries = extractMediaQueries(css);
  
  console.log(`Found ${mediaQueries.length} media queries in CSS\n`);
  
  // Check for required breakpoints
  const results = checkBreakpoints(mediaQueries);
  
  // Display results
  displayResults(results);
  
  const allValid = Object.values(results).every(r => r.found);
  
  console.log('\n' + '='.repeat(60));
  if (allValid) {
    console.log('✅ All required responsive breakpoints are present!');
  } else {
    console.log('⚠️  Some required breakpoints are missing.');
  }
  console.log('='.repeat(60) + '\n');
  
  return allValid;
}

/**
 * Extract media queries from CSS
 */
function extractMediaQueries(css) {
  const mediaQueryRegex = /@media\s*([^{]+)\{/g;
  const queries = [];
  let match;
  
  while ((match = mediaQueryRegex.exec(css)) !== null) {
    queries.push(match[1].trim());
  }
  
  return queries;
}

/**
 * Check for required breakpoints
 */
function checkBreakpoints(mediaQueries) {
  const results = {};
  
  // Check mobile breakpoint (max-width: 767px or similar)
  const hasMobile = mediaQueries.some(q => 
    /max-width:\s*76[0-9]px/.test(q) || /max-width:\s*480px/.test(q)
  );
  
  results.mobile = {
    found: hasMobile,
    description: config.requiredBreakpoints.mobile.description,
    queries: mediaQueries.filter(q => /max-width/.test(q))
  };
  
  // Check tablet breakpoint (min-width: 768px)
  const hasTablet = mediaQueries.some(q => 
    /min-width:\s*768px/.test(q)
  );
  
  results.tablet = {
    found: hasTablet,
    description: config.requiredBreakpoints.tablet.description,
    queries: mediaQueries.filter(q => /min-width:\s*768px/.test(q))
  };
  
  // Check desktop breakpoint (min-width: 1024px or higher)
  const hasDesktop = mediaQueries.some(q => 
    /min-width:\s*(102[4-9]|10[3-9][0-9]|1[1-9][0-9]{2}|[2-9][0-9]{3})px/.test(q)
  );
  
  results.desktop = {
    found: hasDesktop,
    description: config.requiredBreakpoints.desktop.description,
    queries: mediaQueries.filter(q => /min-width:\s*102[4-9]px/.test(q))
  };
  
  return results;
}

/**
 * Display validation results
 */
function displayResults(results) {
  for (const [breakpoint, result] of Object.entries(results)) {
    const icon = result.found ? '✅' : '❌';
    console.log(`${icon} ${result.description}`);
    
    if (result.found && result.queries.length > 0) {
      console.log(`   Found ${result.queries.length} matching media query/queries`);
      result.queries.slice(0, 2).forEach(q => {
        console.log(`   • @media ${q.substring(0, 60)}...`);
      });
    } else if (!result.found) {
      console.log('   ⚠ No matching media query found');
    }
    console.log();
  }
}

// Run validation if executed directly
if (require.main === module) {
  const valid = validateResponsive();
  process.exit(valid ? 0 : 1);
}

module.exports = { validateResponsive };
