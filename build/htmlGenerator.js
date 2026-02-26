/**
 * HTML Generator Module
 * 
 * Generates semantic HTML5 structure for the static site
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 5.6, 10.1
 */

/**
 * Generate complete HTML document
 * @param {Object} content - Site content data
 * @param {Object} options - Generation options
 * @returns {string} Complete HTML document
 */
function generateHTML(content, options = {}) {
  const {
    sections = [],
    teamMembers = [],
    statistics = [],
    companyValues = [],
    metadata = {}
  } = content;

  const {
    includeMetadata = true,
    includeLazyLoading = true,
    useWebP = true
  } = options;

  return `<!DOCTYPE html>
<html lang="it">
<head>
${includeMetadata ? generateMetadata(metadata) : ''}
  <link rel="stylesheet" href="css/normalize.css">
  <link rel="stylesheet" href="css/main.css">
</head>
<body>
${generateHeader(metadata.contactInfo)}
  
  <main>
${generateHeroSection(metadata.hero, { includeLazyLoading, useWebP })}
${generateServicesSection(metadata.services, { includeLazyLoading, useWebP })}
${generateValuesSection(companyValues, { includeLazyLoading, useWebP })}
${generateStatisticsSection(statistics)}
${generateTeamSection(teamMembers, { includeLazyLoading, useWebP })}
  </main>

${generateFooter(metadata.footer)}

  <script src="js/main.js"></script>
</body>
</html>`;
}

/**
 * Generate HTML metadata section
 * @param {Object} metadata - SEO and metadata information
 * @returns {string} HTML head content
 */
function generateMetadata(metadata) {
  const {
    title = 'Sebana Servizi',
    description = 'Servizi professionali per la gestione condominiale',
    keywords = [],
    ogTags = {}
  } = metadata;

  return `  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  ${keywords.length > 0 ? `<meta name="keywords" content="${escapeHtml(keywords.join(', '))}">` : ''}
  
  <!-- Open Graph Tags -->
  <meta property="og:title" content="${escapeHtml(ogTags.title || title)}">
  <meta property="og:description" content="${escapeHtml(ogTags.description || description)}">
  <meta property="og:type" content="${escapeHtml(ogTags.type || 'website')}">
  ${ogTags.url ? `<meta property="og:url" content="${escapeHtml(ogTags.url)}">` : ''}
  ${ogTags.image ? `<meta property="og:image" content="${escapeHtml(ogTags.image)}">` : ''}
  
  <!-- Security Headers -->
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;">
  <meta http-equiv="X-Content-Type-Options" content="nosniff">`;
}

/**
 * Generate header with navigation and contact info
 * @param {Object} contactInfo - Contact information
 * @returns {string} HTML header element
 */
function generateHeader(contactInfo = {}) {
  const { phone, email } = contactInfo;

  return `  <header class="site-header">
    <div class="container">
      <div class="header-content">
        <div class="logo">
          <a href="/">
            <img src="images/logo.png" alt="Sebana Servizi Logo" width="150" height="50">
          </a>
        </div>
        
        <nav class="main-nav" role="navigation" aria-label="Main navigation">
          <ul>
            <li><a href="#hero">Home</a></li>
            <li><a href="#services">Servizi</a></li>
            <li><a href="#values">I Nostri Valori</a></li>
            <li><a href="#statistics">Numeri</a></li>
            <li><a href="#team">Team</a></li>
            <li><a href="#contact">Contatti</a></li>
          </ul>
        </nav>
        
        ${phone || email ? `<div class="header-contact">
          ${phone ? `<a href="tel:${phone.replace(/\s/g, '')}" class="contact-link phone">${escapeHtml(phone)}</a>` : ''}
          ${email ? `<a href="mailto:${email}" class="contact-link email">${escapeHtml(email)}</a>` : ''}
        </div>` : ''}
      </div>
    </div>
  </header>`;
}

/**
 * Generate hero section with main services
 * @param {Object} hero - Hero section data
 * @param {Object} options - Generation options
 * @returns {string} HTML hero section
 */
function generateHeroSection(hero = {}, options = {}) {
  const {
    title = 'Sebana Servizi',
    subtitle = 'Servizi professionali per la gestione condominiale',
    mainServices = [
      {
        title: 'Gestione Antincendio',
        description: 'Servizi completi per la sicurezza antincendio',
        icon: 'fire'
      },
      {
        title: 'Controllo Idrico',
        description: 'Conformità D.LGS. 18/2023',
        icon: 'water'
      },
      {
        title: 'Conformità Privacy',
        description: 'Gestione GDPR e privacy',
        icon: 'privacy'
      }
    ]
  } = hero;

  return `    <section id="hero" class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1>${escapeHtml(title)}</h1>
          <p class="hero-subtitle">${escapeHtml(subtitle)}</p>
        </div>
        
        <div class="main-services">
          ${mainServices.map((service, index) => `<div class="service-card">
            ${service.icon ? `<div class="service-icon" aria-hidden="true">
              <img src="images/icons/${service.icon}.svg" alt="" width="64" height="64">
            </div>` : ''}
            <h2>${escapeHtml(service.title)}</h2>
            <p>${escapeHtml(service.description)}</p>
            ${service.link ? `<a href="${escapeHtml(service.link)}" class="service-link">Scopri di più</a>` : ''}
          </div>`).join('\n          ')}
        </div>
      </div>
    </section>`;
}

