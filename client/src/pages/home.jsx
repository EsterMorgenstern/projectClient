
// src/pages/Home.jsx
// import React from 'react';
// import { BookOpen, Users, GraduationCap, Activity, PlusCircle, ClipboardList } from "lucide-react";
// import Button from '../components/ui/button';
// import { useNavigate } from 'react-router-dom';

// const Home = () => {
//   const navigate = useNavigate();

//   const handleNavigate = (path) => {
//     navigate(path);
//   };

//   return (
//     <div className="flex flex-col justify-center items-center h-screen space-y-8 px-6">
//       <h1 className="text-4xl font-extrabold text-gray-900 mb-12">Welcome to the Management System</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
//         <Button
//           icon={<BookOpen />}
//           label="Manage Students"
//           onClick={() => handleNavigate('/students')}
//         />
//         <Button
//           icon={<Users />}
//           label="Manage Instructors"
//           onClick={() => handleNavigate('/instructors')}
//         />
//         <Button
//           icon={<GraduationCap />}
//           label="Manage Courses"
//           onClick={() => handleNavigate('/courses')}
//         />
//         <Button
//           icon={<Activity />}
//           label="Active Courses"
//           onClick={() => handleNavigate('/active-courses')}
//         />
//         <Button
//           icon={<PlusCircle />}
//           label="Assignments"
//           onClick={() => handleNavigate('/assignments')}
//         />
//         <Button
//           icon={<ClipboardList />}
//           label="Reports"
//           onClick={() => handleNavigate('/reports')}
//         />
//       </div>
//     </div>
//   );
// };

// export default Home;

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Users, GraduationCap, Activity, PlusCircle, ClipboardList } from "lucide-react";
import { Button, Card, CardContent } from "@mui/material";


export default function Home() {
  const navigate = useNavigate();

  const buttons = [
    { label: "ניהול תלמידים", path: "/students", icon: Users },
    { label: "ניהול מדריכים", path: "/instructors", icon: GraduationCap },
    { label: "ניהול כל החוגים", path: "/courses", icon: BookOpen },
    { label: "חוגים פעילים", path: "/active-courses", icon: Activity },
    { label: "שיבוץ תלמידים לחוגים", path: "/student-courses", icon: ClipboardList },
    { label: "הוספת חוג חדש", path: "/add-course", icon: PlusCircle },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 p-8">
      <motion.h1
        className="text-5xl md:text-7xl font-bold text-center mb-16 text-white drop-shadow-lg"
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        ניהול חוגים
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 w-full flex-grow">
        {buttons.map((btn, index) => {
          const Icon = btn.icon;
          return (
            <motion.div 
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex"
            >
              <Card
                onClick={() => navigate(btn.path)}
                className="flex flex-col items-center justify-center w-full h-64 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl cursor-pointer transition hover:bg-white"
              >
                <CardContent className="flex flex-col items-center justify-center space-y-6">
                  <Icon className="h-16 w-16 text-purple-600" />
                  <Button
                    variant="ghost" 
                    className="text-2xl font-bold text-purple-700 hover:text-purple-900"
                  >
                    {btn.label}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
