import { DataGrid } from "@mui/x-data-grid";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useState } from "react";
const rr = [
  { id: 1, fullName: "דוד כהן", email: "david@example.com" },
  { id: 2, fullName: "רונית לוי", email: "ronit@example.com" },
];  

export default function AnimatedTable() {


  const [rows, setRows] = useState(rr);
  const [open, setOpen] = useState(false);
  const [currentInstructor, setCurrentInstructor] = useState({ id: null, fullName: "", email: "" });

  const handleSave = () => {
    if (currentInstructor.id) {
      setRows(rows.map(row => row.id === currentInstructor.id ? currentInstructor : row));
    } else {
      setRows([...rows, { ...currentInstructor, id: rows.length + 1 }]);
    }
    setOpen(false);
  };

  const handleDelete = (id) => {
    setRows(rows.filter(row => row.id !== id));
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "fullName", headerName: "שם מלא", width: 200 },
    { field: "email", headerName: "אימייל", width: 250 },
    {
      field: "actions",
      headerName: "פעולות",
      width: 200,
      renderCell: (params) => (
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button onClick={() => { setCurrentInstructor(params.row); setOpen(true); }}>
            <Edit color="primary" />
          </Button>
          <Button onClick={() => handleDelete(params.row.id)}>
            <Delete color="error" />
          </Button>
        </motion.div>
      ),
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Button
        startIcon={<Add />}
        variant="contained"
        color="primary"
        onClick={() => { setCurrentInstructor({ id: null, fullName: "", email: "" }); setOpen(true); }}
        component={motion.button}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        הוסף מדריך
      </Button>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        sx={{
          borderRadius: 2,
          boxShadow: 3,
          "& .MuiDataGrid-cell": { transition: "all 0.3s ease-in-out" },
          "& .MuiDataGrid-cell:hover": { backgroundColor: "#f5f5f5" },
          backgroundColor: "background.paper",
        }}
      />

      <Dialog open={open} onClose={() => setOpen(false)} component={motion.div} initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
        <DialogTitle>{currentInstructor.id ? "ערוך מדריך" : "הוסף מדריך"}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="שם מלא" value={currentInstructor.fullName} onChange={(e) => setCurrentInstructor({ ...currentInstructor, fullName: e.target.value })} />
          <TextField fullWidth label="אימייל" value={currentInstructor.email} onChange={(e) => setCurrentInstructor({ ...currentInstructor, email: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>ביטול</Button>
          <Button onClick={handleSave} variant="contained" color="primary">שמור</Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
}
