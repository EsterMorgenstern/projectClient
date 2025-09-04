/**
 * פונקציית דיבוג לבדיקת תגובת השרת
 * @param {Response} response - תגובת fetch
 * @returns {Promise<Object>} - נתוני התגובה המפוענחים
 */
export const debugServerResponse = async (response) => {
    console.log('🔍 === DEBUG SERVER RESPONSE ===');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('OK:', response.ok);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    const contentType = response.headers.get('content-type') || '';
    console.log('Content-Type:', contentType);
    
    try {
        // ניסיון לקרוא את התגובה כטקסט תחילה
        const textResponse = await response.text();
        console.log('Raw Response Text:', textResponse);
        
        // ניסיון לפרסר כ-JSON
        if (textResponse) {
            try {
                const jsonData = JSON.parse(textResponse);
                console.log('Parsed JSON:', jsonData);
                return { success: true, data: jsonData, raw: textResponse };
            } catch (jsonError) {
                console.log('JSON Parse Error:', jsonError.message);
                return { success: false, error: 'Invalid JSON', raw: textResponse, jsonError };
            }
        } else {
            console.log('Empty response body');
            return { success: false, error: 'Empty response', raw: '' };
        }
    } catch (error) {
        console.error('Error reading response:', error);
        return { success: false, error: error.message };
    }
};
