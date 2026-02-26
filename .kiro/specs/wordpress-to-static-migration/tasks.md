# Implementation Plan: WordPress to Static Site Migration

## Overview

This implementation plan converts the Sebana Servizi WordPress site to a static HTML/CSS/JavaScript site hosted on GitHub Pages. The approach follows a phased strategy: content extraction, asset processing, static site generation, and deployment configuration. Each task builds incrementally, with early validation through testing.

## Tasks

- [x] 1. Set up project structure and extraction tools
  - Create static site directory structure (css/, js/, images/, assets/)
  - Set up Node.js project with package.json
  - Install dependencies: cheerio (HTML parsing), sharp (image processing), html-minifier, terser (JS minification), clean-css (CSS minification)
  - Create extraction script entry point
  - _Requirements: 8.1, 8.5_

- [x] 2. Implement content extraction from WordPress site
  - [x] 2.1 Create content extractor module
    - Write JavaScript module to parse WordPress HTML using cheerio
    - Implement functions to extract sections, team members, statistics, and company values
    - Extract text content while preserving structure
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_
  
  - [ ]* 2.2 Write property test for content preservation
    - **Property 1: Content Preservation**
    - **Validates: Requirements 1.1**
  
  - [ ]* 2.3 Write unit tests for content extraction
    - Test extraction of hero section with 3 main services
    - Test extraction of 4 company values
    - Test extraction of 4 statistics
    - Test extraction of 5 team members
    - _Requirements: 1.2, 1.4, 1.5, 1.6_

- [x] 3. Implement image processing pipeline
  - [x] 3.1 Create image processor module
    - Write JavaScript module to copy images from /Volumes/KINGSTON/sebanaservizi.it
    - Implement image optimization using sharp library
    - Generate WebP versions for all JPEG/PNG images
    - Organize images into logical subdirectories (team/, services/, icons/)
    - _Requirements: 2.1, 2.2, 4.3_
  
  - [x] 3.2 Implement error handling for image processing
    - Add logging for missing or corrupted images
    - Include image identifier in warning messages
    - Continue processing on individual image failures
    - _Requirements: 2.5_
  
  - [ ]* 3.3 Write property tests for image processing
    - **Property 2: Complete Image Extraction**
    - **Property 4: Image Processing Error Logging**
    - **Property 6: WebP Image Generation**
    - **Validates: Requirements 2.1, 2.5, 4.3**

- [x] 4. Generate static HTML structure
  - [x] 4.1 Create HTML generator module
    - Write function to generate semantic HTML5 structure
    - Implement header with navigation and contact info
    - Implement hero section with three main services
    - Implement services description section
    - Implement company values section with 4 values
    - Implement statistics section with 4 metrics
    - Implement team section with 5 members
    - Implement footer with company info and links
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 5.6, 10.1_
  
  - [x] 4.2 Add SEO metadata and tags
    - Include descriptive title tag
    - Add meta description tag
    - Add Open Graph tags for social sharing
    - Add viewport meta tag for mobile rendering
    - Include Content Security Policy meta tag
    - _Requirements: 5.1, 5.2, 5.3, 3.5, 7.2_
  
  - [x] 4.3 Implement image references with lazy loading
    - Generate img tags with correct relative paths
    - Add loading="lazy" attribute for below-fold images
    - Include WebP sources with fallbacks using picture element
    - _Requirements: 2.4, 4.4, 4.3_
  
  - [ ]* 4.4 Write property tests for HTML generation
    - **Property 3: Valid Image References**
    - **Property 7: Lazy Loading for Below-Fold Images**
    - **Property 9: Content Sanitization**
    - **Property 12: Section Order Preservation**
    - **Validates: Requirements 2.4, 4.4, 7.4, 9.3**

- [x] 5. Checkpoint - Verify HTML generation
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement CSS styling
  - [x] 6.1 Create main stylesheet
    - Write CSS with mobile-first responsive approach
    - Implement layout using Flexbox/CSS Grid
    - Define breakpoints for mobile (<768px), tablet (768-1024px), desktop (>1024px)
    - Replicate color scheme from WordPress site
    - Implement typography matching WordPress fonts
    - Style all interactive elements (buttons, links, forms)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 9.1, 9.2, 9.4_
  
  - [x] 6.2 Add normalize.css for cross-browser consistency
    - Include normalize.css or CSS reset
    - _Requirements: 3.1_
  
  - [ ]* 6.3 Write unit tests for responsive breakpoints
    - Test mobile layout (width < 768px)
    - Test tablet layout (width 768-1024px)
    - Test desktop layout (width > 1024px)
    - _Requirements: 3.2, 3.3, 3.4_

