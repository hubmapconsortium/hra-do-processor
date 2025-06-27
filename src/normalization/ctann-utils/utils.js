/**
 * Converts various date string formats to "YYYY-MM-DD"
 * @param {string} dateStr - The date string to parse
 * @returns {string} A date string in YYYY-MM-DD format
 * @throws {Error} If the date string is invalid
 */
export function formatCustomDate(dateStr) {
    if (!dateStr || typeof dateStr !== 'string') {
        throw new Error('Invalid input: date string is required');
    }

    let date;

    // Try parsing with Date.parse first
    date = new Date(Date.parse(dateStr));

    // If invalid, try custom formats
    if (isNaN(date.getTime())) {
        // Try DD-MMM-YY format
        const customFormat = /^(\d{1,2})-([A-Za-z]{3})-(\d{2})$/;
        if (customFormat.test(dateStr)) {
            return formatCustomDate(dateStr);
        }
        throw new Error('Unable to parse date string');
    }

    // Format to YYYY-MM-DD
    return date.toISOString().split('T')[0];
}
