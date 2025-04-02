import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";
import axios from "axios";

// const API_URL = "http://localhost:5000/api/instructors";

const InstructorsTable=() =>{
   const [instructors, setInstructors] = useState([]);
   const [open, setOpen] = useState(false);
   const [currentInstructor, setCurrentInstructor] = useState({ id: null, fullName: "", email: "" });

  // useEffect(() => {
  //   fetchInstructors();
  // }, []);

  // const fetchInstructors = async () => {
  //   const response = await axios.get(API_URL);
  //   setInstructors(response.data);
  // };

  // const handleSave = async () => {
  //   if (currentInstructor.id) {
  //     await axios.put(`${API_URL}/${currentInstructor.id}`, currentInstructor);
  //   } else {
  //     await axios.post(API_URL, currentInstructor);
  //   }
  //   fetchInstructors();
  //   setOpen(false);
  // };

  // const handleDelete = async (id) => {
  //   await axios.delete(`${API_URL}/${id}`);
  //   fetchInstructors();
  // };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "fullName", headerName: "שם מלא", width: 200 },
    { field: "email", headerName: "אימייל", width: 250 },
    {
      field: "actions",
      headerName: "פעולות",
      width: 200,
      // renderCell: (params) => (
      //   <>
      //     <Button onClick={() => { setCurrentInstructor(params.row); setOpen(true); }}>
      //       <Edit color="primary" />
      //     </Button>
      //     <Button onClick={() => handleDelete(params.row.id)}>
      //       <Delete color="error" />
      //     </Button>
      //   </>/
      // ),
    },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <Button startIcon={<Add />} variant="contained" color="primary" onClick={() => { setCurrentInstructor({ id: null, fullName: "", email: "" }); setOpen(true); }}>
        הוסף מדריך
      </Button>
      <DataGrid rows={instructors} columns={columns} pageSize={5} />
      
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{currentInstructor.id ? "ערוך מדריך" : "הוסף מדריך"}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="שם מלא" value={currentInstructor.fullName} onChange={(e) => setCurrentInstructor({ ...currentInstructor, fullName: e.target.value })} />
          <TextField fullWidth label="אימייל" value={currentInstructor.email} onChange={(e) => setCurrentInstructor({ ...currentInstructor, email: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>ביטול</Button>
          {/* <Button onClick={handleSave} variant="contained" color="primary">שמור</Button> */}
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default InstructorsTable;
