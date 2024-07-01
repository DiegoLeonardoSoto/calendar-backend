const express = require('express')
const { dbConnection } = require('./database/config')
const cors = require('cors')
require('dotenv').config()

// Crear el servidor de express
const app = express()

// Base de datos
dbConnection()

//CORS
app.use(cors())

//Directorio publico
app.use(express.static('public'))

//lectura y parse del body
app.use(express.json())

//*rutas auth
app.use('/api/auth', require('./routes/auth'))

//*rutas eventos: CRUD
app.use('/api/events', require('./routes/events'))

// escuchar peticiones
app.listen(process.env.PORT, () => {
  console.log(`servidor corriendo en puerto ${process.env.PORT}`)
})
