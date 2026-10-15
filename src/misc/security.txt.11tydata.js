const { DateTime } = require('luxon');

module.exports = () => ({
  // RFC 9116 recommends Expires less than one year out.
  expires: DateTime.utc()
    .plus({ days: 364 })
    .startOf('second')
    .toISO({ suppressMilliseconds: true })
});
