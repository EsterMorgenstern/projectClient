import { useSelector } from 'react-redux';
import { isSameDay } from 'date-fns';

export const useCalendarCancellations = () => {
    const { cancellations } = useSelector(state => state.lessonCancellations);
    const { groups } = useSelector(state => state.groups);

    // בדיקה האם יש ביטול לקבוצה מסוימת בתאריך מסוים
    const getCancellationForGroupAndDate = (groupId, date) => {
        return cancellations.find(cancellation => 
            cancellation.groupId === groupId && 
            isSameDay(new Date(cancellation.date), new Date(date))
        );
    };

    // קבלת כל הביטולים לתאריך מסוים
    const getCancellationsForDate = (date) => {
        return cancellations.filter(cancellation => 
            isSameDay(new Date(cancellation.date), new Date(date))
        ).map(cancellation => ({
            ...cancellation,
            group: groups.find(g => g.id === cancellation.groupId)
        }));
    };

    // בדיקה האם תאריך מסוים כולל ביטולים
    const hasAnyCancellationsOnDate = (date) => {
        return cancellations.some(cancellation => 
            isSameDay(new Date(cancellation.date), new Date(date))
        );
    };

    // קבלת מספר הביטולים בתאריך מסוים
    const getCancellationCountForDate = (date) => {
        return cancellations.filter(cancellation => 
            isSameDay(new Date(cancellation.date), new Date(date))
        ).length;
    };

    // קבלת כל הביטולים של קבוצה מסוימת
    const getCancellationsForGroup = (groupId) => {
        return cancellations.filter(cancellation => 
            cancellation.groupId === groupId
        ).map(cancellation => ({
            ...cancellation,
            group: groups.find(g => g.id === groupId)
        }));
    };

    return {
        cancellations,
        groups,
        getCancellationForGroupAndDate,
        getCancellationsForDate,
        hasAnyCancellationsOnDate,
        getCancellationCountForDate,
        getCancellationsForGroup
    };
};
export default useCalendarCancellations;