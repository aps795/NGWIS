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

  // Development simulation mode
  console.log(`=======================================================`);
  console.log(`[Email Service: DEV SIMULATION]`);
  console.log(`Target Recipient : ${toEmail}`);
  console.log(`Verification Code: ${otpCode}`);
  console.log(`Expires In       : 5 minutes`);
  console.log(`Status           : To dispatch live emails, set SMTP_APP_PASSWORD in .env`);
  console.log(`=======================================================`);

  return { success: true, simulated: true };
}

/**
 * Sends full details of a new online admission enquiry to the school administration email.
 * Target email: newglobalwisdominternationalsc@gmail.com
 * 
 * @param {object} enquiry The admission enquiry record
 * @returns {Promise<{ success: boolean; messageId?: string; simulated?: boolean; error?: string }>}
 */
export async function sendNewEnquiryNotificationEmail(enquiry) {
  const mailTransporter = getTransporter();
  const adminEmail = config.adminEmail || 'newglobalwisdominternationalsc@gmail.com';

  const formattedDate = enquiry.submittedAt
    ? new Date(enquiry.submittedAt).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Admission Enquiry - ${enquiry.studentName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b1329; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #e2e8f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b1329; padding: 30px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background: #0f172a; border-radius: 18px; border: 1px solid #1e293b; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); padding: 28px 24px; text-align: center; border-bottom: 2px solid #d97706;">
              <h1 style="margin: 0; color: #ffffff; font-size: 21px; font-weight: 700; letter-spacing: 0.5px;">
                New Global Wisdom International School
              </h1>
              <p style="margin: 6px 0 0; color: #fbbf24; font-size: 12px; font-style: italic;">
                Bhujehuan, Sauna, Ghazipur &bull; Estd. 2016
              </p>
            </td>
          </tr>

          <!-- Notification Title Bar -->
          <tr>
            <td style="background: #020617; padding: 14px 24px; border-bottom: 1px solid #1e293b;">
              <table width="100%" role="presentation">
                <tr>
                  <td>
                    <span style="background: rgba(217, 119, 6, 0.2); border: 1px solid rgba(217, 119, 6, 0.5); color: #fbbf24; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 3px 10px; border-radius: 12px; letter-spacing: 0.5px;">
                      New Enquiry
                    </span>
                  </td>
                  <td align="right" style="color: #94a3b8; font-size: 12px;">
                    Ref: <strong style="color: #ffffff; font-family: monospace;">${enquiry.id}</strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 28px 24px;">
              <h2 style="margin: 0 0 18px; color: #ffffff; font-size: 18px; font-weight: 600;">
                Online Admission Enquiry Received
              </h2>
              <p style="margin: 0 0 22px; color: #94a3b8; font-size: 13px; line-height: 1.6;">
                A new prospective student admission enquiry has been submitted on the NGWIS school website. Here are the complete details:
              </p>

              <!-- Enquiry Details Table -->
              <table width="100%" role="presentation" style="border-collapse: collapse; background: #020617; border-radius: 12px; border: 1px solid #1e293b; overflow: hidden; margin-bottom: 24px;">
                <tr style="border-bottom: 1px solid #1e293b;">
                  <td style="padding: 12px 16px; color: #94a3b8; font-size: 12px; width: 35%; font-weight: 600;">Student Full Name:</td>
                  <td style="padding: 12px 16px; color: #ffffff; font-size: 14px; font-weight: 700;">${enquiry.studentName}</td>
                </tr>
                <tr style="border-bottom: 1px solid #1e293b;">
                  <td style="padding: 12px 16px; color: #94a3b8; font-size: 12px; font-weight: 600;">Parent / Guardian:</td>
                  <td style="padding: 12px 16px; color: #ffffff; font-size: 13px;">${enquiry.parentName}</td>
                </tr>
                <tr style="border-bottom: 1px solid #1e293b;">
                  <td style="padding: 12px 16px; color: #94a3b8; font-size: 12px; font-weight: 600;">Class Applying For:</td>
                  <td style="padding: 12px 16px; color: #fbbf24; font-size: 14px; font-weight: 700;">${enquiry.classApplying}</td>
                </tr>
                <tr style="border-bottom: 1px solid #1e293b;">
                  <td style="padding: 12px 16px; color: #94a3b8; font-size: 12px; font-weight: 600;">Contact Mobile:</td>
                  <td style="padding: 12px 16px;">
                    <a href="tel:${enquiry.mobile}" style="color: #38bdf8; font-size: 14px; font-weight: 700; text-decoration: none;">
                      ${enquiry.mobile} &nbsp;📞
                    </a>
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #1e293b;">
                  <td style="padding: 12px 16px; color: #94a3b8; font-size: 12px; font-weight: 600;">Email Address:</td>
                  <td style="padding: 12px 16px; color: #e2e8f0; font-size: 13px;">
                    ${enquiry.email ? `<a href="mailto:${enquiry.email}" style="color: #38bdf8; text-decoration: none;">${enquiry.email}</a>` : '<em style="color: #64748b;">Not provided</em>'}
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #1e293b;">
                  <td style="padding: 12px 16px; color: #94a3b8; font-size: 12px; font-weight: 600;">Village / Locality / Tehsil:</td>
                  <td style="padding: 12px 16px; color: #e2e8f0; font-size: 13px;">
                    ${enquiry.address ? enquiry.address : '<em style="color: #64748b;">Not provided</em>'}
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #1e293b;">
                  <td style="padding: 12px 16px; color: #94a3b8; font-size: 12px; font-weight: 600;">Message / Questions:</td>
                  <td style="padding: 12px 16px; color: #e2e8f0; font-size: 13px; line-height: 1.5;">
                    ${enquiry.message ? enquiry.message : '<em style="color: #64748b;">No specific questions provided</em>'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; color: #94a3b8; font-size: 12px; font-weight: 600;">Submitted On:</td>
                  <td style="padding: 12px 16px; color: #94a3b8; font-size: 12px;">
                    ${formattedDate} (IST)
                  </td>
                </tr>
              </table>

              <!-- Action Buttons -->
              <table width="100%" role="presentation">
                <tr>
                  <td align="center">
                    <a href="tel:${enquiry.mobile}" style="display: inline-block; background: #d97706; color: #020617; font-weight: 700; font-size: 13px; text-decoration: none; padding: 12px 28px; border-radius: 8px; margin: 4px;">
                      📞 Call Parent (${enquiry.mobile})
                    </a>
                    <a href="https://ngwis.vercel.app/admin/login" style="display: inline-block; background: #1e293b; color: #ffffff; font-weight: 600; font-size: 13px; text-decoration: none; padding: 12px 24px; border-radius: 8px; margin: 4px; border: 1px solid #334155;">
                      Open Admin Portal &rarr;
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Institutional Footer Strip -->
          <tr>
            <td style="background: #020617; padding: 18px 24px; border-top: 1px solid #1e293b; text-align: center;">
              <p style="margin: 0; color: #475569; font-size: 11px;">
                &copy; ${new Date().getFullYear()} New Global Wisdom International School &bull; Admissions Desk
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
Online Admission Enquiry Received
----------------------------------------
Tracking ID      : ${enquiry.id}
Student Name     : ${enquiry.studentName}
Parent / Guardian: ${enquiry.parentName}
Class Applying   : ${enquiry.classApplying}
Mobile Number    : ${enquiry.mobile}
Email Address    : ${enquiry.email || 'Not provided'}
Address/Locality : ${enquiry.address || 'Not provided'}
Message/Query    : ${enquiry.message || 'None'}
Submitted At     : ${formattedDate} (IST)
----------------------------------------
To contact the parent, call: ${enquiry.mobile}
Open School Admin Desk: https://ngwis.vercel.app/admin/login
  `.trim();

  if (mailTransporter) {
    try {
      const info = await mailTransporter.sendMail({
        from: `"NGWIS Admissions Portal" <${config.smtpUser}>`,
        to: adminEmail,
        subject: `New Admission Enquiry: ${enquiry.studentName} (${enquiry.classApplying}) - Ref: ${enquiry.id}`,
        text: plainText,
        html: htmlContent
      });

      console.log(`[Email Service] Admission enquiry ${enquiry.id} successfully emailed to ${adminEmail} (Message ID: ${info.messageId})`);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.error(`[Email Service Error] Failed sending enquiry email to ${adminEmail}:`, err);
      return { success: false, error: 'Failed to deliver notification email.' };
    }
  }

  // Development simulation mode
  console.log(`=======================================================`);
  console.log(`[Email Service: NEW ENQUIRY NOTIFICATION]`);
  console.log(`Target Recipient : ${adminEmail}`);
  console.log(`Tracking ID      : ${enquiry.id}`);
  console.log(`Student Name     : ${enquiry.studentName}`);
  console.log(`Parent Name      : ${enquiry.parentName}`);
  console.log(`Class Applying   : ${enquiry.classApplying}`);
  console.log(`Mobile Number    : ${enquiry.mobile}`);
  console.log(`Email Address    : ${enquiry.email || 'None'}`);
  console.log(`Address/Locality : ${enquiry.address || 'None'}`);
  console.log(`Message          : ${enquiry.message || 'None'}`);
  console.log(`Status           : Ready for live dispatch via SMTP`);
  console.log(`=======================================================`);

  return { success: true, simulated: true };
}
