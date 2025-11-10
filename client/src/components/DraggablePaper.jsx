import React, { useState, useRef, useEffect } from 'react';
import { Paper, Box } from '@mui/material';
import { DragIndicator as DragIndicatorIcon } from '@mui/icons-material';

const DraggablePaper = React.forwardRef((props, ref) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const paperRef = useRef();

  const handleMouseDown = (e) => {
    // בדיקה שהגרירה מתחילה רק מאזור הכותרת או מהאייקון
    const dragHandle = e.target.closest('.drag-handle');
    if (!dragHandle) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  return (
    <Paper 
      {...props} 
      ref={paperRef}
      onMouseDown={handleMouseDown}
      sx={{
        ...props.sx,
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'default',
        position: 'relative'
      }}
    >
      {props.children}
    </Paper>
  );
});

// רכיב אייקון הגרירה שניתן להוסיף לכותרת הדיאלוג
export const DragHandle = ({ sx = {} }) => (
  <Box
    className="drag-handle"
    sx={{
      display: 'flex',
      alignItems: 'center',
      cursor: 'grab',
      '&:active': {
        cursor: 'grabbing'
      },
      '&:hover': {
        opacity: 0.7
      },
      ...sx
    }}
  >
    <DragIndicatorIcon 
      sx={{ 
        fontSize: 20, 
        color: 'rgba(255, 255, 255, 0.8)',
        '&:hover': {
          color: 'rgba(255, 255, 255, 1)'
        }
      }} 
    />
  </Box>
);

export default DraggablePaper;