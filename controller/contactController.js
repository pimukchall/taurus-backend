const contactModel = require('../models/contactModel');

exports.getAllContactRequests = async (req, res) => {
  try {
    const contactRequests = await contactModel.findAllContactRequests();
    res.status(200).json({
      status: 'success',
      count: contactRequests.length,
      data: { contactRequests }
    });
  } catch (error) {
    console.error("Get All Contact Requests Error:", error);
    res.status(500).json({
      status: 'error',
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลคำขอติดต่อ'
    });
  }
}