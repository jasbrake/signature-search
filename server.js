const express = require('express')
const flash = require('express-flash')
const path = require('path')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const authenticate = require('./middleware/authenticate')

const app = express()
const server = require('http').createServer(app)

const pagesRouter = require('./routes/pages')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(cookieSession({
  name: 'session',
  keys: ['devtestkey']
}))

// app.use(authenticate.authRedirect)

app.use(flash())

app.use('/', pagesRouter)

server.listen(80, () => {
  console.log(`Listening on port ${80}`)
})
