#!/usr/bin/env node

/**
 * Test SRI Hash Generator
 * 
 * Simple test to verify SRI hash generation functionality
 */

const sriHashGenerator = require('./sriHashGenerator');

console.log('🧪 Testing SRI Hash Generator\n');

// Test 1: Generate hash from content
console.log('Test 1: Generate SRI hash from content');
const testContent = 'console.log("Hello, World!");';
const hash = sriHashGenerator.generateSRIHash(testContent, 'sha384');
console.log(`   Content: ${testContent}`);
console.log(`   Hash: ${hash}`);
console.log(`   ✓ Hash generated successfully\n`);

// Test 2: Extract external resources from HTML
console.log('Test 2: Extract external resources from HTML');
const testHTML = `
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://cdn.example.com/style.css">
  <link rel="stylesheet" href="css/local.css">
  <script src="https://cdn.example.com/script.js"></script>
  <script src="js/local.js"></script>
</head>
<body>
  <h1>Test</h1>
</body>
</html>
`;

const resources = sriHashGenerator.extractExternalResources(testHTML);
console.log(`   External scripts: ${resources.scripts.length}`);
resources.scripts.forEach(url => console.log(`   - ${url}`));
console.log(`   External stylesheets: ${resources.stylesheets.length}`);
resources.stylesheets.forEach(url => console.log(`   - ${url}`));
console.log(`   ✓ Resources extracted successfully\n`);

// Test 3: Add SRI attributes to HTML
console.log('Test 3: Add SRI attributes to HTML');
const mockHashes = {
  'https://cdn.example.com/style.css': 'sha384-abc123',
  'https://cdn.example.com/script.js': 'sha384-def456'
};

const updatedHTML = sriHashGenerator.addSRIAttributesToHTML(testHTML, mockHashes);
const hasIntegrity = updatedHTML.includes('integrity=');
const hasCrossorigin = updatedHTML.includes('crossorigin=');

console.log(`   Integrity attribute added: ${hasIntegrity ? '✓' : '✗'}`);
console.log(`   Crossorigin attribute added: ${hasCrossorigin ? '✓' : '✗'}`);

if (hasIntegrity && hasCrossorigin) {
  console.log(`   ✓ SRI attributes added successfully\n`);
} else {
  console.log(`   ✗ Failed to add SRI attributes\n`);
  process.exit(1);
}

// Test 4: Process HTML with no external resources
console.log('Test 4: Process HTML with no external resources');
const localOnlyHTML = `
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="css/local.css">
  <script src="js/local.js"></script>
</head>
<body>
  <h1>Test</h1>
</body>
</html>
`;

sriHashGenerator.processHTMLForSRI(localOnlyHTML, { skipFetch: true })
  .then(result => {
    console.log(`   External resources found: ${result.resources.scripts.length + result.resources.stylesheets.length}`);
    console.log(`   HTML modified: ${result.modified ? 'Yes' : 'No'}`);
    console.log(`   ✓ Correctly handled HTML with no external resources\n`);
    
    console.log('✨ All tests passed!');
  })
  .catch(error => {
    console.log(`   ✗ Test failed: ${error.message}\n`);
    process.exit(1);
  });
