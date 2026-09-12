import { db } from '../storage/dataStore.js';

export const getFaculty = async (req, res, next) => {
  try {
    const faculty = db.getFaculty();
    return res.status(200).json({
      success: true,
      count: faculty.length,
      faculty
    });
  } catch (err) {
    next(err);
  }
};

export const createFacultyMember = async (req, res, next) => {
  try {
    const {
      id,
      name,
      designation,
      departmentOrSubject,
      isSeniorLeadership,
      roleCategory,
      photoUrl
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Faculty member name is required.'
      });
    }

    if (!designation || !designation.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Faculty designation is required.'
      });
    }

    const existingFaculty = db.getFaculty();
    let assignedId = Number(id);
    if (!assignedId || isNaN(assignedId)) {
      const maxId = existingFaculty.reduce((max, f) => Math.max(max, Number(f.id) || 0), 0);
      assignedId = maxId + 1;
    }

    const newMember = {
      id: assignedId,
      name: name.trim(),
      designation: designation.trim(),
      departmentOrSubject: (departmentOrSubject || '').trim(),
      isSeniorLeadership: Boolean(isSeniorLeadership),
      roleCategory: roleCategory || 'teacher',
      photoUrl: photoUrl ? photoUrl.trim() : ''
    };

    const saved = db.addFaculty(newMember);

    return res.status(201).json({
      success: true,
      message: 'Faculty member added successfully.',
      member: saved
    });
  } catch (err) {
    next(err);
  }
};

export const updateFacultyMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const numId = Number(id);

    if (!numId || isNaN(numId)) {
      return res.status(400).json({
        success: false,
        error: 'Valid numeric faculty ID is required.'
      });
    }

    const updates = {};
    if (req.body.name !== undefined) updates.name = String(req.body.name).trim();
    if (req.body.designation !== undefined) updates.designation = String(req.body.designation).trim();
    if (req.body.departmentOrSubject !== undefined) updates.departmentOrSubject = String(req.body.departmentOrSubject).trim();
    if (req.body.isSeniorLeadership !== undefined) updates.isSeniorLeadership = Boolean(req.body.isSeniorLeadership);
    if (req.body.roleCategory !== undefined) updates.roleCategory = req.body.roleCategory;
    if (req.body.photoUrl !== undefined) updates.photoUrl = String(req.body.photoUrl).trim();
    if (req.body.newId !== undefined) updates.id = Number(req.body.newId);

    const updated = db.updateFaculty(numId, updates);

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: `Faculty member with ID ${id} not found.`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Faculty member updated successfully.',
      member: updated
    });
  } catch (err) {
    next(err);
  }
};

export const deleteFacultyMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const numId = Number(id);

    if (!numId || isNaN(numId)) {
      return res.status(400).json({
        success: false,
        error: 'Valid numeric faculty ID is required.'
      });
    }

    const deleted = db.deleteFaculty(numId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: `Faculty member with ID ${id} not found.`
      });
    }

    return res.status(200).json({
      success: true,
      message: `Faculty member ${id} deleted successfully.`
    });
  } catch (err) {
    next(err);
  }
};
