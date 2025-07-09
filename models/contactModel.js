const { pool } = require("../config/database");

exports.findAllContactRequests = async () => {
  const sql = `
    SELECT
    cr.id AS contact_request_id,
    cr.full_name,
    cr.email,
    cr.phone,
    cr.created_at,
    GROUP_CONCAT(rs.name_th ORDER BY rs.name_th SEPARATOR ', ') AS services_th,
    GROUP_CONCAT(rs.name_en ORDER BY rs.name_en SEPARATOR ', ') AS services_en
    FROM contact_requests cr
    LEFT JOIN contact_request_services crs ON cr.id = crs.contact_request_id
    LEFT JOIN request_services rs ON crs.service_id = rs.id
    GROUP BY cr.id
    ORDER BY cr.created_at DESC;
    `;

  const [rows] = await pool.query(sql);
  return rows;
};
