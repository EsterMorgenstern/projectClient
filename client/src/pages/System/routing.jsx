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
import GrowPaymentCallback from '../Payments/GrowPaymentCallback';
import GrowPaymentTest from '../Payments/GrowPaymentTest';
import RegistrationTracking from './RegistrationTracking';

const Routing = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeLayout><Home /></HomeLayout>} />  
        <Route path="/my-notes" element={<Layout><MyNotes /></Layout>} />
        <Route path="/aboutSystem" element={<HomeLayout><AboutSystem /></HomeLayout>} />
        <Route path="/registration-tracking" element={<Layout><RegistrationTracking /></Layout>} />
        <Route path="/students" element={<Layout><StudentsTable /></Layout>} />
        <Route path="/instructors" element={<Layout><InstructorsTable /></Layout>} />
        <Route path="/attendanceCalendar" element={<Layout><AttendanceCalendar /></Layout>} />
        <Route path="/entrollStudent" element={<Layout><EntrollStudent /></Layout>} />
        <Route path="/lesson-management" element={<Layout><LessonManagement /></Layout>} />
        <Route path="/grow-payment-callback" element={<GrowPaymentCallback />} />
        <Route path="/grow-payment-test" element={<Layout><GrowPaymentTest /></Layout>} />
      </Routes>
    </Router>
  );
};

export default Routing;
