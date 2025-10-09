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





/* ****************************************
*  Process the add inventory
* *************************************** */
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_year,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
 } = req.body
  
  const regResult = await invModel.addInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_year,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  )

  if (regResult) {
    req.flash(
      "notice successful",
      `Congratulations, you have added ${inv_make} ${inv_model} to your inventory.`
    )
    res.status(201).render("./inventory/", {
      title: "Vehicles Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice failed", "Sorry, there was an error in the proccess of adding the inventory, try again.")
    res.status(501).render("./inventory/add_inv", {
      title: "Add New Inventory",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
*  Process the add classification
* *************************************** */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  
  const regResult = await invModel.addClassification( classification_name )
  if (regResult) {
    req.flash(
      "notice successful",
      `Congratulations, you have added ${classification_name} to your classification list.`
    )
    res.status(201).render("./inventory/", {
      title: "Vehicles Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice failed", "Sorry, there was an error in the proccess of adding the classification, try again.")
    res.status(501).render("./inventory/add_class", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
  }
}



/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

module.exports = invCont;