import { useSelector } from 'react-redux';
import { isSameDay } from 'date-fns';

export const useCalendarCancellations = () => {
    const { canceledLessons: cancellations = [] } = useSelector(state => state.lessons || {});
    const { completionLessons = [] } = useSelector(state => state.lessons || {});
    const { groups } = useSelector(state => state.groups);

    const getLessonDate = (lesson) => lesson?.lessonDate || lesson?.date || lesson?.LessonDate;
    const getLessonGroupId = (lesson) => lesson?.groupId || lesson?.GroupId;

    // בדיקה האם יש ביטול לקבוצה מסוימת בתאריך מסוים
    const getCancellationForGroupAndDate = (groupId, date) => {
        return cancellations.find(cancellation => 
            getLessonGroupId(cancellation) === groupId && 
            isSameDay(new Date(getLessonDate(cancellation)), new Date(date))
        );
    };

    // בדיקה האם יש שיעור השלמה לקבוצה מסוימת בתאריך מסוים
    const getCompletionForGroupAndDate = (groupId, date) => {
        return completionLessons.find(lesson =>
            getLessonGroupId(lesson) === groupId &&
            isSameDay(new Date(getLessonDate(lesson)), new Date(date))
        );
    };

    // קבלת כל הביטולים לתאריך מסוים
    const getCancellationsForDate = (date) => {
        return cancellations.filter(cancellation => 
            isSameDay(new Date(getLessonDate(cancellation)), new Date(date))
        ).map(cancellation => ({
            ...cancellation,
            group: groups.find(g => g.groupId === getLessonGroupId(cancellation))
        }));
    };

    const getCompletionsForDate = (date) => {
        return completionLessons.filter(lesson =>
            isSameDay(new Date(getLessonDate(lesson)), new Date(date))
        );
    };

    // בדיקה האם תאריך מסוים כולל ביטולים
    const hasAnyCancellationsOnDate = (date) => {
        return cancellations.some(cancellation => 
            isSameDay(new Date(getLessonDate(cancellation)), new Date(date))
        );
    };

    // קבלת מספר הביטולים בתאריך מסוים
    const getCancellationCountForDate = (date) => {
        return cancellations.filter(cancellation => 
            isSameDay(new Date(getLessonDate(cancellation)), new Date(date))
        ).length;
    };

    const getCompletionCountForDate = (date) => {
        return completionLessons.filter(lesson =>
            isSameDay(new Date(getLessonDate(lesson)), new Date(date))
        ).length;
    };

    // קבלת כל הביטולים של קבוצה מסוימת
    const getCancellationsForGroup = (groupId) => {
        return cancellations.filter(cancellation => 
            getLessonGroupId(cancellation) === groupId
        ).map(cancellation => ({
            ...cancellation,
            group: groups.find(g => g.groupId === groupId)
        }));
    };

    return {
        cancellations,
        groups,
        getCancellationForGroupAndDate,
        getCompletionForGroupAndDate,
        getCancellationsForDate,
        getCompletionsForDate,
        hasAnyCancellationsOnDate,
        getCancellationCountForDate,
        getCompletionCountForDate,
        getCancellationsForGroup
    };
};
export default useCalendarCancellations;