const APP_NAME = 'Interview AI';
const BRAND = '#4F46E5';
const BRAND_DARK = '#3730A3';

const escapeHtml = (str = '') =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const button = (href, label, color = BRAND) => `
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:28px auto;">
    <tr>
      <td align="center" style="border-radius:8px;background:${color};">
        <a href="${href}" target="_blank"
           style="display:inline-block;padding:14px 32px;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:8px;">
          ${label}
        </a>
      </td>
    </tr>
  </table>`;

const layout = ({ preheader, heading, icon, content }) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${APP_NAME}</title>
</head>
<body style="margin:0;padding:0;background:#F3F4F6;">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</span>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#F3F4F6;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
               style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;">
          <tr>
            <td align="center" style="background:${BRAND};padding:28px 20px;font-family:Arial,Helvetica,sans-serif;">
              <div style="font-size:22px;font-weight:bold;color:#ffffff;letter-spacing:0.5px;">${APP_NAME}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px 12px;font-family:Arial,Helvetica,sans-serif;color:#374151;font-size:16px;line-height:1.6;">
              <div style="text-align:center;font-size:44px;line-height:1;margin-bottom:12px;">${icon}</div>
              <h1 style="margin:0 0 16px;text-align:center;font-size:24px;color:#111827;">${heading}</h1>
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#9CA3AF;text-align:center;border-top:1px solid #E5E7EB;">
              &copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.<br/>
              This is an automated email, please do not reply.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

const welcomeEmail = (username) => {
  const name = escapeHtml(username);
  const loginUrl = `${process.env.FRONTEND_URL}/user/login`;

  return {
    subject: `Welcome to ${APP_NAME}!`,
    html: layout({
      preheader: 'Your account has been created successfully.',
      icon: '&#127881;',
      heading: `Welcome, ${name}!`,
      content: `
        <p style="margin:0 0 12px;">Your account has been created successfully. We're excited to have you on board.</p>
        <p style="margin:0 0 12px;">Get ready to practice, improve and ace your next interview.</p>
        ${button(loginUrl, 'Get Started')}
        <p style="margin:0;text-align:center;font-size:14px;color:#6B7280;">Good luck with your preparation!</p>
      `,
    }),
  };
};

const resetPasswordEmail = (username, resetLink) => {
  const name = escapeHtml(username);

  return {
    subject: 'Reset your password',
    html: layout({
      preheader: 'Use this link to reset your password. It expires in 15 minutes.',
      icon: '&#128274;',
      heading: 'Password Reset Request',
      content: `
        <p style="margin:0 0 12px;">Hi ${name},</p>
        <p style="margin:0 0 12px;">We received a request to reset your password. Click the button below to choose a new one.</p>
        ${button(resetLink, 'Reset Password')}
        <p style="margin:0 0 12px;text-align:center;font-size:14px;color:#B45309;background:#FEF3C7;padding:10px;border-radius:6px;">
          This link expires in <b>15 minutes</b>.
        </p>
        <p style="margin:16px 0 0;font-size:14px;color:#6B7280;">If you didn't request this, you can safely ignore this email. Your password will not be changed.</p>
      `,
    }),
  };
};

const resetSuccessEmail = (username) => {
  const name = escapeHtml(username);
  const loginUrl = `${process.env.FRONTEND_URL}/user/login`;

  return {
    subject: 'Your password was changed',
    html: layout({
      preheader: 'Your password has been reset successfully.',
      icon: '&#9989;',
      heading: 'Password Reset Successful',
      content: `
        <p style="margin:0 0 12px;">Hi ${name},</p>
        <p style="margin:0 0 12px;">Your password has been reset successfully. You can now log in with your new password.</p>
        ${button(loginUrl, 'Log In', '#059669')}
        <p style="margin:0;font-size:14px;color:#6B7280;background:#FEF2F2;padding:10px;border-radius:6px;">
          If this wasn't you, please reset your password again right away and contact our support team.
        </p>
      `,
    }),
  };
};

const accountDeletedEmail = (username) => {
  const name = escapeHtml(username);
  const signupUrl = `${process.env.FRONTEND_URL}/user/register`;

  return {
    subject: 'Your account has been deleted',
    html: layout({
      preheader: 'Your account and data have been permanently deleted.',
      icon: '&#128075;',
      heading: 'Account Deleted',
      content: `
        <p style="margin:0 0 12px;">Hi ${name},</p>
        <p style="margin:0 0 12px;">Your ${APP_NAME} account has been permanently deleted along with all your data. We're sorry to see you go.</p>
        <p style="margin:0 0 12px;">If you ever want to come back, you're always welcome to create a new account.</p>
        ${button(signupUrl, 'Create New Account', '#6B7280')}
        <p style="margin:0;font-size:14px;color:#6B7280;background:#FEF2F2;padding:10px;border-radius:6px;">
          If this wasn't you, please contact our support team immediately.
        </p>
      `,
    }),
  };
};

module.exports = { welcomeEmail, resetPasswordEmail, resetSuccessEmail, accountDeletedEmail };