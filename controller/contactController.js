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

exports.getContactRequestById = async (req, res) => {
  const { id } = req.params;
  try {
    const contactRequest = await contactModel.findContactRequestById(id);
    if (!contactRequest) {
      return res.status(404).json({
        status: 'fail',
        message: 'ไม่พบคำขอติดต่อที่ระบุ'
      });
    }
    res.status(200).json({
      status: 'success',
      data: { contactRequest }
    });
  } catch (error) {
    console.error("Get Contact Request By ID Error:", error);
    res.status(500).json({
      status: 'error',
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลคำขอติดต่อ'
    });
  }
}

exports.createContactRequest = async (req, res) => {
  const { fullName, email, phone, budget, location, additionalDetails, acceptTerms, services } = req.body;
  try {
    const newContactRequest = await contactModel.createContactRequest(fullName, email, phone, budget, location, additionalDetails, acceptTerms, services);
    res.status(201).json({
      status: 'success',
      data: { contactRequest: newContactRequest }
    });
  } catch (error) {
    console.error("Create Contact Request Error:", error);
    res.status(500).json({
      status: 'error',
      message: 'เกิดข้อผิดพลาดในการสร้างคำขอติดต่อ'
    });
  }
}

exports.deleteContactRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedContactRequest = await contactModel.deleteContactRequest(id);
    if (!deletedContactRequest) {
      return res.status(404).json({
        status: 'fail',
        message: 'ไม่พบคำขอติดต่อที่ระบุ'
      });
    }
    res.status(204).json({
      status: 'success',
      message: 'ลบคำขอติดต่อสำเร็จ'
    });
  } catch (error) {
    console.error("Delete Contact Request Error:", error);
    res.status(500).json({
      status: 'error',
      message: 'เกิดข้อผิดพลาดในการลบคำขอติดต่อ'
    });
  }
}