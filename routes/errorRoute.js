const express = require("express")
const router = express.Router()
const errorController = require("../controllers/errorController")



// The intentional error

router.get("/trigger-error", errorController.throwError);


module.exports = router
