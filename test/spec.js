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

  it('should replace div with p', function() {
    var ret = sanitize('<div>foo</div> bar')
    assert(ret, '<p>foo</p> bar')
  })

  it('should keep href only', function() {
    var ret = sanitize('<a href="#" name="baz">foo</a> bar')
    assert(ret, '<a href="#">foo</a> bar')
  })

  it('can replace complex html', function() {
    var ret = sanitize('<div>foo <b>bold</b></div>')
    assert(ret, '<p>foo <strong>bold</strong></p>')
  })

})
