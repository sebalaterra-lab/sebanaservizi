# Design Document: WordPress to Static Site Migration

## Overview

This design outlines the migration of the Sebana Servizi WordPress website to a modern static site hosted on GitHub Pages. The migration strategy focuses on extracting content and assets from the existing WordPress installation, rebuilding the site using semantic HTML5, modern CSS, and minimal JavaScript, while maintaining visual fidelity and improving security and performance.

The migration will be executed in phases: content extraction, asset processing, static site construction, and deployment configuration. The resulting site will eliminate WordPress-specific vulnerabilities while providing a faster, more maintainable web presence.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    WordPress Source                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Content    │  │    Images    │  │    Styles    │      │
│  │   (HTML)     │  │   (Various)  │  │    (CSS)     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Extraction & Processing                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Content    │  │    Image     │  │    Style     │      │
│  │  Extractor   │  │  Optimizer   │  │  Extractor   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Static Site Build                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  index.html  │  │   styles/    │  │   images/    │      │
│  │              │  │   main.css   │  │   *.jpg/png  │      │
│  │              │  │              │  │   *.webp     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │   scripts/   │  │  Config      │                        │
│  │   main.js    │  │  Files       │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      GitHub Pages                            │
│              https://[username].github.io/                   │
│                  or custom domain                            │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

1. **Content Extractor**: Analyzes WordPress HTML output and extracts structured content
2. **Image Optimizer**: Processes images from source directory, creates WebP versions, optimizes file sizes
3. **Style Extractor**: Identifies and extracts relevant CSS from WordPress theme
4. **Static Site Builder**: Assembles extracted content into semantic HTML5 structure
5. **Deployment Configurator**: Sets up GitHub Pages configuration files

## Components and Interfaces

### Content Extractor

**Purpose**: Extract structured content from WordPress site

**Interface**:
```typescript
interface ContentExtractor {
  extractSections(): SiteSection[]
  extractTeamMembers(): TeamMember[]
  extractStatistics(): Statistic[]
  extractCompanyValues(): CompanyValue[]
}

interface SiteSection {
  id: string
  title: string
  content: string
  order: number
}

interface TeamMember {
  name: string
  role: string
  description: string
  imageUrl: string
}

interface Statistic {
  value: string
  label: string
  icon?: string
}

interface CompanyValue {
  title: string
  description: string
  icon?: string
}
```

**Responsibilities**:
- Parse WordPress HTML output
- Extract text content from sections
- Identify and structure team member information
- Extract statistics and company values
- Maintain content ordering

### Image Processor

**Purpose**: Process and optimize images for static site

**Interface**:
```typescript
interface ImageProcessor {
  processImages(sourcePath: string, targetPath: string): ProcessingResult
  optimizeImage(imagePath: string, quality: number): OptimizedImage
  generateWebP(imagePath: string): string
  validateImageIntegrity(imagePath: string): boolean
}

interface ProcessingResult {
  processed: string[]
  failed: string[]
  warnings: string[]
}

interface OptimizedImage {
  originalPath: string
  optimizedPath: string
  webpPath: string
  originalSize: number
  optimizedSize: number
}
```

**Responsibilities**:
- Copy images from source directory (/Volumes/KINGSTON/sebanaservizi.it)
- Generate WebP versions with fallbacks
- Optimize image file sizes
- Organize images in target directory structure
- Log processing results and errors

### Static Site Generator

**Purpose**: Generate static HTML/CSS/JS files

**Interface**:
```typescript
interface StaticSiteGenerator {
  generateHTML(content: SiteContent): string
  generateCSS(styles: StyleConfig): string
  generateJS(features: Feature[]): string
  buildSite(config: BuildConfig): BuildResult
}

interface SiteContent {
  sections: SiteSection[]
  teamMembers: TeamMember[]
  statistics: Statistic[]
  values: CompanyValue[]
  metadata: SEOMetadata
}

interface SEOMetadata {
  title: string
  description: string
  keywords: string[]
  ogTags: OpenGraphTags
}

interface BuildResult {
  success: boolean
  outputPath: string
  errors: string[]
}
```

**Responsibilities**:
- Generate semantic HTML5 structure
- Create responsive CSS with mobile-first approach
- Implement minimal JavaScript for interactions
- Include SEO metadata and structured data
- Generate sitemap and robots.txt

