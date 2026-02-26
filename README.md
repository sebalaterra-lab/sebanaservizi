# Sebana Servizi - Static Website

Static website for Sebana Servizi, migrated from WordPress to a modern, secure, and performant static site hosted on GitHub Pages.

## Overview

This project is a static HTML/CSS/JavaScript website that provides information about Sebana Servizi's professional condominium management services, including fire safety, water control, and privacy compliance.

## Project Structure

```
sebanaservizi/
├── index.html              # Main homepage
├── 404.html               # Custom 404 error page
├── CNAME                  # Custom domain configuration
├── robots.txt             # Search engine crawler instructions
├── sitemap.xml            # XML sitemap for SEO
├── _headers               # Security headers configuration
├── css/                   # Stylesheets
│   ├── main.css          # Main stylesheet
│   ├── main.min.css      # Minified version
│   └── normalize.css     # CSS reset
├── js/                    # JavaScript files
│   ├── main.js           # Main JavaScript
│   └── main.min.js       # Minified version
├── images/                # Image assets
│   ├── team/             # Team member photos
│   ├── services/         # Service images
│   └── icons/            # Icon files
├── assets/                # Additional assets
├── build/                 # Build scripts
│   ├── index.js          # Main build script
│   ├── contentExtractor.js
│   ├── imageProcessor.js
│   ├── htmlGenerator.js
│   └── fileNamingValidator.js
└── dist/                  # Production build output
```

## Features

- **Responsive Design**: Mobile-first approach with breakpoints for mobile, tablet, and desktop
- **Performance Optimized**: Minified CSS/JS, optimized images, lazy loading
- **SEO Friendly**: Semantic HTML5, meta tags, sitemap, robots.txt
- **Secure**: Content Security Policy, security headers, no PHP vulnerabilities
- **Accessible**: ARIA labels, semantic markup, keyboard navigation

## Local Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run the build process
npm run build
```

### Build Process

The build script performs the following operations:

1. **Content Extraction**: Extracts content from WordPress export (if available)
2. **Image Processing**: Optimizes images and generates WebP versions
3. **HTML Generation**: Creates semantic HTML5 structure
4. **SRI Hash Generation**: Adds Subresource Integrity hashes to external resources
5. **Asset Minification**: Minifies CSS and JavaScript files
6. **File Validation**: Ensures consistent naming conventions
7. **Distribution**: Copies all files to `dist/` directory

### Available Scripts

```bash
# Build the entire site
npm run build

# Add SRI hashes to HTML files
npm run add-sri

# Preview SRI changes without modifying files
npm run add-sri:dry-run
```

### Development Server

For local development, you can use any static file server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## Deployment

### Initial Repository Setup

If you haven't initialized a Git repository yet:

```bash
# Initialize Git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: WordPress to static site migration"

# Add remote repository (replace with your GitHub repository URL)
git remote add origin https://github.com/YOUR_USERNAME/sebanaservizi.git

# Push to GitHub
git push -u origin main
```

**Note**: If your default branch is named `master` instead of `main`, use `master` in the commands above.

### GitHub Pages Deployment

#### Option 1: Deploy from Root Directory (Recommended)

This option deploys directly from the root of your repository.

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy static site"
   git push origin main
   ```

2. **Configure GitHub Pages**:
   - Go to your repository on GitHub
   - Navigate to Settings → Pages
   - Under "Source", select branch: `main`
   - Select folder: `/ (root)`
   - Click "Save"

3. **Wait for Deployment**:
   - GitHub will build and deploy your site
   - Your site will be available at: `https://YOUR_USERNAME.github.io/sebanaservizi/`
   - Deployment typically takes 1-2 minutes

#### Option 2: Deploy from /dist Directory

If you prefer to deploy only the production build:

1. **Build the site**:
   ```bash
   npm run build
   ```

2. **Update .gitignore**:
   - Remove or comment out the `# dist/` line in `.gitignore`
   - This allows the dist directory to be committed

3. **Commit and push**:
   ```bash
   git add .
   git commit -m "Add production build"
   git push origin main
   ```

4. **Configure GitHub Pages**:
   - Go to Settings → Pages
   - Select branch: `main`
   - Select folder: `/dist`
   - Click "Save"

#### Option 3: Deploy to gh-pages Branch

For a cleaner separation between source and deployment:

1. **Install gh-pages package**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add deploy script to package.json**:
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

4. **Configure GitHub Pages**:
   - Go to Settings → Pages
   - Select branch: `gh-pages`
   - Select folder: `/ (root)`
   - Click "Save"

### Custom Domain Configuration

