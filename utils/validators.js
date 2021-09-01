const {body} = require('express-validator')

exports.registerValidators = [
  body('email', 'Enter valid email').isEmail(),
  body('password', 'Min password is 6 char').isLength({min: 6, max: 56}).isAlphanumeric(),
  body('confirm').custom((value, {req}) => {
    if (value !== req.body.password) {
      throw new Error('passwords must match')
    }
    return true
  }),
  body('name', 'Min name is 3 char').isLength({min: 3})
]