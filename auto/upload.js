const fs = require('fs')
const {readFileAsync} = require('./lib/fs')
const refreshCDN = require('./refresh')
const {sftpSettings, uploadPath} = require('./settings')

const connection = new require('ssh2').Client()

const onReady = () => {
  connection.sftp((err, sftp) => {
    if (err) throw new Error()
    main(sftp)
  })
}

connection.on('ready', onReady).connect(sftpSettings)
// connection.setMaxListeners(0)

const main = (sftpObject) => {
  const stop = () => {
    sftpObject.end()
    connection.end()
  }
  readFileAsync('./upload.tmp')
  .then((data) => {
    const paths = (data.split('\r\n').filter((v) => v !== ''))
    let totalPromise = []
    for (let path of paths) {
      let t = path.split(',')
      let localPath = t[0]
      let fullUrl = t[1]
      let fileName = localPath.match(/(?=[^\/]+\.html$).+/)[0]
      let p = new Promise((resolve, reject) => {
        sftpObject.fastPut(localPath, `${uploadPath}/${fileName}`, (err) => {
          if (err) {
            reject(`${fullUrl} : Upload Error:(`)
          }
          refreshCDN(fullUrl)
          .then(() => {
            resolve(`${fullUrl} : Refresh CDN succesfully!`)
          })
          .catch((err) => {
            reject(`${fullUrl} : Refresh CDN Error:( \r\n ${err}`)
          })
        })
      })
      totalPromise.push(p)
    }
    Promise.all(totalPromise)
    .then((data) => {
      console.log(`${data.length} pages has already been uploaded and refreshed O(∩_∩)O`)
      stop()
    })
    .catch((err) => {
      console.log(err)
      stop()
    })
  })
  .catch((err) => {
    console.log('Read upload.tmp Error:(')
    console.log(err)
    stop()
  })
}
