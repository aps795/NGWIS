import nodemailer from 'nodemailer';
import { config } from '../config/env.js';

/**
 * Creates and caches the Nodemailer transporter instance.
 */
let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  if (config.smtpHost && config.smtpUser && config.smtpAppPassword) {
    transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpPort === 465, // true for 465, false for 587
      auth: {
        user: config.smtpUser,
        pass: config.smtpAppPassword
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    return transporter;
  }

  return null;
}

/**
 * Sends a 6-digit verification code to the administrator's email.
 * 
 * @param {string} toEmail Recipient email address
 * @param {string} otpCode 6-digit numeric OTP
 * @returns {Promise<{ success: boolean; messageId?: string; simulated?: boolean; error?: string }>}
 */
export async function sendAdminOtpEmail(toEmail, otpCode) {
  const mailTransporter = getTransporter();

  // Branded HTML template matching NGWIS institutional colors
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NGWIS Admin Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b1329; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #e2e8f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b1329; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 540px; background: #0f172a; border-radius: 18px; border: 1px solid #1e293b; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); padding: 32px 24px; text-align: center; border-bottom: 2px solid #d97706;">
              <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: 0.5px;">
                New Global Wisdom International School
              </h1>
              <p style="margin: 6px 0 0; color: #fbbf24; font-size: 12px; font-style: italic;">
                Bhujehuan, Sauna, Ghazipur &bull; Estd. 2016
              </p>
            </td>
          </tr>

          <!-- Main Body Content -->
          <tr>
            <td style="padding: 32px 28px;">
              <div style="display: inline-block; background: rgba(217, 119, 6, 0.15); border: 1px solid rgba(217, 119, 6, 0.4); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; color: #fbbf24; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px;">
                Two-Step Verification
              </div>

              <h2 style="margin: 0 0 12px; color: #ffffff; font-size: 18px; font-weight: 600;">
                Admin Login Verification
              </h2>

              <p style="margin: 0 0 24px; color: #94a3b8; font-size: 14px; line-height: 1.6;">
                A sign-in attempt to the NGWIS Administration Portal requires two-step authentication. Use the following 6-digit verification code to complete your login:
              </p>

              <!-- OTP Code Display Card -->
              <div style="background: #020617; border: 2px dashed #f59e0b; border-radius: 12px; padding: 22px; text-align: center; margin: 0 0 24px;">
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #f59e0b; text-shadow: 0 0 12px rgba(245, 158, 11, 0.3);">
                  ${otpCode}
                </span>
                <p style="margin: 10px 0 0; color: #64748b; font-size: 12px;">
                  Your verification code expires in <strong style="color: #f87171;">5 minutes</strong>.
                </p>
              </div>

              <!-- Security Notices -->
              <div style="background: rgba(15, 23, 42, 0.6); border-left: 3px solid #3b82f6; padding: 12px 16px; border-radius: 4px; margin-bottom: 24px;">
                <p style="margin: 0; color: #94a3b8; font-size: 12px; line-height: 1.5;">
                  <strong>Security Reminder:</strong> Never share this verification code with anyone. School IT staff will never ask for your code.
                </p>
              </div>

              <p style="margin: 0; color: #64748b; font-size: 12px; line-height: 1.5;">
                If you did not initiate this login attempt, please secure your administrative account and alert the school IT administrator.
              </p>
            </td>
          </tr>

          <!-- Institutional Footer Strip -->
          <tr>
            <td style="background: #020617; padding: 18px 24px; border-top: 1px solid #1e293b; text-align: center;">
              <p style="margin: 0; color: #475569; font-size: 11px;">
                &copy; ${new Date().getFullYear()} New Global Wisdom International School. All Rights Reserved.
              </p>
              <p style="margin: 4px 0 0; color: #334155; font-size: 10px;">
                Bhujehuan, Sauna, Saidpur, Ghazipur, Uttar Pradesh – 233307
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const plainText = `
New Global Wisdom International School
Admin Login Verification

Your verification code is: ${otpCode}

This code will expire in 5 minutes.
Two-step verification is required to access the administration panel.
If you did not initiate this login, please ignore this email.

(C) ${new Date().getFullYear()} New Global Wisdom International School.
  `.trim();

  // If SMTP is properly configured, send via Nodemailer
  if (mailTransporter) {
    try {
      const info = await mailTransporter.sendMail({
        from: `"NGWIS Administration" <${config.smtpUser}>`,
        to: toEmail,
        subject: 'NGWIS Admin Verification Code',
        text: plainText,
        html: htmlContent
      });

      console.log(`[Email Service] OTP successfully delivered to ${toEmail} (Message ID: ${info.messageId})`);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.error(`[Email Service Error] Failed sending to ${toEmail}:`, err);
      return { success: false, error: 'Email delivery failed. Please check SMTP settings.' };
    }
  }

  // Development simulation mode: when SMTP is not yet populated
  console.log(`=======================================================`);
  console.log(`[Email Service: DEV SIMULATION]`);
  console.log(`Target Recipient : ${toEmail}`);
  console.log(`Verification Code: ${otpCode}`);
  console.log(`Expires In       : 5 minutes`);
  console.log(`Status           : To dispatch live emails, set SMTP_APP_PASSWORD in .env`);
  console.log(`=======================================================`);

  return { success: true, simulated: true };
}
