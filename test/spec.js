describe('sanitize', function() {
  var cases = ['a', 'b']

  var sanitize = require('sanitize')

  function assert(a, b) {
    if (a !== b) {
      throw new Error(a + ' not equal ' + b)
    }
  }

  function notContain(a, b) {
    if (a.indexOf(b) !== -1) {
      throw new Error(b + ' is in\n' + a);
    }
  }

  function xhr(url, callback) {
    var r = new XMLHttpRequest()
    r.open('GET', url, true)
    r.onload = function() {
      callback(r.responseText)
    }
    r.send(null)
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
    var ret = sanitize('<a href="#" name="baz" class="baz" style="foo">foo</a> bar')
    assert(ret, '<a href="#">foo</a> bar')
  })

  it('can replace complex html', function() {
    var ret = sanitize('<i>foo <b>bold</b></i>')
    assert(ret, '<em>foo <strong>bold</strong></em>')
  })

  it('should remove blank tags', function() {
    var ret = sanitize('<i>foo <b>bold</b><p></p></i>')
    assert(ret, '<em>foo <strong>bold</strong></em>')
  })

  it('can handle nested error html', function() {
    var code = [
      '<div>foo <p class="foo">foo <p class="bar">bar</p></p>',
      '<a href="#">anchor</a>',
      '<pre><code><script> script</code></script></pre>',
      '<div><span><p></p><i>italic</i>'
    ].join('')
    var ret = sanitize(code)
    notContain(ret, 'class');
  })

  cases.forEach(function(name) {

    it('can sanitize ' + name + '.html', function(done) {
      xhr('./cases/' + name + '.html', function(text) {
        var ret = sanitize(text)
        notContain(ret, 'color');
        done()
      })
    })

  })

})
