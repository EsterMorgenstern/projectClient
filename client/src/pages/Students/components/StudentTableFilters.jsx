import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function StudentTableFilters({
	createdByFilter, setCreatedByFilter, createdByOptions = [],
	statusFilter, setStatusFilter, statusOptions = [],
	registrationDateFrom, setRegistrationDateFrom,
	registrationDateTo, setRegistrationDateTo
}) {
	return (
		<Box sx={{ display: 'flex', gap: 2, direction: 'rtl', flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
			{/* Created By Filter */}
			<FormControl size="small" sx={{
				minWidth: 220,
				direction: 'rtl',
				background: '#f7fafd',
				borderRadius: '14px',
				boxShadow: '0 1px 4px 0 rgba(60, 60, 60, 0.04)',
				'& .MuiOutlinedInput-root': {
					borderRadius: '14px',
					background: 'inherit',
					'& fieldset': {
						borderColor: '#b6c6e3',
					},
					'&:hover fieldset': {
						borderColor: '#1976d2',
					},
				},
			}}>
				<Select
					value={createdByFilter}
					onChange={e => setCreatedByFilter(e.target.value)}
					displayEmpty
					sx={{ direction: 'rtl', textAlign: 'right', pt: 0, pb: 0, minHeight: 40 }}
					MenuProps={{
						PaperProps: {
							sx: { direction: 'rtl', textAlign: 'right' }
						}
					}}
					renderValue={selected => selected || <span style={{ color: '#bdbdbd' }}>נרשם על ידי</span>}
				>
					<MenuItem value="" sx={{ color: '#7b8ca7', fontWeight: 500 }}>כל המשתמשים</MenuItem>
					{createdByOptions.map((createdBy) => (
						<MenuItem key={createdBy} value={createdBy} sx={{ direction: 'rtl', textAlign: 'right', color: '#222', fontWeight: 400 }}>{createdBy}</MenuItem>
					))}
				</Select>
			</FormControl>

			{/* Status Filter */}
			<FormControl size="small" sx={{
				minWidth: 180,
				direction: 'rtl',
				background: '#f7fafd',
				borderRadius: '14px',
				boxShadow: '0 1px 4px 0 rgba(60, 60, 60, 0.04)',
				'& .MuiOutlinedInput-root': {
					borderRadius: '14px',
					background: 'inherit',
					'& fieldset': {
						borderColor: '#b6c6e3',
					},
					'&:hover fieldset': {
						borderColor: '#1976d2',
					},
				},
			}}>
				<Select
					value={statusFilter}
					onChange={e => setStatusFilter(e.target.value)}
					displayEmpty
					sx={{ direction: 'rtl', textAlign: 'right', pt: 0, pb: 0, minHeight: 40 }}
					MenuProps={{
						PaperProps: {
							sx: { direction: 'rtl', textAlign: 'right' }
						}
					}}
					renderValue={selected => selected || <span style={{ color: '#bdbdbd' }}>סטטוס</span>}
				>
					<MenuItem value="" sx={{ color: '#7b8ca7', fontWeight: 500 }}>כל הסטטוסים</MenuItem>
					{statusOptions.map((option) => (
						<MenuItem key={option.value} value={option.value} sx={{ direction: 'rtl', textAlign: 'right', color: '#222', fontWeight: 400 }}>{option.label}</MenuItem>
					))}
				</Select>
			</FormControl>

			{/* Registration Date From */}
			<TextField
				label="מתאריך רישום"
				type="date"
				size="small"
				InputLabelProps={{
					shrink: true,
					sx: {
						right: 0,
						left: 'unset',
						textAlign: 'right',
						direction: 'rtl',
						transformOrigin: 'top right',
						marginRight: '26px',
						color: '#1976d2',
						fontWeight: 600,
					}
				}}
				inputProps={{ style: { textAlign: 'right', direction: 'rtl', fontWeight: 500, color: '#222' } }}
				value={registrationDateFrom}
				onChange={e => setRegistrationDateFrom(e.target.value)}
				sx={{
					minWidth: 180,
					background: '#f7fafd',
					borderRadius: '14px',
					boxShadow: '0 1px 4px 0 rgba(60, 60, 60, 0.04)',
					'& .MuiOutlinedInput-root': {
						borderRadius: '14px',
						background: 'inherit',
						'& fieldset': {
							borderColor: '#b6c6e3',
						},
						'&:hover fieldset': {
							borderColor: '#1976d2',
						},
					},
					'& input::placeholder': {
						color: '#7b8ca7',
						fontWeight: 400,
					},
					'& .MuiOutlinedInput-notchedOutline': { textAlign: 'right' },
					'& legend': { textAlign: 'right', direction: 'rtl', marginRight: 0, marginLeft: 'auto' },
				}} 
			/>

			{/* Registration Date To */}
			<TextField
				label="עד תאריך רישום"
				type="date"
				size="small"
				InputLabelProps={{
					shrink: true,
					sx: {
						right: 0,
						left: 'unset',
						textAlign: 'right',
						direction: 'rtl',
						transformOrigin: 'top right',
						marginRight: '26px',
						color: '#1976d2',
						fontWeight: 600,
					}
				}}
				inputProps={{ style: { textAlign: 'right', direction: 'rtl', fontWeight: 500, color: '#222' } }}
				value={registrationDateTo}
				onChange={e => setRegistrationDateTo(e.target.value)}
				sx={{
					minWidth: 180,
					background: '#f7fafd',
					borderRadius: '14px',
					boxShadow: '0 1px 4px 0 rgba(60, 60, 60, 0.04)',
					'& .MuiOutlinedInput-root': {
						borderRadius: '14px',
						background: 'inherit',
						'& fieldset': {
							borderColor: '#b6c6e3',
						},
						'&:hover fieldset': {
							borderColor: '#1976d2',
						},
					},
					'& input::placeholder': {
						color: '#7b8ca7',
						fontWeight: 400,
					},
					'& .MuiOutlinedInput-notchedOutline': { textAlign: 'right' },
					'& legend': { textAlign: 'right', direction: 'rtl', marginRight: 0, marginLeft: 'auto' },
				}} 
			/>
		</Box>
	);
}
