const XLSX = require('xlsx')

const xlsxToJSON = (projectFile = './project.xlsx') => {
  const workSheetsFromFile = XLSX.readFile(projectFile)
  const first_sheet_name = workSheetsFromFile.SheetNames[0];
  const worksheet = workSheetsFromFile.Sheets[first_sheet_name]
  return XLSX.utils.sheet_to_json(worksheet)
}

module.exports = xlsxToJSON
