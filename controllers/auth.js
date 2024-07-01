const { response } = require('express')
const bcrypt = require('bcryptjs')

const User = require('../models/User')
const { generateJWT } = require('../helpers/jwt')

//*create users
const createUser = async (req, res = response) => {
  const { email, password } = req.body

  try {
    let user = await User.findOne({ email })

    if (user) {
      return res.status(400).json({
        ok: false,
        msg: 'Ese email ya esta en uso'
      })
    }

    //Crea el objeto utilizando el modelo
    user = new User(req.body)

    //Encriptar contraseña
    const salt = bcrypt.genSaltSync()
    user.password = bcrypt.hashSync(password, salt)

    //Se graba en al base de datos si no existe el usuario
    await user.save()

    //generar JWT
    const token = await generateJWT(user._id, user.name)

    res.status(201).json({
      ok: true,
      uid: user._id,
      name: user.name,
      token
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    })
  }
}

//*login users
const loginUser = async (req, res = response) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: 'El usuario no existe con ese email'
      })
    }

    //confirmar los password
    const validPassword = bcrypt.compareSync(password, user.password)

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Password incorrecto'
      })
    }
    //generar JWT
    const token = await generateJWT(user._id, user.name)

    res.json({
      ok: true,
      uid: user._id,
      name: user.name,
      token
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    })
  }
}

//*renew users
const renewToken = async (req, res = response) => {
  const { uid, name } = req

  const token = await generateJWT(uid, name)

  res.json({
    ok: true,
    token
  })
}

module.exports = { createUser, loginUser, renewToken }
