describe('hx-disabled-elt attribute', function() {
  beforeEach(function() {
    this.server = sinon.fakeServer.create()
    clearWorkArea()
  })
  afterEach(function() {
    this.server.restore()
    clearWorkArea()
  })

  it('single element can be disabled w/ hx-disabled elts', function() {
    this.server.respondWith('GET', '/test', 'Clicked!')
    const btn = make('<button hx-get="/test" hx-disabled-elt="this">Click Me!</button>')
    btn.hasAttribute('disabled').should.equal(false)
    btn.click()
    btn.hasAttribute('disabled').should.equal(true)
    this.server.respond()
    btn.hasAttribute('disabled').should.equal(false)
  })

  it('single element can be disabled w/ data-hx-disabled elts', function() {
    this.server.respondWith('GET', '/test', 'Clicked!')
    const btn = make('<button hx-get="/test" data-hx-disabled-elt="this">Click Me!</button>')
    btn.hasAttribute('disabled').should.equal(false)
    btn.click()
    btn.hasAttribute('disabled').should.equal(true)
    this.server.respond()
    btn.hasAttribute('disabled').should.equal(false)
  })

  it('single element can be disabled w/ closest syntax', function() {
    this.server.respondWith('GET', '/test', 'Clicked!')
    const fieldset = make('<fieldset><button id="b1" hx-get="/test" hx-disabled-elt="closest fieldset">Click Me!</button></fieldset>')
    const btn = byId('b1')
    fieldset.hasAttribute('disabled').should.equal(false)
    btn.click()
    fieldset.hasAttribute('disabled').should.equal(true)
    this.server.respond()
    fieldset.hasAttribute('disabled').should.equal(false)
  })

  it('multiple requests with same disabled elt are handled properly', function() {
    this.server.respondWith('GET', '/test', 'Clicked!')
    const b1 = make('<button hx-get="/test" hx-disabled-elt="#b3">Click Me!</button>')
    const b2 = make('<button hx-get="/test" hx-disabled-elt="#b3">Click Me!</button>')
    const b3 = make('<button id="b3">Demo</button>')
    b3.hasAttribute('disabled').should.equal(false)

    b1.click()
    b3.hasAttribute('disabled').should.equal(true)

    b2.click()
    b3.hasAttribute('disabled').should.equal(true)

    // hack to make sinon process only one response
    this.server.processRequest(this.server.queue.shift())

    b3.hasAttribute('disabled').should.equal(true)

    this.server.respond()

    b3.hasAttribute('disabled').should.equal(false)
  })

  it('multiple elts can be disabled', function() {
    this.server.respondWith('GET', '/test', 'Clicked!')
    const b1 = make('<button hx-get="/test" hx-disabled-elt="#b2, #b3">Click Me!</button>')
    const b2 = make('<button id="b2">Click Me!</button>')
    const b3 = make('<button id="b3">Demo</button>')

    b2.hasAttribute('disabled').should.equal(false)
    b3.hasAttribute('disabled').should.equal(false)

    b1.click()
    b2.hasAttribute('disabled').should.equal(true)
    b3.hasAttribute('disabled').should.equal(true)

    this.server.respond()

    b2.hasAttribute('disabled').should.equal(false)
    b3.hasAttribute('disabled').should.equal(false)
  })

  it('load trigger does not prevent disabled element working', function() {
    this.server.respondWith('GET', '/test', 'Loaded!')
    const div1 = make('<div id="d1" hx-get="/test" hx-disabled-elt="#b1" hx-trigger="load">Load Me!</div><button id="b1">Demo</button>')
    const div = byId('d1')
    const btn = byId('b1')
    div.innerHTML.should.equal('Load Me!')
    btn.hasAttribute('disabled').should.equal(true)
    this.server.respond()
    div.innerHTML.should.equal('Loaded!')
    btn.hasAttribute('disabled').should.equal(false)
  })

  it('hx-disabled-elt supports multiple extended selectors', function() {
    this.server.respondWith('GET', '/test', 'Clicked!')
    const form = make('<form hx-get="/test" hx-disabled-elt="find input[type=\'text\'], find button" hx-swap="none"><input id="i1" type="text" placeholder="Type here..."><button id="b2" type="submit">Send</button></form>')
    const i1 = byId('i1')
    const b2 = byId('b2')

    i1.hasAttribute('disabled').should.equal(false)
    b2.hasAttribute('disabled').should.equal(false)

    b2.click()
    i1.hasAttribute('disabled').should.equal(true)
    b2.hasAttribute('disabled').should.equal(true)

    this.server.respond()

    i1.hasAttribute('disabled').should.equal(false)
    b2.hasAttribute('disabled').should.equal(false)
  })

  it('closest/find/next/previous handle nothing to find without exception', function() {
    this.server.respondWith('GET', '/test', 'Clicked!')
    const btn1 = make('<button hx-get="/test" hx-disabled-elt="closest input">Click Me!</button>')
    const btn2 = make('<button hx-get="/test" hx-disabled-elt="find input">Click Me!</button>')
    const btn3 = make('<button hx-get="/test" hx-disabled-elt="next input">Click Me!</button>')
    const btn4 = make('<button hx-get="/test" hx-disabled-elt="previous input">Click Me!</button>')
    btn1.click()
    btn1.hasAttribute('disabled').should.equal(false)
    this.server.respond()
    btn2.click()
    btn2.hasAttribute('disabled').should.equal(false)
    this.server.respond()
    btn3.click()
    btn3.hasAttribute('disabled').should.equal(false)
    this.server.respond()
    btn4.click()
    btn4.hasAttribute('disabled').should.equal(false)
    this.server.respond()
  })
})
