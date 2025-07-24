import React from 'react';
import { createPrintWindow, waitForImagesAndPrint, generateCertificateNumber, formatHebrewDate } from './printUtils';
import './style/printCertificate.css';

const PrintCertificate = ({ student, group, onClose }) => {
  const currentDate = formatHebrewDate();
  const certificateNumber = generateCertificateNumber();

  const generatePrintableHTML = () => {
    return `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>אישור הצטרפות - פיתוח עצמי - ${student?.name || 'תלמיד'}</title>
    <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
        }

        body {
            font-family: 'Heebo', Arial, sans-serif;
            background: white;
            color: #2d3748;
            line-height: 1.4;
            direction: rtl;
            font-size: 14px;
        }

        .certificate-page {
            width: 210mm;
            height: 297mm;
            margin: 0 auto;
            padding: 15mm;
            background: white;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        /* רקע דקורטיבי קל */
        .certificate-page::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
                radial-gradient(circle at 20% 20%, rgba(102, 126, 234, 0.03) 0%, transparent 40%),
                radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.03) 0%, transparent 40%);
            z-index: -1;
        }

        /* מסגרת דקורטיבית */
        .decorative-frame {
            position: absolute;
            top: 8mm;
            left: 8mm;
            right: 8mm;
            bottom: 8mm;
            border: 2px solid;
            border-image: linear-gradient(45deg, #667eea, #764ba2, #667eea) 1;
            border-radius: 10px;
        }

        .certificate-header {
            text-align: center;
            margin-bottom: 20px;
            position: relative;
            z-index: 2;
        }

        .certificate-logo {
            width: 60px;
            height: 60px;
            margin: 0 auto 15px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            color: white;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .certificate-title {
            font-size: 2rem;
            font-weight: 700;
            color: #1a202c;
            margin: 0 0 8px 0;
        }

        .certificate-subtitle {
            font-size: 1rem;
            color: #667eea;
            margin: 0 0 5px 0;
            font-weight: 500;
        }

        .certificate-tagline {
            font-size: 0.8rem;
            color: #718096;
            font-style: italic;
        }

        .certificate-number {
            position: absolute;
            top: 12mm;
            left: 12mm;
            background: rgba(102, 126, 234, 0.1);
            padding: 4px 10px;
            border-radius: 15px;
            font-size: 0.7rem;
            color: #667eea;
            font-weight: 600;
            border: 1px solid rgba(102, 126, 234, 0.3);
        }

        .certificate-body {
            flex: 1;
            display: flex;
            flex-direction: column;
            position: relative;
            z-index: 2;
        }

        .congratulations-section {
            background: linear-gradient(135deg, #f7fafc, #edf2f7);
            border: 2px solid #e2e8f0;
            border-radius: 15px;
            padding: 20px;
            margin: 15px 0;
            text-align: center;
            position: relative;
        }

        .congratulations-section::before {
            content: '🎉';
            position: absolute;
            top: -8px;
            right: 15px;
            font-size: 1.2rem;
            background: white;
            padding: 2px 6px;
            border-radius: 50%;
        }

        .congratulations-text {
            font-size: 1.3rem;
            color: #2d3748;
            margin-bottom: 15px;
            font-weight: 600;
        }

        .student-name {
            font-size: 1.8rem;
            font-weight: 700;
            color: #667eea;
            margin: 15px 0;
            text-decoration: underline;
            text-decoration-color: #764ba2;
            text-decoration-thickness: 2px;
            text-underline-offset: 5px;
        }

        .enrollment-message {
            font-size: 1rem;
            color: #2d3748;
            margin: 15px 0;
            line-height: 1.5;
        }

        .course-details {
            background: white;
            border: 2px solid #e2e8f0;
            border-radius: 15px;
            padding: 20px;
            margin: 15px 0;
            text-align: right;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            position: relative;
            flex: 1;
        }

        .course-details::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #667eea, #764ba2);
            border-radius: 15px 15px 0 0;
        }

        .course-details h3 {
            color: #667eea;
            font-size: 1.2rem;
            margin-bottom: 15px;
            text-align: center;
            font-weight: 600;
        }

        .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 15px;
        }

        .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px dotted #cbd5e0;
            font-size: 0.9rem;
        }

        .detail-row:last-child {
            border-bottom: none;
        }

        .detail-label {
            font-weight: 600;
            color: #4a5568;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .detail-value {
            color: #2d3748;
            font-weight: 500;
        }

        .motivational-section {
            background: linear-gradient(135deg, #fff5f5, #fed7d7);
            border: 2px solid #feb2b2;
            border-radius: 15px;
            padding: 15px;
            margin: 15px 0;
            text-align: center;
            position: relative;
        }

        .motivational-section::before {
            content: '✨';
            position: absolute;
            top: -8px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 1.2rem;
            background: white;
            padding: 2px 6px;
            border-radius: 50%;
        }

        .motivational-text {
            font-size: 0.9rem;
            color: #2d3748;
            line-height: 1.5;
            margin: 10px 0;
        }

        .quote {
            font-size: 0.9rem;
            font-style: italic;
            color: #667eea;
            font-weight: 500;
            margin-top: 10px;
        }

        .certificate-footer {
            margin-top: auto;
            text-align: center;
            border-top: 2px solid #e2e8f0;
            padding-top: 15px;
            position: relative;
            z-index: 2;
        }

        .signature-section {
            display: flex;
            justify-content: space-between;
            margin: 20px 0;
        }

        .signature-box {
            text-align: center;
            width: 150px;
        }

        .signature-line {
            border-bottom: 2px solid #2d3748;
            margin-bottom: 8px;
            height: 30px;
            position: relative;
        }

        .signature-line::after {
            content: '✓';
            position: absolute;
            right: 5px;
            bottom: 2px;
            color: #48bb78;
            font-weight: bold;
            font-size: 1rem;
        }

        .signature-label {
            font-size: 0.8rem;
            color: #4a5568;
            font-weight: 500;
        }

        .contact-info {
            background: #f8fafc;
            border-radius: 10px;
            padding: 12px;
            margin: 15px 0;
            font-size: 0.7rem;
            color: #4a5568;
            border: 1px solid #e2e8f0;
            line-height: 1.3;
        }

        .contact-info strong {
            color: #2d3748;
            font-size: 0.8rem;
        }

        .date-issued {
            font-size: 0.8rem;
            color: #718096;
            margin-top: 10px;
            font-weight: 500;
        }

        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 4rem;
            color: rgba(102, 126, 234, 0.02);
            font-weight: bold;
            z-index: 1;
            pointer-events: none;
        }

        /* הדפסה */
        @media print {
            body { 
                margin: 0; 
                -webkit-print-color-adjust: exact;
            }
            .certificate-page { 
                margin: 0; 
                box-shadow: none; 
                page-break-inside: avoid;
                height: 297mm;
                overflow: hidden;
            }
            
            @page {
                size: A4;
                margin: 0;
            }
        }
    </style>
</head>
<body>
    <div class="certificate-page">
        <div class="decorative-frame"></div>
        <div class="watermark">פיתוח עצמי</div>
        <div class="certificate-number">מספר: ${certificateNumber}</div>
        
        <!-- כותרת -->
        <div class="certificate-header">
            <div class="certificate-logo">🎓</div>
            <h1 class="certificate-title">פיתוח עצמי</h1>
            <p class="certificate-subtitle">מרכז לחינוך והעשרה</p>
            <p class="certificate-tagline">"מחויבים להצלחתך ולגדילתך האישית"</p>
        </div>

        <!-- גוף האישור -->
        <div class="certificate-body">
            <div class="congratulations-section">
                <h2 class="congratulations-text">ברכותינו החמות!</h2>
                <div class="student-name">${student?.name || 'תלמיד יקר'}</div>
                <p class="enrollment-message">
                    אנו שמחים להודיע כי נרשמת בהצלחה לחוגי <strong>"פיתוח עצמי"</strong>
                    ומזמינים אותך להצטרף למסע מרתק של גדילה אישית!
                </p>
            </div>
<br/>
            <!-- פרטי החוג -->
            <div class="course-details">
                <h3>📋 פרטי החוג והרישום</h3>
                
                <div class="details-grid">
                    <div class="detail-row">
                        <span class="detail-label">🎯 שם הקבוצה:</span>
                        <span class="detail-value">${'חוג '+group?.course+' קבוצה '+  group?.name|| 'פיתוח עצמי'}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">📅 יום ושעה:</span>
                        <span class="detail-value">${group?.schedule || 'יפורסם בקרוב'}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">📍 מיקום:</span>
                        <span class="detail-value">${group?.location || 'יפורסם בקרוב'}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">👨‍🏫 מדריך:</span>
                        <span class="detail-value">${group?.instructor || 'יפורסם בקרוב'}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">🚀 מפגש ראשון:</span>
                        <span class="detail-value">${group?.startDate || 'יפורסם בקרוב'}</span>
                    
                    
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">📧 תאריך רישום:</span>
                    <span class="detail-value">${currentDate}</span>
                </div>
            </div>
<br /><br />
            <!-- הודעה מעודדת -->
            <div class="motivational-section">
                <p class="motivational-text">
                    <strong>מה מחכה לך:</strong>
                    🌟 כלים מעשיים לפיתוח אישי • 🤝  חיזוק ביטחון עצמי • 🎯 הגשמת מטרות
                </p>
                <p class="quote">"כל מסע של אלף מיילים מתחיל בצעד אחד"</p>
            </div>
        </div>

            <!-- מידע ליצירת קשר -->
            <div class="contact-info">
                <strong>📞 ליצירת קשר:</strong>
                טלפון:  08-6323232 |  דוא"ל: easyOffice100@gmail.com  |  עיר: ערד
                <br />
            </div>
            
            <div class="date-issued">
                📅 אישור זה הונפק בתאריך: <strong>${currentDate}</strong> | 
                🏛️ מרכז "פיתוח עצמי" | 
                מספר: ${certificateNumber}
            </div>
        </div>
    </div>
</body>
</html>`;
  };

  const handlePrint = () => {
    const htmlContent = generatePrintableHTML();
    const printWindow = createPrintWindow(htmlContent, `אישור הצטרפות - ${student?.name || 'תלמיד'}`);
    
    if (printWindow) {
      waitForImagesAndPrint(printWindow, () => {
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      });
    }
  };

  const handleDownloadPDF = () => {
    const htmlContent = generatePrintableHTML();
    const printWindow = createPrintWindow(htmlContent, `אישור הצטרפות - ${student?.name || 'תלמיד'}`);
    
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
        }, 500);
      };
    }
  };

  const handleEmailCertificate = () => {
    const subject = encodeURIComponent(`אישור הצטרפות לחוג פיתוח עצמי - ${student?.name || 'תלמיד'}`);
    const body = encodeURIComponent(`
שלום ${student?.name || 'תלמיד יקר'},

מצורף אישור ההצטרפות שלך לחוג פיתוח עצמי.

פרטי החוג:
- שם החוג: ${'חוג '+group?.course +' קבוצה '+group?.name || 'פיתוח עצמי'}
- יום ושעה: ${group?.schedule || 'יפורסם בקרוב'}
- מיקום: ${group?.location || 'יפורסם בקרוב'}
- מדריך: ${group?.instructor || 'יפורסם בקרוב'}

מספר אישור: ${certificateNumber}
תאריך רישום: ${currentDate}

נתראה בחוג!
צוות פיתוח עצמי
    `);
    
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="print-certificate">
      {/* תצוגה מקדימה מקוצרת */}
      <div className="preview-container">
        <div style={{ 
          maxWidth: '600px', 
          margin: '0 auto', 
          padding: '15px',
          background: 'white',
          borderRadius: '10px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          direction: 'rtl'
        }}>
          {/* כותרת מקוצרת */}
          <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid #667eea', paddingBottom: '15px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              margin: '0 auto 15px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              color: 'white'
            }}>
              🎓
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1a202c', margin: '0 0 8px 0' }}>
              פיתוח עצמי
            </h1>
            <p style={{ fontSize: '1rem', color: '#667eea', margin: '0' }}>
              מרכז לחינוך והעשרה
            </p>
            <div style={{ 
              display: 'inline-block', 
              background: 'rgba(102, 126, 234, 0.1)', 
              padding: '4px 12px', 
              borderRadius: '12px', 
              fontSize: '0.8rem', 
              color: '#667eea', 
              marginTop: '8px',
              border: '1px solid rgba(102, 126, 234, 0.3)'
            }}>
              מספר אישור: {certificateNumber}
            </div>
          </div>

          {/* תוכן מקוצר */}
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <div style={{
              background: 'linear-gradient(135deg, #f7fafc, #edf2f7)',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              padding: '20px',
              margin: '15px 0'
            }}>
              <h2 style={{ fontSize: '1.4rem', color: '#2d3748', marginBottom: '15px', fontWeight: '600' }}>
                🎉 ברכותינו החמות! 🎉
              </h2>
              
              <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#667eea', margin: '15px 0' }}>
                {student?.name || 'תלמיד יקר'}
              </div>
              
              <p style={{ fontSize: '1rem', color: '#2d3748', margin: '15px 0', lineHeight: '1.5' }}>
                נרשמת בהצלחה לחוגי <strong>"פיתוח עצמי"</strong>
                <br />
                ומזמינים אותך למסע של גדילה אישית!
              </p>
            </div>

            <div style={{
              background: 'white',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              padding: '15px',
              margin: '15px 0',
              textAlign: 'right'
            }}>
              <h3 style={{ color: '#667eea', fontSize: '1.1rem', marginBottom: '12px', textAlign: 'center' }}>
                📋 פרטי החוג
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px dotted #cbd5e0' }}>
                  <span style={{ fontWeight: 'bold', color: '#4a5568' }}>🎯 חוג:</span>
                  <span style={{ color: '#2d3748' }}>{'חוג ' + group?.course + ' קבוצה ' + group?.name || 'פיתוח עצמי'}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px dotted #cbd5e0' }}>
                  <span style={{ fontWeight: 'bold', color: '#4a5568' }}>📅 זמן:</span>
                  <span style={{ color: '#2d3748' }}>{group?.schedule || 'יפורסם'}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px dotted #cbd5e0' }}>
                  <span style={{ fontWeight: 'bold', color: '#4a5568' }}>📍 מקום:</span>
                  <span style={{ color: '#2d3748' }}>{group?.location || 'יפורסם'}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px dotted #cbd5e0' }}>
                  <span style={{ fontWeight: 'bold', color: '#4a5568' }}>📧 רישום:</span>
                  <span style={{ color: '#2d3748' }}>{currentDate}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="preview-note">
            <strong>💡 תצוגה מקדימה:</strong> האישור המודפס יכלול את כל הפרטים בעמוד A4 אחד
          </div>
        </div>
      </div>

      {/* כפתורי פעולה */}
      <div className="action-buttons-container">
        <div style={{ 
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={handlePrint}
            className="primary-button"
            style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              padding: '12px 25px',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            🖨️ הדפס אישור
          </button>
          
          <button
            onClick={handleDownloadPDF}
            className="success-button"
            style={{
              background: 'linear-gradient(135deg, #10B981, #059669)',
              color: 'white',
              border: 'none',
              padding: '12px 25px',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            📄 שמור כ-PDF
          </button>
          
          <button
            onClick={handleEmailCertificate}
            style={{
              background: 'linear-gradient(135deg, #3B82F6, #1E40AF)',
              color: 'white',
              border: 'none',
              padding: '12px 25px',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            📧 שלח במייל
          </button>
          
          <button
            onClick={onClose}
            className="secondary-button"
            style={{
              background: '#e2e8f0',
              color: '#4a5568',
              border: 'none',
              padding: '12px 25px',
              borderRadius: '10px',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            ✕ סגור
          </button>
        </div>
        
        <div style={{ 
          textAlign: 'center', 
          marginTop: '15px', 
          padding: '12px',
          background: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <p style={{ color: '#4a5568', fontSize: '0.85rem', margin: '0' }}>
            <strong>✅ מותאם לדף A4:</strong> האישור מותאם במיוחד להדפסה בדף אחד עם איכות גבוהה
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrintCertificate;
