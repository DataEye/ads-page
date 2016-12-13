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

let result = ''

fs.readdir('../swipe/', (err, files) => {
  const names = files.filter(v => v.match('.html') !== null)
  names.map(v => {
    readFileAsync(`../swipe/${v}`).then(data => {
      result = data.replace(/(MtaH5.clickStat\(.*)\)$/, '$1 + location.pathname.split("/").pop().replace(".html", "")' + ')')
    }).then(() => {
      writeFileAsync(`../swipe/${v}`, result)
    })
  })
})
