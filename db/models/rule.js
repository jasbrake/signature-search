const db = require('../../db')

function searchBySID(sid) {
  return new Promise((resolve, reject) => {
    db.query("select * from signatures where sid like '%' || $1 || '%';", [sid])
      .then(response => {
        if (response.rowCount > 0) {
          resolve(response.rows)
        } else {
          reject(new Error('No matching signatures found'))
        }
      })
      .catch(e => {
        reject(e)
      })
  })
}

function getByID(id) {
  return new Promise((resolve, reject) => {
    db.query("select * from signatures where id=$1 limit 1;", [id])
      .then(response => {
        if (response.rowCount > 0) {
          resolve(response.rows[0])
        } else {
          reject(new Error('No items by that ID found'))
        }
      })
      .catch(e => {
        reject(e)
      })
  })
}

function save(id, msg, rule) {
  return new Promise((resolve, reject) => {
    db.query("update signatures set msg = $1, rule = $2 where id=$3 returning *", [msg, rule, id])
      .then(response => {
        if (response.rowCount > 0) {
          resolve(response.rows[0])
        } else {
          reject(new Error('No items by that ID found'))
        }
      })
      .catch(e => reject(e))
  })
}

module.exports = {
  searchBySID,
  getByID,
  save
}