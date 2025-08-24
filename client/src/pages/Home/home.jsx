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
import EventBusyIcon from "@mui/icons-material/EventBusy";
import { fetchInstructors } from "../../store/instructor/instructorGetAllThunk";
import { fetchStudents } from "../../store/student/studentGetAllThunk";
import { fetchCourses } from "../../store/course/CoursesGetAllThunk";
import { fetchGroups } from "../../store/group/groupGellAllThunk";

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
    dispatch(fetchGroups());
  }, [dispatch]);
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
  color: "white",
  padding: theme.spacing(12, 0, 14),
  textAlign: "center", background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #4facfe 100%)',
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

const AnimatedStar = styled(StarIcon)(({ theme }) => ({
  animation: 'colorChange 3s ease-in-out infinite',
  '@keyframes colorChange': {
    '0%': { color: '#4facfe' },      // כחול בהיר
    '25%': { color: '#667eea' },     // כחול סגול
    '50%': { color: '#f093fb' },     // ורוד בהיר
    '75%': { color: '#ff9a9e' },     // ורוד קורל
    '100%': { color: '#4facfe' }     // חזרה לכחול
  }
}));
const AnimatedArrow = styled(ArrowForwardIcon)(({ theme }) => ({
  animation: 'colorChange 3s ease-in-out infinite',
  '@keyframes colorChange': {
    '0%': { color: '#4facfe' },      // כחול בהיר
    '25%': { color: '#667eea' },     // כחול סגול
    '50%': { color: '#f093fb' },     // ורוד בהיר
    '75%': { color: '#ff9a9e' },     // ורוד קורל
    '100%': { color: '#4facfe' }     // חזרה לכחול
  }
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
  const groups = useSelector((state) => state.groups.groups || []);
  const attendance = useSelector((state) => state.attendances.attendances || []);



  // Calculate real statistics
  const activeStudents = students.filter(student => student.isActive !== false).length;
  const activeInstructors = instructors.filter(instructor => instructor.isActive !== false).length;
  const activeCourses = courses.filter(course => course.isActive !== false).length;
  const activeGroups = groups.filter(group => group.isActive !== false).length;
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
      title: "ניהול חוגים, סניפים וקבוצות",
      description: "יצירת וניהול חוגים, סניפים וקבוצות, קביעת לוחות זמנים ומעקב אחר התקדמות הלמידה",
      icon: SchoolIcon,
      path: "/entrollStudent",
      color: "#32CD32",
      gradient: "linear-gradient(135deg, #32CD32, #228B22)",
      badge: "פעיל",
      stats: `${activeGroups} קבוצות`
    },
    {
      title: "מעקב נוכחות",
      description: "רישום נוכחות תלמידים, יצירת דוחות נוכחות וסימון אוטומטי",
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
      title: "ניהול ביטולים",
      description: "ביטול חוגים ספציפיים וכן ימים מסויימים מראש עם עדכון אוטומטי בלוח השנה ",
      icon: EventBusyIcon,
      path: "/lesson-management",
      color: "#FF4757",
      gradient: "linear-gradient(135deg, #FF4757, #FF3742)",
      badge: "חכם",
      stats: "ביטול מתוכנן"
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
                icon={<AnimatedStar />}
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
                  px: isMobile ? 3 : 4,
                  direction: "ltr",
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#1e3c72',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(10px)',
                  fontWeight: 'bold',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 1)',
                    borderColor: 'rgba(255, 255, 255, 0.3)',

                    transform: 'translateY(-3px)',
                    boxShadow: '0 15px 30px rgba(255, 255, 255, 0.3)',
                  }
                }}
                endIcon={<AnimatedArrow />}
              >
                ניהול תלמידים
              </ActionButton>

              <ActionButton
                variant="outlined"
                color="inherit"
                size="large"
                onClick={() => navigate("/entrollStudent")}
                sx={{
                  direction: 'ltr',
                  mx: 1,
                  fontSize: isMobile ? 14 : 16,
                  px: isMobile ? 3 : 4,
                  borderColor: "rgba(255,255,255,0.6)",
                  color: "white",
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                  border: "2px solid rgba(255,255,255,0.3)",
                  "&:hover": {
                    background: "rgba(255,255,255,0.2)",
                    borderColor: "rgba(255,255,255,0.8)",
                    transform: "translateY(-3px)",
                    boxShadow: "0 12px 25px rgba(255, 255, 255, 0.2)",
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
                style={{ perspective: '1000px', width: '350px' }}
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
                icon={<VerifiedIcon color="white" />}
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
          {/* <Grid item xs={12}>
            <MotionBox
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8 }}
            > */}
              {/* ✅ Grid נפרד עם 3 קולונות */}
              {/* <Grid container spacing={3} justifyContent="center"> */}
                {/* לוח שנה ייחודי */}
                {/* <Grid item xs={12} md={4}>
                  <motion.div
                    whileHover={{ scale: 1.03, y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      sx={{
                        p: 2.5,
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #4facfe 0%, #667eea 50%, #43e97b 100%)',
                        color: 'white',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 15px 40px rgba(79, 172, 254, 0.3)',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        height: '220px',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: -50,
                          right: -50,
                          width: 150,
                          height: 150,
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.1)',
                          backdropFilter: 'blur(30px)'
                        },
                        '&:hover': {
                          boxShadow: '0 25px 60px rgba(79, 172, 254, 0.4)',
                          transform: 'translateY(-5px)',
                          '&::before': {
                            transform: 'scale(1.2)',
                          }
                        },
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1.5, position: 'relative', zIndex: 1 }}>
                        <Avatar
                          sx={{
                            background: 'rgba(255, 255, 255, 0.25)',
                            border: '2px solid rgba(255, 255, 255, 0.4)',
                            width: 40,
                            height: 40,
                            mr: 1.5,
                            boxShadow: '0 8px 25px rgba(255, 255, 255, 0.2)'
                          }}
                        >
                          <CalendarTodayIcon sx={{ color: 'white', fontSize: 20 }} />
                        </Avatar>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{
                          textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                          background: 'linear-gradient(45deg, #ffffff 0%, rgba(255,255,255,0.8) 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        }}>
                          לוח שנה ייחודי
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          position: 'relative',
                          zIndex: 1,
                          opacity: 0.95,
                          lineHeight: 1.4,
                          fontSize: '0.8rem'
                        }}
                      >
                        מערכת לוח שנה מתקדמת לרישום נוכחות יומי, תזכורות ומעקב אחר אירועים חשובים
                      </Typography>
                    </Card>
                  </motion.div>
                </Grid> */}

                {/* הערות אישיות */}
                {/* <Grid item xs={12} md={4}>
                  <motion.div
                    whileHover={{ scale: 1.03, y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      sx={{
                        p: 2.5,
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #f093fb 0%, #764ba2 50%, #667eea 100%)',
                        color: 'white',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 15px 40px rgba(240, 147, 251, 0.3)',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        height: '220px',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          bottom: -50,
                          left: -50,
                          width: 150,
                          height: 150,
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.1)',
                          backdropFilter: 'blur(30px)'
                        },
                        '&:hover': {
                          boxShadow: '0 25px 60px rgba(240, 147, 251, 0.4)',
                          transform: 'translateY(-5px)',
                          '&::before': {
                            transform: 'scale(1.2)',
                          }
                        },
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1.5, position: 'relative', zIndex: 1 }}>
                        <Avatar
                          sx={{
                            background: 'rgba(255, 255, 255, 0.25)',
                            border: '2px solid rgba(255, 255, 255, 0.4)',
                            width: 40,
                            height: 40,
                            mr: 1.5,
                            boxShadow: '0 8px 25px rgba(255, 255, 255, 0.2)'
                          }}
                        >
                          <NoteIcon sx={{ color: 'white', fontSize: 20 }} />
                        </Avatar>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{
                          textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                          background: 'linear-gradient(45deg, #ffffff 0%, rgba(255,255,255,0.8) 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        }}>
                          הערות אישיות
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          position: 'relative',
                          zIndex: 1,
                          opacity: 0.95,
                          lineHeight: 1.4,
                          fontSize: '0.8rem'
                        }}
                      >
                        מערכת הערות מתקדמת לכל תלמיד, מעקב אחר התקדמות ותיעוד התנהגות אישי
                      </Typography>
                    </Card>
                  </motion.div>
                </Grid> */}

                {/* מעקב נוכחות מתקדם */}
                {/* <Grid item xs={12} md={4}>
                  <motion.div
                    whileHover={{ scale: 1.03, y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      sx={{
                        p: 2.5,
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 50%, #4facfe 100%)',
                        color: 'white',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 15px 40px rgba(67, 233, 123, 0.3)',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        height: '220px',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: -30,
                          left: -30,
                          width: 120,
                          height: 120,
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.1)',
                          backdropFilter: 'blur(30px)'
                        },
                        '&:hover': {
                          boxShadow: '0 25px 60px rgba(67, 233, 123, 0.4)',
                          transform: 'translateY(-5px)',
                          '&::before': {
                            transform: 'scale(1.2)',
                          }
                        },
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1.5, position: 'relative', zIndex: 1 }}>
                        <Avatar
                          sx={{
                            background: 'rgba(255, 255, 255, 0.25)',
                            border: '2px solid rgba(255, 255, 255, 0.4)',
                            width: 40,
                            height: 40,
                            mr: 1.5,
                            boxShadow: '0 8px 25px rgba(255, 255, 255, 0.2)'
                          }}
                        >
                          <EventAvailableIcon sx={{ color: 'white', fontSize: 20 }} />
                        </Avatar>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{
                          textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                          background: 'linear-gradient(45deg, #ffffff 0%, rgba(255,255,255,0.8) 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        }}>
                          מעקב נוכחות מתקדם
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          position: 'relative',
                          zIndex: 1,
                          opacity: 0.95,
                          lineHeight: 1.4,
                          fontSize: '0.8rem'
                        }}
                      >
                        רישום נוכחות דיגיטלי עם דוחות מפורטים ומעקב אחר דפוסי השתתפות וכן סימון אוטומטי בכל יום
                      </Typography>
                    </Card>
                  </motion.div>
                </Grid> */}
              {/* </Grid> */}
            {/* </MotionBox>
          </Grid> */}
        </Grid>
      </Container>


          
        

      {/* Call to Action Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #4facfe 100%)', color: "white",
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
                      direction: 'ltr',
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
                    endIcon={<AnimatedArrow />}
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