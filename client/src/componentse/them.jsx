import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Button, Box } from "@mui/material";
import AnimatedTable from "./components/AnimatedTable"; // או כל טבלה אחרת

export default function App() {
  const [darkMode, setDarkMode] = useState(false);  // מצב ברירת מחדל הוא בהיר

  // יצירת תבנית שמחוללת מצב כהה או בהיר
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",  // שינוי הצבעים
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setDarkMode(!darkMode)}  // שינוי המצב בין כהה להיר
          style={{ marginBottom: "20px", padding: "10px 20px" }}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}  {/* טקסט משתנה בהתאם למצב */}
        </Button>
        <AnimatedTable />  {/* טבלה או רכיב אחר */}
      </Box>
    </ThemeProvider>
  );
}
