import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { fetchStudents } from '../store/studentGetAllThunk';
import { fetchCourses } from '../store/CoursesGetAllThunk';
import { useDispatch, useSelector } from 'react-redux';

export default function EntrollStudent() {
  const students = useSelector((state) => state.students.students);
  const courses = useSelector((state) => state.courses.courses);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchStudents());
      await dispatch(fetchCourses());
      setLoading(false);

    };
    fetchData();
  }, []);

  const handleAssign = async () => {
    if (!selectedStudent || !selectedCourse) return;

    try {
      // await axios.post('https://localhost:5000/api/Assign/AssignStudentToCourse', {
      //   studentId: selectedStudent,
      //   courseId: selectedCourse
      // });
      setSuccess(true);
      setSelectedStudent('');
      setSelectedCourse('');
    } catch (error) {
      console.error('Error assigning student to course', error);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <br/><br/>
      <Box sx={{ p: 4, backgroundColor: '#E0F2FE', borderRadius: 3, boxShadow: 6, maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#1E3A8A', textAlign: 'center' }}>
          שיבוץ תלמיד לחוג
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>בחר תלמיד</InputLabel>
              <Select
                value={selectedStudent}
                label="בחר תלמיד"
                onChange={(e) => setSelectedStudent(e.target.value)}
              >
                {students.map((student) => (
                  <MenuItem key={student.id} value={student.id}>
                    {student.firstName} {student.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel>בחר חוג</InputLabel>
              <Select
                value={selectedCourse}
                label="בחר חוג"
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                {courses.map((course) => (
                  <MenuItem key={course.curseId} value={course.courseName}>
                    {course.courseName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              size="large"
               fullWidth
              sx={{
                backgroundColor: '#1E40AF',
                color: '#fff',
                borderRadius: 2,
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#3B82F6'
                }
              }}
              onClick={handleAssign}
            >
              שבץ תלמיד לחוג
            </Button>
          </>
        )}
      </Box>

      <Snackbar
        open={success}
        autoHideDuration={4000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
         ! התלמיד שובץ בהצלחה
        </Alert>
      </Snackbar>
    </motion.div>
  );
}
