const fs = require('fs')
const XLSX = require('xlsx')
const config = require('./config.js')
const urls = require('./shortUrl.js')

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

const getShortUrl = (urls, url) => {
  for (const i in urls) {
    if (i.match(url) !== null) return urls[i]
  }
  console.log(`$(url) 没有匹配的短链:(`)
  return ''
}

const getProject = (projectFile = './project.xlsx') => {
  const workSheetsFromFile = XLSX.readFile(projectFile)
  const first_sheet_name = workSheetsFromFile.SheetNames[0];
  const worksheet = workSheetsFromFile.Sheets[first_sheet_name]
  return XLSX.utils.sheet_to_json(worksheet)
}

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
  const templateFile = config.templateFile || './template.html'
  const templatePath = config.templatePath || 'twzw'
  const fileName = project['链接'].match(/(?=[^\/]+\.html$).+/)[0]

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
      writeFileAsync(`./${timeStamp}/${fileName}`, result).then(() => {
        console.log(`Make ${fileName} successfully:)`)
      }, (err) => {
        console.log(err)
      })
    })
  }, (err) => {
    console.log(err)
  })

}

const main = () => {
  getProject().forEach((v) => {
    make(v)
  })
}

main()
