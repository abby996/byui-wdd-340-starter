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

module.exports = Util

console.log(data)


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)





// Format price as US Dollars
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

// Format mileage with commas
function formatMileage(miles) {
    return new Intl.NumberFormat('en-US').format(miles);
}

// Wrap vehicle data in HTML
function wrapVehicleInHTML(vehicle) {
    return `
        <div class="vehicle-detail">
            <div class="vehicle-image">
                <img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}" class="img-fluid">
            </div>
            
            <div class="vehicle-info">
                <div class="vehicle-header">
                    <h1>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h1>
                    <div class="vehicle-price">${formatPrice(vehicle.inv_price)}</div>
                </div>
                
                <div class="vehicle-specs">
                    <div class="spec-item">
                        <span class="spec-label">Mileage:</span>
                        <span class="spec-value">${formatMileage(vehicle.inv_miles)} miles</span>
                    </div>
                    
                    <div class="spec-item">
                        <span class="spec-label">Color:</span>
                        <span class="spec-value">${vehicle.inv_color}</span>
                    </div>
                    
                    <div class="spec-item">
                        <span class="spec-label">Stock #:</span>
                        <span class="spec-value">${vehicle.inv_id}</span>
                    </div>
                </div>
                
                <div class="vehicle-description">
                    <h3>Vehicle Description</h3>
                    <p>${vehicle.inv_description}</p>
                </div>
                
                <div class="vehicle-actions">
                    <button class="btn-primary">Schedule Test Drive</button>
                    <button class="btn-secondary">Check Financing</button>
                </div>
            </div>
        </div>
    `;
}

module.exports = {
    formatPrice,
    formatMileage,
    wrapVehicleInHTML
};