### Deployment Configurator

**Purpose**: Configure GitHub Pages deployment

**Interface**:
```typescript
interface DeploymentConfigurator {
  generateGitHubPagesConfig(): ConfigFiles
  createCNAME(domain: string): string
  generate404Page(): string
  generateREADME(projectInfo: ProjectInfo): string
}

interface ConfigFiles {
  cname?: string
  readme: string
  notFound: string
  gitignore: string
}
```

**Responsibilities**:
- Create GitHub Pages configuration files
- Generate custom 404 page
- Create deployment documentation
- Configure custom domain if needed

## Data Models

### Site Structure

```typescript
interface Site {
  metadata: SiteMetadata
  header: Header
  hero: HeroSection
  services: ServicesSection
  values: ValuesSection
  statistics: StatisticsSection
  team: TeamSection
  footer: Footer
}

interface SiteMetadata {
  title: string
  description: string
  language: string
  charset: string
  viewport: string
}

interface Header {
  logo: string
  navigation: NavigationItem[]
  contactInfo: ContactInfo
}

interface NavigationItem {
  label: string
  href: string
  external: boolean
}

interface HeroSection {
  title: string
  subtitle: string
  mainServices: MainService[]
}

interface MainService {
  title: string
  description: string
  icon: string
  link?: string
}

interface ServicesSection {
  title: string
  description: string
  detailedServices: Service[]
}

interface Service {
  title: string
  description: string
  features: string[]
}

interface ValuesSection {
  title: string
  values: CompanyValue[]
}

interface StatisticsSection {
  statistics: Statistic[]
}

interface TeamSection {
  title: string
  members: TeamMember[]
}

interface Footer {
  companyInfo: CompanyInfo
  links: FooterLink[]
  socialMedia: SocialLink[]
  copyright: string
}

interface CompanyInfo {
  name: string
  address?: string
  phone?: string
  email?: string
  vatNumber?: string
}

interface ContactInfo {
  phone?: string
  email?: string
}
```

### File Structure

