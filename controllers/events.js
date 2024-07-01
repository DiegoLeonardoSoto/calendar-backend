const { response } = require('express')
const Event = require('../models/Event')

//*CREATE EVENTS
const createEvent = async (req, res = response) => {
  const event = new Event(req.body)

  try {
    event.user = req.uid

    const savedEvent = await event.save()

    res.json({
      ok: true,
      event: savedEvent
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      ok: false,
      msg: 'hable con el administrador'
    })
  }
}

//* READ EVENTS
const getEvents = async (req, res = response) => {
  const events = await Event.find().populate('user', 'name')

  res.status(200).json({
    ok: true,
    events
  })
}

//*UPDATE EVENTS
const updateEvent = async (req, res = response) => {
  const idEvent = req.params.id

  try {
    const event = await Event.findById(idEvent)

    if (!event)
      return res
        .status(404)
        .json({ ok: false, msg: 'No existe evento con ese id' })

    if (event.user.toString() !== req.uid)
      return res
        .status(401)
        .json({ ok: false, msg: 'no tiene privilegio para editar este evento' })

    const newEvent = {
      ...req.body,
      user: req.uid
    }

    const updatedEvent = await Event.findByIdAndUpdate(idEvent, newEvent, {
      new: true
    })

    res.json({
      ok: true,
      event: updatedEvent
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'hable con el administrador'
    })
  }
}

//*DELETE EVENTS
const deleteEvent = async (req, res = response) => {
  const idEvent = req.params.id

  try {
    const event = await Event.findById(idEvent)

    if (!event)
      return res
        .status(404)
        .json({ ok: false, msg: 'No existe evento con ese id' })

    if (event.user.toString() !== req.uid)
      return res
        .status(401)
        .json({
          ok: false,
          msg: 'no tiene privilegio para eliminar este evento'
        })

    await Event.findByIdAndDelete(idEvent)

    res.json({
      ok: true
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'hable con el administrador'
    })
  }
}

module.exports = { createEvent, getEvents, updateEvent, deleteEvent }
