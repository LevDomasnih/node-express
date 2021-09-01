const {Router} = require('express')
const Course = require('../models/course')
const router = Router()
const auth = require('../middleware/auth')
const { courseValidators } = require('../utils/validators')
const {validationResult} = require('express-validator')

router.get('/', auth, (req, res) => {
  res.render('add', {
    title: 'Add courses page',
    isAdd: true
  })
})

router.post('/', auth, courseValidators, async (req, res) => {
  const {
    title,
    price,
    img
  } = req.body

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).render('add', {
      title: 'Add course',
      isAdd: true,
      error: errors.array()[0].msg,
      data: {
        title,
        price,
        img
      }
    })
  }



  const course = new Course({
    title,
    price,
    img,
    userId: req.user
  })

  try {
    await course.save()
    res.redirect('/courses')
  } catch (e) {
    console.log(e)
  }
})


module.exports = router