This project includes a `CNAME` file configured for `www.sebanaservizi.it`. If you're deploying to a different domain, update this file with your domain name.

To use a custom domain (e.g., www.sebanaservizi.it):

1. **Update CNAME file** (if using a different domain):
   - Edit the `CNAME` file in the root directory
   - Replace with your domain: `www.yourdomain.com`
   - Commit and push the file
   
   **Note**: The CNAME file should contain ONLY the domain name, nothing else.

2. **Configure DNS at your domain provider**:
   
   For apex domain (sebanaservizi.it):
   ```
   Type: A
   Name: @
   Value: 185.199.108.153
   Value: 185.199.109.153
   Value: 185.199.110.153
   Value: 185.199.111.153
   ```
   
   For www subdomain (www.sebanaservizi.it):
   ```
   Type: CNAME
   Name: www
   Value: YOUR_USERNAME.github.io
   ```

3. **Configure in GitHub**:
   - Go to Settings → Pages
   - Under "Custom domain", enter: `www.sebanaservizi.it`
   - Check "Enforce HTTPS" (wait for DNS propagation first)
   - Click "Save"

4. **Wait for DNS propagation**:
   - DNS changes can take 24-48 hours
   - Verify with: `dig www.sebanaservizi.it`

### Deployment Verification

After deployment, verify your site:

1. **Check deployment status**:
   - Go to repository → Actions tab
   - Look for "pages build and deployment" workflow
   - Ensure it completed successfully

2. **Test the live site**:
   - Visit your GitHub Pages URL
   - Test all pages and links
   - Verify images load correctly
   - Test contact form submission
   - Check responsive design on mobile

3. **Verify security headers**:
   ```bash
   curl -I https://YOUR_USERNAME.github.io/sebanaservizi/
   ```

### Continuous Deployment

Every push to the main branch will automatically trigger a new deployment:

```bash
# Make changes to your site
# Edit HTML, CSS, or JS files

# Commit and push
git add .
git commit -m "Update content"
git push origin main

# GitHub Pages will automatically rebuild and deploy
```

### Troubleshooting Deployment

**Site not updating after push**:
- Check Actions tab for build errors
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Wait a few minutes for CDN propagation

**404 errors on GitHub Pages**:
- Ensure `index.html` is in the root or selected folder
- Check that file names are lowercase
- Verify paths in HTML are relative, not absolute

**Images not loading**:
- Check image paths are relative: `images/photo.jpg` not `/images/photo.jpg`
- Verify images are committed to repository
- Check file names match exactly (case-sensitive)

**Custom domain not working**:
- Verify DNS records are correct
- Wait for DNS propagation (up to 48 hours)
- Check CNAME file contains only the domain name
- Ensure "Enforce HTTPS" is enabled after DNS propagates

### Manual Deployment

To deploy the production build:

```bash
# Build the site
npm run build

# Deploy the dist/ directory to your hosting provider
# Example: rsync, FTP, or hosting-specific CLI tools
```

## Security Headers

### Subresource Integrity (SRI)

The site implements Subresource Integrity (SRI) for all external resources to ensure that files fetched from CDNs haven't been tampered with.

#### What is SRI?

SRI is a security feature that enables browsers to verify that files they fetch are delivered without unexpected manipulation. It works by allowing you to provide a cryptographic hash that a fetched file must match.

#### How It Works

When external scripts or stylesheets are referenced in HTML, the build process:

1. **Identifies External Resources**: Scans HTML for external script and stylesheet references (URLs starting with `http://` or `https://`)
2. **Generates SRI Hashes**: Fetches each external resource and generates a SHA-384 hash
3. **Adds Integrity Attributes**: Adds `integrity` and `crossorigin` attributes to the HTML tags

Example:
```html
<!-- Before -->
<script src="https://cdn.example.com/library.js"></script>

<!-- After -->
<script src="https://cdn.example.com/library.js" 
        integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC" 
        crossorigin="anonymous"></script>
```

#### Using the SRI Tool

The project includes a standalone tool to add SRI hashes to HTML files:

```bash
# Add SRI hashes to default files (index.html, 404.html)
npm run add-sri

# Preview changes without modifying files
npm run add-sri:dry-run

# Process specific files
node build/addSRIHashes.js path/to/file.html

# Process multiple files
node build/addSRIHashes.js file1.html file2.html file3.html
```

#### When to Use SRI

Use SRI hashes for:
- External JavaScript libraries from CDNs
- External CSS frameworks from CDNs
- Any third-party resources loaded from external domains

Do NOT use SRI for:
- Local resources (files served from your own domain)
- Resources that change frequently
- Resources where you don't control the version

#### Current Implementation

