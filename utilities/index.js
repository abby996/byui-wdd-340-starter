const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors"/></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the inventory view HTML
 * ************************************ */
Util.buildInventoryFlex = async function (data) {
  let flex;
  if (data.length > 0) {
    flex = '<div id="inv_item" class="flex_item_container">';
    flex += '<div id="item_image">';
    flex +=
      '<img src="' +
      data[0].inv_image +
      '" title="' +
      data[0].inv_make +
      " " +
      data[0].inv_model +
      '" alt="Image of ' +
      data[0].inv_make +
      " " +
      data[0].inv_model +
      ' on CSE Motors" />';
    flex += "</div>";
    flex += '<section id="item_details">';
    flex +=
      '<h2 id="details_heading">' +
      data[0].inv_make +
      " " +
      data[0].inv_model +
      "</h2>";
    flex += '<ul id="detail_list">';
    flex +=
      "<li><strong>Price:</strong> $" +
      new Intl.NumberFormat("en-US").format(data[0].inv_price) +
      "</li>";
    flex +=
      "<li><strong>Description:</strong> " + data[0].inv_description + "</li>";
    flex += "<li><strong>Color:</strong> " + data[0].inv_color + "</li>";
    flex +=
      "<li><strong>Miles:</strong> " +
      new Intl.NumberFormat("en-US").format(data[0].inv_miles) +
      "</li>";
    flex += "</ul>";
    flex += "</section>";
    flex += "</div>";
  } else {
    flex += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return flex;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Format price as US Dollars
Util.formatPrice = function(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

// Format mileage with commas
Util.formatMileage = function(miles) {
    return new Intl.NumberFormat('en-US').format(miles);
}




/* ****************************************
 * This function build the select html element.
 **************************************** */
Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
      '<select name="classification_id" class="form input" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
  }
  

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);



module.exports = Util;





module.exports = Util;