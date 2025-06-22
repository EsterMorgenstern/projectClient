// קביעת ה-API URL בהתאם לסביבה
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_API_URL || 'https://api.coursenet.nethost.co.il/api'
  : 'http://localhost:5248/api';

export default API_BASE_URL;