/**
 * Generate services description section
 * @param {Object} services - Services section data
 * @param {Object} options - Generation options
 * @returns {string} HTML services section
 */
function generateServicesSection(services = {}, options = {}) {
  const {
    title = 'Di cosa ci occupiamo',
    description = 'Offriamo servizi professionali per la gestione condominiale',
    detailedServices = []
  } = services;

  return `    <section id="services" class="services-section">
      <div class="container">
        <h2>${escapeHtml(title)}</h2>
        <p class="section-description">${escapeHtml(description)}</p>
        
        ${detailedServices.length > 0 ? `<div class="services-grid">
          ${detailedServices.map(service => `<div class="service-item">
            <h3>${escapeHtml(service.title)}</h3>
            <p>${escapeHtml(service.description)}</p>
            ${service.features && service.features.length > 0 ? `<ul class="service-features">
              ${service.features.map(feature => `<li>${escapeHtml(feature)}</li>`).join('\n              ')}
            </ul>` : ''}
          </div>`).join('\n          ')}
        </div>` : ''}
      </div>
    </section>`;
}

/**
 * Generate company values section
 * @param {Array} values - Array of company values
 * @param {Object} options - Generation options
 * @returns {string} HTML values section
 */
function generateValuesSection(values = [], options = {}) {
  // Default values if none provided
  const defaultValues = [
    {
      title: 'Professionalità',
      description: 'Competenza e serietà in ogni servizio',
      icon: 'professional'
    },
    {
      title: 'Ottimizzazione',
      description: 'Efficienza e miglioramento continuo',
      icon: 'optimization'
    },
    {
      title: 'Qualità',
      description: 'Standard elevati in ogni attività',
      icon: 'quality'
    },
    {
      title: 'Trasparenza',
      description: 'Chiarezza e onestà nei rapporti',
      icon: 'transparency'
    }
  ];

  const valuesToUse = values.length > 0 ? values : defaultValues;

  return `    <section id="values" class="values-section">
      <div class="container">
        <h2>I Nostri Valori</h2>
        
        <div class="values-grid">
          ${valuesToUse.map(value => `<div class="value-card">
            ${value.icon ? `<div class="value-icon" aria-hidden="true">
              <img src="images/icons/${value.icon}.svg" alt="" width="48" height="48">
            </div>` : ''}
            <h3>${escapeHtml(value.title)}</h3>
            <p>${escapeHtml(value.description)}</p>
          </div>`).join('\n          ')}
        </div>
      </div>
    </section>`;
}

/**
 * Generate statistics section
 * @param {Array} statistics - Array of statistics
 * @returns {string} HTML statistics section
 */
function generateStatisticsSection(statistics = []) {
  // Default statistics if none provided
  const defaultStats = [
    { value: '150+', label: 'Condomini' },
    { value: '50+', label: 'Amministratori' },
    { value: '10+', label: 'Anni di Esperienza' },
    { value: '20+', label: 'Città' }
  ];

  const statsToUse = statistics.length > 0 ? statistics : defaultStats;

  return `    <section id="statistics" class="statistics-section">
      <div class="container">
        <div class="statistics-grid">
          ${statsToUse.map(stat => `<div class="stat-item">
            <div class="stat-value">${escapeHtml(stat.value)}</div>
            <div class="stat-label">${escapeHtml(stat.label)}</div>
          </div>`).join('\n          ')}
        </div>
      </div>
    </section>`;
}

/**
 * Generate team section
 * @param {Array} teamMembers - Array of team members
 * @param {Object} options - Generation options
 * @returns {string} HTML team section
 */
