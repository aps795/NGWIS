import { db } from '../storage/dataStore.js';

export const getGallery = async (req, res, next) => {
  try {
    const { category } = req.query;
    const gallery = db.getGallery(category);

    return res.status(200).json({
      success: true,
      count: gallery.length,
      gallery
    });
  } catch (err) {
    next(err);
  }
};

export const createGalleryItem = async (req, res, next) => {
  try {
    const { title, category, imageUrl, caption } = req.body;

    if (!title || !imageUrl) {
      return res.status(400).json({
        success: false,
        error: 'Title and Image URL are required.'
      });
    }

    const newItem = {
      id: `gal-${Date.now()}`,
      title: title.trim(),
      category: category || 'Campus',
      imageUrl: imageUrl.trim(),
      caption: caption ? caption.trim() : ''
    };

    const saved = db.addGalleryItem(newItem);

    return res.status(201).json({
      success: true,
      message: 'Photo added to gallery successfully.',
      item: saved
    });
  } catch (err) {
    next(err);
  }
};

export const deleteGalleryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteGalleryItem(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: `Gallery photo with ID ${id} not found.`
      });
    }

    return res.status(200).json({
      success: true,
      message: `Photo ${id} removed from gallery successfully.`
    });
  } catch (err) {
    next(err);
  }
};
