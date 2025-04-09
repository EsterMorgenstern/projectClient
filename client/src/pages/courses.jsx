import { Box, Typography, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';

const coursesColumns = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'courseName', headerName: 'שם החוג', width: 250 },
  { field: 'schedule', headerName: 'מועד', width: 200 },
  { field: 'instructor', headerName: 'מדריך', width: 200 },
  { field: 'actions', headerName: 'פעולות', width: 150, renderCell: (params) => (
    <Button variant="outlined" color="primary" size="small" onClick={() => handleEdit(params.row)}>
      ערוך
    </Button>
  )},
];

const coursesRows = [
  { id: 1, courseName: 'פיתוח אתרים', schedule: 'ראשון 10:00', instructor: 'דני רוזן' },
  { id: 2, courseName: 'עיצוב גרפי', schedule: 'שלישי 14:00', instructor: 'מיה גולן' },
  // דוגמאות נוספות
];

const handleEdit = (row) => {
  console.log('Edit course:', row);
};

const Courses = () => {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3, padding: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
        ניהול חוגים
      </Typography>

      <Box sx={{ height: '80vh', width: '100%' }}>
        <DataGrid
          rows={coursesRows}
          columns={coursesColumns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          sx={{
            boxShadow: 2,
            borderRadius: '10px',
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: '#f5f5f5',
            },
          }}
        />
      </Box>

      <Button
        component={Link}
        to="/courses/new"
        variant="contained"
        color="primary"
        size="large"
        sx={{
          borderRadius: '20px',
          fontSize: '18px',
          marginTop: '20px',
          padding: '10px 20px',
        }}
      >
        הוסף חוג חדש
      </Button>
    </Box>
  );
};

export default Courses;
