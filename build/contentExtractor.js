/**
 * Content Extractor Module
 * 
 * Extracts structured content from WordPress HTML export
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6
 */

const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

/**
 * Extract all sections from WordPress HTML
 * @param {string} html - WordPress HTML content
 * @returns {Array<SiteSection>} Array of extracted sections
 */
function extractSections(html) {
  const $ = cheerio.load(html);
  const sections = [];
  
  // Extract hero section
  const heroSection = extractHeroSection($);
  if (heroSection) {
    sections.push(heroSection);
  }
  
  // Extract services description section
  const servicesSection = extractServicesSection($);
  if (servicesSection) {
    sections.push(servicesSection);
  }
  
  // Extract company values section
  const valuesSection = extractValuesSection($);
  if (valuesSection) {
    sections.push(valuesSection);
  }
  
  // Extract statistics section
  const statsSection = extractStatisticsSection($);
  if (statsSection) {
    sections.push(statsSection);
  }
  
  // Extract team section
  const teamSection = extractTeamSection($);
  if (teamSection) {
    sections.push(teamSection);
  }
  
  return sections;
}

/**
 * Extract hero section with main services
 * @param {CheerioAPI} $ - Cheerio instance
 * @returns {SiteSection|null} Hero section data
 */
function extractHeroSection($) {
  // Look for hero section - common selectors in WordPress themes
  const heroSelectors = [
    '.hero',
    '#hero',
    '.banner',
    '.jumbotron',
    'section.hero',
    '[class*="hero"]',
    '.elementor-section:first'
  ];
  
  let heroElement = null;
  for (const selector of heroSelectors) {
    heroElement = $(selector).first();
    if (heroElement.length > 0) break;
  }
  
  if (!heroElement || heroElement.length === 0) {
    return null;
  }
  
  const title = heroElement.find('h1, h2, .title, [class*="title"]').first().text().trim();
  const subtitle = heroElement.find('p, .subtitle, [class*="subtitle"]').first().text().trim();
  
  return {
    id: 'hero',
    title: title || 'Hero Section',
    content: heroElement.text().trim(),
    order: 0
  };
}

/**
 * Extract services description section
 * @param {CheerioAPI} $ - Cheerio instance
 * @returns {SiteSection|null} Services section data
 */
function extractServicesSection($) {
  const servicesSelectors = [
    '#services',
    '.services',
    '[class*="servizi"]',
    'section:contains("Di cosa ci occupiamo")',
    '[id*="services"]'
  ];
  
  let servicesElement = null;
  for (const selector of servicesSelectors) {
    servicesElement = $(selector).first();
    if (servicesElement.length > 0) break;
  }
  
  if (!servicesElement || servicesElement.length === 0) {
    return null;
  }
  
  const title = servicesElement.find('h2, h3, .title').first().text().trim();
  const content = servicesElement.text().trim();
  
  return {
    id: 'services',
    title: title || 'Services',
    content: content,
    order: 1
  };
}

/**
 * Extract company values section
 * @param {CheerioAPI} $ - Cheerio instance
 * @returns {SiteSection|null} Values section data
 */
function extractValuesSection($) {
  const valuesSelectors = [
    '#values',
    '.values',
    '[class*="values"]',
    '[class*="valori"]',
    'section:contains("Professionalità")'
  ];
  
  let valuesElement = null;
  for (const selector of valuesSelectors) {
    valuesElement = $(selector).first();
    if (valuesElement.length > 0) break;
  }
  
  if (!valuesElement || valuesElement.length === 0) {
    return null;
  }
  
  const title = valuesElement.find('h2, h3, .title').first().text().trim();
  const content = valuesElement.text().trim();
  
  return {
    id: 'values',
    title: title || 'Company Values',
    content: content,
    order: 2
  };
}

/**
 * Extract statistics section
 * @param {CheerioAPI} $ - Cheerio instance
 * @returns {SiteSection|null} Statistics section data
 */
function extractStatisticsSection($) {
  const statsSelectors = [
    '#statistics',
    '.statistics',
    '[class*="stats"]',
    '[class*="numeri"]',
    '[class*="counter"]'
  ];
  
  let statsElement = null;
  for (const selector of statsSelectors) {
    statsElement = $(selector).first();
    if (statsElement.length > 0) break;
  }
  
  if (!statsElement || statsElement.length === 0) {
    return null;
  }
  
  const title = statsElement.find('h2, h3, .title').first().text().trim();
  const content = statsElement.text().trim();
  
  return {
    id: 'statistics',
    title: title || 'Statistics',
    content: content,
    order: 3
  };
}

/**
 * Extract team section
 * @param {CheerioAPI} $ - Cheerio instance
 * @returns {SiteSection|null} Team section data
 */
