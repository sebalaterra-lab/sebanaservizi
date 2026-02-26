/**
 * SRI Hash Generator Module
 * 
 * Generates Subresource Integrity (SRI) hashes for external resources
 * Requirements: 7.5
 */

const crypto = require('crypto');
const https = require('https');
const http = require('http');

/**
 * Generate SRI hash for a given content
 * @param {string|Buffer} content - Content to hash
 * @param {string} algorithm - Hash algorithm (sha256, sha384, sha512)
 * @returns {string} SRI hash in format: algorithm-base64hash
 */
function generateSRIHash(content, algorithm = 'sha384') {
  const hash = crypto.createHash(algorithm);
  hash.update(content);
  const base64Hash = hash.digest('base64');
  return `${algorithm}-${base64Hash}`;
}

/**
 * Fetch content from URL and generate SRI hash
 * @param {string} url - URL of the external resource
 * @param {string} algorithm - Hash algorithm (sha256, sha384, sha512)
 * @returns {Promise<string>} SRI hash
 */
function generateSRIHashFromURL(url, algorithm = 'sha384') {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to fetch ${url}: HTTP ${response.statusCode}`));
        return;
      }
      
      const chunks = [];
      
      response.on('data', (chunk) => {
        chunks.push(chunk);
      });
      
      response.on('end', () => {
        const content = Buffer.concat(chunks);
        const hash = generateSRIHash(content, algorithm);
        resolve(hash);
      });
    }).on('error', (error) => {
      reject(new Error(`Failed to fetch ${url}: ${error.message}`));
    });
  });
}

/**
 * Generate SRI hashes for multiple URLs
 * @param {Array<string>} urls - Array of URLs
 * @param {string} algorithm - Hash algorithm
 * @returns {Promise<Object>} Map of URL to SRI hash
 */
async function generateSRIHashesForURLs(urls, algorithm = 'sha384') {
  const results = {};
  
  for (const url of urls) {
    try {
      const hash = await generateSRIHashFromURL(url, algorithm);
      results[url] = hash;
      console.log(`   ✓ Generated SRI hash for ${url}`);
    } catch (error) {
      console.log(`   ✗ Failed to generate SRI hash for ${url}: ${error.message}`);
      results[url] = null;
    }
  }
  
  return results;
}

/**
 * Extract external resource URLs from HTML content
 * @param {string} html - HTML content
 * @returns {Object} Object with scripts and stylesheets arrays
 */
function extractExternalResources(html) {
  const resources = {
    scripts: [],
    stylesheets: []
  };
  
  // Match external script tags (src starting with http:// or https://)
  const scriptRegex = /<script[^>]+src=["']?(https?:\/\/[^"'\s>]+)["']?[^>]*>/gi;
  let match;
  
  while ((match = scriptRegex.exec(html)) !== null) {
    const url = match[1];
    if (!resources.scripts.includes(url)) {
      resources.scripts.push(url);
    }
  }
  
  // Match external stylesheet links (href starting with http:// or https://)
  const linkRegex = /<link[^>]+href=["']?(https?:\/\/[^"'\s>]+)["']?[^>]*>/gi;
  
  while ((match = linkRegex.exec(html)) !== null) {
    const url = match[1];
    // Only include stylesheets, not other link types
    const fullTag = match[0];
    if (fullTag.includes('stylesheet') && !resources.stylesheets.includes(url)) {
      resources.stylesheets.push(url);
    }
  }
  
  return resources;
}

/**
 * Add SRI attributes to HTML content
 * @param {string} html - HTML content
 * @param {Object} sriHashes - Map of URL to SRI hash
 * @returns {string} HTML with SRI attributes added
 */
function addSRIAttributesToHTML(html, sriHashes) {
  let updatedHtml = html;
  
  // Add integrity attributes to script tags
  for (const [url, hash] of Object.entries(sriHashes)) {
    if (!hash) continue;
    
    // Match script tags with this URL
    const scriptRegex = new RegExp(
      `(<script[^>]+src=["']?${escapeRegex(url)}["']?)([^>]*>)`,
      'gi'
    );
    
    updatedHtml = updatedHtml.replace(scriptRegex, (match, opening, closing) => {
      // Check if integrity attribute already exists
      if (opening.includes('integrity=')) {
        return match;
      }
      
      // Add integrity and crossorigin attributes
      return `${opening} integrity="${hash}" crossorigin="anonymous"${closing}`;
    });
    
    // Match link tags with this URL
    const linkRegex = new RegExp(
      `(<link[^>]+href=["']?${escapeRegex(url)}["']?)([^>]*>)`,
      'gi'
    );
    
    updatedHtml = updatedHtml.replace(linkRegex, (match, opening, closing) => {
      // Check if integrity attribute already exists
      if (opening.includes('integrity=')) {
        return match;
      }
      
      // Add integrity and crossorigin attributes
      return `${opening} integrity="${hash}" crossorigin="anonymous"${closing}`;
    });
  }
  
  return updatedHtml;
}

/**
 * Escape special regex characters in a string
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Process HTML file and add SRI hashes to external resources
 * @param {string} html - HTML content
 * @param {Object} options - Processing options
 * @returns {Promise<Object>} Result with updated HTML and hash information
 */
async function processHTMLForSRI(html, options = {}) {
  const { algorithm = 'sha384', skipFetch = false } = options;
  
  // Extract external resources
  const resources = extractExternalResources(html);
  const allUrls = [...resources.scripts, ...resources.stylesheets];
  
  if (allUrls.length === 0) {
    return {
      html,
      resources,
      hashes: {},
      modified: false
    };
  }
  
  console.log(`\n   Found ${allUrls.length} external resource(s):`);
  allUrls.forEach(url => console.log(`   - ${url}`));
  
  if (skipFetch) {
    console.log('   ⚠ Skipping hash generation (skipFetch=true)');
    return {
      html,
      resources,
      hashes: {},
      modified: false
    };
  }
  
  // Generate SRI hashes
  const hashes = await generateSRIHashesForURLs(allUrls, algorithm);
  
  // Add SRI attributes to HTML
  const updatedHtml = addSRIAttributesToHTML(html, hashes);
  
  return {
    html: updatedHtml,
    resources,
    hashes,
    modified: updatedHtml !== html
  };
}

module.exports = {
  generateSRIHash,
  generateSRIHashFromURL,
  generateSRIHashesForURLs,
  extractExternalResources,
  addSRIAttributesToHTML,
  processHTMLForSRI
};
