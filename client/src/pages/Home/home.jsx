
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Container,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  IconButton,
  Chip,
  alpha,
  Avatar,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation, useInView } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";

// Icons
import AssessmentIcon from "@mui/icons-material/Assessment";
import SchoolIcon from "@mui/icons-material/School";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StarIcon from "@mui/icons-material/Star";
import VerifiedIcon from "@mui/icons-material/Verified";
import SpeedIcon from "@mui/icons-material/Speed";
import SecurityIcon from "@mui/icons-material/Security";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import NoteIcon from "@mui/icons-material/Note";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { fetchInstructors } from "../../store/instructor/instructorGetAllThunk";
import { fetchStudents } from "../../store/student/studentGetAllThunk";
import { fetchCourses } from "../../store/course/CoursesGetAllThunk";

// Animated components with framer-motion
const MotionBox = ({ children, ...props }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, threshold: 0.2 });
  const dispatch = useDispatch();


  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

   useEffect(() => {
    // טעינת נתונים בסיסיים
    dispatch(fetchStudents());
    dispatch(fetchCourses());
    dispatch(fetchInstructors());
   },[dispatch]);
  return (
    <Box
      ref={ref}
      component={motion.div}
      initial="hidden"
      animate={controls}
      {...props}
    >
      {children}
    </Box>
  );
};

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
             background: 'linear-gradient(135deg,rgb(230, 104, 236) 0%,rgb(29, 148, 199) 100%)',
  color: "white",
  padding: theme.spacing(12, 0, 14),
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
  borderRadius: "0 0 50% 50% / 40px",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(8, 0, 10),
    borderRadius: "0 0 50% 50% / 20px",
  },
}));

const StatsCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4, 3),
  textAlign: "center",
  height: "100%",
  borderRadius: 20,
  boxShadow: "0 12px 30px rgba(0, 0, 0, 0.1)",
  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.8)",
  "&:hover": {
    transform: "translateY(-10px) scale(1.03)",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: "30px",
  padding: "12px 28px",
  fontWeight: "bold",
  boxShadow: "0 6px 15px rgba(0, 0, 0, 0.15)",
  transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 12px 25px rgba(0, 0, 0, 0.2)",
  },
}));

const ScrollDownButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  bottom: 20,
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  color: "white",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  animation: "bounce 2s infinite",
  "@keyframes bounce": {
    "0%, 20%, 50%, 80%, 100%": {
      transform: "translate(-50%, 0)",
    },
    "40%": {
      transform: "translate(-50%, -15px)",
    },
    "60%": {
      transform: "translate(-50%, -7px)",
    },
  },
}));

const DeveloperInfo = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
  padding: theme.spacing(3),
  borderRadius: 16,
  textAlign: "center",
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  backdropFilter: "blur(10px)",
}));

