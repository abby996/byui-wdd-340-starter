// Needed resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

// The route to call the accountController to build the login page.
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// The route to call the accountController to build the register page.
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

// The route for the registration post method.
// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(), // Fixed: registrationRules (not registationRules)
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData, // Fixed: checkLoginData (not checklogData)
  utilities.handleErrors(accountController.accountLogin)
);

// The account management view route
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagementView)
);

router.get(
  "/update/:accountId",
  utilities.handleErrors(accountController.buildUpdateView)
);

// Process the update profile information.
router.post(
  "/update-profile",
  regValidate.profileDetailsRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateProfileInfo)
);

// Process the change password information update
router.post(
  "/change-password",
  regValidate.changePasswordRules(),
  regValidate.checkNewPassword,
  utilities.handleErrors(accountController.changePassword)
);

router.get("/logout", utilities.handleErrors(accountController.accountLogout));

module.exports = router;