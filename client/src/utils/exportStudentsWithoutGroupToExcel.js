import * as XLSX from 'xlsx';

function extractNoteText(note) {
  if (typeof note === 'string') return note.trim();
  if (!note || typeof note !== 'object') return '';

  // Support multiple server/client naming styles.
  return String(
    note.noteContent ??
    note.noteText ??
    note.NoteContent ??
    note.content ??
    note.text ??
    ''
  ).trim();
}

/**
 * ייצוא תלמידים ללא קבוצה עם הערות לאקסל
 * @param {Array} students - מערך התלמידים
 */
export function exportStudentsWithoutGroupToExcel(students) {
  try {
    if (!Array.isArray(students) || students.length === 0) {
      alert('אין תלמידים לייצוא');
      return;
    }

    const rows = students.flatMap(student => {
      const notesArray = Array.isArray(student.notes) ? student.notes : [];
      const noteLines = notesArray
        .map(extractNoteText)
        .filter(Boolean);

      const baseStudentRow = {
        'קוד תלמיד': student.id,
        'מספר זיהוי': student.identityCard || '',
        'שם פרטי': student.firstName,
        'שם משפחה': student.lastName,
        'טלפון': student.phone || '',
        'טלפון נוסף': student.secondaryPhone || '',
        'מייל': student.email || '',
        'גיל': student.age,
        'עיר': student.city || '',
        'בית ספר': student.school || '',
        'כיתה': student.class || '',
        'מגזר': student.sector || '',
        'קופת חולים': student.healthFundName || '',
        'תוכנית קופה': student.healthFundPlan || '',
        'סטטוס': student.status || '',
      };

      if (noteLines.length === 0) {
        return [{
          ...baseStudentRow,
          'מספר הערה': '',
          'הערות': 'אין הערות'
        }];
      }

      return noteLines.map((noteText, idx) => ({
        ...baseStudentRow,
        'מספר הערה': idx + 1,
        'הערות': noteText
      }));
    });

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows, {
      header: [
        'קוד תלמיד', 'מספר זיהוי', 'שם פרטי', 'שם משפחה', 'טלפון', 'טלפון נוסף',
        'מייל', 'גיל', 'עיר', 'בית ספר', 'כיתה', 'מגזר', 'קופת חולים', 'תוכנית קופה',
        'סטטוס', 'מספר הערה', 'הערות'
      ]
    });

    // הגדרת רוחב עמודות
    worksheet['!cols'] = [
      { wch: 12 }, // קוד תלמיד
      { wch: 15 }, // מספר זיהוי
      { wch: 15 }, // שם פרטי
      { wch: 15 }, // שם משפחה
      { wch: 15 }, // טלפון
      { wch: 15 }, // טלפון נוסף
      { wch: 20 }, // מייל
      { wch: 8 },  // גיל
      { wch: 15 }, // עיר
      { wch: 15 }, // בית ספר
      { wch: 10 }, // כיתה
      { wch: 10 }, // מגזר
      { wch: 18 }, // קופת חולים
      { wch: 15 }, // תוכנית קופה
      { wch: 10 }, // סטטוס
      { wch: 10 }, // מספר הערה
      { wch: 45 }  // הערות
    ];

    worksheet['!rtl'] = true;

    // שם הגליון חייב להיות עד 31 תווים וללא תווים מיוחדים
    XLSX.utils.book_append_sheet(workbook, worksheet, 'תלמידים ללא קבוצה');
    XLSX.writeFile(workbook, `תלמידים_ללא_קבוצה_${new Date().toLocaleDateString('he-IL')}.xlsx`);

    console.log('✅ ייצוא לאקסל הצליח');
  } catch (err) {
    console.error('❌ שגיאה ביצוא לאקסל:', err);
    alert('התרחשה שגיאה ביצוא הקובץ לאקסל');
  }
}
