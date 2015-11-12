var test     = require('tape')
var rewire   = require('rewire')
var lib      = rewire('./src')
var locale2  = lib.locale2

test('locale2 is a string', function (t) {
  t.plan(1)
  lib.__with__({
    global: {
      clientInformation: {
        language: 'en-00'
      }
    }
  })(function() {
    t.equal(typeof locale2(), 'string')
    t.end()
  })
})

test('locale2 can force a locale', function (t) {
  t.plan(1)
  t.equal(locale2('en-11'), 'en-11')
  t.end()
})

test('locale2 can detect from...', function (subtest) {
  subtest.test('...clientInformation.language', function (t) {
    t.plan(1)
    lib.__with__({
      global: {
        clientInformation: {
          language: 'en-AA'
        }
      }
    })(function() {
      t.equal(locale2(), 'en-AA')
      t.end()
    })
  })

  subtest.test('...navigator.language', function (t) {
    t.plan(1)
    lib.__with__({
      global: {
        navigator: {
          language: 'en-BB'
       }
     }
    })(function() {
      t.equal(locale2(), 'en-BB')
      t.end()
    })
  })

  subtest.test('...navigator.userLanguage', function (t) {
    t.plan(1)
    lib.__with__({
      global: {
        clientInformation: {
          language: 'en-CC'
        }
      }
    })(function () {
      t.equal(locale2(), 'en-CC')
      t.end()
    })
  })

  subtest.test('...navigator.languages', function (t) {
    t.plan(1)
    lib.__with__({
      global: {
        navigator: {
          languages: ['en-DD', 'en']
        }
      }
    })(function () {
      t.equal(locale2(), 'en-DD')
      t.end()
    })
  })

  subtest.test('...navigator.userAgent', function (t) {
    t.plan(1)
    lib.__with__({
      global: {
        navigator: {
          userAgent: 'Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-EE) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b Safari/531.21.10'
        }
      }
    })(function () {
      t.equal(locale2(), 'en-EE')
      t.end()
    })
  })

  subtest.skip('...process.env.LANG', function (t) {
    t.plan(1)
    lib.__with__({
      process: {
        env: {
          LANGUAGE: 'en_FF.UTF-8',
        }
      }
    })(function () {
      t.equal(locale2(), 'en-FF')
      t.end()
    })
  })

  subtest.test('...Intl.DateTimeFormat', function (t) {
    t.plan(1)
    lib.__with__({
      global: {
        Intl: {
          DateTimeFormat: function () {
            return {
              resolved: {
                locale: 'en-GG'
              }
            }
          }
        }
      }
    })(function () {
      t.equal(locale2(), 'en-GG')
      t.end()
    })
  })
})