import { Box, Typography, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';

const assignmentsColumns = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'student', headerName: 'שם תלמיד', width: 200 },
  { field: 'course', headerName: 'חוג', width: 200 },
  { field: 'actions', headerName: 'פעולות', width: 150, renderCell: (params) => (
    <Button variant="outlined" color="primary" size="small" onClick={() => handleAssign(params.row)}>
      שיבוץ
    </Button>
  )},
];

const assignmentsRows = [
  { id: 1, student: 'יואב כהן', course: 'פיתוח אתרים' },
  { id: 2, student: 'שרה לוי', course: 'סייבר' },
  // דוגמאות נוספות
];

const handleAssign = (row) => {
  console.log('Assign student to course:', row);
};

const Assignments = () => {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3, padding: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
        שיבוץ תלמידים לחוגים
      </Typography>

      <Box sx={{ height: '80vh', width: '100%' }}>
        <DataGrid
          rows={assignmentsRows}
          columns={assignmentsColumns}
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
        to="/assignments/new"
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
        שיבוץ תלמידים
      </Button>
    </Box>
  );
};

export default Assignments;
