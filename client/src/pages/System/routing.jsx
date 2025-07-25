import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentsTable from '../Students/studentTable';
import Home from '../Home/home';
import Layout from '../shared/Layout/layout';
import InstructorsTable from '../Instructors/instructorsTable';
import EntrollStudent from '../Enrollment/components/enrollStudent';
import AboutSystem from './aboutSystem';
import LessonManagement from '../Lessons/components/lessonManagement';
import AttendanceCalendar from '../Attendance/attendanceCalendar'
import HomeLayout from '../shared/Layout/components/homeLayout';
import MyNotes from '../shared/Layout/components/myNotes';

const Routing = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeLayout><Home /></HomeLayout>} />  
        <Route path="/my-notes" element={<Layout><MyNotes /></Layout>} />
        <Route path="/aboutSystem" element={<HomeLayout><AboutSystem /></HomeLayout>} />
        <Route path="/students" element={<Layout><StudentsTable /></Layout>} />
        <Route path="/instructors" element={<Layout><InstructorsTable /></Layout>} />
        <Route path="/attendanceCalendar" element={<Layout><AttendanceCalendar /></Layout>} />
        <Route path="/entrollStudent" element={<Layout><EntrollStudent /></Layout>} />
        <Route path="/lesson-management" element={<Layout><LessonManagement /></Layout>} />
      </Routes>
    </Router>
  );
};

export default Routing;
