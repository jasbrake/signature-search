const bcrypt = require('bcryptjs')
const db = require('../../db')

function create(email, password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10)
      .then(hash => {
        db.query('insert into users (email, password, role) values ($1, $2, $3) returning *', [email, hash, 'user'])
          .then(result => {
            const user = result.rows[0]
            resolve(user)
          })
          .catch(e => {
            console.error(e.stack)
            reject(e)
          })
      })
      .catch(e => Promise.reject(e))
  })
}

function getByEmail(email) {
  return new Promise((resolve, reject) => {
    db.query('select * from users where email=$1 limit 1', [email])
      .then(response => {
        if (response.rowCount > 0) {
          const u = response.rows[0]
          resolve(u)
        } else {
          reject(new Error('no users found'))
        }
      })
      .catch(e => reject(e))
  })
}

function getByCredentials(email, password) {
  return new Promise((resolve, reject) => {
   db.query('select * from users where email=$1 limit 1', [email])
     .then(response => {
       if (response.rowCount === 1) {
         const u = response.rows[0]
         bcrypt.compare(password, u.password)
           .then(res => {
             (res) ? resolve(response.rows[0]) : reject(new Error('passwords do not match'))
           })
           .catch(e => reject(e))
       } else {
         reject(new Error('no users found'))
       }
     })
     .catch(e => reject(e))
  })
}

module.exports = {
  create,
  getByCredentials,
  getByEmail
}