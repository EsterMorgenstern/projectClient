import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import { Calendar, Settings, BarChart } from '@mui/icons-material';
import LessonCalendar from './components/LessonCalendar';
import LessonCancellationManager from './components/lessonCancell';

const LessonsPage = () => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tab 
                        icon={<Calendar />} 
                        label="לוח שיעורים" 
                        iconPosition="start"
                    />
                    <Tab 
                        icon={<Settings />} 
                        label="ניהול ביטולים" 
                        iconPosition="start"
                    />
                    <Tab 
                        icon={<BarChart />} 
                        label="דוחות" 
                        iconPosition="start"
                    />
                </Tabs>
            </Box>

            {activeTab === 0 && <LessonCalendar />}
            {activeTab === 1 && (
                <LessonCancellationManager
                    open={true}
                    onClose={() => {}}
                    onCancellationUpdate={() => {}}
                />
            )}
            {activeTab === 2 && (
                <Box sx={{ p: 3 }}>
                    <Typography variant="h6">דוחות - בפיתוח</Typography>
                </Box>
            )}
        </Box>
    );
};

export default LessonsPage;
