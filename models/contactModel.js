// const { pool } = require('../config/database');

// exports.createContactRequest = async (
//   conn,
//   full_name,
//   email,
//   phone,
//   budget,
//   location,
//   additional_details,
//   accept_terms
// ) => {
//   const sql = `
//     INSERT INTO contact_requests 
//     (full_name, email, phone, budget, location, additional_details, accept_terms, created_at)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//   `;

//   const [result] = await conn.query(sql, [
//     full_name,
//     email,
//     phone,
//     budget,
//     location,
//     additional_details,
//     accept_terms ? 1 : 0,
//     new Date(),
//   ]);

//   return result.insertId;
// };

// exports.linkServicesToContact = async (conn, contactId, serviceIds) => {
//   const sql = `
//     INSERT INTO contact_request_services (contact_request_id, service_id)
//     VALUES (?, ?)
//   `;

//   for (const serviceId of serviceIds) {
//     await conn.query(sql, [contactId, serviceId]);
//   }
// };
