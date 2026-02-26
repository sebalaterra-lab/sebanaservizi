#!/usr/bin/env node

/**
 * Generate a sample HTML file to demonstrate the HTML generator
 */

const fs = require('fs');
const path = require('path');
const htmlGen = require('./htmlGenerator.js');

// Sample content
const sampleContent = {
  metadata: {
    title: 'Sebana Servizi - Gestione Condominiale Professionale',
    description: 'Servizi professionali per la gestione condominiale: antincendio, controllo idrico, conformità privacy e molto altro.',
    keywords: ['gestione condominiale', 'antincendio', 'controllo idrico', 'privacy', 'GDPR'],
    ogTags: {
      title: 'Sebana Servizi - Gestione Condominiale',
      description: 'Servizi professionali per amministratori di condominio',
      type: 'website',
      url: 'https://www.sebanaservizi.it',
      image: 'https://www.sebanaservizi.it/images/og-image.jpg'
    },
    contactInfo: {
      phone: '+39 02 1234 5678',
      email: 'info@sebanaservizi.it'
    },
    hero: {
      title: 'Sebana Servizi',
      subtitle: 'Partner affidabile per la gestione condominiale',
      mainServices: [
        {
          title: 'Gestione Antincendio',
          description: 'Servizi completi per la sicurezza antincendio dei condomini',
          icon: 'fire'
        },
        {
          title: 'Controllo Idrico',
          description: 'Conformità D.LGS. 18/2023 e gestione impianti idrici',
          icon: 'water'
        },
        {
          title: 'Conformità Privacy',
          description: 'Gestione GDPR e protezione dati per condomini',
          icon: 'privacy'
        }
      ]
    },
    services: {
      title: 'Di cosa ci occupiamo',
      description: 'Offriamo una gamma completa di servizi per amministratori di condominio e gestori immobiliari',
      detailedServices: [
        {
          title: 'Sicurezza Antincendio',
          description: 'Gestione completa della sicurezza antincendio',
          features: [
            'Valutazione del rischio incendio',
            'Manutenzione estintori e idranti',
            'Formazione addetti antincendio',
            'Certificazioni e documentazione'
          ]
        },
        {
          title: 'Gestione Impianti Idrici',
          description: 'Controllo e manutenzione impianti idrici',
          features: [
            'Analisi qualità acqua',
            'Conformità normativa D.LGS. 18/2023',
            'Manutenzione preventiva',
            'Gestione emergenze'
          ]
        }
      ]
    },
    footer: {
      companyInfo: {
        name: 'Sebana Servizi S.r.l.',
        address: 'Via Roma 123, 20100 Milano (MI)',
        phone: '+39 02 1234 5678',
        email: 'info@sebanaservizi.it',
        vatNumber: '12345678901'
      },
      links: [
        { label: 'Privacy Policy', href: '/privacy', external: false },
        { label: 'Cookie Policy', href: '/cookie', external: false },
        { label: 'Termini e Condizioni', href: '/terms', external: false }
      ],
      socialMedia: [
        { platform: 'LinkedIn', url: 'https://linkedin.com/company/sebanaservizi' },
        { platform: 'Facebook', url: 'https://facebook.com/sebanaservizi' }
      ]
    }
  },
  teamMembers: [
    {
      name: 'Mario Rossi',
      role: 'Direttore Generale',
      description: 'Oltre 15 anni di esperienza nella gestione condominiale',
      imageUrl: 'images/team/member1.jpg'
    },
    {
      name: 'Laura Bianchi',
      role: 'Responsabile Sicurezza',
      description: 'Specialista certificata in prevenzione incendi',
      imageUrl: 'images/team/member2.jpg'
    },
    {
      name: 'Giuseppe Verdi',
      role: 'Tecnico Impianti',
      description: 'Esperto in impianti idrici e termici',
      imageUrl: 'images/team/member3.jpg'
    },
    {
      name: 'Anna Neri',
      role: 'Consulente Privacy',
      description: 'Specialista GDPR e protezione dati',
      imageUrl: 'images/team/member4.jpg'
    },
    {
      name: 'Paolo Gialli',
      role: 'Amministratore',
      description: 'Gestione amministrativa e contabile',
      imageUrl: 'images/team/member5.jpg'
    }
  ],
  statistics: [
    { value: '150+', label: 'Condomini Gestiti' },
    { value: '50+', label: 'Amministratori Partner' },
    { value: '10+', label: 'Anni di Esperienza' },
    { value: '20+', label: 'Città Servite' }
  ],
  companyValues: [
    {
      title: 'Professionalità',
      description: 'Competenza tecnica e serietà in ogni intervento',
      icon: 'professional'
    },
    {
      title: 'Ottimizzazione',
      description: 'Efficienza operativa e miglioramento continuo',
      icon: 'optimization'
    },
    {
      title: 'Qualità',
      description: 'Standard elevati e attenzione ai dettagli',
      icon: 'quality'
    },
    {
      title: 'Trasparenza',
      description: 'Chiarezza e onestà nei rapporti con i clienti',
      icon: 'transparency'
    }
  ]
};

// Generate HTML
const html = htmlGen.generateHTML(sampleContent, {
  includeMetadata: true,
  includeLazyLoading: true,
  useWebP: true
});

// Write to file
const outputPath = path.join(__dirname, '..', 'index.html');
fs.writeFileSync(outputPath, html, 'utf-8');

console.log('✅ Sample HTML generated successfully!');
console.log(`📄 Output: ${outputPath}`);
console.log('\nYou can open this file in a browser to preview the structure.');
console.log('Note: CSS and images are not yet implemented, so styling will be minimal.');
