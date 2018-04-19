const user = require('../db/models/user')

const authRedirect = (req, res, next) => {
  console.log(req.originalUrl)
  if (req.originalUrl === '/login' || req.originalUrl === '/register' || req.originalUrl === '/logout') {
    next()
  } else if (!req.session.email) {
    return res.redirect('/login')
  }
  next()
}

const requireAdmin = (req, res, next) => {
  if (!req.session.email) {
    return res.redirect('/login')
  }
  user.getByEmail(req.session.email)
    .then(u => {
      if (u.role === 'admin') {
        next()
      } else {
        Promise.reject(new Error('User is not an admin'))
      }
    })
    .catch(e => {
      res.render('error', { title: 'Admin Error', error: e})
    })
}

module.exports = {
  authRedirect,
  requireAdmin
}