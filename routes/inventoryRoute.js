// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory item detail view
router.get("/item/:inventoryId", invController.buildByInventoryId)



// Intentional error route 
router.get('/trigger-error', invController.triggerInventoryError);

router.post("/update/", invController.updateInventory)

module.exports = router;