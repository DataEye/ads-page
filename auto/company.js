const fs = require('fs')
const XLSX = require('xlsx')
const config = require('./config')
const xlsxToJSON = require('./lib/xlsxToJSON')
const {readFileAsync, writeFileAsync} = require('./lib/fs')
const refreshCDN = require('./refresh')
// const upload = require('./lib/upload')
const connection = new require('ssh2').Client()

const settings = {
   host: '112.74.91.38',
   port: 22,
   username: 'root',
   password: 'dcAT2013123121'
}

let sftpObject

const onReady = () => {
  connection.sftp((err, sftp) => {
    if (err) throw err
    sftpObject = sftp
    main()
  })
}

connection.on('ready', onReady).connect(settings)
connection.setMaxListeners(0)

const printError = (e) => {
  console.error(e)
}

const configPath = config.configPath

const make = (project) => {
  let result = ''
  const templateFile = './template/twzw/twzw.html'
  const fullUrl = project['链接'].trim()
  const fileName = fullUrl.match(/(?=[^\/]+\.html$).+/)[0]
  const company = project['公司'].trim()
  const remotePath = '/usr/local/nginx/html/res.digitcube.net/ads-page/swipe'

  if (!fs.existsSync(`./company`)) fs.mkdirSync(`./company`)

  readFileAsync(templateFile)
  .then((data) => {
    result = data.replace('<!-- {company} -->', company)
  })
  .then(() => {
    writeFileAsync(`./company/${fileName}`, result)
    .then(() => {
      // upload(fileName, './company', remotePath)
      sftpObject.fastPut(`./company/${fileName}`, `${remotePath}/${fileName}`, (err) => {
        if (err) throw new Error(err)
        refreshCDN(fullUrl).then(() => {
          console.log('Refresh CDN succesfully!')
        }).catch(() => {
          console.error('Refresh CDN Error!')
        })
      })
      console.log(`${fullUrl}`)
    })
  })
}

const main = () => {
  xlsxToJSON(`./config/${configPath}/company.xlsx`).forEach((v) => {
    make(v)
  })
}
