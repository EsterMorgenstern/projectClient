import * as XLSX from 'xlsx';
import store from '../store/store';
import { getAllGroupsWithStudents } from '../store/group/groupGetAllGroupsWithStudentsThunk';

/**
 * Fetches all groups and their students, then exports to Excel
 */
export async function exportGroupsToExcelWithData() {
  try {
  // הורדה ללא הודעות
    console.log('התחל יצוא קבוצות לאקסל');
    const response = await store.dispatch(getAllGroupsWithStudents());
    console.log('תשובת thunk:', response);
    if (response.error) {
      console.error('שגיאת thunk:', response.error);
  // אפשר להוסיף טיפול בשגיאה אם רוצים
      return;
    }
    const groups = response.payload || [];
    if (!Array.isArray(groups) || groups.length === 0) {
      console.error('השרת החזיר נתונים לא תקינים או ריקים:', groups);
  // אפשר להוסיף טיפול בשגיאה אם רוצים
      return;
    }

    const rows = [];
    groups.forEach(group => {
      const groupStatus = group.isActive !== undefined ? (group.isActive ? '✅ פעיל' : '⏸️ לא פעיל') : '✅ פעיל';
      if (group.students && group.students.length > 0) {
        group.students.forEach(student => {
          rows.push({
            'שם קבוצה': group.groupName,
            'חוג': group.courseName,
            'סניף': group.branchName,
            'יום ושעה': group.schedule,
            'מדריך': group.instructorName,
            'סטטוס הקבוצה': groupStatus,
            'קוד תלמיד': student.studentId,
            'שם תלמיד': student.studentName,
            'טלפון': student.phone,
            'עיר': student.city ,
            'קופת חולים': student.healthFound
          });
        });
      } else {
        rows.push({
          'שם קבוצה': group.groupName,
          'חוג': group.courseName,
          'סניף': group.branchName,
          'יום ושעה': group.schedule,
          'מדריך': group.instructorName,
          'סטטוס הקבוצה': groupStatus,
          'קוד תלמיד': '',
          'שם תלמיד': '',
          'טלפון': '',
          'עיר': '',
          'קופת חולים': ''
        });
      }
    });

    console.log('נתונים לאקסל:', rows);

    // יצירת workbook ו-worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows, { header: [
      'שם קבוצה', 'חוג', 'סניף', 'יום ושעה', 'מדריך', 'סטטוס הקבוצה', 'קוד תלמיד', 'שם תלמיד', 'טלפון', 'עיר', 'קופת חולים'
    ] });
    worksheet['!cols'] = [
      { wch: 30 }, // שם קבוצה
      { wch: 10 }, // חוג
      { wch: 15 }, // סניף
      { wch: 10 }, // יום ושעה
      { wch: 18 }, // מדריך
      { wch: 15 }, // סטטוס
      { wch: 20 }, // קוד תלמיד
      { wch: 20 }, // שם תלמיד
      { wch: 15 }, // טלפון
      { wch: 15 }, // עיר
      { wch: 15 }  // קופת חולים
    ];
    worksheet['!rtl'] = true;

  XLSX.utils.book_append_sheet(workbook, worksheet, 'קבוצות');
  XLSX.writeFile(workbook, 'שיבוץ_תלמידים_בקבוצות.xlsx');
// הודעת Snackbar מעוצבת בתחתית המסך
function showSnackbarPersistent(message, type = 'info') {
  removeSnackbarPersistent();
  let color = '#2563eb';
  let icon = '';
  if (type === 'success') {
    color = '#10b981';
    icon = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#EAFBF3"/><path d="M8.5 12.5L11 15L16 10" stroke="#10b981" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  } else if (type === 'error') {
    color = '#ef4444';
    icon = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#FDEDED"/><path d="M8 8L16 16M16 8L8 16" stroke="#ef4444" stroke-width="2.2" stroke-linecap="round"/></svg>`;
  } else {
    color = '#2563eb';
    icon = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#EAF0FB"/><path d="M12 8V12" stroke="#2563eb" stroke-width="2.2" stroke-linecap="round"/><circle cx="12" cy="16" r="1" fill="#2563eb"/></svg>`;
  }
  const el = document.createElement('div');
  el.id = 'snackbar-persistent';
  el.innerHTML = `
    <div style="display:flex;align-items:center;gap:16px;">
      <span style="display:flex;align-items:center;">${icon}</span>
      <span style="font-size:1.15rem;font-weight:500;color:#1B3A2B;">${message}</span>
      <button id="snackbar-close-btn" style="margin-right:auto;background:none;border:none;cursor:pointer;font-size:1.6rem;color:#1B3A2B;">&times;</button>
    </div>
  `;
  el.style.position = 'fixed';
  el.style.bottom = '32px';
  el.style.left = '50%';
  el.style.transform = 'translateX(-50%)';
  el.style.background = color + '22';
  el.style.border = '1.5px solid ' + color;
  el.style.color = '#1B3A2B';
  el.style.padding = '18px 36px';
  el.style.borderRadius = '18px';
  el.style.fontWeight = 'bold';
  el.style.fontSize = '1.15rem';
  el.style.zIndex = '9999';
  el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.10)';
  el.style.opacity = '0.98';
  el.style.direction = 'rtl';
  el.style.display = 'flex';
  el.style.alignItems = 'center';
  el.style.minWidth = '320px';
  el.style.maxWidth = '90vw';
  el.style.gap = '16px';
  document.body.appendChild(el);
  document.getElementById('snackbar-close-btn').onclick = removeSnackbarPersistent;
}

function removeSnackbarPersistent() {
  const el = document.getElementById('snackbar-persistent');
  if (el) document.body.removeChild(el);
}
  } catch (err) {
    console.error('שגיאה ביצוא לאקסל:', err);
    alert('התרחשה שגיאה ביצוא לאקסל. נסה שוב או פנה למנהל מערכת.');
  }
}
