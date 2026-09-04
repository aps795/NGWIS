import { db } from '../storage/dataStore.js';

export const submitContact = async (req, res, next) => {
  try {
    const { name, email, mobile, subject, message } = req.body;

    if (!name || !mobile || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, Mobile number, and Message are required.'
      });
    }

    const newMessage = {
      id: `msg-${Date.now()}`,
      name: name.trim(),
      email: email ? email.trim() : '',
      mobile: mobile.trim(),
      subject: subject ? subject.trim() : 'General Inquiry',
      message: message.trim(),
      receivedAt: new Date().toISOString(),
      read: false
    };

    const saved = db.addContactMessage(newMessage);

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully. Our administration team will contact you shortly.',
      messageId: saved.id
    });
  } catch (err) {
    next(err);
  }
};

export const getContactMessages = async (req, res, next) => {
  try {
    const messages = db.getContactMessages();
    return res.status(200).json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (err) {
    next(err);
  }
};