function extractTeamSection($) {
  const teamSelectors = [
    '#team',
    '.team',
    '[class*="team"]',
    '[class*="staff"]',
    'section:contains("Team")'
  ];
  
  let teamElement = null;
  for (const selector of teamSelectors) {
    teamElement = $(selector).first();
    if (teamElement.length > 0) break;
  }
  
  if (!teamElement || teamElement.length === 0) {
    return null;
  }
  
  const title = teamElement.find('h2, h3, .title').first().text().trim();
  const content = teamElement.text().trim();
  
  return {
    id: 'team',
    title: title || 'Team',
    content: content,
    order: 4
  };
}

/**
 * Extract team members from WordPress HTML
 * @param {string} html - WordPress HTML content
 * @returns {Array<TeamMember>} Array of team members
 */
function extractTeamMembers(html) {
  const $ = cheerio.load(html);
  const teamMembers = [];
  
  // Common selectors for team member cards
  const memberSelectors = [
    '.team-member',
    '.staff-member',
    '[class*="team-member"]',
    '[class*="member-card"]',
    '.team .member',
    '#team .member'
  ];
  
  let memberElements = $();
  for (const selector of memberSelectors) {
    memberElements = $(selector);
    if (memberElements.length > 0) break;
  }
  
  memberElements.each((index, element) => {
    const $member = $(element);
    
    const name = $member.find('h3, h4, .name, [class*="name"]').first().text().trim();
    const role = $member.find('.role, .position, [class*="role"], [class*="position"]').first().text().trim();
    const description = $member.find('p, .description, [class*="description"]').first().text().trim();
    
    // Extract image URL
    const img = $member.find('img').first();
    const imageUrl = img.attr('src') || img.attr('data-src') || '';
    
    if (name) {
      teamMembers.push({
        name,
        role: role || '',
        description: description || '',
        imageUrl
      });
    }
  });
  
  return teamMembers;
}

/**
 * Extract statistics from WordPress HTML
 * @param {string} html - WordPress HTML content
 * @returns {Array<Statistic>} Array of statistics
 */
function extractStatistics(html) {
  const $ = cheerio.load(html);
  const statistics = [];
  
  // Common selectors for statistics/counters
  const statSelectors = [
    '.statistic',
    '.stat',
    '.counter',
    '[class*="statistic"]',
    '[class*="counter"]',
    '.statistics .item',
    '#statistics .item'
  ];
  
  let statElements = $();
  for (const selector of statSelectors) {
    statElements = $(selector);
    if (statElements.length > 0) break;
  }
  
  statElements.each((index, element) => {
    const $stat = $(element);
    
    const value = $stat.find('.value, .number, [class*="value"], [class*="number"]').first().text().trim();
    const label = $stat.find('.label, .text, [class*="label"]').first().text().trim();
    
    // Try to find icon
    const icon = $stat.find('i, .icon, [class*="icon"]').first().attr('class') || '';
    
    if (value || label) {
      statistics.push({
        value: value || '',
        label: label || '',
        icon: icon || undefined
      });
    }
  });
  
  return statistics;
}

/**
 * Extract company values from WordPress HTML
 * @param {string} html - WordPress HTML content
 * @returns {Array<CompanyValue>} Array of company values
 */
function extractCompanyValues(html) {
  const $ = cheerio.load(html);
  const values = [];
  
  // Common selectors for value cards
  const valueSelectors = [
    '.value',
    '.company-value',
    '[class*="value-card"]',
    '[class*="value-item"]',
    '.values .item',
    '#values .item'
  ];
  
  let valueElements = $();
  for (const selector of valueSelectors) {
    valueElements = $(selector);
    if (valueElements.length > 0) break;
  }
  
  valueElements.each((index, element) => {
    const $value = $(element);
    
    const title = $value.find('h3, h4, .title, [class*="title"]').first().text().trim();
    const description = $value.find('p, .description, [class*="description"]').first().text().trim();
    
    // Try to find icon
    const icon = $value.find('i, .icon, [class*="icon"]').first().attr('class') || '';
    
    if (title) {
      values.push({
        title,
        description: description || '',
        icon: icon || undefined
      });
    }
  });
  
  return values;
}

/**
 * Load and parse WordPress HTML file
 * @param {string} filePath - Path to WordPress HTML file
 * @returns {string} HTML content
 */
function loadWordPressHTML(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`WordPress HTML file not found: ${filePath}`);
  }
  
  return fs.readFileSync(filePath, 'utf-8');
}

/**
 * Extract all content from WordPress HTML file
 * @param {string} filePath - Path to WordPress HTML file
 * @returns {Object} Extracted content
 */
function extractAllContent(filePath) {
  const html = loadWordPressHTML(filePath);
  
  return {
    sections: extractSections(html),
    teamMembers: extractTeamMembers(html),
    statistics: extractStatistics(html),
    companyValues: extractCompanyValues(html)
  };
}

module.exports = {
  extractSections,
  extractTeamMembers,
  extractStatistics,
  extractCompanyValues,
  loadWordPressHTML,
  extractAllContent
};
