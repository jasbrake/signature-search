const router = require('express').Router()
const authenticate = require('../middleware/authenticate')
const rule = require('../db/models/rule')
const user = require('../db/models/user')

router.get('/', (req, res) => {
  if (!req.session.email) {
    res.redirect('/login')
  } else {
    res.render('index', { title: "Signature Search", email: req.session.email })
  }
})

router.get('/login', (req, res) => {
  if (req.session.email) {
    res.redirect('/')
  } else {
    res.render('login', { title: 'Login' })
  }
})

router.post('/login', (req, res) => {
  user.getByCredentials(req.body.email, req.body.password)
    .then(u => {
      req.session.email = u.email
      res.redirect('/')
    })
    .catch(e => {
      req.flash('error', 'Login failed')
      res.redirect('/login')
    })
})

router.get('/register', (req, res) => {
  if (req.session.email) {
    res.redirect('/')
  } else {
    res.render('register', { title: 'Register'})
  }
})

router.post('/register', (req, res) => {
  if (req.body.password.length < 8) {
    req.flash('error', 'Passwords must be at least 8 characters')
    res.redirect('/register')
  } else if (req.body.password !== req.body.password2) {
    req.flash('error', 'Passwords must match')
    res.redirect('/register')
  } else {
    user.create(req.body.email, req.body.password)
      .then(u => {
        req.session.email = u.email
        res.redirect('/')
      })
      .catch(e => {
        console.log(e)
        req.flash('error', 'Could not register')
        res.redirect('/register')
      })
  }
})

router.get('/logout', (req, res) => {
  req.session = null
  res.redirect('/login')
})


router.get('/search', (req, res) => {
  if (!req.session.email) {
    return res.redirect('/login')
  }
  if (!req.query.sid) {
    return res.redirect('/')
  }
  const sid = req.query.sid
  rule.searchBySID(sid)
    .then(result => {
      res.render('search', { title: 'Signature Search', results: result})
    })
    .catch(e => {
      res.render('error', {title: 'Search Error', error: e})
    })
})

router.get('/signatures/:id', (req, res) => {
  if (!req.session.email) {
    return res.redirect('/login')
  }
  rule.getByID(req.params.id)
    .then(rule => {
      user.getByEmail(req.session.email)
        .then(u => {
          res.render('signature', { title: 'Signature', signature: rule, user: u })
        })
        .catch(e => {
          res.render('error', { title: 'Error', error: e })
        })
    })
    .catch(e => {
      res.render('error', { error: e})
    })
})

router.get('/editsignature/:id', authenticate.requireAdmin, (req, res) => {
  if (!req.session.email) {
    return res.redirect('/login')
  }
  rule.getByID(req.params.id)
    .then(rule => {
        res.render('editsignature', { title: 'Edit Signature', signature: rule })
    })
    .catch(e => {
      res.render('error', { title: 'Error', error: e })
    })
})

router.post('/editsignature/:id', authenticate.requireAdmin, (req, res) => {
  if (!req.session.email) {
    return res.redirect('/login')
  }
  rule.save(req.params.id, req.body.msg, req.body.rule)
    .then(response => {
      res.redirect('/signatures/' + req.params.id)
    })
    .catch(e => {
      res.render('error', { title: 'Error', error: e })
    })
})

module.exports = router