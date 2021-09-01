const {Router} = require('express')
const bcrypt = require('bcryptjs')
const {body, validationResult} = require('express-validator')
const User = require('../models/user')
const router = Router()

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Auth',
    isLogin: true,
    loginError: req.flash('loginError'),
    registerError: req.flash('registerError')
  })
})

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login#login')
  })
})

router.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body

    const candidate = await User.findOne({email})

    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password)

      if (areSame) {
        req.session.user = candidate
        req.session.isAuthenticated = true
        req.session.save(err => {
          if (err) {
            throw err
          }
          res.redirect('/')
        })
      } else {
        req.flash('loginError', 'Not valid password')
        res.redirect('/auth/login#login')
      }
    } else {
      req.flash('loginError', 'User not exist')
      res.redirect('/auth/login#login')
    }
  } catch (e) {
    console.log(e)
  }

})

router.post('/register', body('email').isEmail(), async (req, res) => {
  try {
    const {email, password, confirm, name} = req.body
    const candidate = await User.findOne({email})

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      req.flash('registerError', errors.array()[0].msg)
      return res.status(422).redirect('/auth/login#register')
    }

    if (candidate) {
      req.flash('registerError', "This email exists")
      res.redirect('/auth/login#register')
    } else {
      const hashPassword = await bcrypt.hash(password, 10)
      const user = new User({
        email,
        name,
        password: hashPassword,
        cart: {
          items: []
        }
      })
      await user.save()
      res.redirect('/auth/login#login')
    }
  } catch (e) {
    console.log(e)
  }
})

module.exports = router