function generateTeamSection(teamMembers = [], options = {}) {
  const { includeLazyLoading = true, useWebP = true } = options;

  // Default team members if none provided
  const defaultTeam = [
    {
      name: 'Mario Rossi',
      role: 'Direttore',
      description: 'Esperto in gestione condominiale',
      imageUrl: 'images/team/member1.jpg'
    },
    {
      name: 'Laura Bianchi',
      role: 'Responsabile Sicurezza',
      description: 'Specialista in antincendio',
      imageUrl: 'images/team/member2.jpg'
    },
    {
      name: 'Giuseppe Verdi',
      role: 'Tecnico',
      description: 'Esperto in impianti idrici',
      imageUrl: 'images/team/member3.jpg'
    },
    {
      name: 'Anna Neri',
      role: 'Consulente Privacy',
      description: 'Specialista GDPR',
      imageUrl: 'images/team/member4.jpg'
    },
    {
      name: 'Paolo Gialli',
      role: 'Amministratore',
      description: 'Gestione amministrativa',
      imageUrl: 'images/team/member5.jpg'
    }
  ];

  const teamToUse = teamMembers.length > 0 ? teamMembers : defaultTeam;

  return `    <section id="team" class="team-section">
      <div class="container">
        <h2>Il Nostro Team</h2>
        
        <div class="team-grid">
          ${teamToUse.map((member, index) => {
            const isAboveFold = index < 3;
            return `<div class="team-member">
            ${generateImageTag(member.imageUrl, member.name, {
              includeLazyLoading: includeLazyLoading && !isAboveFold,
              useWebP,
              width: 300,
              height: 300,
              className: 'member-photo'
            })}
            <h3>${escapeHtml(member.name)}</h3>
            <p class="member-role">${escapeHtml(member.role)}</p>
            <p class="member-description">${escapeHtml(member.description)}</p>
          </div>`;
          }).join('\n          ')}
        </div>
      </div>
    </section>`;
}

/**
 * Generate footer with company info and links
 * @param {Object} footer - Footer data
 * @returns {string} HTML footer element
 */
function generateFooter(footer = {}) {
  const {
    companyInfo = {},
    links = [],
    socialMedia = [],
    copyright = `© ${new Date().getFullYear()} Sebana Servizi. Tutti i diritti riservati.`
  } = footer;

  const {
    name = 'Sebana Servizi',
    address,
    phone,
    email,
    vatNumber
  } = companyInfo;

  return `  <footer id="contact" class="site-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section company-info">
          <h3>${escapeHtml(name)}</h3>
          ${address ? `<p class="address">${escapeHtml(address)}</p>` : ''}
          ${phone ? `<p class="phone"><a href="tel:${phone.replace(/\s/g, '')}">${escapeHtml(phone)}</a></p>` : ''}
          ${email ? `<p class="email"><a href="mailto:${email}">${escapeHtml(email)}</a></p>` : ''}
          ${vatNumber ? `<p class="vat">P.IVA: ${escapeHtml(vatNumber)}</p>` : ''}
        </div>
        
        ${links.length > 0 ? `<div class="footer-section footer-links">
          <h3>Link Utili</h3>
          <ul>
            ${links.map(link => `<li><a href="${escapeHtml(link.href)}"${link.external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${escapeHtml(link.label)}</a></li>`).join('\n            ')}
          </ul>
        </div>` : ''}
        
        ${socialMedia.length > 0 ? `<div class="footer-section social-media">
          <h3>Seguici</h3>
          <div class="social-links">
            ${socialMedia.map(social => `<a href="${escapeHtml(social.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(social.platform)}">
              <img src="images/icons/${social.platform.toLowerCase()}.svg" alt="${escapeHtml(social.platform)}" width="32" height="32">
            </a>`).join('\n            ')}
          </div>
        </div>` : ''}
      </div>
      
      <div class="footer-bottom">
        <p>${escapeHtml(copyright)}</p>
      </div>
    </div>
  </footer>`;
}

/**
 * Generate image tag with optional lazy loading and WebP support
 * @param {string} imagePath - Path to image
 * @param {string} alt - Alt text
 * @param {Object} options - Image options
 * @returns {string} HTML image tag or picture element
 */
function generateImageTag(imagePath, alt, options = {}) {
  const {
    includeLazyLoading = false,
    useWebP = false,
    width,
    height,
    className = ''
  } = options;

  const lazyAttr = includeLazyLoading ? ' loading="lazy"' : '';
  const classAttr = className ? ` class="${className}"` : '';
  const sizeAttrs = (width && height) ? ` width="${width}" height="${height}"` : '';

  if (useWebP && (imagePath.endsWith('.jpg') || imagePath.endsWith('.jpeg') || imagePath.endsWith('.png'))) {
    const webpPath = imagePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    
    return `<picture>
              <source srcset="${escapeHtml(webpPath)}" type="image/webp">
              <img src="${escapeHtml(imagePath)}" alt="${escapeHtml(alt)}"${classAttr}${sizeAttrs}${lazyAttr}>
            </picture>`;
  }

  return `<img src="${escapeHtml(imagePath)}" alt="${escapeHtml(alt)}"${classAttr}${sizeAttrs}${lazyAttr}>`;
}

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  if (typeof text !== 'string') {
    return '';
  }
  
  const htmlEscapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
  };
  
  return text.replace(/[&<>"'\/]/g, char => htmlEscapeMap[char]);
}

module.exports = {
  generateHTML,
  generateMetadata,
  generateHeader,
  generateHeroSection,
  generateServicesSection,
  generateValuesSection,
  generateStatisticsSection,
  generateTeamSection,
  generateFooter,
  generateImageTag,
  escapeHtml
};
