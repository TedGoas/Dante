const { DateTime } = require('luxon');

module.exports = (date) => {
  // Handle null/undefined dates
  if (!date) {
    return 'Invalid DateTime';
  }

  try {
    // If it's already a Date object, use it directly
    if (date instanceof Date) {
              return DateTime.fromJSDate(date, { zone: 'utc' }).toFormat('LLL d, yyyy');
    }
    
    // If it's a string, try to parse it
    if (typeof date === 'string') {
      const parsedDate = DateTime.fromISO(date, { zone: 'utc' });
      if (parsedDate.isValid) {
        return parsedDate.toFormat('LLL d, yyyy');
      }
    }
    
    // If it's a number (timestamp), try to parse it
    if (typeof date === 'number') {
      const parsedDate = DateTime.fromMillis(date, { zone: 'utc' });
      if (parsedDate.isValid) {
        return parsedDate.toFormat('LLL d, yyyy');
      }
    }
    
    return 'Invalid DateTime';
  } catch (error) {
    return 'Invalid DateTime';
  }
};
