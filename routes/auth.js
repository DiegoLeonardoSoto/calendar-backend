//* auth routes: host + /api/auth
const { Router } = require('express')
const { check } = require('express-validator')
const { createUser, loginUser, renewToken } = require('../controllers/auth')
const { validateFields } = require('../middlewares/validateFields')
const { validateJWT } = require('../middlewares/validateJWT')

const router = Router()

router.post(
  '/new',
  [
    //* MIDDLEWARES
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('email', 'El email no es valido').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check(
      'password',
      'El password debe de ser al menos de 6 caracteres'
    ).isLength({ min: 6 }),
    validateFields
  ],
  createUser
)

router.post(
  '/',
  [
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('email', 'El email no es valido').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check(
      'password',
      'El password debe de ser al menos de 6 caracteres'
    ).isLength({ min: 6 }),
    validateFields
  ],
  loginUser
)

router.get('/renew', validateJWT, renewToken)

module.exports = router
