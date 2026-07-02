const DAY_OF_WEEK_MAP = {
  0: 'ראשון',
  1: 'שני',
  2: 'שלישי',
  3: 'רביעי',
  4: 'חמישי',
  5: 'שישי',
  6: 'שבת'
};

const GROUP_STATUS_LABELS = {
  1: 'פעיל',
  2: 'עזב',
  3: 'ליד',
  4: 'ניסיון'
};

const GROUP_STATUS_COLORS = {
  1: { bg: '#ecfdf5', text: '#047857', border: '#a7f3d0' },
  2: { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' },
  3: { bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
  4: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' }
};

const EMAIL_THEME = {
  headerGradient: 'linear-gradient(135deg,#2563eb 0%,#7c3aed 55%,#db2777 100%)',
  bodyBackground: '#f1f5f9',
  cardShadow: '0 20px 45px rgba(15,23,42,0.12)',
  primary: '#2563eb',
  primaryDark: '#1e40af',
  accent: '#7c3aed',
  text: '#0f172a',
  textMuted: '#64748b',
  border: '#e2e8f0',
  surface: '#f8fafc',
  infoGradient: 'linear-gradient(135deg,#ecfdf5 0%,#f0f9ff 100%)',
  infoBorder: '#bfdbfe',
  infoTitle: '#1d4ed8'
};

const escapeHtml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const formatDate = (value) => {
  if (!value) return 'לא צוין';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('he-IL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatDayOfWeek = (day) => {
  if (day === null || day === undefined || day === '') return 'לא צוין';
  if (typeof day === 'number') return DAY_OF_WEEK_MAP[day] || String(day);
  return String(day);
};

export const getGroupInstructorName = (group, instructors = []) => {
  const directName = String(
    group?.instructorName ||
    group?.InstructorName ||
    group?.instructor ||
    ''
  ).trim();

  if (directName) return directName;

  const groupInstructorId =
    group?.instructorId ??
    group?.InstructorId ??
    group?.instructor?.id ??
    group?.instructor?.instructorId;

  if (groupInstructorId === undefined || groupInstructorId === null || String(groupInstructorId).trim() === '') {
    return '';
  }

  const matchedInstructor = (Array.isArray(instructors) ? instructors : []).find((inst) => {
    const instId = inst?.instructorId ?? inst?.id ?? inst?.InstructorId ?? inst?.Id;
    return String(instId || '').trim() === String(groupInstructorId).trim();
  });

  if (!matchedInstructor) return '';

  return String(
    matchedInstructor?.instructorName ||
    matchedInstructor?.InstructorName ||
    `${matchedInstructor?.firstName || matchedInstructor?.FirstName || ''} ${matchedInstructor?.lastName || matchedInstructor?.LastName || ''}`
  ).trim();
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

const buildSection = (title, rowsHtml) => {
  if (!rowsHtml) return '';

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:22px;border:1px solid ${EMAIL_THEME.border};border-radius:16px;overflow:hidden;background:#ffffff;">
      <tr>
        <td colspan="2" style="padding:14px 20px;background:linear-gradient(90deg,#f8fafc 0%,#ffffff 100%);border-bottom:1px solid ${EMAIL_THEME.border};">
          <span style="font-size:13px;font-weight:700;color:${EMAIL_THEME.primaryDark};letter-spacing:0.3px;text-transform:uppercase;">${escapeHtml(title)}</span>
        </td>
      </tr>
      ${rowsHtml}
    </table>
  `;
};

const buildHighlightCard = (label, value, accent) => `
  <td width="33.33%" style="padding:6px;vertical-align:top;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${EMAIL_THEME.surface};border:1px solid ${EMAIL_THEME.border};border-radius:14px;overflow:hidden;">
      <tr>
        <td style="height:4px;background:${accent};font-size:0;line-height:0;">&nbsp;</td>
      </tr>
      <tr>
        <td style="padding:16px 14px;text-align:center;">
          <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:${EMAIL_THEME.textMuted};">${escapeHtml(label)}</p>
          <p style="margin:0;font-size:15px;font-weight:700;color:${EMAIL_THEME.text};line-height:1.4;">${escapeHtml(value)}</p>
        </td>
      </tr>
    </table>
  </td>
`;

export const buildEnrollmentSuccessEmail = ({
  student = {},
  group = {},
  courseName = '',
  branchName = '',
  instructorName = '',
  enrollDate = '',
  groupStatus = 1,
  studentLessonsCount = null
}) => {
  const studentFirstName = student.firstName || student.FirstName || '';
  const studentLastName = student.lastName || student.LastName || '';
  const studentFullName = `${studentFirstName} ${studentLastName}`.trim() || 'התלמיד/ה';
  const groupName = group.groupName || group.GroupName || 'הקבוצה';
  const resolvedCourseName = courseName || group.courseName || group.couresName || group.CourseName || 'לא צוין';
  const resolvedBranchName = branchName || group.branchName || group.BranchName || 'לא צוין';
  const groupHour = group.hour || group.Hour || 'לא צוין';
  const dayOfWeek = formatDayOfWeek(group.dayOfWeek ?? group.DayOfWeek);
  const statusLabel = GROUP_STATUS_LABELS[groupStatus] || GROUP_STATUS_LABELS[1];
  const statusColors = GROUP_STATUS_COLORS[groupStatus] || GROUP_STATUS_COLORS[1];
  const resolvedInstructor = instructorName || 'לא צוין';
  const scheduleLabel = `${dayOfWeek}${groupHour && groupHour !== 'לא צוין' ? ` · ${groupHour}` : ''}`;

  const subject = `אישור רישום – ${studentFullName} נרשם/ה לקבוצה ${groupName}`;

  const studentRows = [
    buildDetailRow('שם מלא', studentFullName, '👤'),
    buildDetailRow('תעודת זהות', student.id || student.studentId, '🪪'),
    buildDetailRow('תאריך רישום', formatDate(enrollDate), '✅', true)
  ].filter(Boolean).join('');

  const groupRows = [
    buildDetailRow('חוג', resolvedCourseName, '🎨'),
    buildDetailRow('סניף', resolvedBranchName, '📍'),
    buildDetailRow('שם המדריך/ה', resolvedInstructor, '🧑‍🏫'),
    buildDetailRow('יום בשבוע', dayOfWeek, '📅'),
    buildDetailRow('שעת השיעור', groupHour, '🕐'),
    buildDetailRow('תאריך התחלה', formatDate(group.startDate || group.StartDate), '🗓️', true)
  ].filter(Boolean).join('');

  const highlightCards = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;">
      <tr>
        ${buildHighlightCard('חוג', resolvedCourseName, EMAIL_THEME.primary)}
        ${buildHighlightCard('מועד', scheduleLabel, EMAIL_THEME.accent)}
        ${buildHighlightCard('מדריך/ה', resolvedInstructor, '#db2777')}
      </tr>
    </table>
  `;

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
              <div style="font-size:42px;line-height:1;margin-bottom:16px;">🎉</div>
              <h1 style="margin:0 0 10px;font-size:30px;line-height:1.3;color:#ffffff;font-weight:800;">
                הרישום התבצע בהצלחה!
              </h1>
              <p style="margin:0;font-size:16px;line-height:1.7;color:rgba(255,255,255,0.94);max-width:480px;display:inline-block;">
                ${escapeHtml(studentFullName)} נרשם/ה בהצלחה לקבוצה
                <strong style="color:#ffffff;">${escapeHtml(groupName)}</strong>
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 8px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:20px;">
                <tr>
                  <td style="padding:16px 18px;background:linear-gradient(135deg,#f8fafc 0%,#ffffff 100%);border:1px solid ${EMAIL_THEME.border};border-radius:16px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="vertical-align:middle;">
                          <p style="margin:0 0 4px;font-size:13px;color:${EMAIL_THEME.textMuted};font-weight:600;">סטטוס רישום</p>
                          <p style="margin:0;font-size:18px;font-weight:800;color:${EMAIL_THEME.text};">${escapeHtml(studentFullName)}</p>
                        </td>
                        <td align="left" style="vertical-align:middle;">
                          <span style="display:inline-block;padding:8px 14px;border-radius:999px;background:${statusColors.bg};color:${statusColors.text};border:1px solid ${statusColors.border};font-size:13px;font-weight:700;">
                            ${escapeHtml(statusLabel)}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 20px;font-size:16px;line-height:1.85;color:#334155;">
                שלום רב,<br />
                שמחים לעדכן כי תהליך הרישום הושלם בהצלחה. להלן סיכום מסודר של כל הפרטים החשובים:
              </p>

              ${highlightCards}

              ${buildSection('פרטי התלמיד/ה', studentRows)}
              ${buildSection('פרטי הקבוצה והחוג', groupRows)}
            </td>
          </tr>

          <tr>
            <td style="padding:4px 28px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${EMAIL_THEME.infoGradient};border:1px solid ${EMAIL_THEME.infoBorder};border-radius:18px;overflow:hidden;">
                <tr>
                  <td style="width:5px;background:${EMAIL_THEME.infoTitle};font-size:0;line-height:0;">&nbsp;</td>
                  <td style="padding:20px 22px;">
                    <p style="margin:0 0 8px;font-size:15px;font-weight:700;color:${EMAIL_THEME.infoTitle};">💡 חשוב לדעת</p>
                    <p style="margin:0;font-size:14px;line-height:1.85;color:#334155;">
                      אנא הגיעו לשיעור הראשון בזמן. במידה ויש שאלות, שינוי בפרטים או צורך בעדכון,
                      ניתן לפנות אלינו ונשמח לסייע.
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

export const prepareEnrollmentSuccessEmail = async (params) => {
  const courseName = params.courseName
    || params.group?.courseName
    || params.group?.couresName
    || '';

  return buildEnrollmentSuccessEmail({
    ...params,
    courseName
  });
};
