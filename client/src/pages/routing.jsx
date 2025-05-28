import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentsTable from './studentTable';
import Home from './home';
import Layout from './layout';
import Courses from './coursesTable';
import Assignments from './assignments';
import InstructorsTable from './InstructorsTable';
import EntrollStudent from './enrollStudent';
import AboutSystem from './aboutSystem';
import Menu from './menu';
import AttendanceCalendar from './attendanceManagement/attendanceCalendar';

const Routing = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/menu" element={<Layout><Menu /></Layout>} />
        <Route path="/aboutSystem" element={<Layout><AboutSystem /></Layout>} />
        <Route path="/students" element={<Layout><StudentsTable /></Layout>} />
        <Route path="/instructors" element={<Layout><InstructorsTable /></Layout>} />
        <Route path="/courses" element={<Layout><AttendanceCalendar /></Layout>} />
        <Route path="/entrollStudent" element={<Layout><EntrollStudent /></Layout>} />
        <Route path="/assignments" element={<Layout><Assignments /></Layout>} />
      </Routes>
    </Router>
  );
};

export default Routing;
