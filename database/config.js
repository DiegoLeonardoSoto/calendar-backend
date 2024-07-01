const mongoose = require('mongoose')

const dbConnection = async () => {
  try {
    mongoose.connect(process.env.DB_CNN)
    console.log('Se conecto con éxito a la base de datos')
  } catch (error) {
    console.log(error)
    throw new Error('Error a la hora de inicializar BD')
  }
}

module.exports = {
  dbConnection
}
