const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***********************************************
* Build inventory by classification view
* ********************************************** */
invCont.buildByClassificationId = async function (req, res, next){
    try {
        const classification_id = req.params.classificationId
        const data = await invModel.getInventoryByClassificationId(classification_id)
        const grid = await utilities.buildClassificationGrid(data)
        let nav = await utilities.getNav()
        const className = data[0].classification_name
        res.render("./inventory/classification", {
            title: className +" "+ "vehicles",
            nav,
            grid,
        })
    } catch (error) {
        next(error)
    }
}

/* ***********************************************
* Build Items by item_id view
* ********************************************** */
invCont.buildByInventoryId = async function (req, res, next) {
    try {
        const inventory_id  = req.params.inventoryId
        const data = await invModel.getInventoryByInventoryId(inventory_id)
        const flex = await utilities.buildInventoryFlex(data)
        let nav = await utilities.getNav()
        const invName = data[0].inv_model
        const invMake = data[0].inv_make
        const invYear = data[0].inv_year

        res.render("./inventory/item", {
            title: invYear +" "+ invMake + " " + invName,
            nav,
            flex,
        })
    } catch (error) {
        next(error)
    }
}

/* ***********************************************
* Build Vehicle Detail View for Task 1
* ********************************************** */
invCont.buildVehicleDetail = async function(req, res, next) {
    try {
        const vehicleId = parseInt(req.params.inv_id);
        
        // Validate ID
        if (isNaN(vehicleId) || vehicleId <= 0) {
            const error = new Error('Invalid vehicle ID format');
            error.status = 400;
            throw error;
        }

        const vehicleData = await invModel.getVehicleById(vehicleId);
        
        if (!vehicleData) {
            const error = new Error(`Vehicle with ID ${vehicleId} not found`);
            error.status = 404;
            throw error;
        }
        
        const vehicleHTML = utilities.wrapVehicleInHTML(vehicleData);
        
        let nav = await utilities.getNav();
        res.render('inventory/detail', {
            title: `${vehicleData.inv_year} ${vehicleData.inv_make} ${vehicleData.inv_model}`,
            vehicleHTML: vehicleHTML,
            nav
        });
    } catch (error) {
        next(error);
    }
}

/* ***********************************************
* Intentional error for Task 3
* ********************************************** */
invCont.triggerInventoryError = async function(req, res, next) {
    try {
        throw new Error("This is an intentional error thrown for the assignment.");
    } catch (err) {
        next({status: 500, message: 'This is an intentional error thrown for the assignment.'});
    }
}

module.exports = invCont;