```
static-site/
├── index.html
├── 404.html
├── README.md
├── CNAME (if custom domain)
├── robots.txt
├── sitemap.xml
├── css/
│   ├── main.css
│   ├── main.min.css
│   └── normalize.css
├── js/
│   ├── main.js
│   └── main.min.js
├── images/
│   ├── logo.png
│   ├── team/
│   │   ├── member1.jpg
│   │   └── member1.webp
│   ├── services/
│   │   └── ...
│   └── icons/
│       └── ...
└── assets/
    └── fonts/ (if custom fonts)
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Content Preservation
*For any* section in the WordPress site, all text content from that section should appear in the corresponding section of the static site
**Validates: Requirements 1.1**

### Property 2: Complete Image Extraction
*For any* image file in the WordPress source directory, that image should be extracted and present in the static site's image directory
**Validates: Requirements 2.1**

### Property 3: Valid Image References
*For any* image referenced in the static site HTML, the referenced path should resolve to an existing image file in the static site directory structure
**Validates: Requirements 2.4**

### Property 4: Image Processing Error Logging
*For any* corrupted or missing image during processing, the Asset_Pipeline should log a warning message that includes the image identifier
**Validates: Requirements 2.5**

### Property 5: Asset Minification
*For any* CSS or JavaScript file in the production build, the file should be minified (no unnecessary whitespace, comments removed, identifiers shortened where safe)
**Validates: Requirements 4.1, 4.2**

### Property 6: WebP Image Generation
*For any* raster image (JPEG, PNG) in the static site, a corresponding WebP version should exist with the same base filename
**Validates: Requirements 4.3**

### Property 7: Lazy Loading for Below-Fold Images
*For any* image element that appears below the initial viewport (below the fold), the img tag should include the loading="lazy" attribute
**Validates: Requirements 4.4**

### Property 8: PHP File Exclusion
*For any* file in the static site directory structure, the file extension should not be .php
**Validates: Requirements 7.1**

### Property 9: Content Sanitization
*For any* user-facing text content in the static site HTML, the content should not contain unescaped script tags or dangerous event handler attributes (onclick, onerror, etc.)
**Validates: Requirements 7.4**

### Property 10: External Resource Integrity
*For any* external script or stylesheet reference (src or href starting with http:// or https://), the HTML element should include an integrity attribute with an SRI hash
**Validates: Requirements 7.5**

### Property 11: Consistent File Naming
*For any* file or directory in the static site, the name should follow a consistent naming convention (lowercase, hyphen-separated, no spaces or special characters)
**Validates: Requirements 8.2**

### Property 12: Section Order Preservation
*For any* ordered sequence of sections in the WordPress site, the same sections should appear in the same order in the static site
**Validates: Requirements 9.3**

## Error Handling

### Image Processing Errors

**Missing Images**:
- Log warning with image path and reference location
- Continue processing remaining images
- Generate placeholder or skip image reference in HTML

**Corrupted Images**:
- Log warning with image path and corruption details
- Attempt to process with reduced quality settings
- If processing fails, treat as missing image

**Optimization Failures**:
- Fall back to original image without optimization
- Log warning with image path and error details
- Continue with unoptimized version

### Content Extraction Errors

**Malformed HTML**:
- Use lenient HTML parser that handles malformed markup
- Log warnings for parsing issues
- Extract as much content as possible

**Missing Sections**:
- Log error with expected section identifier
- Continue processing other sections
- Generate placeholder content with clear indication of missing data

**Character Encoding Issues**:
- Detect and convert to UTF-8
- Log warnings for encoding conversions
- Preserve special characters and international text

### Build Process Errors

**File System Errors**:
- Check write permissions before starting build
- Provide clear error messages for permission issues
- Suggest remediation steps (chmod, directory creation)

**Dependency Errors**:
- Validate all required tools are installed (image processors, minifiers)
- Provide clear installation instructions in error messages
- Fail fast with actionable error messages

### Deployment Configuration Errors

**Invalid Domain Configuration**:
- Validate CNAME format before writing file
- Provide error message with correct format example
- Prevent deployment with invalid configuration

**Missing Required Files**:
- Validate presence of index.html before deployment
- Check for required metadata files
- Provide checklist of missing files

## Testing Strategy

### Dual Testing Approach

This project will use both unit testing and property-based testing to ensure comprehensive coverage:

**Unit Tests**: Verify specific examples, edge cases, and error conditions
- Specific content sections are present (hero, services, team, etc.)
- Specific counts match (3 main services, 4 values, 5 team members, 4 statistics)
- Viewport breakpoints work correctly (mobile, tablet, desktop)
- Required files exist (404.html, robots.txt, sitemap.xml, README.md)
- SEO metadata is present (title, description, OG tags)
- Security headers are configured
- Contact information is included

**Property Tests**: Verify universal properties across all inputs
- Content preservation across all sections
- Complete image extraction and valid references
- Asset minification for all CSS/JS files
- WebP generation for all raster images
- Lazy loading for all below-fold images
- PHP file exclusion across entire site
- Content sanitization for all user-facing content
- SRI hashes for all external resources
- Consistent naming conventions for all files
- Section order preservation

### Property-Based Testing Configuration

**Testing Library**: fast-check (for JavaScript/TypeScript) or hypothesis (for Python build scripts)

**Test Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with: **Feature: wordpress-to-static-migration, Property {N}: {property text}**
- Each correctness property implemented by a SINGLE property-based test

**Example Property Test Structure**:
```typescript
// Feature: wordpress-to-static-migration, Property 3: Valid Image References
test('all image references resolve to existing files', () => {
  fc.assert(
    fc.property(
      fc.array(imageReferenceGenerator()),
      (imageRefs) => {
        return imageRefs.every(ref => 
          fs.existsSync(path.join(STATIC_SITE_DIR, ref.path))
        )
      }
    ),
    { numRuns: 100 }
  )
})
```

### Test Coverage Goals

- 100% of correctness properties covered by property-based tests
- All specific examples and edge cases covered by unit tests
- Integration tests for end-to-end build process
- Visual regression testing (manual) for design fidelity

### Testing Phases

1. **Content Extraction Testing**: Verify content extractor produces correct structured data
2. **Asset Processing Testing**: Verify images are processed, optimized, and organized correctly
3. **HTML Generation Testing**: Verify generated HTML is valid, semantic, and complete
4. **Security Testing**: Verify no PHP files, proper sanitization, security headers
5. **Performance Testing**: Verify minification, lazy loading, WebP generation
6. **Deployment Testing**: Verify GitHub Pages configuration is correct

