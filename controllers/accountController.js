// Needed resources
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next){
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Deliver registeration view
* *************************************** */
async function buildRegister(req, res, next){
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    // FIX: Use correct flash message type
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    // FIX: Use correct flash message type
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    // FIX: Use correct flash message type and pass form data back
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      // FIX: Include account_type in JWT token
      const accessToken = jwt.sign(
        {
          account_id: accountData.account_id,
          account_firstname: accountData.account_firstname,
          account_lastname: accountData.account_lastname,
          account_email: accountData.account_email,
          account_type: accountData.account_type // This is crucial for role-based access
        }, 
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: 3600 * 1000 }
      )
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      // FIX: Use correct flash message type
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

async function buildManagementView(req, res) {
  let nav = await utilities.getNav();
  res.render("account/index", {
    title: "Account Management",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver account update view
 * *************************************** */
async function buildUpdateView(req, res, next) {
  let nav = await utilities.getNav();
  const account_id = req.params.accountId;
  const accountInfo = await accountModel.getAccountById(account_id);
  res.render("account/update", {
    title: "Update Your Account", // FIX: Typo "Updata" → "Update"
    nav,
    errors: null,
    account_firstname: accountInfo.account_firstname,
    account_lastname: accountInfo.account_lastname,
    account_email: accountInfo.account_email,
    account_id: accountInfo.account_id,
  });
}

/* ****************************************
 *  Process the account update
 * *************************************** */
async function updateProfileInfo(req, res, next) {
  let nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email } =
    req.body;

  const updateResult = await accountModel.updateAccountById(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  );

  if (updateResult) {
    // FIX: Use correct flash message type
    req.flash(
      "notice",
      `Your account information ${account_firstname} ${account_lastname} was successfully updated.`
    );
    res.redirect("/account/");
  } else {
    // FIX: Use correct flash message type
    req.flash(
      "notice",
      "Sorry, your account information update failed."
    );
    res.status(501).render("account/update", {
      title: "Update Your Account", // FIX: Typo
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    });
  }
}

/* ****************************************
 *  Process the account password update
 * *************************************** */
async function changePassword(req, res, next) {
  let nav = await utilities.getNav();
  const { account_id, account_password } = req.body;
  try {
    // Hash the password before storing
    let hashedPassword;
    try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10);
    } catch (error) {
        // FIX: Use correct flash message type
        req.flash(
          "notice",
          "Sorry, there was an error processing the password update."
        );
        res.status(500).render("account/update", {
          title: "Update Your Account", // FIX: Typo
          nav,
          errors: null,
          account_id,
        });
        return; // Add return to stop execution
      }

    const changePassword = await accountModel.updatePasswordById(
      account_id,
      hashedPassword
    );
    if (changePassword) {
      // FIX: Use correct flash message type
      req.flash(
        "notice",
        `Your account password was successfully updated.`
      );
      res.redirect("/account/");
    } else {
        // FIX: Use correct flash message type
        req.flash(
          "notice",
          "Sorry, your account password update failed."
        );
        res.status(501).render("account/update", {
          title: "Update Your Account", // FIX: Typo
          nav,
          errors: null,
          account_id,
        });
      }
  } catch (error) {
    throw new Error("Password update failed at hashing");
  }
}

/* ****************************************
 *  Process account logout
 * *************************************** */
async function accountLogout(req, res) {
   if (req.cookies.jwt){
    res.clearCookie("jwt")
    // FIX: Use correct flash message type
    req.flash("notice", "You have successfully logged out.")
    return res.redirect("/")
  } else {
    // FIX: Use correct flash message type
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildManagementView,
  buildUpdateView,
  updateProfileInfo,
  changePassword,
  accountLogout,
};