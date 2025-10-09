/******************************************
 * server.js - Main server file
 ******************************************/

const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const path = require("path")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const flash = require("connect-flash")
const pool = require("./database/")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const errorRoute = require("./routes/errorRoute")
const static = require("./routes/static")
const utilities = require("./utilities/")
require("dotenv").config()

const app = express()

/* ***********************
 * Middleware Setup
 *************************/
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static("public"))

/* ***********************
 * View Engine Setup
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")
app.set("views", path.join(__dirname, "views"))

/* ***********************
 * Session and Flash
 *************************/
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET || "superSecret",
    resave: false,
    saveUninitialized: true,
    name: "sessionId",
  })
)

app.use(flash())

// Make flash messages available to views
app.use((req, res, next) => {
  res.locals.messages = req.flash()
  next()
})

/* ***********************
 * Routes
 *************************/
app.use(static)
app.use("/account", accountRoute)
app.use("/inv", inventoryRoute)
app.use("/error", errorRoute)

// Home
app.get("/", utilities.handleErrors(baseController.buildHome))

// 404 handler
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." })
})

/* ***********************
 * Express Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)

  let message =
    err.status == 404
      ? err.message
      : err.status == 500
      ? err.message
      : "Oh no! There was a crash. Maybe try a different route?"

  res.render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  })
})

/* ***********************
 * Server Startup
 *************************/
const port = process.env.PORT || 3000
const host = process.env.HOST || "localhost"

app.listen(port, () => {
  console.log(`✅ App listening on ${host}:${port}`)
})

app.use(utilities.checkJWTToken)

module.exports = app
