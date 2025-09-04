import * as XLSX from 'xlsx';
import { getGroupWithStudentsById } from '../../../store/group/groupGetGroupWithStudentsByIdThunk';


export async function exportGroupStudentsToExcel(groupId, groupName, dispatch) {
  try {

    // קריאה ל-API לקבלת קבוצה עם תלמידים
    const result = await dispatch(getGroupWithStudentsById(groupId));
    const groupData = result.payload || {};
    const students = groupData.students || [];

    // הגדרת עמודות - שדות בלבד כפי שביקשת, מותאמים למבנה החדש
    const data = students.map(student => ({
      'טלפון': student.phone || '',
      'שם פרטי': student.studentName?.split(' ')[0] || '',
      'שם משפחה': student.studentName?.split(' ').slice(1).join(' ') || '',
      'כתובת': '', 
      'עיר': student.city || '',
      'מזהה': student.studentId || '',
      'מידע נוסף': groupData.instructorName || ''
    }));

    // יצירת worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'תלמידים');

    // הורדת הקובץ
    XLSX.writeFile(workbook, `students_${groupName || groupId}.xlsx`);
  } catch (error) {
    alert('שגיאה בייצוא לאקסל: ' + (error?.message || error));
  }
}
