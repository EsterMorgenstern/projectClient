const EMAIL_THEME = {
  headerGradient: 'linear-gradient(135deg,#0ea5e9 0%,#2563eb 55%,#7c3aed 100%)',
  bodyBackground: '#f1f5f9',
  cardShadow: '0 20px 45px rgba(15,23,42,0.12)',
  primary: '#2563eb',
  primaryDark: '#1e40af',
  accent: '#0ea5e9',
  text: '#0f172a',
  textMuted: '#64748b',
  border: '#e2e8f0',
  surface: '#f8fafc',
  infoGradient: 'linear-gradient(135deg,#fffbeb 0%,#fef3c7 100%)',
  infoBorder: '#fcd34d',
  infoTitle: '#b45309',
  ctaGradient: 'linear-gradient(135deg,#ecfdf5 0%,#f0f9ff 100%)',
  ctaBorder: '#bfdbfe',
  ctaTitle: '#1d4ed8'
};

const escapeHtml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

export const formatTrialDate = (value) => {
  if (!value) return null;
  if (typeof value === 'string' && value.startsWith('0001')) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('he-IL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getTrialDaysAgo = (value) => {
  const formatted = formatTrialDate(value);
  if (!formatted) return null;
  const diffDays = Math.floor((new Date() - new Date(value)) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 ? diffDays : null;
};

export const getStudentEmailFromRow = (row = {}) => String(
  row.email || row.Email || row.studentEmail || row.StudentEmail || ''
).trim();

export const getStudentFullNameFromRow = (row = {}) => {
  const first = row.studentFirstName || row.firstName || row.FirstName || '';
  const last = row.studentLastName || row.lastName || row.LastName || '';
  const combined = `${first} ${last}`.trim();
  return combined || row.studentName || row.StudentName || 'התלמיד/ה';
};

const buildDetailRow = (label, value, icon = '', isLast = false) => {
  if (value === null || value === undefined || value === '') return '';

  const borderStyle = isLast ? 'border-bottom:none;' : `border-bottom:1px solid ${EMAIL_THEME.border};`;

  return `
    <tr>
      <td style="padding:15px 20px;${borderStyle}color:${EMAIL_THEME.textMuted};font-size:14px;width:40%;vertical-align:middle;background:#ffffff;">
        <span style="display:inline-block;width:28px;height:28px;line-height:28px;text-align:center;background:${EMAIL_THEME.surface};border-radius:8px;margin-left:10px;font-size:15px;">${icon}</span>
        <span style="font-weight:500;">${escapeHtml(label)}</span>
      </td>
      <td style="padding:15px 20px;${borderStyle}color:${EMAIL_THEME.text};font-size:15px;font-weight:600;vertical-align:middle;background:#ffffff;">
        ${escapeHtml(value)}
      </td>
    </tr>
  `;
};

export const buildTrialFollowUpEmail = ({
  row = {},
  contactPhone = '',
   contactEmail = ''
}) => {
  const studentFullName = getStudentFullNameFromRow(row);
  const groupName = row.groupName || row.GroupName || 'לא צוין';
  const enrollmentDate = formatTrialDate(row.enrollmentDate || row.EnrollmentDate) || 'לא צוין';
  const trialDateRaw = row.trialDate || row.TrialDate;
  const trialDateFormatted = formatTrialDate(trialDateRaw);
  const trialDaysAgo = getTrialDaysAgo(trialDateRaw);

  const trialDateLabel = trialDateFormatted
    ? (trialDaysAgo !== null && trialDaysAgo >= 4
      ? `${trialDateFormatted} (לפני ${trialDaysAgo} ימים)`
      : trialDateFormatted)
    : 'לא הוזן עדיין';

  const subject = `שיעור ניסיון – ${studentFullName} | נשמח לשמוע אם ממשיכים בחוג`;

  const detailRows = [
    buildDetailRow('שם התלמיד/ה', studentFullName, '👤'),
    buildDetailRow('תעודת זהות', row.studentId || row.StudentId || 'לא צוין', '🪪'),
    buildDetailRow('סטטוס', 'ניסיון', '🔍'),
    buildDetailRow('קבוצה', groupName, '👥'),
    buildDetailRow('תאריך התחלה', enrollmentDate, '🗓️'),
    buildDetailRow('תאריך שיעור ניסיון', trialDateLabel, '🧪', true)
  ].filter(Boolean).join('');

 const phonePart = contactPhone
  ? `לפנות אלינו בטלפון: <strong>${escapeHtml(contactPhone)}</strong>`
  : '';
const emailPart = contactEmail
  ? `להשיב למייל: <a href="mailto:${escapeHtml(contactEmail)}" style="color:#2563eb;">${escapeHtml(contactEmail)}</a>`
  : '';
const parts = [phonePart, emailPart].filter(Boolean).join(' או ');
const contactLine = parts ? `ניתן ${parts}.` : 'ניתן להשיב למייל זה.';

  const body = `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${EMAIL_THEME.bodyBackground};font-family:'Segoe UI',Tahoma,Arial,sans-serif;color:${EMAIL_THEME.text};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${EMAIL_THEME.bodyBackground};padding:36px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:${EMAIL_THEME.cardShadow};">
          <tr>
            <td style="background:${EMAIL_THEME.headerGradient};padding:40px 32px 36px;text-align:center;">
              <div style="font-size:42px;line-height:1;margin-bottom:16px;">🔍</div>
              <h1 style="margin:0 0 10px;font-size:28px;line-height:1.3;color:#ffffff;font-weight:800;">
                מעקב אחר שיעור ניסיון
              </h1>
              <p style="margin:0;font-size:16px;line-height:1.7;color:rgba(255,255,255,0.94);max-width:500px;display:inline-block;">
                ${escapeHtml(studentFullName)} רשום/ה כיום בסטטוס <strong>ניסיון</strong>
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 12px;">
              <p style="margin:0 0 20px;font-size:16px;line-height:1.85;color:#334155;">
                שלום רב,<br />
                אנו פונים אליכם בנוגע לשיעור הניסיון של ${escapeHtml(studentFullName)}.
                להלן פרטי הרישום הרלוונטיים:
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:22px;border:1px solid ${EMAIL_THEME.border};border-radius:16px;overflow:hidden;background:#ffffff;">
                <tr>
                  <td colspan="2" style="padding:14px 20px;background:linear-gradient(90deg,#f8fafc 0%,#ffffff 100%);border-bottom:1px solid ${EMAIL_THEME.border};">
                    <span style="font-size:13px;font-weight:700;color:${EMAIL_THEME.primaryDark};letter-spacing:0.3px;">פרטי שיעור הניסיון</span>
                  </td>
                </tr>
                ${detailRows}
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:4px 28px 20px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${EMAIL_THEME.ctaGradient};border:1px solid ${EMAIL_THEME.ctaBorder};border-radius:18px;overflow:hidden;">
                <tr>
                  <td style="width:5px;background:${EMAIL_THEME.ctaTitle};font-size:0;line-height:0;">&nbsp;</td>
                  <td style="padding:22px 24px;">
                    <p style="margin:0 0 10px;font-size:16px;font-weight:700;color:${EMAIL_THEME.ctaTitle};">נשמח לשמוע מכם</p>
                    <p style="margin:0;font-size:15px;line-height:1.9;color:#334155;">
                      נשמח לדעת האם ${escapeHtml(studentFullName)} מעוניין/ת להמשיך בחוג או לא.<br />
                      ${contactLine}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 28px 32px;text-align:center;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid ${EMAIL_THEME.border};">
                <tr>
                  <td style="padding-top:22px;">
                    <p style="margin:0 0 6px;font-size:13px;color:#94a3b8;">
                      מייל זה נשלח אוטומטית ממערכת ניהול החוגים
                    </p>
                    <p style="margin:0;font-size:13px;color:#94a3b8;">
                      ${escapeHtml(new Date().toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' }))}
                    </p>
                    <p style="margin:10px 0 0;font-size:11px;color:#cbd5e1;">
                      Powered by Esther M · Software solutions
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return { subject, body };
};
