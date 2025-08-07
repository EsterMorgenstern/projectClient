
import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Container,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Chip,
  alpha,
  Avatar,
  Stack,
  Divider,
  LinearProgress,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation, useInView } from "framer-motion";

// Icons
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import VerifiedIcon from "@mui/icons-material/Verified";
import SpeedIcon from "@mui/icons-material/Speed";
import SecurityIcon from "@mui/icons-material/Security";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import CloudIcon from "@mui/icons-material/Cloud";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import NoteIcon from "@mui/icons-material/Note";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import DevicesIcon from "@mui/icons-material/Devices";
import MobileScreenShareIcon from "@mui/icons-material/MobileScreenShare";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import StarIcon from "@mui/icons-material/Star";
import PsychologyIcon from "@mui/icons-material/Psychology";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";

// Animated components
const MotionBox = ({ children, ...props }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, threshold: 0.2 });
  
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);
  
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
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 50%, ${theme.palette.secondary.light} 100%)`,
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

const FeatureCard = styled(Card)(({ theme }) => ({
  height: "100%",
  borderRadius: 20,
  overflow: "hidden",
  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.8)",
  boxShadow: "0 12px 30px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    transform: "translateY(-15px) scale(1.03)",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
  },
}));

const TechCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 20,
  textAlign: "center",
  height: "100%",
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.8)",
  boxShadow: "0 12px 30px rgba(0, 0, 0, 0.08)",
  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  "&:hover": {
    transform: "translateY(-10px) scale(1.02)",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.12)",
  },
}));

const DeveloperCard = styled(Card)(({ theme }) => ({
  borderRadius: 24,
  overflow: "hidden",
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
  backdropFilter: "blur(20px)",
  border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
  transition: "all 0.4s ease",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 30px 60px rgba(0, 0, 0, 0.15)",
  },
}));

const ProgressCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.8)",
  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.08)",
}));

export const AboutSystem = () => {
    const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [activeFeature, setActiveFeature] = useState(0);

  // System features
   const systemFeatures = [
    {
      title: "ניהול תלמידים מתקדם",
      description: "מערכת מקיפה לניהול פרטי תלמידים, מעקב אחר פעילות והתקדמות אישית",
      icon: GroupIcon,
      color: '#4A90E2',
      details: [
        "הוספה ועריכה של פרטי תלמידים",
        "מעקב אחר סטטוס פעילות (פעיל/לא פעיל)",
        "חיפוש מתקדם לפי שם, מזהה או נתונים אחרים",
        "הערות אישיות לכל תלמיד",
        "ניהול קבוצות ושיבוץ תלמידים"
      ]
    },
    {
      title: "ניהול מדריכים וצוות",
      description: "כלים מתקדמים לניהול צוות המדריכים והקצאת חוגים",
      icon: PersonIcon,
      color: '#7B68EE',
      details: [
        "רישום מדריכים חדשים במערכת",
        "הקצאת חוגים למדריכים",
        "מעקב אחר עומס עבודה של כל מדריך",
        "ניהול הרשאות וגישה למערכת",
        "דוחות פעילות מדריכים"
      ]
    },
    {
      title: "מערכת חוגים דינמית",
      description: "יצירה וניהול של חוגים עם לוחות זמנים גמישים ומעקב התקדמות",
      icon: SchoolIcon,
      color: '#32CD32',
      details: [
        "יצירת חוגים חדשים עם פרטים מלאים",
        "קביעת לוחות זמנים גמישים",
        "רישום תלמידים לחוגים (entrollStudent)",
        "מעקב אחר מספר משתתפים ומקומות פנויים",
        "ניהול סטטוס חוגים (פעיל/מושעה)"
      ]
    },
    {
      title: "מעקב נוכחות חכם",
      description: "מערכת נוכחות מתקדמת עם לוח שנה ייחודי ודוחות מפורטים",
      icon: CheckCircleIcon,
      color: '#FF6347',
      details: [
        "רישום נוכחות יומי דיגיטלי",
        "לוח שנה ייחודי לניהול נוכחות (attendanceCalendar)",
        "חישוב אחוזי נוכחות אוטומטי",
        "התראות על היעדרויות חוזרות",
        "דוחות נוכחות מפורטים לכל תקופה"
      ]
    },
    {
      title: "לוח שנה אינטראקטיבי",
      description: "לוח שנה מתקדם לתזכורות, אירועים ומעקב פעילויות יומיות",
      icon: CalendarTodayIcon,
      color: '#FF8C00',
      details: [
        "תצוגת לוח שנה אינטראקטיבית",
        "רישום אירועים וחוגים",
        "תזכורות אוטומטיות",
        "סינכרון עם מערכת הנוכחות",
        "תצוגות שונות: יומי, שבועי, חודשי"
      ]
    },
    {
      title: "מערכת הערות מתקדמת",
      description: "כלי מתקדם לתיעוד הערות אישיות ומעקב התקדמות תלמידים",
      icon: NoteIcon,
      color: '#9370DB',
      details: [
        "הערות אישיות לכל תלמיד",
        "קטגוריות הערות (התנהגות, הישגים, הערות כלליות)",
        "מעקב היסטורי של הערות",
        "חיפוש והצגת הערות לפי תקופות",
        "שיתוף הערות בין מדריכים"
      ]
    },
    {
      title: "דוחות וניתוחים מתקדמים",
      description: "מערכת דוחות מקיפה עם ויזואליזציה של נתונים וסטטיסטיקות",
      icon: AnalyticsIcon,
      color: '#DC143C',
      details: [
        "דוחות נוכחות מפורטים",
        "ניתוח נתוני השתתפות",
        "דוחות פעילות מדריכים",
        "סטטיסטיקות כלליות של המערכת"
      ]
    },
    {
      title: "ממשק רספונסיבי מתקדם",
      description: "עיצוב מותאם לכל המכשירים עם חוויית משתמש מעולה",
      icon:AnalyticsIcon,
      color: '#20B2AA',
      details: [
        "עיצוב רספונסיבי לכל המכשירים",
        "אנימציות חלקות עם Framer Motion",
        "Material Design 3 מתקדם",
        "נגישות מלאה (WCAG 2.1)"
      ]
    }
  ];


   // Technical specifications - עדכון מדויק
  const techSpecs = [
    {
      category: "Frontend",
      technologies: [
        { name: "React 19", level: 95, color: "#61DAFB" }, // הגרסה החדשה ביותר!
        { name: "Material-UI v7", level: 92, color: "#0081CB" },
        { name: "Framer Motion", level: 88, color: "#FF0055" },
        { name: "Redux Toolkit", level: 90, color: "#764ABC" }
      ]
    },
    {
      category: "Backend & Database",
      technologies: [
        { name: ".NET Core", level: 88, color: "#512BD4" },
        { name: "C# Programming", level: 85, color: "#239120" },
        { name: "SQL Server", level: 82, color: "#CC2927" },
        { name: "Entity Framework", level: 80, color: "#512BD4" }
      ]
    },
    {
      category: "DevOps & Tools",
      technologies: [
        { name: "React Router v7", level: 90, color: "#CA4245" },
        { name: "Git & GitHub", level: 93, color: "#F05032" },
        { name: "Responsive Design", level: 95, color: "#38B2AC" },
        { name: "RESTful APIs", level: 88, color: "#4CAF50" }
      ]
    }
  ];

  // System advantages
  const advantages = [
    {
      icon: SpeedIcon,
      title: "ביצועים מעולים",
      description: "מהירות טעינה מעולה וחוויית משתמש חלקה",
      color: "#4A90E2"
    },
    {
      icon: SecurityIcon,
      title: "אבטחה מתקדמת",
      description: "הגנה מקסימלית על נתונים רגישים",
      color: "#FF6B6B"
    },
    {
      icon: MobileScreenShareIcon,
      title: "עיצוב רספונסיבי",
      description: "מותאם לכל המכשירים והמסכים",
      color: "#38B2AC"
    },
    {
      icon: CloudIcon,
      title: "טכנולוגיית ענן",
      description: "גישה מכל מקום ובכל זמן",
      color: "#9370DB"
    },
    {
      icon: AutoAwesomeIcon,
      title: "ממשק אינטואיטיבי",
      description: "קל לשימוש ללא צורך בהכשרה",
      color: "#FF8C00"
    },
    {
      icon: SupportAgentIcon,
      title: "תמיכה מלאה",
      description: "ליווי וסיוע טכני מתמיד",
      color: "#32CD32"
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

  return (
    <Box sx={{ direction: "rtl", overflow: "hidden" }}>
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
                icon={<RocketLaunchIcon />} 
                label="טכנולוגיה מתקדמת לחינוך"
                size="large"
                sx={{
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  fontWeight: "bold",
                  mb: 3,
                  fontSize: "1rem",
                  height: 40,
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
                אודות מערכת ניהול החוגים
              </Typography>
            </MotionBox>
            
            <MotionBox variants={itemVariants}>
              <Typography 
                variant={isMobile ? "body1" : "h5"} 
                paragraph 
                sx={{ 
                  maxWidth: "900px", 
                  mx: "auto", 
                  mb: 4,
                  opacity: 0.95,
                  lineHeight: 1.7
                }}
              >
                מערכת ניהול חוגים מתקדמת ומקיפה, שפותחה במיוחד עבור מוסדות חינוך
                המחפשים פתרון טכנולוגי חדשני לניהול יעיל ומקצועי
              </Typography>
            </MotionBox>
          </MotionBox>
        </Container>

        {/* Floating elements animation */}
        <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
          {[...Array(6)].map((_, i) => (
            <Box
              key={i}
              component={motion.div}
              sx={{
                position: "absolute",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "50%",
                pointerEvents: "none",
              }}
              initial={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                scale: Math.random() * 0.5 + 0.3,
              }}
              animate={{
                y: [
                  `${Math.random() * 100}%`,
                  `${Math.random() * 100}%`,
                  `${Math.random() * 100}%`
                ],
                x: [
                  `${Math.random() * 100}%`,
                  `${Math.random() * 100}%`,
                  `${Math.random() * 100}%`
                ],
                rotate: [0, 360],
              }}
              transition={{
                duration: Math.random() * 25 + 20,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                width: `${Math.random() * 150 + 50}px`,
                height: `${Math.random() * 150 + 50}px`,
              }}
            />
          ))}
        </Box>
      </HeroSection>

      {/* System Features Section */}
      <Container sx={{ mt: 12, mb: 12 }}>
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
                  width: 100,
                  height: 4,
                  borderRadius: 2,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                },
              }}
            >
              תכונות המערכת
            </Typography>
          </MotionBox>
          
          <MotionBox variants={fadeInUpVariants}>
            <Typography 
              variant="h6" 
              color="textSecondary" 
              paragraph 
              sx={{ 
                maxWidth: 800, 
                mx: "auto", 
                mt: 3,
                opacity: 0.8,
                lineHeight: 1.6
              }}
            >
              המערכת מציעה מגוון רחב של כלים מתקדמים לניהול יעיל של חוגים ותלמידים
            </Typography>
          </MotionBox>
        </MotionBox>

        <Grid container spacing={4}>
          {systemFeatures.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <MotionBox
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1 }}
              >
                <FeatureCard
                  sx={{
                    cursor: "pointer",
                    "&:hover .feature-icon": {
                      transform: "scale(1.1) rotate(5deg)",
                      backgroundColor: feature.color,
                      color: "white",
                    }
                  }}
                  onClick={() => setActiveFeature(index)}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3 }}>
                      <Avatar
                        className="feature-icon"
                        sx={{
                          width: 70,
                          height: 70,
                          backgroundColor: alpha(feature.color, 0.1),
                          color: feature.color,
                          mr: 3,
                          transition: "all 0.4s ease",
                          border: `3px solid ${alpha(feature.color, 0.2)}`,
                        }}
                      >
                        <feature.icon sx={{ fontSize: 35 }} />
                      </Avatar>
                      
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          variant="h5" 
                          fontWeight="bold" 
                          gutterBottom
                          sx={{ color: "text.primary" }}
                        >
                          {feature.title}
                        </Typography>
                        
                        <Typography 
                          variant="body1" 
                          color="text.secondary"
                          sx={{ mb: 3, lineHeight: 1.6 }}
                        >
                          {feature.description}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    <List dense>
                      {feature.details.map((detail, idx) => (
                        <ListItem key={idx} sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 35 }}>
                            <CheckCircleIcon 
                              sx={{ 
                                color: feature.color, 
                                fontSize: 20 
                              }} 
                            />
                          </ListItemIcon>
                          <ListItemText 
                            primary={detail}
                            sx={{
                              "& .MuiListItemText-primary": {
                                fontSize: "0.95rem",
                                fontWeight: 500
                              }
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </FeatureCard>
              </MotionBox>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Technical Specifications */}
      <Box sx={{ bgcolor: alpha(theme.palette.primary.light, 0.03), py: 10 }}>
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
                    width: 100,
                    height: 4,
                    borderRadius: 2,
                    background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                  },
                }}
              >
                מפרט טכני
              </Typography>
            </MotionBox>
            
            <MotionBox variants={fadeInUpVariants}>
              <Typography 
                variant="h6" 
                color="textSecondary" 
                paragraph 
                sx={{ 
                  maxWidth: 800, 
                  mx: "auto", 
                  mt: 3,
                  opacity: 0.8
                }}
              >
                המערכת בנויה על טכנולוגיות מתקדמות ומודרניות ביותר
              </Typography>
            </MotionBox>
          </MotionBox>

          <Grid container spacing={4}>
            {techSpecs.map((spec, index) => (
              <Grid item xs={12} md={4} key={index}>
                <MotionBox
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.1 }}
                  sx={{marginRight:'48px'}}
                >
                  <TechCard>
                    <Typography 
                      variant="h5" 
                      fontWeight="bold" 
                      gutterBottom
                      sx={{ 
                        mb: 4,
                        color: theme.palette.primary.main,
                        
                      }}
                    >
                      {spec.category}
                    </Typography>
                    
                    <Stack spacing={3}>
                      {spec.technologies.map((tech, idx) => (
                        <ProgressCard key={idx}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                            <Typography variant="body1" fontWeight="600">
                              {tech.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {tech.level}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={tech.level}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: alpha(tech.color, 0.1),
                              "& .MuiLinearProgress-bar": {
                                backgroundColor: tech.color,
                                borderRadius: 4,
                              },
                            }}
                          />
                        </ProgressCard>
                      ))}
                    </Stack>
                  </TechCard>
                </MotionBox>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* System Advantages */}
      <Container sx={{ mt: 22, mb: 22 }}>
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
                  width: 100,
                  height: 4,
                  borderRadius: 2,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                },
              }}
            >
              יתרונות המערכת
            </Typography>
          </MotionBox>
          
          <MotionBox variants={fadeInUpVariants}>
            <Typography 
              variant="h6" 
              color="textSecondary" 
              paragraph 
              sx={{ 
                maxWidth: 800, 
                mx: "auto", 
                mt: 3,
                opacity: 0.8
              }}
            >
              למה לבחור במערכת שלנו? הנה הסיבות העיקריות
            </Typography>
          </MotionBox>
        </MotionBox>

        <Grid container spacing={4}>
          {advantages.map((advantage, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <MotionBox
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    width:'350px',
                    height: "100%",
                    borderRadius: 3,
                    transition: "all 0.4s ease",
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.8)",
                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.08)",
                    "&:hover": {
                      transform: "translateY(-10px)",
                      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.12)",
                      "& .advantage-icon": {
                        transform: "scale(1.1) rotate(5deg)",
                        backgroundColor: advantage.color,
                        color: "white",
                      }
                    }
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: "center" }}>
                    <Avatar
                      className="advantage-icon"
                      sx={{
                        width: 80,
                        height: 80,
                        backgroundColor: alpha(advantage.color, 0.1),
                        color: advantage.color,
                        mx: "auto",
                        mb: 3,
                        transition: "all 0.4s ease",
                        border: `3px solid ${alpha(advantage.color, 0.2)}`,
                      }}
                    >
                      <advantage.icon sx={{ fontSize: 40 }} />
                    </Avatar>
                    
                    <Typography 
                      variant="h6" 
                      fontWeight="bold" 
                      gutterBottom
                      sx={{ mb: 2 }}
                    >
                      {advantage.title}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      {advantage.description}
                    </Typography>
                  </CardContent>
                </Card>
              </MotionBox>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Developer Section */}
      <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02), py: 10 }}>
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
                    width: 100,
                    height: 4,
                    borderRadius: 2,
                    background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                  },
                }}
              >
                המפתחת
              </Typography>
            </MotionBox>
            
            <MotionBox variants={fadeInUpVariants}>
              <Typography 
                variant="h6" 
                color="textSecondary" 
                paragraph 
                sx={{ 
                  maxWidth: 600, 
                  mx: "auto", 
                  mt: 3,
                  opacity: 0.8
                }}
              >
                פיתוח מקצועי ומסור עם תשומת לב לפרטים הקטנים
              </Typography>
            </MotionBox>
          </MotionBox>

          <Grid container justifyContent="center">
            <Grid item xs={12} md={8} lg={6}>
              <MotionBox
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                <DeveloperCard>
                  <CardContent sx={{ p: 6 }}>
                    <Box sx={{ textAlign: "center", mb: 4 }}>
                      <Avatar
                        sx={{
                          width: 120,
                          height: 120,
                          mx: "auto",
                          mb: 3,
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          fontSize: "3rem",
                          fontWeight: "bold",
                          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                        }}
                      >
                        א.מ
                      </Avatar>
                      
                      <Typography 
                        variant="h4" 
                        fontWeight="bold" 
                        gutterBottom
                        sx={{ 
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          mb: 1
                        }}
                      >
                        אסתר מורגנשטרן
                      </Typography>
                      
                      <Typography 
                        variant="h6" 
                        color="primary" 
                        fontWeight="600"
                        sx={{ mb: 3 }}
                      >
                        מפתחת Full Stack
                      </Typography>
                      
                                   <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ 
                  lineHeight: 1.7,
                  mb: 4,
                  maxWidth: 500,
                  mx: "auto"
                }}
              >
                מפתחת מנוסה עם התמחות בפיתוח אפליקציות web מתקדמות.
                <br />
                מתמחה בטכנולוגיות C#, .NET Core, React ועיצוב חוויית משתמש מעולה.
                <br />
                מחויבת לפיתוח פתרונות איכותיים ויעילים עבור מוסדות חינוך.
              </Typography>

                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    {/* Skills */}
                    <Box sx={{ mb: 4 }}>
                      <Typography 
                        variant="h6" 
                        fontWeight="bold" 
                        gutterBottom
                        sx={{ 
                          textAlign: "center",
                          mb: 3,
                          color: theme.palette.primary.main
                        }}
                      >
                        כישורים מקצועיים
                      </Typography>
                      
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
                         {[
                          "React 19 (החדש ביותר!)",
                          ".NET Core",
                          "C# Programming", 
                          "SQL Server",
                          "Entity Framework",
                          "Material-UI v7",
                          "Framer Motion 12",
                          "Redux Toolkit",
                          "React Router v7",
                          "JavaScript ES6+",
                          "HTML5 & CSS3",
                          "Responsive Design",
                          "Git & GitHub",
                          "RESTful APIs",
                          "JWT Authentication",
                          "Cloud Deployment"
                          
                        ].map((skill, index) => (


                          <Chip
                            key={index}
                            label={skill}
                            variant="outlined"
                            sx={{
                              borderColor: alpha(theme.palette.primary.main, 0.3),
                              color: theme.palette.primary.main,
                              fontWeight: 500,
                              "&:hover": {
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                borderColor: theme.palette.primary.main,
                              }
                            }}
                          />
                        ))}
                      </Box>
                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    {/* Contact Information */}
                    <Box sx={{ textAlign: "center" }}>
                      <Typography 
                        variant="h6" 
                        fontWeight="bold" 
                        gutterBottom
                        sx={{ 
                    
                          mb: 3,
                          color: theme.palette.primary.main
                        }}
                      >
                        יצירת קשר
                      </Typography>

                      <Stack
                        direction={isMobile ? "column" : "row"}
                        spacing={3}
                        sx={{ direction: 'ltr' }}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Avatar
                            sx={{
                              width: 35,
                              height: 35,
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                            }}
                          >
                            <EmailIcon sx={{ fontSize: 18 }} />
                          </Avatar>
                          <Typography variant="body2" fontWeight="500">
                            em0527104104@gmail.com | st104.mor@gmail.com
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Avatar
                            sx={{
                              width: 35,
                              height: 35,
                              backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                              color: theme.palette.secondary.main,
                            }}
                          >
                            <PhoneIcon sx={{ fontSize: 18 }} />
                          </Avatar>
                          <Typography variant="body2" fontWeight="500">
                            052-710-4104
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Avatar
                            sx={{
                              width: 35,
                              height: 35,
                              backgroundColor: alpha("#333", 0.1),
                              color: "#333",
                            }}
                          >
                            <GitHubIcon sx={{ fontSize: 18 }} />
                          </Avatar>
                          <Typography variant="body2" fontWeight="500">
                            EsterMorgenstern
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </CardContent>
                </DeveloperCard>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Statistics Section */}
      <Container sx={{ mt: 12, mb: 12 }}>
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
                  width: 100,
                  height: 4,
                  borderRadius: 2,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                },
              }}
            >
              המערכת במספרים
            </Typography>
          </MotionBox>
          
          <MotionBox variants={fadeInUpVariants}>
            <Typography 
              variant="h6" 
              color="textSecondary" 
              paragraph 
              sx={{ 
                maxWidth: 600, 
                mx: "auto", 
                mt: 3,
                opacity: 0.8
              }}
            >
              נתונים מרשימים המעידים על איכות ויעילות המערכת
            </Typography>
          </MotionBox>
        </MotionBox>

        <Grid container spacing={4}>
          {[
            {
              icon: <DataUsageIcon fontSize="large" />,
              value: "99.9%",
              label: "זמינות המערכת",
              description: "זמינות גבוהה ויציבות מעולה",
              color: "#4A90E2"
            },
            {
              icon: <SpeedIcon fontSize="large" />,
              value: "< 2s",
              label: "זמן טעינה",
              description: "ביצועים מהירים במיוחד",
              color: "#32CD32"
            },
            {
              icon: <SecurityIcon fontSize="large" />,
              value: "100%",
              label: "אבטחת נתונים",
              description: "הגנה מלאה על מידע רגיש",
              color: "#FF6B6B"
            },
            {
              icon: <VerifiedIcon fontSize="large" />,
              value: "24/6",
              label: "תמיכה טכנית",
              description: "זמינות מלאה לסיוע",
              color: "#9370DB"
            }
          ].map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <MotionBox
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: "100%",
                    textAlign: "center",
                    borderRadius: 3,
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.8)",
                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.08)",
                    transition: "all 0.4s ease",
                    position: "relative",
                    overflow: "hidden",
                    marginRight: '48px',
                    "&:hover": {
                      transform: "translateY(-10px)",
                      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.12)",
                      "& .stat-icon": {
                        transform: "scale(1.1)",
                        color: "white",
                        backgroundColor: stat.color,
                      }
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: stat.color,
                    }
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Avatar
                      className="stat-icon"
                      sx={{
                        width: 70,
                        height: 70,
                        backgroundColor: alpha(stat.color, 0.1),
                        color: stat.color,
                        mx: "auto",
                        mb: 2,
                        transition: "all 0.4s ease",
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                    
                    <Typography 
                      variant="h3" 
                      fontWeight="bold" 
                      sx={{ 
                        color: stat.color,
                        mb: 1
                      }}
                    >
                      {stat.value}
                    </Typography>
                    
                    <Typography 
                      variant="h6" 
                      fontWeight="600"
                      gutterBottom
                      sx={{ mb: 1 }}
                    >
                      {stat.label}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ fontSize: "0.875rem" }}
                    >
                      {stat.description}
                    </Typography>
                  </CardContent>
                </Card>
              </MotionBox>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #f093fb 0%, #667eea  50%, #36d8d3ff 100%)',
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
            sx={{ position: "relative", zIndex: 1, textAlign: "center" }}
          >
            <MotionBox variants={fadeInUpVariants}>
              <Typography 
                variant="h4" 
                component="h2" 
                gutterBottom 
                fontWeight="bold"
                sx={{
                  textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                  mb: 2
                }}
              >
                מוכנים לחוות את המערכת?
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
                  mb: 4,
                  lineHeight: 1.6
                }}
              >
                הצטרפו לקהילת המנהלים והמוסדות החינוכיים שכבר נהנים מהיתרונות של המערכת המתקדמת שלנו
              </Typography>
            </MotionBox>
            
            <MotionBox variants={fadeInUpVariants} sx={{ mt: 4 }}>
              {/* כפתור התחילו עכשיו */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ marginBottom: isMobile ? 24 : 32,marginRight:'464px' }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/students")}
                  sx={{
                    background: "rgba(255, 255, 255, 0.2)",
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "30px",
                    padding: "12px 32px",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    backdropFilter: "blur(10px)",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.3)",
                      borderColor: "rgba(255, 255, 255, 0.5)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
                    }
                  }}
                  startIcon={<RocketLaunchIcon />}
                >
                  התחילו עכשיו
                </Button>
              </motion.div>

              {/* כפתורי יצירת קשר */}
              <Box sx={{ mb: 3 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 3, 
                    opacity: 0.9,
                    fontWeight: 600
                  }}
                >
                  או צרו איתנו קשר:
                </Typography>
                
                <Stack 
                  direction={isMobile ? "column" : "row"} 
                  spacing={isMobile ? 2 : 3} 
                  justifyContent="center"
                  alignItems="center"
                  sx={{direction:'ltr'}}
                >
                  {/* כפתור אימייל */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<EmailIcon />}
                      onClick={() => window.open('mailto:em0527104104@gmail.com?subject=פנייה מאתר מערכת ניהול החוגים&body=שלום אסתר,%0D%0A%0D%0Aאני מעוניין/ת לקבל מידע נוסף על המערכת.%0D%0A%0D%0Aתודה!')}
                      sx={{
                        borderColor: "rgba(255, 255, 255, 0.5)",
                        color: "white",
                        borderRadius: "25px",
                        padding: "10px 24px",
                        fontWeight: "600",
                        minWidth: isMobile ? "200px" : "140px",
                        backdropFilter: "blur(10px)",
                        "&:hover": {
                          borderColor: "white",
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                        }
                      }}
                    >
                      אימייל
                    </Button>
                  </motion.div>
                  
                  {/* כפתור טלפון */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<PhoneIcon />}
                      onClick={() => window.open('tel:+972527104104')}
                      sx={{
                        borderColor: "rgba(255, 255, 255, 0.5)",
                        color: "white",
                        borderRadius: "25px",
                        padding: "10px 24px",
                        fontWeight: "600",
                        minWidth: isMobile ? "200px" : "140px",
                        backdropFilter: "blur(10px)",
                        "&:hover": {
                          borderColor: "white",
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                        }
                      }}
                    >
                      התקשרו
                    </Button>
                  </motion.div>
                  
                  {/* כפתור WhatsApp */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<WhatsAppIcon />}
                      onClick={() => window.open('https://wa.me/972527104104?text=שלום אסתר, אני מעוניין/ת במידע על מערכת ניהול החוגים')}
                      sx={{
                        borderColor: "rgba(255, 255, 255, 0.5)",
                        color: "white",
                        borderRadius: "25px",
                        padding: "10px 24px",
                        fontWeight: "600",
                        minWidth: isMobile ? "200px" : "140px",
                        backdropFilter: "blur(10px)",
                        "&:hover": {
                          borderColor: "white",
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                        }
                      }}
                    >
                      WhatsApp
                    </Button>
                  </motion.div>
                </Stack>
              </Box>

              {/* מידע יצירת קשר נוסף */}
              <MotionBox variants={fadeInUpVariants} sx={{ mt: 4 }}>
                <Divider sx={{ bgcolor: "rgba(255, 255, 255, 0.3)", mb: 3 }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    opacity: 0.8,
                    mb: 2
                  }}
                >
                  זמינה לשאלות ויעוץ מקצועי
                </Typography>
                <Stack 
                  direction={isMobile ? "column" : "row"} 
                  spacing={isMobile ? 1 : 3} 
                  justifyContent="center"
                  alignItems="center"
                  sx={{ fontSize: "0.9rem", direction: 'ltr' }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <EmailIcon sx={{ fontSize: 18 }} />
                    <Typography variant="body2">
                      em0527104104@gmail.com | st104.mor@gmail.com
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PhoneIcon sx={{ fontSize: 18 }} />
                    <Typography variant="body2">
                      052-710-4104
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <GitHubIcon sx={{ fontSize: 18 }} />
                    <Typography variant="body2">
                      EsterMorgenstern
                    </Typography>
                  </Box>
                </Stack>
              </MotionBox>
            </MotionBox>
          </MotionBox>
        </Container>

        {/* Background Animation */}
        <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
          {[...Array(5)].map((_, i) => (
            <Box
              key={i}
              component={motion.div}
              sx={{
                position: "absolute",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderRadius: "50%",
                pointerEvents: "none",
              }}
              initial={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                scale: Math.random() * 0.5 + 0.3,
              }}
              animate={{
                y: [
                  `${Math.random() * 100}%`,
                  `${Math.random() * 100}%`,
                  `${Math.random() * 100}%`
                ],
                x: [
                  `${Math.random() * 100}%`,
                  `${Math.random() * 100}%`,
                  `${Math.random() * 100}%`
                ],
                rotate: [0, 360],
              }}
              transition={{
                duration: Math.random() * 30 + 20,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                width: `${Math.random() * 200 + 100}px`,
                height: `${Math.random() * 200 + 100}px`,
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Footer Information */}
      <Box sx={{ bgcolor: alpha(theme.palette.grey[900], 0.05), py: 6 }}>
        <Container>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={8}>
              <MotionBox
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                sx={{ textAlign: "center" }}
              >
                <MotionBox variants={fadeInUpVariants}>
                  <Typography 
                    variant="h5" 
                    fontWeight="bold" 
                    gutterBottom
                    sx={{ 
                      color: theme.palette.primary.main,
                      mb: 3
                    }}
                  >
                    מערכת ניהול חוגים מתקדמת
                  </Typography>
                </MotionBox>
                
                <MotionBox variants={fadeInUpVariants}>
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ 
                      lineHeight: 1.7,
                      mb: 4,
                      maxWidth: 600,
                      mx: "auto"
                    }}
                  >
                    פותח במיוחד עבור מוסדות חינוך המחפשים פתרון מקצועי, יעיל ואמין לניהול תלמידים, 
                    נוכחות דיווחים וביטולים. המערכת משלבת טכנולוגיה מתקדמת עם ממשק ידידותי למשתמש.
                  </Typography>
                </MotionBox>
                
                <MotionBox variants={fadeInUpVariants}>
                  <Box sx={{ display: "flex", justifyContent: "center", gap: 3, flexWrap: "wrap" }}>
                    {[
                      { icon: <VerifiedIcon />, text: "מערכת מאובטחת" },
                      { icon: <SpeedIcon />, text: "ביצועים מעולים" },
                      { icon: <SupportAgentIcon />, text: "תמיכה מלאה" },
                      { icon: <CloudIcon />, text: "טכנולוגיית ענן" }
                    ].map((item, index) => (
                      <Box 
                        key={index}
                        sx={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: 1,
                          color: theme.palette.text.secondary
                        }}
                      >
                        <Box sx={{ color: theme.palette.primary.main }}>
                          {item.icon}
                        </Box>
                        <Typography variant="body2" fontWeight="500">
                          {item.text}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </MotionBox>
                
                <MotionBox variants={fadeInUpVariants} sx={{ mt: 4 }}>
                  <Divider sx={{ mb: 3 }} />
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ opacity: 0.7 }}
                  >
                    ©2025 מערכת ניהול חוגים | פותח על ידי אסתר מורגנשטרן | כל הזכויות שמורות
                  </Typography>
                </MotionBox>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutSystem;
