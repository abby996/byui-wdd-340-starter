/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require ("express")
const expresslayouts = require ("express-ejs-layouts")
const baseController = require("./controllers/baseController")

const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")



// Inventory routes
app.use("/inv", inventoryRoute)



/* ***********************
 * view engine and template
 *************************/
app.set("view engine", "ejs")
app.use(expresslayouts)
app.set("layout", "./layouts/layout") // not at views root


app.use(static)

//Index route
app.get("/", function (req, res){
  res.render("index", {title: "Home"})
})

utilities.handleErrors(baseController.buildHome)


app.get("/", utilities.handleErrors(baseController.buildHome))



// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})


/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: err.message,
    nav
  })
})



/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})



const express = require("express")

const path = require("path")

// Routers

const inventoryRoute = require("./routes/inventoryRoute")

// Setup
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/", require("./routes/baseRoute"))
app.use("/inv", inventoryRoute)

// Catch-all route if no match (404)
app.use(async (req, res, next) => {
  next({
    status: 404,
    message: "Sorry, we couldn’t find that page.",
  })
})

// Error-handling middleware (catch ANY error)
app.use(async (err, req, res, next) => {
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)

  let status = err.status || 500
  res.status(status).render("errors/error", {
    title: `${status} Error`,
    message: err.message,
    status,
  })
})

module.exports = app

const errorRoute = require("./routes/errorRoute")
app.use("/error", errorRoute)
