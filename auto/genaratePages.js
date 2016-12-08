const fs = require('fs')

const copy = (src, dst) => {
  fs.writeFile(dst, fs.readFileSync(src), (err) => {
    if (err) console.log(err)
    else console.log(`${dst}`)
  })
}

const defaultMethod = (last) => {
  if (!this.last) {
    this.last = last
  } else {
    let letter = this.last.match(/[A-Z]+/g)[0]
    let number = Number(this.last.match(/\d+/g)[0])
    this.last = letter === 'Z' ? ++number + 'A' : number + String.fromCharCode(letter.charCodeAt(0) + 1)
  }
  return this.last
}

const genarateSuffix = (begin, method) => {
  return method(begin)
}

const main = (argv) => {
  const [src, prefix, beginSuffix, total] = argv

  for (let i = 0; i < total; i++) {
    let suffix = genarateSuffix(beginSuffix, defaultMethod)
    copy(src, prefix + '_' + suffix + '.html')
  }
}

console.log('参数：原始文件 前缀 第一个后缀 总数')
console.log('支持后缀生成格式为数字加字母大写：1A 1B 1C ... 1Z 2A ... 2Z ...')
main(process.argv.slice(2))
