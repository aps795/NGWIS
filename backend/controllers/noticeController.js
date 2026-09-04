import { db } from '../storage/dataStore.js';

export const getNotices = async (req, res, next) => {
  try {
    const isStaff = Boolean(req.user);
    const notices = db.getNotices(!isStaff);

    return res.status(200).json({
      success: true,
      count: notices.length,
      notices
    });
  } catch (err) {
    next(err);
  }
};

export const createNotice = async (req, res, next) => {
  try {
    const { title, category, summary, content, isPinned, isPublished, fileDownloadName } = req.body;

    if (!title || !category || !summary || !content) {
      return res.status(400).json({
        success: false,
        error: 'Title, Category, Summary, and Content are required.'
      });
    }

    const newNotice = {
      id: `not-${Date.now()}`,
      title: title.trim(),
      date: new Date().toISOString().split('T')[0],
      category,
      summary: summary.trim(),
      content: content.trim(),
      isPinned: Boolean(isPinned),
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      fileDownloadName: fileDownloadName || undefined
    };

    const saved = db.addNotice(newNotice);

    return res.status(201).json({
      success: true,
      message: 'Notice published successfully.',
      notice: saved
    });
  } catch (err) {
    next(err);
  }
};

export const updateNotice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = db.updateNotice(id, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: `Notice with ID ${id} not found.`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Notice updated successfully.',
      notice: updated
    });
  } catch (err) {
    next(err);
  }
};

export const deleteNotice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteNotice(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: `Notice with ID ${id} not found.`
      });
    }

    return res.status(200).json({
      success: true,
      message: `Notice ${id} deleted successfully.`
    });
  } catch (err) {
    next(err);
  }
};
