const fs = require('fs')
const XLSX = require('xlsx')
const config = require('./config')
const xlsxToJSON = require('./lib/xlsxToJSON')
const {readFileAsync, writeFileAsync, appendFileAsync} = require('./lib/fs')

const configPath = config.configPath

const make = (project) => {
  let result = ''
  const templateFile = './template/twzw/twzw.html'
  const fullUrl = project['链接'].trim()
  const fileName = fullUrl.match(/(?=[^\/]+\.html$).+/)[0]
  const company = project['公司'].trim()

  if (!fs.existsSync(`./company`)) fs.mkdirSync(`./company`)

  readFileAsync(templateFile)
  .then((data) => {
    result = data.replace('<!-- {company} -->', company)
  })
  .then(() => {
    const filePath = `./company/${fileName}`
    writeFileAsync(filePath, result)
    .then(() => {
      appendFileAsync('./upload.tmp', filePath + ',' + fullUrl + '\r\n').catch((err) => console.log(err))
      console.log(`${fullUrl}`)
    })
  }).catch((err) => {
    console.error(err)
  })
}

const main = () => {
  xlsxToJSON(`./config/${configPath}/company.xlsx`).forEach((v) => {
    make(v)
  })
}

fs.unlink('./upload.tmp', (err) => {
  if (err && err.code !== 'ENOENT') {
    throw new Error('Delete upload.tmp Error:(')
  }
  main()
})
