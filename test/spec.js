describe('sanitize', function() {
  var sanitize = require('sanitize')

  function assert(a, b) {
    if (a !== b) {
      throw new Error(a + ' not equal ' + b)
    }
  }

  it('should has no script', function() {
    var ret = sanitize('<script>foo</script>bar')
    assert(ret, 'bar')
  })

  it('should unwrap span', function() {
    var ret = sanitize('<span>foo</span> bar')
    assert(ret, 'foo bar')
  })

  it('should replace i with em', function() {
    var ret = sanitize('<i>foo</i> bar')
    assert(ret, '<em>foo</em> bar')
  })

  it('should keep href only', function() {
    var ret = sanitize('<a href="#" name="baz">foo</a> bar')
    assert(ret, '<a href="#">foo</a> bar')
  })

  it('can replace complex html', function() {
    var ret = sanitize('<i>foo <b>bold</b></i>')
    assert(ret, '<em>foo <strong>bold</strong></em>')
  })

  it('should remove blank tags', function() {
    var ret = sanitize('<i>foo <b>bold</b><p></p></i>')
    assert(ret, '<em>foo <strong>bold</strong></em>')
  });

  it('can handle nested error html', function() {
    var code = [
      '<div>foo <p class="foo">foo <p class="bar">bar</p></p>',
      '<a href="#">anchor</a>',
      '<pre><code><script> script</code></script></pre>',
      '<div><span><p></p><i>italic</i>'
    ].join('');
    console.log(sanitize(code));
  });

})
