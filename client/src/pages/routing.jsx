import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentsTable from './studentTable';
import Home from './home';
import Layout from './layout';
import InstructorsTable from './instructorsTable';
import EntrollStudent from './enrollStudent';
import AboutSystem from './aboutSystem';
import Menu from './menu';
import LessonManagement from './lessonManagement';
import AttendanceCalendar from './attendanceManagement/attendanceCalendar'

const Routing = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/menu" element={<Layout><Menu /></Layout>} />
        <Route path="/aboutSystem" element={<Layout><AboutSystem /></Layout>} />
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
