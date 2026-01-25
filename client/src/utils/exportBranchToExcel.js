import * as XLSX from 'xlsx';

/**
 * יוצא נתוני קבוצות ותלמידים של סניף לקובץ אקסל
 * @param {Array} groupsData - מערך הקבוצות עם התלמידים 
 * @param {string} branchName - שם הסניף
 */
export const exportBranchToExcel = (groupsData, branchName = 'סניף') => {
  try {
    if (!groupsData || groupsData.length === 0) {
      alert('אין נתונים לייצוא');
      return;
    }

    // הכנת הנתונים לאקסל
    const excelData = [];
    
    // הוספת כותרת עמודות
    const headers = [
      'מזהה קבוצה',
      'שם קבוצה', 
      'שם חוג',
      'שם סניף',
      'מערכת שעות',
      'גיל',
      'מקומות פנויים ',
      'מגזר',
      'תאריך התחלה',
      'מספר שיעורים',
      'שיעורים שהתקיימו',
      'שם מדריך',
      'סטטוס הקבוצה',
      'מזהה תלמיד',
      'שם תלמיד',
      'טלפון',
      'עיר',
      'קופת חולים'
    ];
    
    excelData.push(headers);
    
    // עיבוד הנתונים
    groupsData.forEach(group => {
      if (group.students && group.students.length > 0) {
        // הוספת שורה לכל תלמיד בקבוצה
        group.students.forEach(student => {
          const row = [
            group.groupId || '',
            group.groupName || '',
            group.courseName || '',
            group.branchName || '',
            group.schedule || '',
            group.ageRange || '',
            group.maxStudents || 0,
            group.sector || '',
            group.startDate ? new Date(group.startDate).toLocaleDateString('he-IL') : '',
            group.numOfLessons || 0,
            group.lessonsCompleted || 0,
            group.instructorName || '',
            group.isActive !== undefined ? (group.isActive ? '✅ פעיל' : '⏸️ לא פעיל') : '✅ פעיל',
            student.studentId || '',
            student.studentName || '',
            student.phone || '',
            student.city || '',
            student.healthFound || ''
          ];
          excelData.push(row);
        });
      } else {
        // קבוצה ללא תלמידים - הוספת שורה עם פרטי הקבוצה בלבד
        const row = [
          group.groupId || '',
          group.groupName || '',
          group.courseName || '',
          group.branchName || '',
          group.schedule || '',
          group.ageRange || '',
          group.maxStudents || 0,
          group.sector || '',
          group.startDate ? new Date(group.startDate).toLocaleDateString('he-IL') : '',
          group.numOfLessons || 0,
          group.lessonsCompleted || 0,
          group.instructorName || '',
          group.isActive !== undefined ? (group.isActive ? '✅ פעיל' : '⏸️ לא פעיל') : '✅ פעיל',
          '', // מזהה תלמיד ריק
          '', // שם תלמיד ריק
          '', // טלפון ריק
          '', // עיר ריקה
          ''  // קופת חולים ריקה
        ];
        excelData.push(row);
      }
    });

    // יצירת Workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(excelData);

    // הגדרת עמודות RTL
    ws['!dir'] = 'rtl';
    
    // הגדרת רוחב עמודות
    const columnWidths = [
      { wch: 15 }, // מזהה קבוצה
      { wch: 40 }, // שם קבוצה
      { wch: 20 }, // שם חוג
      { wch: 20 }, // שם סניף
      { wch: 15 }, // מערכת שעות
      { wch: 10 }, // גיל
      { wch: 15 }, // מקסימום תלמידים
      { wch: 15 }, // סקטור
      { wch: 15 }, // תאריך התחלה
      { wch: 15 }, // מספר שיעורים
      { wch: 15 }, // שיעורים שהתקיימו
      { wch: 20 }, // שם מדריך
      { wch: 15 }, // סטטוס
      { wch: 15 }, // מזהה תלמיד
      { wch: 25 }, // שם תלמיד
      { wch: 15 }, // טלפון
      { wch: 15 }, // עיר
      { wch: 15 }  // קופת חולים
    ];
    
    ws['!cols'] = columnWidths;

    // עיצוב כותרות
    const headerStyle = {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '4472C4' } },
      alignment: { horizontal: 'center', vertical: 'center' }
    };

    // החלת עיצוב על כותרות (שורה ראשונה)
    for (let col = 0; col < headers.length; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!ws[cellAddress]) ws[cellAddress] = {};
      ws[cellAddress].s = headerStyle;
    }

    // הוספת הגיליון לחוברת
    const sheetName = `${branchName} - קבוצות ותלמידים`;
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // יצירת שם קובץ עם תאריך נוכחי
    const currentDate = new Date().toLocaleDateString('he-IL').replace(/\./g, '-');
    const fileName = `${branchName}_קבוצות_ותלמידים_${currentDate}.xlsx`;

    // הורדת הקובץ
    XLSX.writeFile(wb, fileName);
    
    console.log('✅ קובץ האקסל נוצר בהצלחה:', fileName);
    
    // החזרת סטטיסטיקות
    const totalGroups = groupsData.length;
    const totalStudents = groupsData.reduce((sum, group) => 
      sum + (group.students ? group.students.length : 0), 0
    );
    
    return {
      success: true,
      fileName,
      totalGroups,
      totalStudents,
      message: `יוצא בהצלחה: ${totalGroups} קבוצות ו-${totalStudents} תלמידים`
    };

  } catch (error) {
    console.error('❌ שגיאה בייצוא לאקסל:', error);
    alert('שגיאה בייצוא הקובץ: ' + error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * פונקציה לוואליצית נתוני הקבוצות לפני הייצוא
 * @param {Array} groupsData - נתוני הקבוצות
 * @returns {boolean} - האם הנתונים תקינים
 */
export const validateGroupsDataForExport = (groupsData) => {
  if (!Array.isArray(groupsData)) {
    console.error('❌ נתונים לא תקינים - לא מערך');
    return false;
  }
  
  if (groupsData.length === 0) {
    console.warn('⚠️ אין קבוצות לייצוא');
    return false;
  }
  
  // בדיקה שיש לפחות קבוצה אחת עם נתונים בסיסיים
  const validGroups = groupsData.filter(group => 
    group.groupId && group.groupName
  );
  
  if (validGroups.length === 0) {
    console.error('❌ אין קבוצות תקינות עם נתונים בסיסיים');
    return false;
  }
  
  console.log('✅ נתוני הקבוצות תקינים לייצוא:', validGroups.length, 'קבוצות');
  return true;
};