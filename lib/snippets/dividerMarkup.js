/**
 * Editorial divider markup (keep in sync with components/divider.njk).
 */
module.exports = function dividerMarkup(modifier = '') {
  const modClass = modifier ? ` divider--${modifier}` : '';
  return (
    `<div class="divider${modClass}" role="separator" aria-hidden="true">` +
    '<span class="divider__dot" aria-hidden="true"></span>' +
    '<span class="divider__dot" aria-hidden="true"></span>' +
    '<span class="divider__dot" aria-hidden="true"></span>' +
    '<span class="divider__line" aria-hidden="true"></span>' +
    '</div>'
  );
};
