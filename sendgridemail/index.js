/* eslint-disable no-undef */
const { initializeApp } = require('firebase-admin/app');
const { onCall } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const { logger } = require('firebase-functions');
const sgMail = require('@sendgrid/mail');

initializeApp();

const SENDGRID_API_KEY = defineSecret('SENDGRID_API_KEY');
const SENDGRID_FROM = defineSecret('SENDGRID_FROM');

/* eslint-env node */

exports.sendEmail = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 60,
    secrets: [SENDGRID_API_KEY, SENDGRID_FROM],
  },
  async (request) => {
    const { to, subject, text, html, attachmentsBase64 = [] } = request.data || {};

    if (!to || !subject) {
      throw new Error('Missing "to" or "subject" field');
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const fromEmail = process.env.SENDGRID_FROM;

    const recipients = Array.isArray(to) ? to : [to];
    const attachments = attachmentsBase64.length
      ? attachmentsBase64.map(a => ({
          filename: a.filename,
          type: a.type || 'application/octet-stream',
          disposition: 'attachment',
          content: a.contentBase64,
        }))
      : undefined;

    const msg = {
      to: recipients,
      from: fromEmail,
      subject,
      text: text || undefined,
      html: html || undefined,
      attachments,
    };

    try {
      await sgMail.send(msg);
      logger.info(' Email sent:', { to: recipients });
      return { success: true };
    } catch (err) {
      logger.error(' SendGrid error:', err);
      throw new Error('Send email failed: ' + err.message);
    }
  }
);
