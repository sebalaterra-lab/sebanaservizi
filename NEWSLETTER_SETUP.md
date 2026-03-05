# Configurazione Newsletter con Brevo

Questa guida spiega come attivare il sistema di newsletter usando **Brevo** (ex Sendinblue), che gestisce automaticamente iscrizioni, double opt-in, lista iscritti e disiscrizioni.

---

## PARTE 1 — Configurazione iniziale (una volta sola)

### Step 1 — Crea l'account Brevo

1. Vai su [https://www.brevo.com/it/](https://www.brevo.com/it/)
2. Clicca **"Inizia gratuitamente"**
3. Registrati con la mail aziendale (`info@sebanaservizi.it`)
4. Verifica l'indirizzo email

> Il piano gratuito include **300 email/giorno** e **contatti illimitati** — più che sufficiente per iniziare.

---

### Step 2 — Configura il mittente

1. Dal menu laterale vai su **Impostazioni → Mittenti e IP**
2. Clicca **"Aggiungi mittente"**
3. Inserisci:
   - **Nome mittente:** Sebana Servizi
   - **Email mittente:** `info@sebanaservizi.it`
4. Verifica l'email tramite il link che riceverai

> ⚠️ Dovrai anche aggiungere i record DNS per il tuo dominio (SPF, DKIM). Brevo ti guida passo passo. Chiedi al gestore del dominio se hai dubbi.

---

### Step 3 — Crea la lista iscritti

1. Dal menu laterale vai su **Contatti → Liste**
2. Clicca **"Crea una lista"**
3. Nome lista: `Newsletter Sebana Servizi`
4. Salva

---

### Step 4 — Crea il form di iscrizione

1. Dal menu laterale vai su **Email → Forms** (o cerca "Moduli di iscrizione")
2. Clicca **"Crea un modulo di iscrizione"**
3. Configura:
   - **Nome modulo:** Iscrizione Newsletter Sito
   - **Lista di destinazione:** seleziona `Newsletter Sebana Servizi` (creata al passo 3)
   - **Double opt-in:** abilita — invia una email di conferma all'iscritto (obbligatorio per GDPR)
4. Nella sezione **Campi**, aggiungi:
   - Email (obbligatorio, già presente)
   - Nome e Cognome
   - Azienda/Condominio (opzionale)
5. Nella sezione **Email di conferma**, personalizza il testo:
   - Oggetto: `Conferma iscrizione alla newsletter Sebana Servizi`
   - Corpo: invita l'utente a cliccare per confermare l'iscrizione
6. Nella sezione **Pagina di successo**, scegli "Redirect a URL" e inserisci:
   `https://www.sebanaservizi.it/newsletter.html`
7. Clicca **"Salva e ottieni il codice"**

---

### Step 5 — Incolla il codice embed nel sito

1. Brevo ti mostra un blocco di codice HTML (simile a questo):
   ```html
   <!-- BEGIN BREVO FORM -->
   <div class="sib-form" ...>
     ...
   </div>
   <link rel="stylesheet" href="https://sibforms.com/forms/end-form/build/sib-styles.css">
   <script src="https://sibforms.com/forms/end-form/build/main.js"></script>
   <!-- END BREVO FORM -->
   ```
2. Apri il file `newsletter.html`
3. Trova questo commento:
   ```html
   <!-- INCOLLA QUI IL CODICE EMBED DI BREVO -->
   ```
4. Sostituiscilo con il codice copiato da Brevo
5. Esegui `npm run build` per ricostruire il sito
6. Fai commit e push su GitHub

---

## PARTE 2 — Come inviare una nuova newsletter

Ogni volta che pubblichi una nuova edizione della newsletter, segui questi passi:

### Step 1 — Aggiungi il PDF al sito

1. Rinomina il PDF nel formato: `newsletter-[mese]-[anno].pdf`
   - Esempio: `newsletter-ottobre-2024.pdf`
2. Mettilo nella cartella `downloads/`
3. Apri `newsletter.html` e aggiungi un nuovo `<article>` nella sezione `newsletter-archive-section`, copiando il blocco esistente e aggiornando:
   - L'etichetta edizione (`Ed. Ottobre 2024`)
   - Il titolo e il contenuto dell'articolo
   - Il link del pulsante di download (`downloads/newsletter-ottobre-2024.pdf`)
4. Esegui `npm run build`, poi commit e push

### Step 2 — Invia la campagna email su Brevo

1. Accedi su [app.brevo.com](https://app.brevo.com)
2. Dal menu vai su **Email → Campagne**
3. Clicca **"Crea una campagna email"**
4. Configura:
   - **Nome campagna:** Newsletter Sebana Servizi — Ottobre 2024
   - **Oggetto email:** Newsletter Sebana Servizi — Ed. Ottobre 2024
   - **Mittente:** Sebana Servizi `info@sebanaservizi.it`
5. Scegli il template o usa l'editor drag-and-drop per scrivere il corpo della email:
   - Includi un riassunto dell'articolo
   - Aggiungi un pulsante/link verso `https://www.sebanaservizi.it/newsletter.html`
   - (Opzionale) Allega il PDF oppure linka direttamente `https://www.sebanaservizi.it/downloads/newsletter-ottobre-2024.pdf`
6. **Destinatari:** seleziona la lista `Newsletter Sebana Servizi`
7. Invia un **test** a te stesso prima di inviare a tutti
8. Clicca **"Invia"**

---

## PARTE 3 — Cosa gestisce Brevo automaticamente

| Funzione | Automatico |
|---|---|
| Conferma iscrizione (double opt-in) | ✅ |
| Email di benvenuto dopo conferma | ✅ |
| Disiscrizione con un click | ✅ |
| Gestione lista iscritti | ✅ |
| Bounce handling (email non valide) | ✅ |
| Conformità GDPR | ✅ |
| Statistiche aperture e click | ✅ |

---

## PARTE 4 — Aggiornare il CSP quando hai il codice Brevo

Quando incolli il codice Brevo in `newsletter.html`, controlla che il `<meta>` CSP in testa alla pagina includa il dominio del tuo specifico form Brevo. Il dominio di base è già incluso (`https://sibforms.com`), ma se Brevo usa un sottodominio diverso aggiornalo.

Il tag CSP si trova alla riga ~19 di `newsletter.html`:
```html
<meta http-equiv="Content-Security-Policy" content="... script-src ... https://sibforms.com ...">
```

---

## Contatti Brevo

- Documentazione: [https://help.brevo.com/hc/it](https://help.brevo.com/hc/it)
- Supporto: chat disponibile dalla dashboard
