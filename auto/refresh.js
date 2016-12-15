const co = require('co')
const SDK = require('./lib/aliyun-cdn-sdk/sdk')
<<<<<<< HEAD
const {cdnSettings} = require('./settings')
=======

const CONFIG = {
  accessKeyId: '',
  appSecret: '',
  endpoint: '',
  apiVersion: '',
}
>>>>>>> e0e9cb9b34b46b279de83d2b972ab850696bb118

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
  const sdk = new SDK(cdnSettings)
  const ObjectPath = makeObjectPath(urls)
  const res = yield sdk.RefreshObjectCaches({
    ObjectPath,
  })
  return res
})

module.exports = refreshCDN
