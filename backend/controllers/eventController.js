import { db } from '../storage/dataStore.js';

export const getEvents = async (req, res, next) => {
  try {
    const events = db.getEvents();
    return res.status(200).json({
      success: true,
      count: events.length,
      events
    });
  } catch (err) {
    next(err);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const { title, date, time, venue, category, description, imageUrl } = req.body;

    if (!title || !date || !category || !description) {
      return res.status(400).json({
        success: false,
        error: 'Title, Date, Category, and Description are required.'
      });
    }

    const newEvent = {
      id: `evt-${Date.now()}`,
      title: title.trim(),
      date,
      time: time || '',
      venue: venue || 'School Campus Grounds',
      category,
      description: description.trim(),
      imageUrl: imageUrl || 'assets/school-children.jpg'
    };

    const saved = db.addEvent(newEvent);

    return res.status(201).json({
      success: true,
      message: 'Event scheduled successfully.',
      event: saved
    });
  } catch (err) {
    next(err);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteEvent(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: `Event with ID ${id} not found.`
      });
    }

    return res.status(200).json({
      success: true,
      message: `Event ${id} deleted successfully.`
    });
  } catch (err) {
    next(err);
  }
};
