const pool = require("../database/")

const invModel = {};

/* ***************************
 *  Get all classification data
 * ************************** */
invModel.getClassifications = async function(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
invModel.getInventoryByClassificationId = async function(classification_id) {
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
    return null
  }
}

/* ***************************
 *  Get vehicle by inventory ID
 * ************************** */
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
            FROM public.inventory 
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