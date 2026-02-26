# Contact Form Setup Instructions

The contact form on the Sebana Servizi website uses [Formspree](https://formspree.io/) as a static form backend solution.

## Setup Steps

### 1. Create a Formspree Account

1. Go to [https://formspree.io/](https://formspree.io/)
2. Sign up for a free account (allows up to 50 submissions per month)
3. Verify your email address

### 2. Create a New Form

1. Log in to your Formspree dashboard
2. Click "New Form" or "Create Form"
3. Give your form a name (e.g., "Sebana Servizi Contact Form")
4. Copy the form endpoint URL (it will look like: `https://formspree.io/f/YOUR_FORM_ID`)

### 3. Update the HTML

1. Open `index.html`
2. Find the contact form section (search for `id="contact-form"`)
3. Replace `YOUR_FORM_ID` in the form action attribute with your actual Formspree form ID:

```html
<form id="contact-form" class="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

### 4. Configure Form Settings (Optional)

In your Formspree dashboard, you can configure:

- **Email notifications**: Set where form submissions should be sent
- **Spam protection**: Enable reCAPTCHA or honeypot protection
- **Custom redirect**: Redirect users after successful submission
- **Auto-reply**: Send automatic confirmation emails to users
- **Webhooks**: Integrate with other services

### 5. Test the Form

1. Deploy your site to GitHub Pages
2. Fill out the contact form and submit
3. Check your email for the submission notification
4. Verify the submission appears in your Formspree dashboard

## Alternative Solutions

If you prefer not to use Formspree, here are other static form solutions:

### Netlify Forms
- Free with Netlify hosting
- 100 submissions per month on free plan
- Built-in spam filtering
- [Documentation](https://docs.netlify.com/forms/setup/)

### Getform
- Free tier: 50 submissions per month
- Easy setup with just an endpoint URL
- [Website](https://getform.io/)

### EmailJS
- Send emails directly from JavaScript
- Free tier: 200 emails per month
- [Website](https://www.emailjs.com/)

### Custom Backend
For more control, you can create a custom backend using:
- AWS Lambda + API Gateway
- Google Cloud Functions
- Vercel Serverless Functions
- Cloudflare Workers

## Form Fields

The current form includes:

- **Name** (required)
- **Email** (required)
- **Phone** (optional)
- **Subject** (required)
- **Message** (required)
- **Privacy Policy Acceptance** (required checkbox)

All fields are validated both client-side (JavaScript) and server-side (by Formspree).

## Spam Protection

The form includes basic client-side validation. For additional spam protection:

1. Enable Formspree's built-in spam filtering
2. Add reCAPTCHA through Formspree settings
3. Consider adding a honeypot field (hidden field that bots fill out)

## Troubleshooting

### Form submissions not working

1. Check that the Formspree form ID is correct in `index.html`
2. Verify your Formspree account is active and verified
3. Check browser console for JavaScript errors
4. Ensure the form action URL is correct

### Not receiving email notifications

1. Check your Formspree dashboard settings
2. Verify the notification email address
3. Check your spam folder
4. Ensure your email provider isn't blocking Formspree emails

### CORS errors

Formspree handles CORS automatically. If you see CORS errors:
1. Ensure you're using the correct form endpoint
2. Check that your site is deployed (CORS may not work on localhost)
3. Verify the form method is POST

## Security Notes

- The form includes CSRF protection through Formspree
- All submissions are encrypted in transit (HTTPS)
- Privacy policy acceptance is required before submission
- Email validation is performed client-side and server-side
- The form respects the Content Security Policy defined in the HTML
