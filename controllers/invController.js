const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

 module.exports = invCont

 const invModel = require('../models/inventory-model');
const utilities = require('../utilities/');

const invController = {};

// Build vehicle detail view
invController.buildVehicleDetail = async function(req, res, next) {
    try {
        const vehicleId = req.params.id;
        const vehicleData = await invModel.getVehicleById(vehicleId);
        
        if (!vehicleData) {
            throw new Error('Vehicle not found');
        }
        
        const vehicleHTML = utilities.wrapVehicleInHTML(vehicleData);
        
        res.render('inventory/detail', {
            title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
            vehicleHTML: vehicleHTML
        });
    } catch (error) {
        next(error);
    }
};

module.exports = invController;