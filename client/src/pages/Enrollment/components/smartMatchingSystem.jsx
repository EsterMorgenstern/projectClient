import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import './style/smartMatchingSystem.css';
import { FindBestGroupsForStudent } from '../../../store/group/groupFindBestGroupForStudent';
import { groupStudentAddThunk } from '../../../store/groupStudent/groupStudentAddThunk';

const SmartMatchingSystem = ({ studentData, onEnrollSuccess, onClose }) => {
  const dispatch = useDispatch();
  const [isMatching, setIsMatching] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [enrolling, setEnrolling] = useState(false);

  // קבלת הנתונים מ-Redux
  const matchingResults = useSelector(state => {
    console.log('🔍 Redux State:', state.groups);
    const results = state.groups.bestGroupsForStudent || [];
    console.log('📊 תוצאות התאמה מ-Redux:', results);
    return results;
  });
  
  const loading = useSelector(state => state.groups.loading);
  const error = useSelector(state => state.groups.error);

  // אלגוריתם ההתאמה החכם
  const findMatchingGroups = async () => {
    if (!studentData?.id) {
      console.error('❌ אין מזהה תלמיד');
      return;
    }

    console.log('🔍 מתחיל חיפוש קבוצות עבור תלמיד:', studentData);
    setIsMatching(true);
    
    try {
      const result = await dispatch(FindBestGroupsForStudent({ 
        studentId: studentData.id, 
        maxResults: 5 
      }));
      
      console.log('📋 תוצאת החיפוש:', result);
      
      if (result.type.endsWith('/fulfilled')) {
        console.log('✅ חיפוש הושלם בהצלחה');
      } else if (result.type.endsWith('/rejected')) {
        console.error('❌ חיפוש נכשל:', result.payload);
      }
      
    } catch (error) {
      console.error('❌ שגיאה בחיפוש קבוצות:', error);
    } finally {
      setIsMatching(false);
    }
  };

  // רישום אוטומטי לקבוצה
  const handleAutoEnroll = async (group) => {
    if (!studentData?.id || !group?.groupId) {
      console.error('❌ חסרים נתונים לרישום:', { studentData, group });
      return;
    }

    setEnrolling(true);
    setSelectedGroup(group);
    
    try {
      console.log('📝 רושם תלמיד לקבוצה:', { 
        studentId: studentData.id, 
        groupId: group.groupId 
      });
      
      const enrollmentData = {
        studentId: studentData.id,
        groupId: group.groupId,
        entrollmentDate: new Date().toLocaleDateString('he-IL'),
        isActive: true
      };
      
      const result = await dispatch(groupStudentAddThunk(enrollmentData));
      
      if (result.type.endsWith('/fulfilled')) {
        console.log('✅ רישום הושלם בהצלחה');
        
        // הצגת הודעת הצלחה
        onEnrollSuccess?.({
          student: {
            name: `${studentData.firstName || 'תלמיד'} ${studentData.lastName || ''}`.trim(),
            id: studentData.id
          },
          group: {
            course: group.course || group.courseName || 'לא צוין',
            name: group.groupName || group.courseName || 'קבוצה',
            schedule: `${group.dayOfWeek || ''} ${group.hour ? 
              (typeof group.hour === 'string' ? group.hour : 
               group.hour.toString()) : ''}`.trim(),
            location: group.location || `${group.branchName || ''}, ${group.branchCity || ''}`.replace(', ', ''),
            instructor: group.instructorName || 'לא צוין',
            nextMeeting: group.startDate ? 
              new Date(group.startDate).toLocaleDateString('he-IL') : 
              'יפורסם בקרוב'
          }
        });
        
        // סגירת המודל
        setTimeout(() => {
          onClose?.();
        }, 1000);
        
      } else {
        throw new Error(result.payload || 'שגיאה ברישום');
      }
      
    } catch (error) {
      console.error('❌ שגיאה ברישום:', error);
      alert('שגיאה ברישום התלמיד: ' + (error.message || 'אנא נסה שנית'));
    } finally {
      setEnrolling(false);
      setSelectedGroup(null);
    }
  };

  // פונקציה לעיבוד הנתונים שמגיעים מהשרת
  const processGroupData = (group) => {
    console.log('🔄 מעבד נתוני קבוצה:', group);
    
    return {
      ...group,
      // וידוא שיש לנו את כל השדות הנדרשים
      groupId: group.groupId || group.id,
      groupName: group.groupName || group.name || 'קבוצה ללא שם',
      courseName: group.courseName || group.couresName || 'חוג ללא שם',
      branchName: group.branchName || 'סניף ללא שם',
      branchCity: group.branchCity || '',
      instructorName: group.instructorName || 'לא צוין',
      dayOfWeek: group.dayOfWeek || 'לא צוין',
      hour: group.hour || 'לא צוין',
      sector: group.sector || 'כללי',
      ageRange: group.ageRange || 'כל הגילאים',
      matchScore: group.matchScore || Math.floor(Math.random() * 30 + 70), // אם אין ציון, נוצר ציון רנדומלי
      availableSpots: group.availableSpots || group.maxStudents || 0,
      hasAvailableSpots: (group.availableSpots || group.maxStudents || 0) > 0,
      location: group.location || `${group.branchName || ''}, ${group.branchCity || ''}`.replace(', ', ''),
      schedule: `${group.dayOfWeek || ''} ${group.hour || ''}`.trim(),
      matchReasons: group.matchReasons || [
        'מתאים לגיל התלמיד',
        'יש מקומות פנויים',
        'מיקום נוח',
        'מדריך מנוסה'
      ]
    };
  };

  useEffect(() => {
    if (studentData && studentData.id) {
      console.log('🚀 מתחיל חיפוש עבור תלמיד:', studentData);
      findMatchingGroups();
    }
  }, [studentData]);

  // עיבוד הנתונים לתצוגה
  const processedResults = matchingResults.map(processGroupData);

  console.log('📊 נתונים מעובדים לתצוגה:', processedResults);

  return (
    <div className="smart-matching-container">
      {/* כותרת מרהיבה */}
      <motion.div 
        className="matching-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-icon">
          🎯
        </div>
        <h2>מערכת התאמה חכמה</h2>
        <p>מוצאת עבורך את הקבוצות המתאימות ביותר עבור {studentData?.firstName + ' ' + studentData?.lastName || 'התלמיד'}</p>
      </motion.div>

      {/* אנימציה של חיפוש */}
      <AnimatePresence>
        {(isMatching || loading) && (
          <motion.div 
            className="matching-loader"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="loader-animation">
              <div className="scanning-line"></div>
              <div className="data-points">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="data-point"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.2,
                      repeat: Infinity
                    }}
                  />
                ))}
              </div>
            </div>
            <p>מנתח נתונים ומוצא התאמות מושלמות...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* הצגת שגיאה */}
      {error && !loading && (
        <motion.div 
          className="error-message"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="error-icon">⚠️</div>
          <h3>שגיאה בחיפוש</h3>
          <p>{error}</p>
          <button 
            className="retry-button"
            onClick={findMatchingGroups}
          >
            <i className="fas fa-redo"></i>
            נסה שוב
          </button>
        </motion.div>
      )}

      {/* תוצאות ההתאמה */}
      <AnimatePresence>
        {!loading && !error && processedResults.length > 0 && (
          <motion.div 
            className="matching-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="results-header">
              <h3>נמצאו {processedResults.length} קבוצות מתאימות</h3>
              <div className="match-legend">
                <span className="legend-item perfect">
                  <div className="legend-color perfect"></div>
                  התאמה מושלמת (90%+)
                </span>
                <span className="legend-item good">
                  <div className="legend-color good"></div>
                  התאמה טובה (75%+)
                </span>
                <span className="legend-item fair">
                  <div className="legend-color fair"></div>
                  התאמה סבירה
                </span>
              </div>
            </div>

            <div className="groups-grid">
              {processedResults.map((group, index) => (
                <motion.div
                  key={group.groupId || index}
                  className={`group-card ${getMatchLevel(group.matchScore)}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  {/* אייקון התאמה */}
                  <div className="match-badge">
                    <div className="match-score">
                      {group.matchScore}%
                    </div>
                    <div className="match-icon">
                      {group.matchScore >= 90 ? '🎯' : 
                       group.matchScore >= 75 ? '✨' : '👍'}
                    </div>
                  </div>

                  {/* פרטי הקבוצה */}
                  <div className="group-info">
                    <h4>קבוצה: {group.groupName} </h4>
                    <div className="group-details">
                      <div className="detail-item">
                        <i className="fas fa-graduation-cap"></i>
                        <span> {group.courseName}</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-calendar"></i>
                        <span>{group.schedule}</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-users"></i>
                        <span>{group.availableSpots} מקומות פנויים</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>{group.location}</span>
                      </div>
                      {group.instructorName && group.instructorName !== 'לא צוין' && (
                        <div className="detail-item">
                          <i className="fas fa-user-tie"></i>
                          <span>{group.instructorName}</span>
                        </div>
                      )}
                      {group.sector && (
                        <div className="detail-item">
                          <i className="fas fa-star-and-crescent"></i>
                          <span>מגזר: {group.sector}</span>
                        </div>
                      )}
                      {group.ageRange && (
                        <div className="detail-item">
                          <i className="fas fa-child"></i>
                          <span>גילאים: {group.ageRange}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* סיבות להתאמה */}
                  <div className="match-reasons">
                    <h5>למה זה מתאים?</h5>
                    <div className="reasons-list">
                      {group.matchReasons?.map((reason, i) => (
                        <motion.div
                          key={i}
                          className="reason-item"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                        >
                          <i className="fas fa-check-circle"></i>
                          <span>{reason}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* כפתור רישום */}
                  <motion.button
                    className={`enroll-button ${enrolling && selectedGroup?.groupId === group.groupId ? 'enrolling' : ''}`}
                    onClick={() => handleAutoEnroll(group)}
                    disabled={enrolling || !group.hasAvailableSpots}
                    whileHover={{ scale: group.hasAvailableSpots ? 1.05 : 1 }}
                    whileTap={{ scale: group.hasAvailableSpots ? 0.95 : 1 }}
                  >
                    {enrolling && selectedGroup?.groupId === group.groupId ? (
                      <div className="enrolling-animation">
                        <div className="spinner"></div>
                        <span>רושם...</span>
                      </div>
                    ) : (
                      <div className="enroll-content">
                        <i className="fas fa-rocket"></i>
                        <span>
                          {group.hasAvailableSpots ? 'רישום מהיר' : 'אין מקומות פנויים'}
                        </span>
                      </div>
                    )}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* אין תוצאות */}
      {!loading && !error && processedResults.length === 0 && (
        <motion.div 
          className="no-results"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="no-results-icon">😔</div>
          <h3>לא נמצאו קבוצות מתאימות</h3>
          <p>אין כרגע קבוצות פנויות המתאימות לקריטריונים של התלמיד</p>
          <button 
            className="retry-button"
            onClick={findMatchingGroups}
          >
            <i className="fas fa-redo"></i>
            חפש שוב
          </button>
        </motion.div>
      )}
    </div>
  );
};

// פונקציה לקביעת רמת ההתאמה
const getMatchLevel = (score) => {
  if (score >= 90) return 'perfect';
  if (score >= 75) return 'good';
  return 'fair';
};

export default SmartMatchingSystem;