export const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  // Redux selectors for real data
  const students = useSelector((state) => state.students.students || []);
  const instructors = useSelector((state) => state.instructors.instructors || []);
  const courses = useSelector((state) => state.courses.courses || []);
  const attendance = useSelector((state) => state.attendances.attendances || []);



  // Calculate real statistics
  const activeStudents = students.filter(student => student.isActive !== false).length;
  const activeInstructors = instructors.filter(instructor => instructor.isActive !== false).length;
  const activeCourses = courses.filter(course => course.isActive !== false).length;
  const attendanceRate = attendance.length > 0 
    ? Math.round((attendance.filter(a => a.isPresent).length / attendance.length) * 100)
    : 95;

  // Main menu items for course management system
  const mainMenuItems = [
    {
      title: "ניהול תלמידים",
      description: "הוספה, עריכה וניהול פרטי התלמידים במערכת עם ממשק ידידותי וקל לשימוש",
      icon: GroupIcon,
      path: "/students",
      color: "#4A90E2",
      gradient: "linear-gradient(135deg, #4A90E2, #357ABD)",
      badge: "מרכזי",
      stats: `${activeStudents} תלמידים`
    },
    {
      title: "ניהול מדריכים",
      description: "ניהול צוות המדריכים, הקצאת חוגים ומעקב אחר פעילותם במערכת",
      icon: PersonIcon,
      path: "/instructors",
      color: "#7B68EE",
      gradient: "linear-gradient(135deg, #7B68EE, #6A5ACD)",
      badge: "חשוב",
      stats: `${activeInstructors} מדריכים`
    },
    {
      title: "ניהול חוגים",
      description: "יצירת וניהול חוגים, קביעת לוחות זמנים ומעקב אחר התקדמות הלמידה",
      icon: SchoolIcon,
      path: "/entrollStudent",
      color: "#32CD32",
      gradient: "linear-gradient(135deg, #32CD32, #228B22)",
      badge: "פעיל",
      stats: `${activeCourses} חוגים`
    },
    {
      title: "מעקב נוכחות",
      description: "רישום נוכחות תלמידים, יצירת דוחות נוכחות ומעקב אחר השתתפות בחוגים",
      icon: CheckCircleIcon,
      path: "/lesson-management",
      color: "#FF6347",
      gradient: "linear-gradient(135deg, #FF6347, #FF4500)",
      badge: "יומי",
      stats: `${attendanceRate}% נוכחות`
    },
    {
      title: "לוח שנה ייחודי",
      description: "לוח שנה מתקדם לרישום נוכחות יומי, תזכורות ומעקב אחר אירועים חשובים",
      icon: CalendarTodayIcon,
      path: "/attendanceCalendar",
      color: "#FF8C00",
      gradient: "linear-gradient(135deg, #FF8C00, #FF7F50)",
      badge: "חדש",
      stats: "ניהול זמנים"
    },
    {
      title: "הערות אישיות",
      description: "מערכת הערות מתקדמת לכל תלמיד, מעקב אחר התקדמות ותיעוד התנהגות",
      icon: NoteIcon,
      path: "/students",
      color: "#9370DB",
      gradient: "linear-gradient(135deg, #9370DB, #8A2BE2)",
      badge: "אישי",
      stats: "מעקב מותאם"
    },
    {
      title: "רישום לחוגים",
      description: "רישום תלמידים חדשים לחוגים ושיבוץ קל ומהיר",
      icon: PersonAddIcon,
      path: "/entrollStudent",
      color: "#20B2AA",
      gradient: "linear-gradient(135deg, #20B2AA, #008B8B)",
      badge: "מהיר",
      stats: "רישום קל"
    },
    {
      title: "דוחות וניתוחים",
      description: "יצירת דוחות מפורטים, ניתוח נתונים וקבלת תובנות על פעילות החוגים",
      icon: AnalyticsIcon,
      path: "/lesson-management",
      color: "#DC143C",
      gradient: "linear-gradient(135deg, #DC143C, #B22222)",
      badge: "מתקדם",
      stats: "דוחות חכמים"
    }
  ];

  const stats = [
    { 
      value: activeStudents.toString(), 
      label: "תלמידים פעילים", 
      icon: <GroupIcon fontSize="large" />, 
      color: '#4A90E2',
      description: "תלמידים רשומים ופעילים במערכת"
    },
    { 
      value: activeInstructors.toString(), 
      label: "מדריכים", 
      icon: <PersonIcon fontSize="large" />, 
      color: '#7B68EE',
      description: "מדריכים מוסמכים ופעילים"
    },
    { 
      value: activeCourses.toString(), 
      label: "חוגים פעילים", 
      icon: <SchoolIcon fontSize="large" />, 
      color: '#32CD32',
      description: "חוגים הפועלים כעת במערכת"
    },
    { 
      value: `${attendanceRate}%`, 
      label: "אחוז נוכחות", 
      icon: <CheckCircleIcon fontSize="large" />, 
      color: '#FF6347',
      description: "אחוז נוכחות ממוצע בכל החוגים"
    }
  ];

  const benefits = [
    {
      icon: <SpeedIcon />,
      title: "מהירות וביצועים",
      description: "ממשק מהיר ויעיל המאפשר עבודה שוטפת ללא עיכובים, גם בעומסים גבוהים",
      color: '#4A90E2'
    },
    {
      icon: <SecurityIcon />,
      title: "אבטחה מתקדמת", 
      description: "הגנה מקסימלית על נתוני התלמידים עם הצפנה מתקדמת ואמצעי אבטחה קפדניים",
      color: '#32CD32'
    },
    {
      icon: <VerifiedIcon />,
      title: "דיוק ואמינות",
      description: "מערכת מדויקת המבטיחה שכל הנתונים מנוהלים בצורה אמינה ומדויקת",
      color: '#7B68EE'
    },
    {
      icon: <SupportAgentIcon />,
      title: "תמיכה מקצועית",
      description: "צוות תמיכה זמין לעזור בכל שאלה או בעיה, עם זמני תגובה מהירים במיוחד",
      color: '#FF6347'
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { 
        duration: 0.6, 
        ease: [0.175, 0.885, 0.32, 1.275]
      }
    }
  };

  const fadeInUpVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.175, 0.885, 0.32, 1.275]
      }
    }
  };

  const scrollToFeatures = () => {
    document.getElementById("features-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box 
      component={motion.div} 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 1 }}
      sx={{ direction: "rtl" }}
    >
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <MotionBox
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            sx={{ position: "relative", zIndex: 2 }}
          >
            <MotionBox variants={itemVariants}>
              <Chip 
                icon={<StarIcon color="secondary"/>} 
                label="מערכת ניהול חוגים מתקדמת"
                size="medium"
                sx={{
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  fontWeight: "bold",
                  mb: 3,
                  boxShadow: "0 4px 15px rgba(255, 255, 255, 0.2)"
                }}
              />
            </MotionBox>
            
            <MotionBox variants={itemVariants}>
              <Typography 
                variant={isMobile ? "h3" : "h2"} 
                component="h1" 
                gutterBottom 
                fontWeight="bold"
                sx={{
                  textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                  mb: 3
                }}
              >
                ברוכים הבאים למערכת ניהול החוגים
              </Typography>
            </MotionBox>
            
            <MotionBox variants={itemVariants}>
              <Typography 
                variant={isMobile ? "body1" : "h5"} 
                paragraph 
                sx={{ 
                  maxWidth: "800px", 
                  mx: "auto", 
                  mb: 4,
                  opacity: 0.9,
                  lineHeight: 1.6
                }}
              >
                פלטפורמה מתקדמת לניהול מוסדות חינוך וחוגים
                בממשק חדשני ואינטואיטיבי המותאם לצרכי המנהלים והמדריכים
              </Typography>
            </MotionBox>
            
            <MotionBox variants={itemVariants} sx={{ mt: 5 }}>
              <ActionButton
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => navigate("/students")}
                sx={{ 
                  mx: 1,
                  mb: isMobile ? 2 : 0,
                  fontSize: isMobile ? 14 : 16,
                  px: isMobile ? 3 : 4
                }}
                endIcon={<ArrowForwardIcon />}
              >
                ניהול תלמידים
              </ActionButton>
              
              <ActionButton
                variant="outlined"
                color="inherit"
                size="large"
                onClick={() => navigate("/entrollStudent")}
                sx={{ 
                  mx: 1, 
                  bgcolor: "rgba(255,255,255,0.15)",
                  borderColor: "rgba(255,255,255,0.3)",
                  fontSize: isMobile ? 14 : 16,
                  px: isMobile ? 3 : 4,
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.25)",
                    borderColor: "rgba(255,255,255,0.5)",
                  }
                }}
                startIcon={<SchoolIcon />}
              >
                ניהול חוגים
              </ActionButton>
            </MotionBox>
          </MotionBox>
        </Container>
        
        <ScrollDownButton onClick={scrollToFeatures} aria-label="גלול למטה">
          <KeyboardArrowDownIcon />
        </ScrollDownButton>
      </HeroSection>

      {/* Main Menu Section */}
      <Container sx={{ mt: 10, mb: 10 }} id="features-section">
        <MotionBox
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          sx={{ textAlign: "center", mb: 6 }}
        >
          <MotionBox variants={fadeInUpVariants}>
            <Typography 
              variant="h3" 
              component="h2" 
              fontWeight="bold"
              sx={{
                position: "relative",
                display: "inline-block",
                mb: 2,
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -8,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 80,
                  height: 4,
                  borderRadius: 2,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                },
              }}
            >
              תפריט ראשי
            </Typography>
          </MotionBox>
          
          <MotionBox variants={fadeInUpVariants}>
            <Typography 
              variant="h6" 
              color="textSecondary" 
              paragraph 
              sx={{ 
                maxWidth: 700, 
                mx: "auto", 
                mt: 2,
                mb: 6,
                opacity: 0.8
              }}
            >
              כל הכלים הדרושים לניהול יעיל ומקצועי של מוסד החינוך שלכם
            </Typography>
          </MotionBox>
        </MotionBox>

        {/* Enhanced Main Menu Cards */}
        <Grid container spacing={4}>
          {mainMenuItems.map((item, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 100, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: index * 0.1 + 0.5,
                  duration: 1,
                  type: "spring",
                  bounce: 0.3
                }}
                whileHover={{
                  scale: 1.05,
                  y: -20,
                  rotateY: 8,
                  transition: { duration: 0.4 }
                }}
                whileTap={{ scale: 0.95 }}
                style={{ perspective: '1000px' ,width:'350px'}}
              >
                <Card
                  sx={{
                    borderRadius: '28px',
                    cursor: 'pointer',
                    width: '100%',
                    height: '350px',
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(30px)',
                    border: '2px solid rgba(255, 255, 255, 0.8)',
                    boxShadow: `
                      0 25px 50px rgba(0, 0, 0, 0.15),
                      0 12px 24px rgba(0, 0, 0, 0.1),
                      inset 0 1px 0 rgba(255, 255, 255, 0.9)
                    `,
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      boxShadow: `
                        0 40px 80px ${item.color}25,
                        0 20px 40px rgba(0, 0, 0, 0.2),
                        inset 0 1px 0 rgba(255, 255, 255, 0.9)
                      `,
                      borderColor: item.color,
                      '& .card-icon': {
                        transform: 'scale(1.15) rotate(5deg)',
                        background: item.gradient,
                      },
                      '& .card-badge': {
                        transform: 'scale(1.1)',
                        boxShadow: `0 4px 15px ${item.color}40`
                      },
                      '& .card-glow': {
                        opacity: 1,
                        transform: 'scale(2)'
                      },
                      '& .card-stats': {
                        color: item.color,
                        transform: 'translateY(-2px)'
                      }
                    }
                  }}
                  onClick={() => navigate(item.path)}
                >
                  {/* Animated Background Glow */}
                  <Box
                    className="card-glow"
                    sx={{
                      position: 'absolute',
                      top: '20%',
                      right: '20%',
                      width: '120px',
                      height: '120px',
                      background: `radial-gradient(circle, ${item.color}15 0%, transparent 70%)`,
                      borderRadius: '50%',
                      opacity: 0,
                      transition: 'all 0.6s ease',
                      zIndex: 0
                    }}
                  />
                  
                  {/* Premium Badge */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      zIndex: 3
                    }}
                  >
                    <motion.div
                      className="card-badge"
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Chip
                        label={item.badge}
                        size="small"
                        sx={{
                          background: item.gradient,
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          height: '24px',
                          boxShadow: `0 4px 12px ${item.color}30`,
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    </motion.div>
                  </Box>
                  
                  <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Avatar
                        className="card-icon"
                        sx={{
                          width: 80,
                          height: 80,
                          mb: 3,
                          background: `linear-gradient(135deg, ${item.color}20, ${item.color}30)`,
                          border: `3px solid ${item.color}40`,
                          boxShadow: `0 12px 30px ${item.color}25`,
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      >
                        <item.icon sx={{ fontSize: 40, color: item.color }} />
                      </Avatar>
                      
                      <Typography variant="h5" fontWeight="700" sx={{ color: '#1e293b', mb: 2, lineHeight: 1.3 }}>
                        {item.title}
                      </Typography>
                      
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#64748b',
                          mb: 3,
                          lineHeight: 1.6,
                          fontSize: '0.9rem'
                        }}
                      >
                        {item.description}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                      <Typography
                        className="card-stats"
                        variant="body2"
                        fontWeight="600"
                        sx={{
                          color: '#94a3b8',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {item.stats}
                      </Typography>
                      
                      <IconButton
                        size="small"
                        sx={{
                          color: item.color,
                          bgcolor: `${item.color}15`,
                          border: `2px solid ${item.color}30`,
                          '&:hover': {
                            bgcolor: item.color,
                            color: 'white',
                            transform: 'translateX(-5px) scale(1.1)',
                            boxShadow: `0 8px 20px ${item.color}40`
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <ArrowForwardIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box 
        sx={{ 
          bgcolor: alpha(theme.palette.primary.light, 0.05), 
          py: 10,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container>
          <MotionBox
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            sx={{ textAlign: "center", mb: 8 }}
          >
            <MotionBox variants={fadeInUpVariants}>
              <Typography 
                variant="h3" 
                component="h2" 
                fontWeight="bold"
                sx={{
                  position: "relative",
                  display: "inline-block",
                  mb: 2,
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: -8,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 80,
                    height: 4,
                    borderRadius: 2,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  },
                }}
              >
                הנתונים שלנו
              </Typography>
            </MotionBox>
            
            <MotionBox variants={fadeInUpVariants}>
              <Typography 
                variant="h6" 
                color="textSecondary" 
                paragraph 
                sx={{ 
                  maxWidth: 700, 
                  mx: "auto", 
                  mt: 2,
                  opacity: 0.8
                }}
              >
                
                סטטיסטיקות עדכניות על פעילות המערכת
              </Typography>
            </MotionBox>
          </MotionBox>

          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <MotionBox
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <StatsCard>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        mb: 2,
                        color: stat.color
                      }}
                    >
                      {stat.icon}
                    </Box>
                    
                    <Typography 
                      variant="h4" 
                      component="p"
                      fontWeight="bold" 
                      sx={{ 
                        color: "text.primary",
                        mb: 1
                      }}
                    >
                      {stat.value}
                    </Typography>
                    
                    <Typography 
                      variant="h6" 
                      color="primary"
                      fontWeight="medium"
                      sx={{ mb: 1 }}
                    >
                      {stat.label}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ mt: 1, fontSize: "0.875rem" }}
                    >
                      {stat.description}
                    </Typography>
                  </StatsCard>
                </MotionBox>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Container sx={{ mt: 12, mb: 12 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <MotionBox
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8 }}
            >
              <Chip 
                icon={<VerifiedIcon />} 
                label="ממשק ידידותי למנהלים" 
                size="medium"
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  color: "white",
                  fontWeight: "bold",
                  mb: 3
                }}
              />
              
              <Typography 
                variant="h3" 
                component="h2" 
                gutterBottom 
                fontWeight="bold"
                sx={{ mt: 2, mb: 3 }}
              >
                חווית משתמש מתקדמת
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ mb: 3, opacity: 0.8, lineHeight: 1.7 }}>
                המערכת שלנו מציעה ממשק אינטואיטיבי וקל לשימוש, המאפשר למנהלים לנהל חוגים, 
                לעקוב אחר תלמידים ולקבל דוחות מפורטים בקלות ובמהירות.
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ mb: 4, opacity: 0.8, lineHeight: 1.7 }}>
                עם כלים מתקדמים כמו לוח שנה ייחודי לרישום נוכחות יומי והערות אישיות לכל תלמיד,
                המנהלים יכולים לקבל תובנות משמעותיות ולהתאים את התכנית בהתאם.
              </Typography>
              
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {benefits.map((benefit, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      display: "flex", 
                      alignItems: "flex-start",
                      gap: 2,
                      p: 2,
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: alpha(benefit.color, 0.05),
                        transform: "translateX(-5px)",
                      }
                    }}
                    component={motion.div}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    viewport={{ once: true }}
                  >
                    <Box 
                      sx={{ 
                        color: benefit.color,
                        mt: 0.5
                      }}
                    >
                      {benefit.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {benefit.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {benefit.description}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </MotionBox>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <MotionBox
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8 }}
            >
              <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
                {/* Feature highlights */}
                <Box
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    backdropFilter: "blur(10px)",
                    width:'350px'
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <CalendarTodayIcon sx={{ color: theme.palette.primary.main, mr: 2 }} />
                    <Typography variant="h6" fontWeight="bold">
                      לוח שנה ייחודי
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    מערכת לוח שנה מתקדמת לרישום נוכחות יומי, תזכורות ומעקב אחר אירועים חשובים
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.1)})`,
                    border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                    backdropFilter: "blur(10px)",
                                      width:'350px'

                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <NoteIcon sx={{ color: theme.palette.secondary.main, mr: 2 }} />
                    <Typography variant="h6" fontWeight="bold">
                      הערות אישיות
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    מערכת הערות מתקדמת לכל תלמיד, מעקב אחר התקדמות ותיעוד התנהגות אישי
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${alpha('#32CD32', 0.1)}, ${alpha('#20B2AA', 0.1)})`,
                    border: `1px solid ${alpha('#32CD32', 0.2)}`,
                    backdropFilter: "blur(10px)",
                                     width:'350px'

                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <EventAvailableIcon sx={{ color: '#32CD32', mr: 2 }} />
                    <Typography variant="h6" fontWeight="bold">
                      מעקב נוכחות מתקדם
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    רישום נוכחות דיגיטלי עם דוחות מפורטים ומעקב אחר דפוסי השתתפות
                  </Typography>
                </Box>
              </Box>
            </MotionBox>
          </Grid>
        </Grid>
      </Container>

      {/* Developer Info Section - Smaller */}
      <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03), py: 6 }}>
        <Container>
          <MotionBox
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
          >
            <DeveloperInfo>
              <Typography 
                variant="h6" 
                component="h3" 
                gutterBottom 
                fontWeight="bold"
                sx={{ color: theme.palette.primary.main, mb: 1 }}
              >
                פיתוח: אסתר מורגנשטרן
              </Typography>
              
              <Stack 
                direction={isMobile ? "column" : "row"} 
                spacing={2} 
                justifyContent="center"
                alignItems="center"
                sx={{ fontSize: "0.9rem" }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <EmailIcon sx={{ color: theme.palette.primary.main, fontSize: 18 }} />
                  <Typography variant="body2">
                    em0527104104@gmail.com
                  </Typography>
                </Box>
                
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PhoneIcon sx={{ color: theme.palette.primary.main, fontSize: 18 }} />
                  <Typography variant="body2">
                    052-710-4104
                  </Typography>
                </Box>
              </Stack>
            </DeveloperInfo>
          </MotionBox>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box 
        sx={{ 
             background: 'linear-gradient(135deg,rgb(230, 104, 236) 0%,rgb(29, 148, 199) 100%)',
          color: "white", 
          py: 8,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container>
          <MotionBox
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            sx={{ position: "relative", zIndex: 1 }}
          >
            <Grid container spacing={4} justifyContent="center" alignItems="center">
              <Grid item xs={12} md={8} textAlign="center">
                <MotionBox variants={fadeInUpVariants}>
                  <Typography 
                    variant="h4" 
                    component="h2" 
                    gutterBottom 
                    fontWeight="bold"
                    sx={{
                      textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                    }}
                  >
                    מוכנים להתחיל?
                  </Typography>
                </MotionBox>
                
                <MotionBox variants={fadeInUpVariants}>
                  <Typography 
                    variant="h6" 
                    paragraph
                    sx={{ 
                      maxWidth: 700, 
                      mx: "auto", 
                      opacity: 0.9,
                      mb: 4
                    }}
                  >
                    הצטרפו למוסדות החינוך שכבר משתמשים במערכת לניהול חוגים
                    וגלו כיצד ניתן לחסוך זמן יקר ולשפר את תהליכי העבודה
                  </Typography>
                </MotionBox>
                
                <MotionBox variants={fadeInUpVariants} sx={{ mt: 3 }}>
                  <ActionButton
                    variant="contained"
                    size="large"
                    onClick={() => navigate("/students")}
                    sx={{ 
                      mx: 1,
                      mb: isMobile ? 2 : 0,
                      fontSize: isMobile ? 14 : 16,
                      px: isMobile ? 3 : 4,
                      bgcolor: "white",
                      color: theme.palette.primary.main,
                      "&:hover": {
                      bgcolor: "white"
                      }
                    }}
                    endIcon={<ArrowForwardIcon />}
                  >
                    התחל עכשיו
                  </ActionButton>
                  
                  <ActionButton
                    variant="outlined"
                    size="large"
                    onClick={() => navigate("/aboutSystem")}
                    sx={{ 
                      mx: 1, 
                      borderColor: "white",
                      color: "white",
                      fontSize: isMobile ? 14 : 16,
                      px: isMobile ? 3 : 4,
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.1)",
                        borderColor: "white",
                      }
                    }}
                  >
                    מידע נוסף
                  </ActionButton>
                </MotionBox>
              </Grid>
            </Grid>
          </MotionBox>
        </Container>
      </Box>
    </Box>
  );
};
export default Home;