// Needed resources
const utilities = require("./index");
const { body, validationResult } = require("express-validator");
const validate = {};

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.addInventoryRules = () => {
  return [
    // inventory make is required and must be string
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Provide the make."), // on error this message is sent.

    // inventory model is required and must be string
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Provide the model."), // on error this message is sent.

    // inventory description is required and must be string
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Provide a description."), // on error this message is sent.

    // inventory year is required and cannot
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Vehicle year is required")
      .isInt({min: 1000, max: 9999})
      .withMessage("A valid 4-digit year is required."),

    // inventory image path is required
    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Inventory image path is require."),

    // inventory thumbnail is required and must be string
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Inventory thumbnail path is require."), // on error this message is sent.

    // inventory price is required
    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Provide the inventory price."), // on error this message is sent.

    // inventory miles is required and must be integer
    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Provide the inventory miles.")
      .isInt({min: 0})
      .withMessage("The inventory miles must be in integer."), // on error this message is sent.

    // Inventory color is required and must be string
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Provide the color."), // on error this message is sent.
  ];
};

/* ******************************
 * Check data and return errors or continue to add inventory
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_year,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList(classification_id)
    res.render("inventory/add_inv", {
      errors,
      title: "Add New Inventory",
      nav,
      classificationList,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_year,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    });
    return;
  }
  next();
};

/*  **********************************
 *  classification Data Validation Rules
 * ********************************* */
validate.addClassificationRules = () => {
  return [
    // A valid name for the classification is required
    body("classification_name")
      .trim()
      .notEmpty()
      .withMessage("Classification name required.")
      .matches(/^\S+$/)
      .withMessage(
        "Classification name must not contain space."
      ),
  ];
};

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add_class", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

module.exports = validate;