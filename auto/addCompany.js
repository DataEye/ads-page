const fs = require('fs')
const XLSX = require('xlsx')

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

const getProject = (projectFile = './company.xlsx') => {
  const workSheetsFromFile = XLSX.readFile(projectFile)
  const first_sheet_name = workSheetsFromFile.SheetNames[0];
  const worksheet = workSheetsFromFile.Sheets[first_sheet_name]
  return XLSX.utils.sheet_to_json(worksheet)
}

const printError = (e) => {
  console.error(e)
}

const make = (project) => {
  let result =''
  const templateFile = './twzw.html'
  const fullUrl = project['链接'].trim()
  const fileName = fullUrl.match(/(?=[^\/]+\.html$).+/)[0]
  const company = project['公司'].trim()

  if (!fs.existsSync(`./company`)) fs.mkdirSync(`./company`)

  // async addCompany() => {
  //   const data = await readFileAsync(templateFile)
  //   result = data.replace('<!-- {company} -->', company)
  //   try {
  //     await writeFileAsync(`./company/${fileName}`, result)
  //     console.log(`${fullUrl}`)
  //   } catch(e) {
  //     console.log(e)
  //   }
  // }
  //
  // addCompany()

  readFileAsync(templateFile).then((data) => {
    result = data.replace('<!-- {company} -->', company)
  }).then(() => {
    writeFileAsync(`./company/${fileName}`, result).then(() => {
      console.log(`${fullUrl}`)
    }, (err) => {
      printError(err)
    })
  }, (err) => {
    printError(err)
  })
}

const main = () => {
  getProject().forEach((v) => {
    make(v)
  })
}

main()
