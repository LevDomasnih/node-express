const {Router} = require('express')
const User = require('../models/user')
const router = Router()

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Auth',
    isLogin: true
  })
})

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login#login')
  })
})

router.post('/login', async (req, res) => {
  const user = await User.findById('612d11b47108f906ace10202')
  req.session.user = user
  req.session.isAuthenticated = true
  req.session.save(err => {
    if (err) {
      throw err
    }
    res.redirect('/')
  })
})


module.exports = router