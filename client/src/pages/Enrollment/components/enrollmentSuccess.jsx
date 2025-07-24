import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PrintCertificate from './printCertificate';
import './style/enrollmentSuccess.css';

const EnrollmentSuccess = ({ student, group, onClose }) => {
  const [showPrintCertificate, setShowPrintCertificate] = useState(false);

  const handlePrintCertificate = () => {
    setShowPrintCertificate(true);
  };

  return (
    <>
      <motion.div
        className="enrollment-success-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="success-modal"
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0, y: 50 }}
          transition={{ type: "spring", duration: 0.6 }}
        >
          {/* אנימציית חגיגה */}
          <div className="celebration-animation">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="confetti"
                initial={{ 
                  opacity: 0, 
                  y: 0, 
                  x: 0,
                  rotate: 0,
                  scale: 0 
                }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  y: [-20, -100, -200],
                  x: [(Math.random() - 0.5) * 200],
                  rotate: [0, 360],
                  scale: [0, 1, 0.5]
                }}
                transition={{ 
                  duration: 2,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>

          {/* אייקון הצלחה */}
          <motion.div
            className="success-icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <motion.i
              className="fas fa-check-circle"
              animate={{ rotate: [0, 360] }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
          </motion.div>

          {/* הודעת הצלחה */}
          <motion.div
            className="success-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 style={{direction:'rtl'}}>🎉 רישום הושלם בהצלחה!</h2>
            <div className="success-details">
              <div className="student-info">
                <h3>{student?.name || student?.firstName + ' ' + student?.lastName || 'תלמיד יקר'}</h3>
                <p>נרשם/ה בהצלחה לחוג</p>
              </div>
              
              <motion.div
                className="arrow-animation"
                animate={{ x: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                ←
              </motion.div>
              
              <div className="group-info">
                <h3>{'חוג ' + group?.course + ' קבוצה ' + group?.name || 'פיתוח עצמי'}</h3>
                <div className="group-details">
                  <p><i className="fas fa-calendar"></i> {group?.schedule || `${group?.dayOfWeek} ${group?.hour}` || 'יפורסם בקרוב'}</p>
                  <p><i className="fas fa-map-marker-alt"></i> {group?.location || group?.branchName || 'יפורסם בקרוב'}</p>
                  <p><i className="fas fa-user-tie"></i> {group?.instructor || group?.instructorName || 'יפורסם בקרוב'}</p>
                </div>
              </div>
            </div>

            {/* פרטים נוספים */}
            <motion.div
              className="additional-info"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="info-card">
                <i className="fas fa-envelope"></i>
                <div>
                  <h4>הודעת אישור נשלחת</h4>
                  <p>להדפסה או לייצוא</p>
                </div>
              </div>
              
              <div className="info-card">
                <i className="fas fa-calendar-plus"></i>
                <div>
                  <h4>המפגש הראשון</h4>
                  <p>{group?.nextMeeting || 'יפורסם בקרוב'}</p>
                </div>
              </div>
            </motion.div>

            {/* כפתורי פעולה */}
            <motion.div
              className="action-buttons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <motion.button
                className="btn-primary"
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-home"></i>
                חזרה לעמוד הראשי
              </motion.button>
              
              <motion.button
                className="btn-secondary"
                onClick={handlePrintCertificate}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-print"></i>
                הדפס אישור מעוצב
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* מודל הדפסת האישור */}
      <AnimatePresence>
        {showPrintCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              zIndex: 3000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              overflow: 'auto'
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              style={{
                background: 'white',
                borderRadius: '10px',
                maxWidth: '900px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto'
              }}
            >
              <PrintCertificate
                student={{
                  name: student?.name || student?.firstName + ' ' + student?.lastName || 'תלמיד יקר',
                  id: student?.id || student?.studentId || 'לא צוין'
                }}
                group={{
                  course: group?.course || group?.courseName || 'לא צוין',
                  name: group?.name || group?.groupName || 'פיתוח עצמי',
                  schedule: group?.schedule || `${group?.dayOfWeek || ''} ${group?.hour || ''}`.trim() || 'יפורסם בקרוב',
                  location: group?.location || `${group?.branchName || ''}, ${group?.branchCity || ''}`.replace(', ', '') || 'יפורסם בקרוב',
                  instructor: group?.instructor || group?.instructorName || 'יפורסם בקרוב',
                  nextMeeting: group?.nextMeeting || group?.startDate ? new Date(group.startDate).toLocaleDateString('he-IL') : 'יפורסם בקרוב'
                }}
                onClose={() => setShowPrintCertificate(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EnrollmentSuccess;
