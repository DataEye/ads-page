const fs = require('fs')
const xlsxToJSON = require('./lib/xlsxToJSON')
const {readFileAsync, writeFileAsync, appendFileAsync} = require('./lib/fs')
const config = require('./config')

const getShortUrl = (urls, url) => {
  for (const i of urls) {
    if (i.directURLs.trim().match(url) !== null) return i.shortURLs.trim()
  }
  console.log(`${url} 没有匹配的短链:(`)
  return ''
}

const configPath = config.configPath

const make = (project) => {
  if (project['落地页类型'].trim() !== '应用下载类') {
    console.log('不是应用下载类！')
    return
  }

  let trackingCode = ''
  let mtaCode = ''
  let pinyouCode = ''
  let result = ''
  const timeStamp = (new Date()).toLocaleDateString()
  const templateFile = config.templateFile
  const templatePath = config.templatePath
  const fullUrl = project['链接']
  const fileName = fullUrl.match(/(?=[^\/]+\.html$).+/)[0]

  const urls = xlsxToJSON(`./config/${configPath}/shortUrlMatch.xlsx`)

  const p1 = project['是否短链统计'].trim() === '是' && readFileAsync('./template/tracking').then((tracking) => {
    trackingCode = tracking.replace('/* {shortUrl} */', `'${getShortUrl(urls, fileName)}'`)
  })
  const p2 = readFileAsync(`./template/${templatePath}/mta`).then((mta) => {
    mtaCode = mta
  })
  const p3 = project['是否品友统计'].trim() === '是' && readFileAsync(`./template/${templatePath}/pinyou`).then((pinyou) => {
    pinyouCode = pinyou
  })

  if (!fs.existsSync(`./${timeStamp}`)) fs.mkdirSync(`./${timeStamp}`)

  Promise.all([p1, p2, p3]).then(() => {
    readFileAsync(templateFile).then((data) => {
      result = data.
      replace('<!-- {tracking} -->', trackingCode).
      replace('<!-- {mta} -->', mtaCode).
      replace('<!-- {pinyou} -->', pinyouCode).
      replace('/* {apkName} */', `var apkName='${project['包号']}'`)
    }).then(() => {
      const filePath = `./${timeStamp}/${fileName}`
      writeFileAsync(filePath, result).then(() => {
        appendFileAsync('./upload.tmp', filePath + ',' + fullUrl + '\r\n').catch((err) => console.log(err))
        console.log(`${fullUrl}`)
      }, (err) => {
        console.log(err)
      })
    })
  }, (err) => {
    console.log(err)
  })

}

const main = () => {
  xlsxToJSON(`./config/${configPath}/project.xlsx`).forEach((v) => {
    make(v)
  })
}

fs.unlink('./upload.tmp', (err) => {
  if (err && err.code !== 'ENOENT') {
    throw new Error('Delete upload.tmp Error:(')
  }
  main()
})
