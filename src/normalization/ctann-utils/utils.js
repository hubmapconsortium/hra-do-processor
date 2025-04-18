/**
 * Converts a date string in the format "DD-MMM-YY" to "YYYY-MM-DD"
 * @param {string} dateStr - The date string to parse (e.g., "15-Jun-24")
 * @returns {string} A date string in YYYY-MM-DD format
 * @throws {Error} If the date string is invalid or improperly formatted
 */
export function formatCustomDate(dateStr) {
  // Input validation
  if (!dateStr || typeof dateStr !== 'string') {
      throw new Error('Invalid input: date string is required');
  }

  // Define month abbreviations
  const months = {
      'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04', 
      'may': '05', 'jun': '06', 'jul': '07', 'aug': '08', 
      'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
  };

  // Split the date string
  const parts = dateStr.split('-');
  if (parts.length !== 3) {
      throw new Error('Invalid date format: expected DD-MMM-YY');
  }

  const day = parseInt(parts[0], 10);
  const monthStr = parts[1].toLowerCase();
  let year = parseInt(parts[2], 10);

  // Validate parts
  if (isNaN(day) || day < 1 || day > 31) {
      throw new Error('Invalid day: must be between 1 and 31');
  }

  if (!months.hasOwnProperty(monthStr)) {
      throw new Error('Invalid month abbreviation');
  }

  // Handle two-digit year
  if (year < 100) {
      year += year < 70 ? 2000 : 1900;
  }

  // Validate the date by creating a Date object
  const date = new Date(year, parseInt(months[monthStr], 10) - 1, day);
  if (isNaN(date.getTime())) {
      throw new Error('Invalid date combination');
  }

  // Format the day with leading zero if needed
  const formattedDay = day.toString().padStart(2, '0');
  
  // Return formatted date string
  return `${year}-${months[monthStr]}-${formattedDay}`;
}