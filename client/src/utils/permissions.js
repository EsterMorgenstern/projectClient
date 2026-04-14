export function checkUserPermission(userId, showNotification) {
  if (!userId) {
    if (typeof showNotification === 'function') {
      showNotification('אינך מורשה לבצע פעולה זו, פנה למנהל המערכת', 'error');
    }
    return false;
  }
  return true;
}
