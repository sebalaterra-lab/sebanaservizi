# SRI (Subresource Integrity) Implementation

## Overview

This document describes the implementation of Subresource Integrity (SRI) hash generation for external resources in the Sebana Servizi static site.

## Requirement

**Requirement 7.5**: The Static_Site SHALL use Subresource Integrity (SRI) hashes for any external scripts or stylesheets.

## Implementation

### Components

1. **sriHashGenerator.js** - Core module for SRI hash generation
2. **addSRIHashes.js** - Standalone CLI tool for adding SRI hashes to HTML files
3. **Integration in build/index.js** - Automatic SRI hash generation during build process

### Features

#### 1. Hash Generation

The `generateSRIHash()` function creates cryptographic hashes using SHA-384 algorithm:

```javascript
const hash = generateSRIHash(content, 'sha384');
// Returns: "sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
```

#### 2. External Resource Detection

The `extractExternalResources()` function identifies external scripts and stylesheets:

- Detects URLs starting with `http://` or `https://`
- Distinguishes between scripts and stylesheets
- Ignores local resources (relative paths)

#### 3. Automatic Hash Fetching

The `generateSRIHashFromURL()` function:

- Fetches external resources via HTTP/HTTPS
- Generates SRI hash from the fetched content
- Handles errors gracefully with detailed logging

#### 4. HTML Modification

The `addSRIAttributesToHTML()` function:

- Adds `integrity` attribute with the SRI hash
- Adds `crossorigin="anonymous"` attribute for CORS
- Preserves existing attributes
- Skips resources that already have integrity attributes

### Usage

#### Automatic (Build Process)

SRI hashes are automatically generated during the build process:

```bash
npm run build
```

The build script:
1. Generates HTML content
2. Scans for external resources
3. Fetches and generates SRI hashes
4. Adds integrity attributes to HTML
5. Writes the updated HTML to dist/

#### Manual (Standalone Tool)

Add SRI hashes to existing HTML files:

```bash
# Process default files (index.html, 404.html)
npm run add-sri

# Preview changes without modifying files
npm run add-sri:dry-run

# Process specific files
node build/addSRIHashes.js path/to/file.html

# Process multiple files
node build/addSRIHashes.js file1.html file2.html
```

### Example

**Before:**
```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
```

**After:**
```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" 
        integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz" 
        crossorigin="anonymous"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
      integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" 
      crossorigin="anonymous">
```

### Security Benefits

1. **Integrity Verification**: Ensures external resources haven't been tampered with
2. **CDN Compromise Protection**: Prevents attacks if a CDN is compromised
3. **Man-in-the-Middle Protection**: Detects if resources are modified in transit
4. **Compliance**: Meets modern web security best practices

### Algorithm Choice

**SHA-384** is used as the default algorithm because:

- Provides strong cryptographic security (384-bit hash)
- Widely supported by modern browsers
- Recommended by W3C for SRI
- Good balance between security and performance

### Error Handling

The implementation handles various error scenarios:

1. **Network Errors**: Logs error and continues with other resources
2. **HTTP Errors**: Reports non-200 status codes
3. **Missing Resources**: Logs warning but doesn't fail the build
4. **Corrupted Content**: Handles gracefully with error messages

### Testing

A test suite is included in `build/test-sri.js`:

```bash
node build/test-sri.js
```

Tests cover:
- Hash generation from content
- External resource extraction
- SRI attribute addition
- HTML with no external resources

### Current Site Status

The current Sebana Servizi site uses only local resources (self-hosted CSS and JavaScript), so no SRI hashes are currently needed. However, the infrastructure is in place for when external resources are added in the future.

### Future Enhancements

Potential improvements:

1. **Cache SRI Hashes**: Store generated hashes to avoid re-fetching
2. **Multiple Algorithms**: Support SHA-256 and SHA-512 in addition to SHA-384
3. **Batch Processing**: Optimize for processing many files at once
4. **CDN Integration**: Automatically fetch hashes from CDN providers that offer them
5. **Verification Mode**: Verify existing SRI hashes are still valid

## Compliance

This implementation satisfies **Requirement 7.5**:
- ✅ Identifies all external script references
- ✅ Identifies all external stylesheet references
- ✅ Generates SRI hashes for each external resource
- ✅ Adds integrity attributes to script and link tags
- ✅ Adds crossorigin attributes for CORS compliance

## References

- [W3C Subresource Integrity Specification](https://www.w3.org/TR/SRI/)
- [MDN: Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)
- [SRI Hash Generator](https://www.srihash.org/)