- [x] 7. Implement JavaScript functionality
  - [x] 7.1 Create main JavaScript file
    - Implement smooth scrolling for navigation links
    - Add mobile menu toggle if needed
    - Implement any interactive features from WordPress site
    - Keep JavaScript minimal and progressive enhancement focused
    - _Requirements: 8.4_
  
  - [x] 7.2 Implement contact form integration
    - Set up static form solution (Formspree or similar)
    - Add form submission handling with feedback messages
    - Include form validation
    - _Requirements: 10.2, 10.4_

- [x] 8. Build and optimization pipeline
  - [x] 8.1 Create build script
    - Write Node.js build script that orchestrates extraction, processing, and generation
    - Implement CSS minification using clean-css
    - Implement JavaScript minification using terser
    - Generate production-ready files in dist/ directory
    - _Requirements: 4.1, 4.2_
  
  - [x] 8.2 Add file naming validation
    - Implement function to validate file naming conventions
    - Ensure all files use lowercase, hyphen-separated names
    - _Requirements: 8.2_
  
  - [ ]* 8.3 Write property tests for build pipeline
    - **Property 5: Asset Minification**
    - **Property 8: PHP File Exclusion**
    - **Property 11: Consistent File Naming**
    - **Validates: Requirements 4.1, 4.2, 7.1, 8.2**

- [x] 9. Generate SEO and configuration files
  - [x] 9.1 Create robots.txt
    - Generate robots.txt allowing all crawlers
    - _Requirements: 5.4_
  
  - [x] 9.2 Create sitemap.xml
    - Generate sitemap.xml listing all pages
    - Include lastmod dates and priority values
    - _Requirements: 5.5_
  
  - [x] 9.3 Create custom 404 page
    - Design 404.html matching site style
    - Include navigation back to home
    - _Requirements: 6.4_
  
  - [x] 9.4 Add security headers configuration
    - Create _headers file for GitHub Pages (if supported) or document in README
    - Include X-Content-Type-Options configuration
    - Document CSP and security header recommendations
    - _Requirements: 7.3_

- [x] 10. Implement external resource security
  - [x] 10.1 Add SRI hashes for external resources
    - Identify all external script and stylesheet references
    - Generate SRI hashes for each external resource
    - Add integrity attributes to script and link tags
    - _Requirements: 7.5_
  
  - [ ]* 10.2 Write property test for external resource integrity
    - **Property 10: External Resource Integrity**
    - **Validates: Requirements 7.5**

- [x] 11. Checkpoint - Verify build output
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. Set up GitHub repository and Pages configuration
  - [x] 12.1 Create repository structure
    - Initialize Git repository if not exists
    - Create .gitignore for node_modules and build artifacts
    - Organize files for GitHub Pages (root or docs/ directory)
    - _Requirements: 6.1_
  
  - [x] 12.2 Create deployment documentation
    - Write README.md with project overview
    - Include deployment instructions for GitHub Pages
    - Document build process and dependencies
    - Include local development instructions
    - _Requirements: 6.2_
  
  - [x] 12.3 Add optional CNAME file
    - Create CNAME file if custom domain will be used
    - Document custom domain setup in README
    - _Requirements: 6.5_

- [x] 13. Add social media and contact features
  - [x] 13.1 Implement contact information display
    - Add phone, email, and address to footer
    - Ensure contact info is easily accessible
    - _Requirements: 10.1_
  
  - [x] 13.2 Add social media links
    - Extract social media links from WordPress site
    - Add social media icons and links to footer
    - _Requirements: 10.3_
  
  - [x] 13.3 Add location information
    - Include Google Maps embed if present in WordPress site
    - Or add address and location information
    - _Requirements: 10.5_

- [x] 14. Final integration and validation
  - [x] 14.1 Run complete build process
    - Execute full extraction and build pipeline
    - Verify all files are generated correctly
    - Check that no PHP files exist in output
    - Validate all image references resolve
    - _Requirements: 7.1, 2.4_
  
  - [x] 14.2 Validate HTML and accessibility
    - Run HTML validator on generated files
    - Check for semantic HTML5 usage
    - Verify responsive design works at all breakpoints
    - _Requirements: 5.6, 3.2, 3.3, 3.4_
  
  - [ ]* 14.3 Run all property-based tests
    - Execute all property tests with 100+ iterations
    - Verify all properties pass
    - Document any failures for remediation

- [x] 15. Final checkpoint - Deployment readiness
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- The build process should be idempotent (running multiple times produces same result)
- Images from /Volumes/KINGSTON/sebanaservizi.it must be accessible during build
- GitHub Pages deployment will be manual (push to gh-pages branch or configure in repo settings)
- Consider using GitHub Actions for automated builds in future iterations
- Property tests validate universal correctness across all content and assets
- Unit tests validate specific examples and the exact content structure of this site
