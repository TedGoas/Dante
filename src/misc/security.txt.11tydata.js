const { DateTime } = require('luxon');

module.exports = () => ({
  expires: DateTime.utc().plus({ years: 1 }).toISO({ suppressMilliseconds: true })
});
