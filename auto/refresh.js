const co = require('co')
const SDK = require('./lib/aliyun-cdn-sdk/sdk')

const CONFIG = {
  accessKeyId: 'ACSRgR2efE0nmhIJ',
  appSecret: 'BD4Pq0Aanj',
  endpoint: 'https://cdn.aliyuncs.com',
  apiVersion: '2014-11-11',
}

const makeObjectPath = (urls) => {
  if (Array.isArray(urls)) {
    return urls.join('\r\n')
  } else if (typeof urls === 'string') {
    return urls
  }
  console.warn('Input must be array of urls!')
  return []
}

const refreshCDN = co.wrap(function* (urls) {
  const sdk = new SDK(CONFIG)
  const ObjectPath = makeObjectPath(urls)
  const res = yield sdk.RefreshObjectCaches({
    ObjectPath,
  })
  return res
})

module.exports = refreshCDN
