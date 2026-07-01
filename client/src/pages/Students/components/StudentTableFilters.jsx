import React from 'react';
import { Box, FormControl, Select, MenuItem, Typography, Divider } from '@mui/material';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import TuneIcon from '@mui/icons-material/Tune';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const selectControlSx = (minWidth = 160) => ({
	minWidth,
	'& .MuiOutlinedInput-root': {
		borderRadius: '10px',
		background: '#fff',
		height: 42,
		fontSize: '0.875rem',
		color: '#0f172a',
		transition: 'box-shadow 0.18s ease',
		'& fieldset': {
			borderColor: '#e2e8f0',
			borderWidth: '1.5px',
			transition: 'border-color 0.18s ease',
		},
		'&:hover fieldset': { borderColor: '#93c5fd' },
		'&.Mui-focused fieldset': { borderColor: '#3b82f6', borderWidth: '2px' },
		'&.Mui-focused': { boxShadow: '0 0 0 3px rgba(59,130,246,0.13)' },
	},
	'& .MuiSelect-select': {
		paddingRight: '14px !important',
		paddingLeft: '32px !important',
		display: 'flex',
		alignItems: 'center',
		gap: '6px',
	},
});

const menuPropsSx = {
	PaperProps: {
		elevation: 4,
		sx: {
			direction: 'rtl',
			textAlign: 'right',
			borderRadius: '12px',
			mt: 0.5,
			boxShadow: '0 8px 30px rgba(0,0,0,0.10)',
			'& .MuiMenuItem-root': {
				fontSize: '0.92rem',
				color: '#1e293b',
				direction: 'rtl',
				textAlign: 'right',
				borderRadius: '6px',
				mx: 0.5,
				'&:hover': { background: '#eff6ff' },
				'&.Mui-selected': { background: '#dbeafe', color: '#1d4ed8', fontWeight: 600 },
				'&.Mui-selected:hover': { background: '#bfdbfe' },
			},
		},
	},
};

const FilterLabel = ({ icon, label, color = '#64748b' }) => (
	<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.75, direction: 'rtl' }}>
		{React.cloneElement(icon, { sx: { fontSize: 15, color } })}
		<Typography sx={{ fontSize: '0.92rem', fontWeight: 600, color: '#475569', letterSpacing: '0.2px', lineHeight: 1 }}>
			{label}
		</Typography>
	</Box>
);

export default function StudentTableFilters({
	createdByFilter, setCreatedByFilter, createdByOptions = [],
	statusFilter, setStatusFilter, statusOptions = [],
	registrationDateFrom, setRegistrationDateFrom,
	registrationDateTo, setRegistrationDateTo
}) {
	return (
		<Box sx={{
			display: 'flex',
			gap: 2,
			direction: 'rtl',
			flexWrap: 'wrap',
			alignItems: 'flex-end',
		}}>

			{/* Date Range Group */}
			<Box sx={{ display: 'flex', flexDirection: 'column', direction: 'rtl' }}>
				<FilterLabel icon={<CalendarMonthOutlinedIcon />} label="תקופת רישום" color="#3b82f6" />
				<Box sx={{
					display: 'flex',
					alignItems: 'center',
					height: 42,
					background: '#fff',
					borderRadius: '10px',
					border: '1.5px solid #e2e8f0',
					overflow: 'hidden',
					transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
					'&:hover': { borderColor: '#93c5fd' },
					'&:focus-within': {
						borderColor: '#3b82f6',
						borderWidth: '2px',
						boxShadow: '0 0 0 3px rgba(59,130,246,0.13)',
					},
				}}>
					<Box sx={{ display: 'flex', alignItems: 'center', px: 1.5, gap: 0.75, height: '100%' }}>
						<Typography sx={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600, whiteSpace: 'nowrap' }}>מ-</Typography>
						<input
							type="date"
							value={registrationDateFrom}
							onChange={e => setRegistrationDateFrom(e.target.value)}
							style={{
								border: 'none',
								outline: 'none',
								background: 'transparent',
								fontSize: '0.88rem',
								fontWeight: 500,
								color: registrationDateFrom ? '#0f172a' : '#94a3b8',
								direction: 'ltr',
								cursor: 'pointer',
								width: 118,
								fontFamily: 'inherit',
							}}
						/>
					</Box>
					<Divider orientation="vertical" flexItem sx={{ borderColor: '#e2e8f0', my: 0.75 }} />
					<Box sx={{ display: 'flex', alignItems: 'center', px: 1.5, gap: 0.75, height: '100%' }}>
						<Typography sx={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600, whiteSpace: 'nowrap' }}>עד-</Typography>
						<input
							type="date"
							value={registrationDateTo}
							onChange={e => setRegistrationDateTo(e.target.value)}
							style={{
								border: 'none',
								outline: 'none',
								background: 'transparent',
								fontSize: '0.88rem',
								fontWeight: 500,
								color: registrationDateTo ? '#0f172a' : '#94a3b8',
								direction: 'ltr',
								cursor: 'pointer',
								width: 118,
								fontFamily: 'inherit',
							}}
						/>
					</Box>
				</Box>
			</Box>

			{/* Status Filter */}
			<Box sx={{ display: 'flex', flexDirection: 'column', direction: 'rtl' }}>
				<FilterLabel icon={<FiberManualRecordIcon />} label="סטטוס" color="#f59e0b" />
				<FormControl sx={selectControlSx(170)}>
					<Select
						value={statusFilter}
						onChange={e => setStatusFilter(e.target.value)}
						displayEmpty
						sx={{ direction: 'rtl', textAlign: 'right' }}
						MenuProps={menuPropsSx}
						renderValue={selected => selected
							? <span style={{ color: '#0f172a', fontWeight: 500 }}>{statusOptions.find(o => o.value === selected)?.label || selected}</span>
							: <span style={{ color: '#94a3b8', fontSize: '0.92rem' }}>סטטוס</span>
						}
					>
						<MenuItem value="" sx={{ color: '#64748b', fontWeight: 500, fontSize: '0.92rem' }}>כל הסטטוסים</MenuItem>
						{statusOptions.map((option) => (
							<MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
						))}
					</Select>
				</FormControl>
			</Box>

			{/* Created By Filter */}
			<Box sx={{ display: 'flex', flexDirection: 'column', direction: 'rtl' }}>
				<FilterLabel icon={<PersonOutlineIcon />} label="נרשם על ידי" color="#8b5cf6" />
				<FormControl sx={selectControlSx(190)}>
					<Select
						value={createdByFilter}
						onChange={e => setCreatedByFilter(e.target.value)}
						displayEmpty
						sx={{ direction: 'rtl', textAlign: 'right' }}
						MenuProps={menuPropsSx}
						renderValue={selected => selected
							? <span style={{ color: '#0f172a', fontWeight: 500 }}>{selected}</span>
							: <span style={{ color: '#94a3b8', fontSize: '0.92rem' }}>נרשם על ידי</span>
						}
					>
						<MenuItem value="" sx={{ color: '#64748b', fontWeight: 500, fontSize: '0.92rem' }}>כל המשתמשים</MenuItem>
						{createdByOptions.map((createdBy) => (
							<MenuItem key={createdBy} value={createdBy}>{createdBy}</MenuItem>
						))}
					</Select>
				</FormControl>
			</Box>

		</Box>
	);
}
