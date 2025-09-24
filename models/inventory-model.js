const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

module.exports = {getClassifications}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

module.exports = {getClassifications, getInventoryByClassificationId};




const pool = require('../database/');

const invModel = {};

// Get vehicle by inventory ID
invModel.getVehicleById = async function(inventoryId) {
    try {
        const sql = `
            SELECT 
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
            FROM inventory 
            WHERE inv_id = $1
        `;
        
        const result = await pool.query(sql, [inventoryId]);
        return result.rows[0];
    } catch (error) {
        console.error('getVehicleById error: ' + error);
        return null;
    }
};

module.exports = invModel;




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