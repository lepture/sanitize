var keep_tags = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'div', 'p', 'blockquote',
  'ul', 'ol', 'li',
  'pre', 'code',
  'em', 'strong', 'i', 'b',
  'a', 'img', 'hr',
  'table', 'td', 'th', 'tr', 'tbody', 'thead', 'tfoot'
];

var drop_tags = [
  'script', 'noscript', 'style',
  'embed', 'iframe', 'frame',
  'form', 'input', 'textarea', 'button', 'fieldset'
];

var replace_tags = {
  'div': 'p',
  'i': 'em',
  'b': 'strong'
};

var keep_attributes = {
  'a': ['href'],
  'img': ['src', 'width', 'height']
};

var $ = require('jquery');

function sanitize(html) {
  html = cleanEmpty(html);
  var doc = $('<div>').html(html);

  doc.find('*').each(function(i, item) {
    var node = item[0];
    if (!node) {
      return;
    }
    var tag = node.tagName.toLowerCase();
    if (isIn(tag, drop_tags)) {
      item.remove();
    } else if (!isIn(tag, keep_tags)) {
      item.unwrap();
    } else if (replace_tags[tag]) {
      item.replaceWith($('<' + replace_tags[tag] + '>').html(item.html()));
    }
  });
  return doc.html();
}

function cleanEmpty(html) {
  var regex = /<(\w+)[^>]*>\s*<\/\1>/g;
  return html.replace(regex, '');
}

function isIn(key, list) {
  return ~list.indexOf(key.toLowerCase());
}

module.exports = sanitize;
