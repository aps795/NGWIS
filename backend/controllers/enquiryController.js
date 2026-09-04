import { db } from '../storage/dataStore.js';

export const createEnquiry = async (req, res, next) => {
  try {
    const { studentName, parentName, classApplying, mobile, email, address, message } = req.body;

    if (!studentName || !parentName || !classApplying || !mobile) {
      return res.status(400).json({
        success: false,
        error: 'Student Name, Parent Name, Class, and Mobile Number are required.'
      });
    }

    // Format Reference Tracking ID
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const trackingId = `ENQ-${randomSuffix}`;

    const newEnquiry = {
      id: trackingId,
      studentName: studentName.trim(),
      parentName: parentName.trim(),
      classApplying: classApplying.trim(),
      mobile: mobile.trim(),
      email: email ? email.trim() : '',
      address: address ? address.trim() : '',
      message: message ? message.trim() : '',
      status: 'New',
      submittedAt: new Date().toISOString(),
      adminNotes: ''
    };

    const saved = db.addEnquiry(newEnquiry);

    return res.status(201).json({
      success: true,
      message: 'Admission enquiry submitted successfully. Tracking reference generated.',
      trackingId,
      enquiry: saved
    });
  } catch (err) {
    next(err);
  }
};

export const getEnquiries = async (req, res, next) => {
  try {
    const { status } = req.query;
    const enquiries = db.getEnquiries(status);

    return res.status(200).json({
      success: true,
      count: enquiries.length,
      enquiries
    });
  } catch (err) {
    next(err);
  }
};

export const updateEnquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const updates = {};
    if (status) updates.status = status;
    if (adminNotes !== undefined) updates.adminNotes = adminNotes;

    const updated = db.updateEnquiry(id, updates);

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: `Enquiry with ID ${id} not found.`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Enquiry updated successfully.',
      enquiry: updated
    });
  } catch (err) {
    next(err);
  }
};

export const deleteEnquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteEnquiry(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: `Enquiry with ID ${id} not found.`
      });
    }

    return res.status(200).json({
      success: true,
      message: `Enquiry ${id} deleted successfully.`
    });
  } catch (err) {
    next(err);
  }
};
