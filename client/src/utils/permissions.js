export const allowedUserIds = [
  329235618,
  322681008,
  316488626,
  315302117,
  315029371,
  208958256,
  300668381,
  322641572,
  324283993,
  317815033
];

export function checkUserPermission(userId, showNotification) {
  if (!allowedUserIds.includes(Number(userId))) {
    if (typeof showNotification === 'function') {
      showNotification('אינך מורשה לבצע פעולה זו, פנה למנהל המערכת', 'error');
    }
    return false;
  }
  return true;
}
