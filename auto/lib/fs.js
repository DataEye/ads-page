const fs = require('fs')

const readFileAsync = (file, encoding='utf8') => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, encoding, (err, data) => {
      if (err) return reject(err)
      resolve(data)
    })
  })
}

const writeFileAsync = (file, result, encoding='utf8') => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, result, encoding, (err, data) => {
      if (err) return reject(err)
      resolve(data)
    })
  })
}

module.exports = {readFileAsync, writeFileAsync}
