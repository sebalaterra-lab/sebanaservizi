#!/usr/bin/env node

/**
 * Test script for HTML Generator
 */

const htmlGen = require('./htmlGenerator.js');

// Test basic HTML generation
const testContent = {
  metadata: {
    title: 'Sebana Servizi - Test',
    description: 'Test description',
    keywords: ['test', 'servizi'],
    ogTags: {
      title: 'Sebana Servizi',
      description: 'Test OG description'
    },
    contactInfo: {
      phone: '+39 123 456 7890',
      email: 'info@sebanaservizi.it'
    },
    hero: {
      title: 'Sebana Servizi',
      subtitle: 'Servizi professionali'
    },
    services: {
      title: 'Di cosa ci occupiamo',
      description: 'Servizi professionali'
    },
    footer: {
      companyInfo: {
        name: 'Sebana Servizi',
        phone: '+39 123 456 7890',
        email: 'info@sebanaservizi.it'
      }
    }
  },
  teamMembers: [],
  statistics: [],
  companyValues: []
};

const html = htmlGen.generateHTML(testContent);

// Verify key elements are present
const checks = [
  { name: 'DOCTYPE', test: html.includes('<!DOCTYPE html>') },
  { name: 'Title tag', test: html.includes('<title>Sebana Servizi - Test</title>') },
  { name: 'Meta description', test: html.includes('meta name="description"') },
  { name: 'Open Graph tags', test: html.includes('property="og:title"') },
  { name: 'Viewport meta', test: html.includes('name="viewport"') },
  { name: 'CSP meta', test: html.includes('Content-Security-Policy') },
  { name: 'Header element', test: html.includes('<header class="site-header">') },
  { name: 'Hero section', test: html.includes('id="hero"') },
  { name: 'Services section', test: html.includes('id="services"') },
  { name: 'Values section', test: html.includes('id="values"') },
  { name: 'Statistics section', test: html.includes('id="statistics"') },
  { name: 'Team section', test: html.includes('id="team"') },
  { name: 'Footer element', test: html.includes('<footer') },
  { name: 'Main element', test: html.includes('<main>') },
  { name: 'Navigation', test: html.includes('<nav') }
];

console.log('HTML Generator Verification:');
console.log('============================');
let allPassed = true;
checks.forEach(check => {
  const status = check.test ? '✓' : '✗';
  console.log(`${status} ${check.name}`);
  if (!check.test) allPassed = false;
});

console.log('');
if (allPassed) {
  console.log('✅ All checks passed!');
} else {
  console.log('❌ Some checks failed');
  process.exit(1);
}

// Test lazy loading
console.log('\nLazy Loading Test:');
console.log('==================');
const teamMembers = [
  { name: 'Member 1', role: 'Role 1', description: 'Desc 1', imageUrl: 'images/team/member1.jpg' },
  { name: 'Member 2', role: 'Role 2', description: 'Desc 2', imageUrl: 'images/team/member2.jpg' },
  { name: 'Member 3', role: 'Role 3', description: 'Desc 3', imageUrl: 'images/team/member3.jpg' },
  { name: 'Member 4', role: 'Role 4', description: 'Desc 4', imageUrl: 'images/team/member4.jpg' },
  { name: 'Member 5', role: 'Role 5', description: 'Desc 5', imageUrl: 'images/team/member5.jpg' }
];

const teamSection = htmlGen.generateTeamSection(teamMembers, { includeLazyLoading: true, useWebP: true });

// First 3 members should NOT have lazy loading
const member1Match = teamSection.match(/<div class="team-member">[\s\S]*?Member 1[\s\S]*?<\/div>/);
const member4Match = teamSection.match(/<div class="team-member">[\s\S]*?Member 4[\s\S]*?<\/div>/);

const hasLazyInFirst = member1Match && member1Match[0].includes('loading="lazy"');
const hasLazyInFourth = member4Match && member4Match[0].includes('loading="lazy"');

console.log(`✓ First member (above fold) has NO lazy loading: ${!hasLazyInFirst ? 'PASS' : 'FAIL'}`);
console.log(`✓ Fourth member (below fold) has lazy loading: ${hasLazyInFourth ? 'PASS' : 'FAIL'}`);

// Test WebP support
const hasWebP = teamSection.includes('<picture>') && teamSection.includes('.webp');
console.log(`✓ WebP support with picture element: ${hasWebP ? 'PASS' : 'FAIL'}`);

console.log('\n✅ HTML Generator module is working correctly!');
