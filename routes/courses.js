const {Router} = require('express')
const Course = require('../models/course')
const router = Router()
const auth = require('../middleware/auth')
const { courseValidators } = require('../utils/validators')
const {validationResult} = require('express-validator')

router.get('/', async (req, res) => {
  const courses = await Course.find()
  .populate('userId', 'email name')
  .select('price title img')

  res.render('courses', {
    title: 'Course page',
    isCourses: true,
    courses
  })
})

router.get('/:id/edit', auth, async (req, res) => {
  const course = await Course.findById(req.params.id)
  if (!req.query.allow) {
    return res.redirect('/')
  }

  res.render('courseEdit', {
    title: course.title,
    course
  })
})

router.post('/remove', auth, async (req, res) => {
  try {
  await Course.deleteOne({_id: req.body.id})
    res.redirect('/courses')
  } catch (e) {
    console.log(e)
  }
})

router.post('/edit', auth, courseValidators, async (req, res) => {
  const errors = validationResult(req)
  const {id} = req.body

  if (!errors.isEmpty()) {
    return res.status(422).redirect(`/courses/${id}/edit?allow=true`)
  }

  delete req.body.id
  await Course.findByIdAndUpdate(id, req.body)
  res.redirect('/courses')
})

router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id)
  res.render('course', {
    layout: 'empty',
    title: `Course ${course.title}`,
    course
  })
})

module.exports = router