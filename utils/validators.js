const { body } = require("express-validator")
const User = require("../models/user")

exports.registerValidators = [
  body("email", "Enter valid email").
    isEmail().
    custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value })
        if (user) {
          return Promise.reject("Email has already")
        }
      } catch (e) {
        console.log(e)
      }
    }).
    normalizeEmail(),

  body("password", "Min password is 6 char").
    isLength({ min: 6, max: 56 }).isAlphanumeric().trim(),

  body("confirm").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("passwords must match")
    }
    return true
  }).trim(),

  body("name", "Min name is 3 char").isLength({ min: 3 }).trim(),
]

exports.courseValidators = [
  body('title', "Min title length 3 char").isLength({min: 3}).trim(),
  body('price', 'Enter valid price').isNumeric(),
  body('img', "Enter valid url image").isURL()
]