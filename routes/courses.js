const {Router} = require('express')
const Course = require('../models/course')
const router = Router()

router.get('/', async (req, res) => {
  const courses = await Course.find()
  res.render('courses', {
    title: 'Course page',
    isCourses: true,
    courses
  })
})

router.get('/:id/edit', async (req, res) => {
  const course = await Course.findById(req.params.id)
  if (!req.query.allow) {
    return res.redirect('/')
  }

  res.render('courseEdit', {
    title: course.title,
    course
  })
})

router.post('/remove', async (req, res) => {
  try {
  await Course.deleteOne({_id: req.body.id})
    res.redirect('/courses')
  } catch (e) {
    console.log(e)
  }
})

router.post('/edit', async (req, res) => {
  const {id} = req.body
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