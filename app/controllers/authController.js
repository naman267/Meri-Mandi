const bcrypt = require('bcrypt')
const passport = require('passport')
const User = require('../models/user')

function authController() {
  function _getRedirectedlogin(req) {
    console.log('req.user--', req.user)
    return req.user.role === 'Farmer' ? '/farmer' : '/user'
  }
  return {
    login(req, res) {
      res.render('login')
    },
    register(req, res) {
      res.render('signup')
    },
    async postRegister(req, res) {
      console.log('coming')
      const { phone, address, Name, password, Email, state } = req.body
      console.log(Name, password, Email, state)
      if (!Name || !Email || !password) {
        console.log(1)

        return res.redirect('/register')
      }
      User.exists({ email: Email }, (err, result) => {
        if (result) {
          console.log(2)
          return res.redirect('/register')
        }
      })
      const hashed = await bcrypt.hash(password, 10)
      const user = new User({
        name: Name,
        email: Email,
        password: hashed,
        role: state,
        phone,
        address
      })
      console.log(user)
      user
        .save()
        .then((result) => {
          res.redirect('/login')
        })
        .catch((e) => {
          console.log(3)
          //req.flash('error','Somethong went wrong')
          return res.redirect('/register')
        })

      console.log('req', req.body)
    },

    postLogin(req, res, next) {
      //Validation request

      const { password, email } = req.body
      if (!email || !password) {
        return res.redirect('/login')
      }
      console.log('login--5', req.body)
      passport.authenticate('local', (err, user, info) => {
        if (err) {
          return next(err)
        }
        if (!user) {
          return res.redirect('/login')
        }
        req.logIn(user, (err) => {
          if (err) {
            return next(error)
          }
          return res.redirect(_getRedirectedlogin(req))
        })
      })(req, res, next)
    },
    logout(req, res) {
      console.log('logoutt----')
      req.logout()
      return res.redirect('/login')
    }
  }
}
module.exports = authController
