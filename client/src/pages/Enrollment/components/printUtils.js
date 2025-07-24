// פונקציות עזר להדפסה
export const createPrintWindow = (htmlContent, title = 'אישור הצטרפות') => {
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  
  if (!printWindow) {
    alert('אנא אפשר חלונות קופצים כדי להדפיס את האישור');
    return null;
  }
  
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.document.title = title;
  
  return printWindow;
};

export const waitForImagesAndPrint = (printWindow, callback) => {
  const images = printWindow.document.images;
  let loadedImages = 0;
  const totalImages = images.length;
  
  if (totalImages === 0) {
    // אין תמונות, אפשר להדפיס מיד
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      if (callback) callback();
    }, 500);
    return;
  }
  
  // המתן לטעינת כל התמונות
  Array.from(images).forEach(img => {
    if (img.complete) {
      loadedImages++;
    } else {
      img.onload = () => {
        loadedImages++;
        if (loadedImages === totalImages) {
          setTimeout(() => {
            printWindow.focus();
            printWindow.print();
            if (callback) callback();
          }, 500);
        }
      };
    }
  });
  
  // אם כל התמונות כבר נטענו
  if (loadedImages === totalImages) {
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      if (callback) callback();
    }, 500);
  }
};

export const generateCertificateNumber = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  
  return `PD${year}${month}${day}-${random}`;
};

export const formatHebrewDate = (date = new Date()) => {
  const hebrewMonths = [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
  ];
  
  const day = date.getDate();
  const month = hebrewMonths[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} ב${month} ${year}`;
};
