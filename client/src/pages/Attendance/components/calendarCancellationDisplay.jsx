import React from 'react';
import { Box, Typography, Chip, Tooltip } from '@mui/material';
import { Cancel, Event } from '@mui/icons-material';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

const CalendarCancellationDisplay = ({ 
    cancellation, 
    group, 
    isCompact = false, 
    showGroupName = true,
    showDate = false 
}) => {
    if (!cancellation) return null;

    const formatDate = (date) => {
        try {
            return format(new Date(date), 'dd/MM', { locale: he });
        } catch (error) {
            return 'תאריך לא תקין';
        }
    };

    if (isCompact) {
        return (
            <Tooltip 
                title={
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                            ביטול שיעור
                        </Typography>
                        {showGroupName && group && (
                            <Typography variant="caption" sx={{ display: 'block' }}>
                                קבוצה: {group.groupName || group.name}
                            </Typography>
                        )}
                        {showDate && (
                            <Typography variant="caption" sx={{ display: 'block' }}>
                                תאריך: {formatDate(cancellation.date)}
                            </Typography>
                        )}
                        <Typography variant="caption" sx={{ display: 'block' }}>
                            סיבה: {cancellation.reason}
                        </Typography>
                        {cancellation.created_by && (
                            <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                                נוצר על ידי: {cancellation.created_by}
                            </Typography>
                        )}
                    </Box>
                }
                arrow
                placement="top"
            >
                <Box
                    sx={{
                        p: 0.5,
                        mb: 0.5,
                        bgcolor: '#DC2626',
                        color: 'white',
                        borderRadius: 1,
                        fontSize: '0.7rem',
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.5,
                        border: '1px solid #B91C1C',
                        cursor: 'help'
                    }}
                >
                    <Cancel sx={{ fontSize: '0.8rem' }} />
                    {showGroupName && group ? (
                        <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
                            {group.groupName || group.name} - בוטל
                        </Typography>
                    ) : (
                        <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
                            בוטל
                        </Typography>
                    )}
                </Box>
            </Tooltip>
        );
    }

    // תצוגה מלאה
    return (
        <Box
            sx={{
                p: 2,
                mb: 2,
                bgcolor: 'rgba(220, 38, 38, 0.05)',
                border: '1px solid rgba(220, 38, 38, 0.2)',
                borderRadius: 2,
                borderRight: '4px solid #DC2626'
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Cancel sx={{ color: '#DC2626', fontSize: 20 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#DC2626' }}>
                    שיעור בוטל
                </Typography>
                {showDate && (
                    <Chip
                        label={formatDate(cancellation.date)}
                        size="small"
                        color="error"
                        variant="outlined"
                    />
                )}
            </Box>

            {showGroupName && group && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>קבוצה:</strong> {group.groupName || group.name}
                </Typography>
            )}

            <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>סיבת הביטול:</strong> {cancellation.reason}
            </Typography>

            {cancellation.created_by && (
                <Typography variant="caption" color="text.secondary">
                    נוצר על ידי: {cancellation.created_by}
                </Typography>
            )}

            {cancellation.created_at && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    נוצר: {format(new Date(cancellation.created_at), 'dd/MM/yyyy HH:mm', { locale: he })}
                </Typography>
            )}
        </Box>
    );
};

export default CalendarCancellationDisplay;
