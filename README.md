# sanitize

sanitize html for safety.


## Installation

Component install with:

    $ component install lepture/sanitize

SPM install with:

    $ spm install lepture/sanitize

## API

```
var sanitize = require('sanitize')
var html = sanitize('<script>alert('foo')</script><div>bar</div>')
```

## License

MIT
