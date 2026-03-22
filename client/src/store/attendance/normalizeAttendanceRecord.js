export const normalizeAttendanceRecord = (record = {}) => ({
  ...record,
  attendanceId: record.attendanceId ?? record.AttendanceId ?? null,
  studentId: record.studentId ?? record.StudentId ?? null,
  lessonId: record.lessonId ?? record.LessonId ?? null,
  dateReport: record.dateReport ?? record.DateReport ?? record.date ?? record.Date ?? null,
  statusReport: record.statusReport ?? record.StatusReport ?? null,
  updateDate: record.updateDate ?? record.UpdateDate ?? null,
  updateBy: record.updateBy ?? record.UpdateBy ?? null,
  healthFundReport: record.healthFundReport ?? record.HealthFundReport ?? null,
  wasPresent: record.wasPresent ?? record.WasPresent ?? false,
});

export const normalizeAttendanceList = (records) => {
  if (!Array.isArray(records)) {
    return [];
  }

  return records.map(normalizeAttendanceRecord);
};