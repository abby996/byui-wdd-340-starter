// Needed resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const validate = require('../utilities/account-validation')

// Route for "My Account" page
router.get("/", utilities.handleErrors(accountController.buildAccount))

// The route to call the accountController to build the login page.
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// The route to call the accountController to build the register page.
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// The route for the registration post method.
// Process the registration data
router.post(
  "/register",
  validate.registrationRules(),
  validate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  validate.loginRules(),
  validate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

module.exports = router