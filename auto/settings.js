const sftpSettings = {
  host: '8',
  port: 22,
  username: '',
  password: ''
}

const cdnSettings = {
  accessKeyId: '',
  appSecret: '',
  endpoint: 'https://cdn.aliyuncs.com',
  apiVersion: '2014-11-11',
}

const uploadPath = '/usr/local/nginx/html/res.digitcube.net/ads-page/swipe'

module.exports = {
  sftpSettings,
  cdnSettings,
  uploadPath,
}
