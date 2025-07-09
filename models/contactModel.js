const { pool } = require("../config/database");

exports.findAllContactRequests = async () => {
  const sql = `
    SELECT
      cr.id AS contact_request_id,
      cr.full_name,
      cr.email,
      cr.phone,
      cr.budget,
      cr.location,
      cr.additional_details,
      cr.accept_terms,
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

exports.findContactRequestById = async (id) => {
  const sql = `
    SELECT
      cr.id AS contact_request_id,
      cr.full_name,
      cr.email,
      cr.phone,
      cr.budget,
      cr.location,
      cr.additional_details,
      cr.accept_terms,
      cr.created_at,
      GROUP_CONCAT(rs.name_th ORDER BY rs.name_th SEPARATOR ', ') AS services_th,
      GROUP_CONCAT(rs.name_en ORDER BY rs.name_en SEPARATOR ', ') AS services_en
    FROM contact_requests cr
    LEFT JOIN contact_request_services crs ON cr.id = crs.contact_request_id
    LEFT JOIN request_services rs ON crs.service_id = rs.id
    WHERE cr.id = ?
    GROUP BY cr.id;
  `;

  const [rows] = await pool.query(sql, [id]);
  return rows[0] || null;
};

exports.createContactRequest = async (
  fullName,
  email,
  phone,
  budget,
  location,
  additionalDetails,
  acceptTerms,
  services
) => {
  const sql = `
    INSERT INTO contact_requests (
      full_name, 
      email, 
      phone,
      budget,
      location,
      additional_details,
      accept_terms,
      created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
  `;

  const [result] = await pool.query(sql, [
    fullName,
    email,
    phone,
    budget,
    location,
    additionalDetails,
    acceptTerms,
    new Date()
  ]);

  const contactRequestId = result.insertId;

  if (services && services.length > 0) {
    const serviceValues = services.map(serviceId => [contactRequestId, serviceId]);
    const serviceSql = `
      INSERT INTO contact_request_services (contact_request_id, service_id)
      VALUES ?;
    `;
    await pool.query(serviceSql, [serviceValues]);
  }

  return contactRequestId;
};

exports.deleteContactRequest = async (id) => {
  const sql = `
    DELETE FROM contact_requests
    WHERE id = ?;
  `;

  const [result] = await pool.query(sql, [id]);
  return result.affectedRows > 0;
};
