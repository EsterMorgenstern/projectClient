import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentsTable from '../Students/studentTable';
import Home from '../Home/home';
import Layout from '../shared/Layout/layout';
import InstructorsTable from '../Instructors/instructorsTable';
import EnrollStudent from '../Enrollment/components/enrollStudent';
import AboutSystem from './aboutSystem';
import LessonManagement from '../Lessons/components/lessonManagement';
import AttendanceCalendar from '../Attendance/attendanceCalendar'
import HomeLayout from '../shared/Layout/components/homeLayout';
import MyNotes from '../shared/Layout/components/myNotes';
import GrowPaymentCallback from '../Payments/GrowPaymentCallback';
import GrowPaymentTest from '../Payments/GrowPaymentTest';
import RegistrationTracking from './RegistrationTracking';
import HealthFundManagement from '../Payments/HealthFundManagement';
import GroupsTable from '../Groups/groupsTable';
import GroupDetailsPage from '../Groups/groupDetailsPage';

const Routing = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeLayout><Home /></HomeLayout>} />
        <Route path="/my-notes" element={<Layout><MyNotes /></Layout>} />
        <Route path="/about-system" element={<HomeLayout><AboutSystem /></HomeLayout>} />
        <Route path="/registration-tracking" element={<Layout><RegistrationTracking /></Layout>} />
        <Route path="/students" element={<Layout><StudentsTable /></Layout>} />
        <Route path="/instructors" element={<Layout><InstructorsTable /></Layout>} />
        <Route path="/attendance-calendar" element={<Layout><AttendanceCalendar /></Layout>} />
        <Route path="/enroll-student" element={<Layout><EnrollStudent /></Layout>} />
        <Route path="/classes-management" element={<Layout><GroupsTable /></Layout>} />
        <Route path="/group/:groupId" element={<Layout><GroupDetailsPage /></Layout>} />
        <Route path="/lesson-management" element={<Layout><LessonManagement /></Layout>} />
        <Route path="/health-fund-management" element={<Layout><HealthFundManagement /></Layout>} />
        <Route path="/grow-payment-callback" element={<GrowPaymentCallback />} />
        <Route path="/grow-payment-test" element={<Layout><GrowPaymentTest /></Layout>} />
      </Routes>
    </Router>
  );
};

export default Routing;
