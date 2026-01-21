import React from 'react';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, Box, Tooltip } from '@mui/material';
import { ArrowUpward as ArrowUpIcon, ArrowDownward as ArrowDownIcon } from '@mui/icons-material';

const headerCellStyle = {
  color: 'white',
  fontWeight: 'bold',
  fontSize: '0.98rem',
  py: 2.5,
  px: 2,
  borderBottom: '2px solid rgba(255,255,255,0.1)',
  whiteSpace: 'nowrap'
};

// עיצוב ספציפי לעמודת פעולות
const actionHeaderStyle = {
  ...headerCellStyle,
  minWidth: '150px'
};

const StyledTableShell = ({ 
  headers = [], 
  children, 
  enableHorizontalScroll = false,
  enableSort = false,
  onSort = null,
  sortField = '',
  sortDirection = 'asc'
}) => {
  
  const handleHeaderClick = (header) => {
    if (enableSort && onSort && header.sortable !== false) {
      onSort(header.field || header.label);
    }
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 3,
        overflow: enableHorizontalScroll ? 'auto' : 'hidden',
        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
        '&::-webkit-scrollbar': enableHorizontalScroll ? {
          height: '8px',
          backgroundColor: '#f1f5f9'
        } : {},
        '&::-webkit-scrollbar-thumb': enableHorizontalScroll ? {
          backgroundColor: '#cbd5e1',
          borderRadius: '4px',
          '&:hover': {
            backgroundColor: '#94a3b8'
          }
        } : {},
        scrollBehavior: 'smooth'
      }}
    >
      <Table sx={{
        '& tbody tr': {
          minHeight: '56px !important',
          height: '56px !important'
        },
        '& tbody td': {
          minHeight: '56px !important',
          height: '56px !important',
          verticalAlign: 'middle !important',
          textAlign: 'center',
          padding: '12px 8px !important'
        },
        '& .MuiTableBody-root .MuiTableRow-root': {
          minHeight: '56px !important',
          height: '56px !important'
        },
        '& .MuiTableBody-root .MuiTableCell-root': {
          minHeight: '56px !important',
          height: '56px !important',
          verticalAlign: 'middle !important',
          textAlign: 'center',
          padding: '12px 8px !important'
        },
        '& .action-button svg': {
          fontSize: '1.4rem !important'
        }
      }}>
        <TableHead>
          <TableRow sx={{ 
            background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
          
          }}>
            {headers.map((header, idx) => {
              const isActionsColumn = header.label === 'פעולות';
              const cellStyle = isActionsColumn ? actionHeaderStyle : headerCellStyle;
              const isSortable = enableSort && header.sortable !== false;
              const isCurrentSort = sortField === (header.field || header.label);
              
              const cellContent = (
                <TableCell
                  key={`${header.label}-${idx}`}
                  align={header.align || 'right'}
                  sx={{ 
                    ...cellStyle, 
                    ...(header.sx || {}),
                    cursor: isSortable ? 'pointer' : 'default',
                    userSelect: 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': isSortable ? {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'scale(1.02)'
                    } : {}
                  }}
                  onClick={() => handleHeaderClick(header)}
                >
                  {header.icon ? (
                    <Box sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 0.25 }}>
                      <span style={{ lineHeight: 0, fontSize: '1.4em' }}>{header.icon}</span>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <span>{header.label}</span>
                        {isSortable && (
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <ArrowUpIcon 
                              sx={{ 
                                fontSize: '12px',
                                color: isCurrentSort && sortDirection === 'asc' ? '#fff' : 'rgba(255, 255, 255, 0.4)',
                                transition: 'color 0.2s ease'
                              }} 
                            />
                            <ArrowDownIcon 
                              sx={{ 
                                fontSize: '12px',
                                color: isCurrentSort && sortDirection === 'desc' ? '#fff' : 'rgba(255, 255, 255, 0.4)',
                                transition: 'color 0.2s ease',
                                mt: -0.5
                              }} 
                            />
                          </Box>
                        )}
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                      <span>{header.label}</span>
                      {isSortable && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <ArrowUpIcon 
                            sx={{ 
                              fontSize: '12px',
                              color: isCurrentSort && sortDirection === 'asc' ? '#fff' : 'rgba(255, 255, 255, 0.4)',
                              transition: 'color 0.2s ease'
                            }} 
                          />
                          <ArrowDownIcon 
                            sx={{ 
                              fontSize: '12px',
                              color: isCurrentSort && sortDirection === 'desc' ? '#fff' : 'rgba(255, 255, 255, 0.4)',
                              transition: 'color 0.2s ease',
                              mt: -0.5
                            }} 
                          />
                        </Box>
                      )}
                    </Box>
                  )}
                </TableCell>
              );

              return isSortable ? (
                <Tooltip
                  key={`${header.label}-${idx}`}
                  title={`לחץ למיון לפי ${header.label} ${isCurrentSort ? (sortDirection === 'asc' ? '(יורד)' : '(עולה)') : ''}`}
                  placement="top"
                  arrow
                  sx={{
                    '& .MuiTooltip-tooltip': {
                      bgcolor: 'rgba(30, 41, 59, 0.9)',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      borderRadius: '8px'
                    }
                  }}
                >
                  {cellContent}
                </Tooltip>
              ) : cellContent;
            })}
          </TableRow>
        </TableHead>
        {children}
      </Table>
    </TableContainer>
  );
};

export default StyledTableShell;
