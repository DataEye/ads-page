const fs = require('fs')
const connection = new require('ssh2').Client()

const settings = {
   host: '',
   port: 22,
   username: 'root',
   password: ''
}

const upload = (files = [], localPath = './', remotePath) => {
  let filesToSend = []
  if (typeof files === 'string') {
    filesToSend = [files]
  } else if (Array.isArray(files)) {
    filesToSend = files
  } else {
    throw new Error('You should give string or array as argument')
    return
  }

  const onReady = () => {
    connection.sftp((err, sftp) => {
      if (err) throw err

      for (let file of filesToSend) {
        const readStream = fs.createReadStream(`${localPath}/${file}`)
        const writeStream = sftp.createWriteStream(`${remotePath}/${file}`)

        const onClose = () => {
          console.log('file transferred succesfully')
          writeStream.removeListener('close', onClose)
          writeStream.removeListener('error', onError)
          sftp.end()
          connection.removeListener('ready', onReady)
          connection.end()
        }

        const onError = (err) => {
          throw new Error(err)
        }

        writeStream.on('close', onClose)

        writeStream.on('error', onError)

        readStream.pipe(writeStream)
      }
    })
  }

  connection.on('ready', onReady).connect(settings)
  connection.setMaxListeners(0)
}

module.exports = upload