The current site uses only local resources (CSS and JavaScript files are self-hosted), so no SRI hashes are needed. However, if you add external resources in the future:

1. Add the external resource to your HTML
2. Run `npm run add-sri` to automatically generate and add SRI hashes
3. Test the site to ensure resources load correctly

#### Security Benefits

- **Integrity Verification**: Ensures external resources haven't been modified
- **Attack Prevention**: Protects against CDN compromises and man-in-the-middle attacks
- **Compliance**: Meets security best practices for modern web applications

### Implemented Security Headers

The site implements the following security headers for protection against common vulnerabilities:

#### X-Content-Type-Options
```
X-Content-Type-Options: nosniff
```
Prevents browsers from MIME-sniffing responses, reducing exposure to drive-by download attacks.

#### X-Frame-Options
```
X-Frame-Options: DENY
```
Prevents the site from being embedded in iframes, protecting against clickjacking attacks.

#### X-XSS-Protection
```
X-XSS-Protection: 1; mode=block
```
Enables browser's built-in XSS filter to block detected attacks.

#### Content Security Policy (CSP)
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; 
  style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; 
  font-src 'self' data:; frame-ancestors 'none'
```
Restricts resource loading to prevent XSS and data injection attacks.

#### Referrer-Policy
```
Referrer-Policy: strict-origin-when-cross-origin
```
Controls how much referrer information is sent with requests.

#### Permissions-Policy
```
Permissions-Policy: geolocation=(), microphone=(), camera=()
```
Disables unnecessary browser features to reduce attack surface.

### GitHub Pages Limitations

**Important**: GitHub Pages has limited support for custom HTTP headers. The `_headers` file is included for documentation purposes, but these headers may not be automatically applied.

### Recommended Solutions

To ensure security headers are properly applied, consider one of these options:

1. **Cloudflare** (Recommended):
   - Free tier available
   - Full control over HTTP headers
   - Additional security features (DDoS protection, SSL)
   - Configure headers in Cloudflare dashboard

2. **Netlify**:
   - Native support for `_headers` file
   - Easy migration from GitHub Pages
   - Automatic HTTPS

3. **Vercel**:
   - Configure headers in `vercel.json`
   - Automatic HTTPS and CDN

4. **Meta Tags** (Current Implementation):
   - CSP and X-Content-Type-Options are included as meta tags in HTML
   - Limited but provides some protection
   - Already implemented in `index.html` and `404.html`

### Verifying Security Headers

After deployment, verify headers are applied:

```bash
# Using curl
curl -I https://www.sebanaservizi.it

# Using online tools
# - securityheaders.com
# - observatory.mozilla.org
```

## SEO Configuration

### Sitemap

The `sitemap.xml` file lists all pages for search engine crawlers:
- Homepage: Priority 1.0, Monthly updates
- 404 page: Priority 0.1, Yearly updates

Update the sitemap when adding new pages.

### Robots.txt

The `robots.txt` file allows all crawlers to access all content:
```
User-agent: *
Allow: /
Sitemap: https://www.sebanaservizi.it/sitemap.xml
```

### Meta Tags

Each page includes:
- Title tags
- Meta descriptions
- Open Graph tags for social sharing
- Viewport meta tag for mobile
- Security meta tags (CSP, X-Content-Type-Options)

## Contact Form

The contact form uses Formspree for form submissions. To configure:

1. Sign up at [formspree.io](https://formspree.io)
2. Create a new form
3. Update the form action in `index.html`:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

See `CONTACT_FORM_SETUP.md` for detailed instructions.

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Minified CSS and JavaScript
- Optimized images with WebP format
- Lazy loading for below-fold images
- No external dependencies (except Formspree)
- Fast load times on GitHub Pages CDN

## License

© 2026 Sebana Servizi. All rights reserved.

## Support

For questions or issues:
- Email: info@sebanaservizi.it
- Phone: +39 02 1234 5678

## Maintenance

### Updating Content

To update site content:

1. Edit the relevant HTML file (`index.html`, `404.html`)
2. Run the build process: `npm run build`
3. Test locally
4. Deploy to GitHub Pages

### Adding New Pages

1. Create new HTML file following the structure of `index.html`
2. Update `sitemap.xml` with the new page
3. Add navigation links as needed
4. Run build and deploy

### Image Optimization

To add new images:

1. Place images in the `images/` directory
2. Run the build script to optimize and generate WebP versions
3. Reference images in HTML with WebP fallbacks:
   ```html
   <picture>
     <source srcset="images/photo.webp" type="image/webp">
     <img src="images/photo.jpg" alt="Description">
   </picture>
   ```
