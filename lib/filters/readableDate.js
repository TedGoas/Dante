const { DateTime } = require('luxon');

module.exports = (date) =>
  DateTime.fromJSDate(date, { zone: 'utc' }).toFormat('LLL d, yyyy');
