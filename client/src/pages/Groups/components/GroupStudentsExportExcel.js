import * as XLSX from 'xlsx';
import { getGroupWithStudentsById } from '../../../store/group/groupGetGroupWithStudentsByIdThunk';


export async function exportGroupStudentsToExcel(groupId, groupName, dispatch) {
  try {

    // קריאה ל-API לקבלת קבוצה עם תלמידים
    const result = await dispatch(getGroupWithStudentsById(groupId));
    const groupData = result.payload || {};
    const students = groupData.students || [];

    // הגדרת עמודות - שדות בלבד כפי שביקשת, מותאמים למבנה החדש
    const groupStatus = groupData.isActive !== undefined ? (groupData.isActive ? '✅ פעיל' : '⏸️ לא פעיל') : '✅ פעיל';
    const data = students.map(student => ({
      'שם קבוצה': groupData.groupName || '',
      'סטטוס הקבוצה': groupStatus,
      'טלפון': student.phone || '',
      'שם פרטי': student.studentName?.split(' ')[0] || '',
      'שם משפחה': student.studentName?.split(' ').slice(1).join(' ') || '',
       'עיר': student.city || '',
      'קופת חולים': student.healthFound || '',
      'מזהה': student.studentId || '',
      'מדריך': groupData.instructorName || ''
    }));

    // יצירת worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    worksheet['!cols'] = [
      { wch: 25 }, // שם קבוצה
      { wch: 15 }, // סטטוס
      { wch: 12 }, // טלפון
      { wch: 15 }, // שם פרטי
      { wch: 15 }, // שם משפחה
      { wch: 12 }, // עיר
      { wch: 15 }, // קופת חולים
      { wch: 12 }, // מזהה
      { wch: 20 }  // מדריך
    ];
    worksheet['!rtl'] = true;
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'תלמידים');

    // הורדת הקובץ
    XLSX.writeFile(workbook, `students_${groupName || groupId}.xlsx`);
  } catch (error) {
    alert('שגיאה בייצוא לאקסל: ' + (error?.message || error));
  }
}
