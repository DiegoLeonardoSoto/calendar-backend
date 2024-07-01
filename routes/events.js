//* events routes: host + /api/events
const { Router } = require('express')
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/events')
const { validateJWT } = require('../middlewares/validateJWT')
const { check } = require('express-validator')
const { validateFields } = require('../middlewares/validateFields')
const { isDate } = require('../helpers/isDate')

const router = Router()

//this middleware is for all endpoints
router.use(validateJWT)

//* C.R.U.D Event
router.post(
  '/',
  [
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatoria').custom(isDate),
    check('end', 'Fecha de finalización es obligatoria').custom(isDate)
  ],
  validateFields,
  createEvent
)

router.get('/', getEvents)

router.put('/:id', updateEvent)

router.delete('/:id', deleteEvent)

module.exports = router
