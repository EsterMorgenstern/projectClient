import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  FaRegLightbulb,
  FaArrowLeft,
  FaRocket,
  FaCheck,
  FaUserFriends,
  FaBuilding,
  FaCalendarAlt,
  FaChartLine,
  FaUsers,
  FaCreditCard,
  FaCalendarCheck,
  FaMapMarkerAlt,
  FaChild,
  FaStar,
  FaQuestionCircle,
  FaChevronDown,
  FaHandshake,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaLinkedinIn,
  FaTwitter,
  FaShieldAlt,
  FaMobileAlt,
  FaCloudDownloadAlt,
  FaLaptopCode
} from "react-icons/fa";

// Styled Components with updated colors
const PageContainer = styled.div`
  font-family: 'Rubik', sans-serif;
  direction: rtl;
`;

const Section = styled.section`
  padding: 100px 0;
  background-color: ${props => props.light ? "#f8faff" : "#ffffff"};
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #1e88e5 0%, #4fc3f7 100%);
  padding: 120px 0 100px;
  position: relative;
  overflow: hidden;
`;

const CTASection = styled.section`
  background: linear-gradient(135deg, #1e88e5 0%, #4fc3f7 100%);
  padding: 100px 0;
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.columns}, 1fr);
  gap: ${props => props.gap || "30px"};
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(6, 1fr);
  }
`;

const GridItem = styled.div`
  grid-column: span ${props => props.span};
  
  @media (max-width: 768px) {
    grid-column: span ${props => props.mobileSpan};
  }
`;

const HighlightChip = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  background-color: ${props => props.dark ? "#e1f5fe" : "rgba(255, 255, 255, 0.2)"};
  color: ${props => props.dark ? "#0288d1" : "white"};
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 20px;
  
  svg {
    margin-left: 8px;
  }
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.large ? "3.5rem" : "2.5rem"};
  font-weight: 700;
  margin-bottom: 20px;
  color: ${props => props.light ? "white" : "#0d47a1"};
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: ${props => props.large ? "2.5rem" : "2rem"};
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  color: ${props => props.light ? "rgba(255, 255, 255, 0.9)" : "#546e7a"};
  margin-bottom: 40px;
  max-width: 700px;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.large ? "15px 30px" : "12px 24px"};
  background-color: ${props => props.secondary ? "#4fc3f7" : "#0288d1"};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: ${props => props.large ? "1.1rem" : "1rem"};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
    background-color: ${props => props.secondary ? "#29b6f6" : "#0277bd"};
  }
  
  svg {
    margin-right: 10px;
  }
`;

const OutlineButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.large ? "14px 28px" : "11px 22px"};
  background-color: transparent;
  color: ${props => props.light ? "white" : "#0288d1"};
  border: 2px solid ${props => props.light ? "white" : "#0288d1"};
  border-radius: 8px;
  font-size: ${props => props.large ? "1.1rem" : "1rem"};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.light ? "rgba(255, 255, 255, 0.1)" : "rgba(2, 136, 209, 0.1)"};
    transform: translateY(-3px);
  }
`;

const FeatureCard = styled.div`
  background-color: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  height: 100%;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIconContainer = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 15px;
  background: linear-gradient(135deg, #1e88e5 0%, #4fc3f7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: white;
  font-size: 28px;
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 15px;
  color: #0d47a1;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: #546e7a;
`;

const CheckListItem = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const CheckIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #e1f5fe;
  color: #0288d1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 15px;
  flex-shrink: 0;
`;

const CheckText = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  color: #546e7a;
  margin: 0;
`;

const StatItem = styled.div`
  background-color: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  text-align: center;
  height: 100%;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  }
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: #0288d1;
  margin-bottom: 10px;
`;

const StatLabel = styled.div`
  font-size: 1.1rem;
  color: #546e7a;
  font-weight: 500;
`;

const Accordion = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const AccordionItem = styled.div`
  margin-bottom: 15px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
`;

const AccordionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  background-color: white;
  cursor: pointer;
  font-weight: 600;
  font-size: 1.1rem;
  color: #0d47a1;
  
  svg {
    transition: transform 0.3s ease;
    transform: ${props => props.isOpen ? "rotate(180deg)" : "rotate(0)"};
    color: #0288d1;
  }
`;

const AccordionContent = styled.div`
  padding: ${props => props.isOpen ? "0 25px 20px" : "0 25px"};
  max-height: ${props => props.isOpen ? "500px" : "0"};
  overflow: hidden;
  transition: all 0.3s ease;
  
  p {
    margin: 0;
    color: #546e7a;
    line-height: 1.7;
  }
`;

const ContactCard = styled.div`
  background-color: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  text-align: center;
  height: 100%;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  }
`;

const ContactIconContainer = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1e88e5 0%, #4fc3f7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
  font-size: 28px;
`;

const ContactTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 15px;
  color: #0d47a1;
`;

const ContactInfo = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: #546e7a;
  margin: 5px 0;
`;

const Particle = styled(motion.div)`
  position: absolute;
  width: ${props => props.size};
  height: ${props => props.size};
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  top: ${props => props.top};
  left: ${props => props.left};
`;

const AboutSystem = () => {
  const [animateStats, setAnimateStats] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);
  const statsRef = useRef(null);
  
  // Features data
  const features = [
    {
      icon: <FaUserFriends />,
      title: "ניהול תלמידים",
      description: "מערכת מתקדמת לניהול פרטי תלמידים, רישום לחוגים, מעקב אחר תשלומים והתקדמות אישית"
    },
    {
      icon: <FaCalendarAlt />,
      title: "ניהול חוגים",
      description: "ניהול קל ויעיל של מערכת החוגים, כולל לוח זמנים, רשימות תלמידים, ומעקב אחר נוכחות"
    },
    {
      icon: <FaCreditCard />,
      title: "ניהול תשלומים",
      description: "מערכת תשלומים מאובטחת המאפשרת גביית תשלומים, הנפקת חשבוניות ומעקב אחר חייבים"
    },
    {
      icon: <FaUsers />,
      title: "ניהול מדריכים",
      description: "מעקב אחר מדריכי החוגים, לוח זמנים, התמחויות, ומערכת הערכה מובנית"
    },
    {
      icon: <FaCalendarCheck />,
      title: "ניהול נוכחות",
      description: "מערכת מתקדמת לניהול נוכחות בחוגים, התראות אוטומטיות להורים ודוחות מפורטים"
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "ניהול סניפים",
      description: "ניהול מרכזי פעילות בפריסה ארצית, כולל חדרים, ציוד, ומשאבים"
    },
    {
      icon: <FaChild />,
      title: "התאמה אישית",
      description: "מנגנון חכם להתאמת חוגים לילדים על פי גיל, מגזר, העדפות אישיות וכישורים"
    },
    {
      icon: <FaChartLine />,
      title: "דוחות וסטטיסטיקות",
      description: "מגוון דוחות מתקדמים וניתוחים סטטיסטיים לקבלת החלטות מבוססות נתונים"
    },
    {
      icon: <FaBuilding />,
      title: "ממשק מוסדי",
      description: "ממשק ייעודי לעבודה מול מוסדות חינוך, מתנ\"סים ורשויות מקומיות"
    }
  ];
  
  // Benefits data
  const benefits = [
    "חיסכון של עד 70% בזמן ניהול החוגים",
    "ממשק ידידותי וקל לשימוש",
    "גישה מכל מקום ובכל זמן",
    "התאמה מלאה לצרכי מרכזי חוגים בישראל",
    "אבטחת מידע ברמה הגבוהה ביותר",
    "תמיכה טכנית זמינה 6 ימים בשבוע"
  ];
  
  // Stats data
  const stats = [
    { number: 1500, label: "מרכזי חוגים" },
    { number: 12000, label: "מדריכים פעילים" },
    { number: 250000, label: "תלמידים רשומים" },
    { number: 98, label: "אחוזי שביעות רצון" }
  ];
  
  const toggleAccordion = (index) => {
    if (openAccordion === index) {
      setOpenAccordion(null);
    } else {
      setOpenAccordion(index);
    }
  };
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimateStats(true);
        }
      },
      { threshold: 0.5 }
    );
    
    if (statsRef.current) {
      observer.observe(statsRef.current);
    }
    
    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);
  
  return (
    <PageContainer>
      {/* Hero Section */}
      <HeroSection>
        <Container>
          <Grid columns={12} gap="50px">
            <GridItem span={6} mobileSpan={12}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <HighlightChip>
                  <FaRegLightbulb />
                  מערכת ניהול חוגים
                </HighlightChip>
                
                <SectionTitle light large>
                  הדרך החכמה לנהל
                  <br />
                  את החוגים שלך
                </SectionTitle>
                
                <SectionSubtitle light>
                  מערכת מתקדמת לניהול חוגים, תלמידים, מדריכים וסניפים במקום אחד.
                  פתרון מושלם למרכזי חוגים, מתנ"סים ובתי ספר.
                </SectionSubtitle>
                
                <div>
                  <Button large>
                    התחל תקופת ניסיון
                    <FaArrowLeft />
                  </Button>
                  
                  <OutlineButton large light>
                    צפה בהדגמה
                  </OutlineButton>
                </div>
              </motion.div>
            </GridItem>
            
            <GridItem span={6} mobileSpan={12}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ position: "relative" }}
              >
                <div style={{ 
                  position: "relative", 
                  borderRadius: "20px", 
                  overflow: "hidden", 
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)"
                }}>
                  <img 
                    src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                    alt="מערכת ניהול חוגים" 
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                </div>
                
                {/* Decorative elements */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  style={{ 
                    position: "absolute", 
                    top: "-20px", 
                    right: "-20px", 
                    width: "100px", 
                    height: "100px", 
                    borderRadius: "20px", 
                    background: "linear-gradient(135deg, #1e88e5 0%, #4fc3f7 100%)",
                    zIndex: -1
                  }}
                />
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  style={{ 
                    position: "absolute", 
                    bottom: "-20px", 
                    left: "-20px", 
                    width: "70px", 
                    height: "70px", 
                    borderRadius: "15px", 
                    background: "linear-gradient(135deg, #4fc3f7 0%, #1e88e5 100%)",
                    zIndex: -1
                  }}
                />
              </motion.div>
            </GridItem>
          </Grid>
        </Container>
        
        {/* Animated particles */}
        {[...Array(20)].map((_, i) => (
          <Particle
            key={i}
            size={`${Math.random() * 10 + 5}px`}
            top={`${Math.random() * 100}%`}
            left={`${Math.random() * 100}%`}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
              opacity: [0.7, 0.1, 0.7],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </HeroSection>
      
      {/* About System Section */}
      <Section>
        <Container>
          <Grid columns={12} gap="50px">
            <GridItem span={6} mobileSpan={12}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <HighlightChip dark>
                  <FaRocket />
                  החזון שלנו
                </HighlightChip>
                
                <SectionTitle>
                  מערכת חכמה לניהול חוגים ופעילויות
                </SectionTitle>
                
                <SectionSubtitle>
                  פיתחנו מערכת ייחודית המשלבת טכנולוגיה מתקדמת עם הבנה עמוקה של צרכי מרכזי החוגים והפעילויות בישראל. המערכת מאפשרת ניהול יעיל של תלמידים, מדריכים וסניפים במקום אחד.
                </SectionSubtitle>
                
                {benefits.map((benefit, index) => (
                  <CheckListItem
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true, amount: 0.3 }}
                    whileHover={{ x: -5 }}
                  >
                    <CheckIcon>
                      <FaCheck />
                    </CheckIcon>
                    <CheckText>{benefit}</CheckText>
                  </CheckListItem>
                ))}
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  viewport={{ once: true, amount: 0.3 }}
                  style={{ marginTop: "30px" }}
                >
                  <Button>
                    גלה עוד על המערכת
                  </Button>
                </motion.div>
              </motion.div>
            </GridItem>
            
            <GridItem span={6} mobileSpan={12}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, amount: 0.3 }}
                style={{ position: "relative" }}
              >
                <div style={{ 
                  position: "relative", 
                  borderRadius: "20px", 
                  overflow: "hidden", 
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                }}>
                  <img 
                    src="https://images.unsplash.com/photo-1529390079861-591de354faf5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                    alt="ילדים בחוג" 
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                </div>
                
                {/* Decorative elements */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  viewport={{ once: true }}
                  style={{ 
                    position: "absolute", 
                    top: "-20px", 
                    right: "-20px", 
                    width: "100px", 
                    height: "100px", 
                    borderRadius: "20px", 
                    background: "linear-gradient(135deg, #1e88e5 0%, #4fc3f7 100%)",
                    zIndex: -1
                  }}
                />
                
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  viewport={{ once: true }}
                  style={{ 
                    position: "absolute", 
                    bottom: "-20px", 
                    left: "-20px", 
                    width: "70px", 
                    height: "70px", 
                    borderRadius: "15px", 
                    background: "linear-gradient(135deg, #4fc3f7 0%, #1e88e5 100%)",
                    zIndex: -1
                  }}
                />
              </motion.div>
            </GridItem>
          </Grid>
        </Container>
      </Section>
      
      {/* Features Section */}
      <Section light>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            style={{ textAlign: "center", marginBottom: "60px" }}
          >
            <HighlightChip dark>
              <FaStar />
              תכונות מרכזיות
            </HighlightChip>
            
            <SectionTitle>
              כל מה שצריך לניהול חוגים מוצלח
            </SectionTitle>
            
            <SectionSubtitle style={{ margin: "0 auto" }}>
              המערכת שלנו מציעה מגוון רחב של כלים וטכנולוגיות מתקדמות לניהול יעיל של מרכזי חוגים ופעילויות
            </SectionSubtitle>
          </motion.div>
          
          <Grid columns={3} gap="30px">
            {features.map((feature, index) => (
              <GridItem key={index} span={1} mobileSpan={1}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <FeatureCard>
                    <FeatureIconContainer>
                      {feature.icon}
                    </FeatureIconContainer>
                    
                    <FeatureTitle>{feature.title}</FeatureTitle>
                    
                    <FeatureDescription>
                      {feature.description}
                    </FeatureDescription>
                  </FeatureCard>
                </motion.div>
              </GridItem>
            ))}
          </Grid>
        </Container>
      </Section>
      
      {/* Stats Section */}
      <Section ref={statsRef}>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            style={{ textAlign: "center", marginBottom: "60px" }}
          >
            <HighlightChip dark>
              <FaChartLine />
              נתונים מרשימים
            </HighlightChip>
            
            <SectionTitle>
              המספרים מדברים בעד עצמם
            </SectionTitle>
            
            <SectionSubtitle style={{ margin: "0 auto" }}>
              הצלחנו לבנות מערכת שמשרתת אלפי תלמידים ומאות חוגים ברחבי הארץ
            </SectionSubtitle>
          </motion.div>
          
          <Grid columns={4} gap="30px">
            {stats.map((stat, index) => (
              <GridItem key={index} span={1} mobileSpan={2}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <StatItem>
                    <StatNumber>
                      {animateStats ? (
                        <CountUp
                          end={stat.number}
                          duration={2.5}
                          separator=","
                        />
                      ) : (
                        0
                      )}
                      {stat.label.includes("אחוזי") && "%"}
                    </StatNumber>
                    
                    <StatLabel>{stat.label}</StatLabel>
                  </StatItem>
                </motion.div>
              </GridItem>
            ))}
          </Grid>
        </Container>
      </Section>
      
      {/* FAQ Section */}
      <Section light>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            style={{ textAlign: "center", marginBottom: "60px" }}
          >
            <HighlightChip dark>
              <FaQuestionCircle />
              שאלות נפוצות
            </HighlightChip>
            
            <SectionTitle>
              כל מה שרצית לדעת
            </SectionTitle>
            
            <SectionSubtitle style={{ margin: "0 auto" }}>
              מענה לשאלות הנפוצות ביותר על מערכת ניהול החוגים שלנו
            </SectionSubtitle>
          </motion.div>
          
          <Accordion>
            {[
              {
                question: "איך המערכת מתאימה חוגים לתלמידים?",
                answer: "המערכת משתמשת באלגוריתם חכם המתחשב בגיל התלמיד, העדפותיו האישיות, המגזר אליו הוא משתייך, וכישוריו. בנוסף, המערכת לומדת מהרגלי הרישום הקודמים ומציעה התאמות מדויקות יותר עם הזמן."
              },
              {
                question: "האם המערכת מתאימה לכל סוגי החוגים?",
                answer: "כן, המערכת מתאימה למגוון רחב של חוגים - מאמנות וספורט ועד מדעים, מוזיקה וטכנולוגיה. ניתן להתאים את המערכת לצרכים הספציפיים של כל סוג חוג."
              },
              {
                question: "איך מנהלים נוכחות במערכת?",
                answer: "המערכת מציעה מספר אפשרויות לניהול נוכחות: סריקת ברקוד/QR, רישום ידני על ידי המדריך, או אפילו זיהוי פנים אוטומטי (בגרסה המתקדמת). ההורים מקבלים עדכונים אוטומטיים על נוכחות ילדיהם."
              },
              {
                question: "האם המערכת תומכת בניהול מספר סניפים?",
                answer: "בהחלט! המערכת תוכננה במיוחד לניהול רשת של סניפים. ניתן לנהל את כל הסניפים ממשק אחד, עם אפשרות לניתוח נתונים ברמת הסניף הבודד או ברמת הרשת כולה."
              },
              {
                question: "האם המערכת מאפשרת תקשורת עם ההורים?",
                answer: "כן, המערכת כוללת מודול תקשורת מתקדם המאפשר שליחת הודעות אישיות או קבוצתיות להורים דרך SMS, אימייל או הודעות פוש באפליקציה. ניתן לשלוח עדכונים שוטפים, תזכורות לאירועים, או דוחות התקדמות."
              },
              {
                question: "האם יש אפליקציה למובייל?",
                answer: "כן, המערכת כוללת אפליקציית מובייל ייעודית למנהלים, למדריכים ולהורים. האפליקציה מאפשרת גישה לכל הפונקציות החשובות של המערכת מכל מקום ובכל זמן."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <AccordionItem>
                  <AccordionHeader 
                    isOpen={openAccordion === index}
                    onClick={() => toggleAccordion(index)}
                  >
                    {item.question}
                    <FaChevronDown />
                  </AccordionHeader>
                  
                  <AccordionContent isOpen={openAccordion === index}>
                    <p>{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </Container>
      </Section>
      
      {/* CTA Section */}
      <CTASection>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}
          >
            <HighlightChip>
              <FaRocket />
              מוכנים להתחיל?
            </HighlightChip>
            
            <SectionTitle light>
              הצטרפו לאלפי מרכזי חוגים שכבר נהנים מהמערכת שלנו
            </SectionTitle>
            
            <SectionSubtitle light style={{ margin: "0 auto 40px" }}>
              התחילו תקופת ניסיון חינם של 14 יום וגלו איך המערכת שלנו יכולה לשפר את ניהול החוגים שלכם
            </SectionSubtitle>
            
            <div>
              <Button large secondary>
                התחל תקופת ניסיון
                <FaArrowLeft />
              </Button>
              
              <OutlineButton large light>
                תיאום הדגמה אישית
              </OutlineButton>
            </div>
          </motion.div>
        </Container>
        
        {/* Animated particles */}
        {[...Array(15)].map((_, i) => (
          <Particle
            key={i}
            size={`${Math.random() * 10 + 5}px`}
            top={`${Math.random() * 100}%`}
            left={`${Math.random() * 100}%`}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
              opacity: [0.7, 0.1, 0.7],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </CTASection>
      
      {/* Contact Section */}
      <Section>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            style={{ textAlign: "center", marginBottom: "60px" }}
          >
            <HighlightChip dark>
              <FaHandshake />
              צור קשר
            </HighlightChip>
            
            <SectionTitle>
              אנחנו כאן לעזור
            </SectionTitle>
            
            <SectionSubtitle style={{ margin: "0 auto" }}>
              צוות התמיכה שלנו זמין לענות על כל שאלה ולסייע בכל בעיה
            </SectionSubtitle>
          </motion.div>
          
          <Grid columns={3} gap="30px">
            <GridItem span={1} mobileSpan={1}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <ContactCard>
                  <ContactIconContainer>
                    <FaPhoneAlt />
                  </ContactIconContainer>
                  
                  <ContactTitle>טלפון</ContactTitle>
                  
                  <ContactInfo>03-1234567</ContactInfo>
                  <ContactInfo>ימים א'-ה', 9:00-17:00</ContactInfo>
                </ContactCard>
              </motion.div>
            </GridItem>
            
            <GridItem span={1} mobileSpan={1}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <ContactCard>
                  <ContactIconContainer>
                    <FaEnvelope />
                  </ContactIconContainer>
                  
                  <ContactTitle>אימייל</ContactTitle>
                  
                  <ContactInfo>info@classmanager.co.il</ContactInfo>
                  <ContactInfo>support@classmanager.co.il</ContactInfo>
                </ContactCard>
              </motion.div>
            </GridItem>
            
            <GridItem span={1} mobileSpan={1}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <ContactCard>
                  <ContactIconContainer>
                    <FaClock />
                  </ContactIconContainer>
                  
                  <ContactTitle>שעות פעילות</ContactTitle>
                  
                  <ContactInfo>ימים א'-ה': 9:00-17:00</ContactInfo>
                  <ContactInfo>יום ו': 9:00-13:00</ContactInfo>
                </ContactCard>
              </motion.div>
            </GridItem>
          </Grid>
        </Container>
      </Section>
      
      {/* Footer */}
      <Section style={{ padding: "50px 0", backgroundColor: "#1e88e5", color: "white" }}>
        <Container>
          <Grid columns={12} gap="30px">
            <GridItem span={4} mobileSpan={12}>
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "15px" }}>
                  מערכת ניהול חוגים
                </h2>
                
                <p style={{ fontSize: "1rem", lineHeight: "1.7", color: "rgba(255, 255, 255, 0.7)" }}>
                  הפתרון המושלם לניהול חוגים, תלמידים, מדריכים וסניפים במקום אחד.
                </p>
              </div>
              
              <div style={{ display: "flex", marginTop: "20px" }}>
                <a href="#" style={{ 
                  width: "40px", 
                  height: "40px", 
                  borderRadius: "50%", 
                  background: "rgba(255, 255, 255, 0.1)", 
                  color: "white", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  marginLeft: "10px",
                  transition: "all 0.3s ease"
                }}>
                  <FaLinkedinIn />
                </a>
                
                <a href="#" style={{ 
                  width: "40px", 
                  height: "40px", 
                  borderRadius: "50%", 
                  background: "rgba(255, 255, 255, 0.1)", 
                  color: "white", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  marginLeft: "10px",
                  transition: "all 0.3s ease"
                }}>
                  <FaTwitter />
                </a>
                
                <a href="#" style={{ 
                  width: "40px", 
                  height: "40px", 
                  borderRadius: "50%", 
                  background: "rgba(255, 255, 255, 0.1)", 
                  color: "white", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  transition: "all 0.3s ease"
                }}>
                  <FaEnvelope />
                </a>
              </div>
            </GridItem>
            
            <GridItem span={2} mobileSpan={6}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "20px" }}>
                מוצרים
              </h3>
              
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <li style={{ marginBottom: "10px" }}>
                  <a href="#" style={{ color: "rgba(255, 255, 255, 0.7)", textDecoration: "none", transition: "all 0.3s ease" }}>
                    ניהול תלמידים
                  </a>
                </li>
                <li style={{ marginBottom: "10px" }}>
                  <a href="#" style={{ color: "rgba(255, 255, 255, 0.7)", textDecoration: "none", transition: "all 0.3s ease" }}>
                    ניהול מדריכים
                  </a>
                </li>
                <li style={{ marginBottom: "10px" }}>
                  <a href="#" style={{ color: "rgba(255, 255, 255, 0.7)", textDecoration: "none", transition: "all 0.3s ease" }}>
                    ניהול חוגים
                  </a>
                </li>
                <li style={{ marginBottom: "10px" }}>
                  <a href="#" style={{ color: "rgba(255, 255, 255, 0.7)", textDecoration: "none", transition: "all 0.3s ease" }}>
                    ניהול סניפים
                  </a>
                </li>
                <li>
                  <a href="#" style={{ color: "rgba(255, 255, 255, 0.7)", textDecoration: "none", transition: "all 0.3s ease" }}>
                    אפליקציית מובייל
                  </a>
                </li>
              </ul>
            </GridItem>
            
            <GridItem span={2} mobileSpan={6}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "20px" }}>
                חברה
              </h3>
              
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <li style={{ marginBottom: "10px" }}>
                  <a href="#" style={{ color: "rgba(255, 255, 255, 0.7)", textDecoration: "none", transition: "all 0.3s ease" }}>
                    אודות
                  </a>
                </li>
                <li style={{ marginBottom: "10px" }}>
                  <a href="#" style={{ color: "rgba(255, 255, 255, 0.7)", textDecoration: "none", transition: "all 0.3s ease" }}>
                    צוות
                  </a>
                </li>
                <li style={{ marginBottom: "10px" }}>
                  <a href="#" style={{ color: "rgba(255, 255, 255, 0.7)", textDecoration: "none", transition: "all 0.3s ease" }}>
                    קריירה
                  </a>
                </li>
                <li style={{ marginBottom: "10px" }}>
                  <a href="#" style={{ color: "rgba(255, 255, 255, 0.7)", textDecoration: "none", transition: "all 0.3s ease" }}>
                    בלוג
                  </a>
                </li>
                <li>
                  <a href="#" style={{ color: "rgba(255, 255, 255, 0.7)", textDecoration: "none", transition: "all 0.3s ease" }}>
                    צור קשר
                  </a>
                </li>
              </ul>
            </GridItem>
            
            <GridItem span={2} mobileSpan={6}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "20px" }}>
                תמיכה
              </h3>
              
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <li style={{ marginBottom: "10px" }}>
                  <a href="#" style={{ color: "rgba(255, 255, 255, 0.7)", textDecoration: "none", transition: "all 0.3s ease" }}>
                    מרכז עזרה
                  </a>
                </li>
                <li style={{ marginBottom: "10px" }}>
                  <a href="#" style={{ color: "rgba(255, 255, 255, 0.7)", textDecoration: "none", transition: "all 0.3s ease" }}>
                    מדריכי שימוש
                  </a>
                </li>
                <li style={{ marginBottom: "10px" }}>
                  <a href="#" style={{ color: "rgba(255, 255, 255, 0.7)", textDecoration: "none", transition: "all 0.3s ease" }}>
                    שאלות נפוצות
                  </a>
                </li>
                <li style={{ marginBottom: "10px" }}>
                  <a href="#" style={{ color: "rgba(255, 255, 255, 0.7)", textDecoration: "none", transition: "all 0.3s ease" }}>
                    סטטוס מערכת
                  </a>
                </li>
                <li>
                  <a href="#" style={{ color: "rgba(255, 255, 255, 0.7)", textDecoration: "none", transition: "all 0.3s ease" }}>
                    דווח על תקלה
                  </a>
                </li>
              </ul>
            </GridItem>
            
            <GridItem span={2} mobileSpan={6}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "20px" }}>
                משפטי
              </h3>
              
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <li style={{ marginBottom: "10px" }}>
                  <a href="#" style={{ color: "rgba(255, 255, 255, 0.7)", textDecoration: "none", transition: "all 0.3s ease" }}>
                    תנאי שימוש
                  </a>
                </li>
                <li style={{ marginBottom: "10px" }}>
                  <a href="#" style={{ color: "rgba(255, 255, 255, 0.7)", textDecoration: "none", transition: "all 0.3s ease" }}>
                    מדיניות פרטיות
                  </a>
                </li>
                <li style={{ marginBottom: "10px" }}>
                  <a href="#" style={{ color: "rgba(255, 255, 255, 0.7)", textDecoration: "none", transition: "all 0.3s ease" }}>
                    אבטחת מידע
                  </a>
                </li>
                <li>
                  <a href="#" style={{ color: "rgba(255, 255, 255, 0.7)", textDecoration: "none", transition: "all 0.3s ease" }}>
                    GDPR
                  </a>
                </li>
              </ul>
            </GridItem>
          </Grid>
          
          <div style={{ 
            borderTop: "1px solid rgba(255, 255, 255, 0.1)", 
            marginTop: "50px", 
            paddingTop: "30px", 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            flexWrap: "wrap"
          }}>
            <div style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.9rem" }}>
              © 2023 מערכת ניהול חוגים. כל הזכויות שמורות.
            </div>
            
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                color: "rgba(255, 255, 255, 0.6)", 
                marginLeft: "20px",
                fontSize: "0.9rem"
              }}>
                <FaShieldAlt style={{ marginLeft: "5px" }} />
                מאובטח ב-SSL
              </div>
              
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                color: "rgba(255, 255, 255, 0.6)",
                fontSize: "0.9rem"
              }}>
                <FaMobileAlt style={{ marginLeft: "5px" }} />
                זמין בכל המכשירים
              </div>
            </div>
          </div>
        </Container>
      </Section>
      
      {/* Floating Elements */}
      <div style={{ 
        position: "fixed", 
        bottom: "30px", 
        left: "30px", 
        zIndex: 999, 
        display: "flex", 
        flexDirection: "column" 
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <a href="#" style={{ 
            width: "60px", 
            height: "60px", 
            borderRadius: "50%", 
            background: "#1e88e5", 
            color: "white", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
            fontSize: "24px",
            marginBottom: "15px",
            transition: "all 0.3s ease"
          }}>
            <FaQuestionCircle />
          </a>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <a href="#" style={{ 
            width: "60px", 
            height: "60px", 
            borderRadius: "50%", 
            background: "#1e88e5", 
            color: "white", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
            fontSize: "24px",
            transition: "all 0.3s ease"
          }}>
            <FaCloudDownloadAlt />
          </a>
        </motion.div>
      </div>
      
      {/* Mobile App Promo */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        style={{ 
          position: "fixed", 
          bottom: "30px", 
          right: "30px", 
          zIndex: 999, 
          background: "white", 
          borderRadius: "15px", 
          padding: "20px", 
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
          display: "flex",
          alignItems: "center",
          maxWidth: "320px"
        }}
      >
        <div style={{ 
          width: "50px", 
          height: "50px", 
          borderRadius: "10px", 
          background: "#1e88e5", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          color: "white",
          fontSize: "24px",
          marginLeft: "15px",
          flexShrink: 0
        }}>
          <FaLaptopCode />
        </div>
        
        <div>
          <h4 style={{ margin: "0 0 5px", fontSize: "1rem", fontWeight: "600", color: "#2D3748" }}>
            גלה את האפליקציה שלנו
          </h4>
          
          <p style={{ margin: "0 0 10px", fontSize: "0.9rem", color: "#718096" }}>
            נהל את החוגים שלך מכל מקום
          </p>
          
          <button style={{ 
            background: "#1e88e5", 
            color: "white", 
            border: "none", 
            borderRadius: "5px", 
            padding: "5px 10px", 
            fontSize: "0.8rem", 
            fontWeight: "600", 
            cursor: "pointer",
            display: "flex",
            alignItems: "center"
          }}>
            <FaMobileAlt style={{ marginLeft: "5px" }} />
            הורד עכשיו
          </button>
        </div>
        
        <button style={{ 
          position: "absolute", 
          top: "10px", 
          left: "10px", 
          background: "none", 
          border: "none", 
          color: "#CBD5E0", 
          fontSize: "16px", 
          cursor: "pointer" 
        }}>
          ×
        </button>
      </motion.div>
    </PageContainer>
  );
};

export default AboutSystem;
