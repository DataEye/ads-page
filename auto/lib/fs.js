const fs = require('fs')

const readFileAsync = (file, encoding='utf8') => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, encoding, (err, data) => {
      if (err) return reject(err)
      resolve(data)
    })
  })
}

const writeFileAsync = (file, data, encoding='utf8') => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, encoding, (err, result) => {
      if (err) return reject(err)
      resolve(result)
    })
  })
}

const appendFileAsync = (file, data, options) => {
  return new Promise((resolve, reject) => {
    fs.appendFile(file, data, options, (err, result) => {
      if (err) return reject(err)
      resolve(result)
    })
  })
}

module.exports = {
  readFileAsync,
  writeFileAsync,
  appendFileAsync,
}
