import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');
const LOCAL_DB_FILE = path.join(DATA_DIR, 'schoolData.json');
const SEED_FILE = path.join(DATA_DIR, 'seedData.json');

class DataStore {
  constructor() {
    this._memoryData = null;
    this._dbPath = this._resolveDbPath();
    this._ensureDataFile();
  }

  _resolveDbPath() {
    // In serverless environments like Vercel or AWS Lambda, the local source directory is read-only.
    // We utilize /tmp which is fully writable across invocations.
    const isServerless = Boolean(
      process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.LAMBDA_TASK_ROOT
    );
    if (isServerless) {
      return path.join('/tmp', 'schoolData.json');
    }
    return LOCAL_DB_FILE;
  }

  _ensureDataFile() {
    try {
      const dir = path.dirname(this._dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (!fs.existsSync(this._dbPath)) {
        if (fs.existsSync(SEED_FILE)) {
          const seedContent = fs.readFileSync(SEED_FILE, 'utf-8');
          fs.writeFileSync(this._dbPath, seedContent, 'utf-8');
        } else if (fs.existsSync(LOCAL_DB_FILE)) {
          const content = fs.readFileSync(LOCAL_DB_FILE, 'utf-8');
          fs.writeFileSync(this._dbPath, content, 'utf-8');
        } else {
          const initial = {
            adminUsers: [],
            notices: [],
            events: [],
            gallery: [],
            enquiries: [],
            contactMessages: []
          };
          fs.writeFileSync(this._dbPath, JSON.stringify(initial, null, 2), 'utf-8');
        }
      }
    } catch (e) {
      console.warn('Could not initialize DB file on disk, fallback to in-memory store:', e.message);
    }
  }

  getData() {
    try {
      this._ensureDataFile();
      if (fs.existsSync(this._dbPath)) {
        const content = fs.readFileSync(this._dbPath, 'utf-8');
        const parsed = JSON.parse(content);
        if (!parsed.gallery) parsed.gallery = [];
        this._memoryData = parsed;
        return parsed;
      }
    } catch (err) {
      console.error('Error reading database file:', err.message);
    }

    if (this._memoryData) {
      return this._memoryData;
    }

    if (fs.existsSync(SEED_FILE)) {
      try {
        const seed = JSON.parse(fs.readFileSync(SEED_FILE, 'utf-8'));
        if (!seed.gallery) seed.gallery = [];
        this._memoryData = seed;
        return seed;
      } catch {}
    }

    return {
      adminUsers: [],
      notices: [],
      events: [],
      gallery: [],
      enquiries: [],
      contactMessages: []
    };
  }

  saveData(data) {
    this._memoryData = data;
    try {
      this._ensureDataFile();
      fs.writeFileSync(this._dbPath, JSON.stringify(data, null, 2), 'utf-8');
      return true;
    } catch (err) {
      console.error('Error writing to database file:', err.message);
      return false;
    }
  }

  // --- Auth Queries ---
  findAdminByEmail(email) {
    const data = this.getData();
    const cleanEmail = email.toLowerCase().trim();
    return data.adminUsers.find(u => u.email.toLowerCase().trim() === cleanEmail);
  }

  // --- Enquiries Queries ---
  getEnquiries(statusFilter) {
    const data = this.getData();
    if (!statusFilter || statusFilter === 'All') {
      return data.enquiries || [];
    }
    return (data.enquiries || []).filter(e => e.status === statusFilter);
  }

  addEnquiry(enquiry) {
    const data = this.getData();
    if (!Array.isArray(data.enquiries)) data.enquiries = [];
    data.enquiries.unshift(enquiry);
    this.saveData(data);
    return enquiry;
  }

  updateEnquiry(id, updates) {
    const data = this.getData();
    if (!Array.isArray(data.enquiries)) return null;
    const index = data.enquiries.findIndex(e => e.id === id);
    if (index === -1) return null;
    data.enquiries[index] = { ...data.enquiries[index], ...updates };
    this.saveData(data);
    return data.enquiries[index];
  }

  deleteEnquiry(id) {
    const data = this.getData();
    if (!Array.isArray(data.enquiries)) return false;
    const prevLen = data.enquiries.length;
    data.enquiries = data.enquiries.filter(e => e.id !== id);
    if (data.enquiries.length !== prevLen) {
      this.saveData(data);
      return true;
    }
    return false;
  }

  // --- Notices Queries ---
  getNotices(publishedOnly = true) {
    const data = this.getData();
    const list = Array.isArray(data.notices) ? data.notices : [];
    if (publishedOnly) {
      return list.filter(n => n.isPublished !== false);
    }
    return list;
  }

  addNotice(notice) {
    const data = this.getData();
    if (!Array.isArray(data.notices)) data.notices = [];
    data.notices.unshift(notice);
    this.saveData(data);
    return notice;
  }

  updateNotice(id, updates) {
    const data = this.getData();
    if (!Array.isArray(data.notices)) return null;
    const index = data.notices.findIndex(n => n.id === id);
    if (index === -1) return null;
    data.notices[index] = { ...data.notices[index], ...updates };
    this.saveData(data);
    return data.notices[index];
  }

  deleteNotice(id) {
    const data = this.getData();
    if (!Array.isArray(data.notices)) return false;
    const prevLen = data.notices.length;
    data.notices = data.notices.filter(n => n.id !== id);
    if (data.notices.length !== prevLen) {
      this.saveData(data);
      return true;
    }
    return false;
  }

  // --- Events Queries ---
  getEvents() {
    const data = this.getData();
    return Array.isArray(data.events) ? data.events : [];
  }

  addEvent(event) {
    const data = this.getData();
    if (!Array.isArray(data.events)) data.events = [];
    data.events.unshift(event);
    this.saveData(data);
    return event;
  }

  deleteEvent(id) {
    const data = this.getData();
    if (!Array.isArray(data.events)) return false;
    const prevLen = data.events.length;
    data.events = data.events.filter(e => e.id !== id);
    if (data.events.length !== prevLen) {
      this.saveData(data);
      return true;
    }
    return false;
  }

  // --- Gallery Queries ---
  getGallery(categoryFilter) {
    const data = this.getData();
    const galleryList = Array.isArray(data.gallery) ? data.gallery : [];
    if (!categoryFilter || categoryFilter === 'All') {
      return galleryList;
    }
    return galleryList.filter(item => item.category === categoryFilter);
  }

  addGalleryItem(item) {
    const data = this.getData();
    if (!Array.isArray(data.gallery)) data.gallery = [];
    data.gallery.unshift(item);
    this.saveData(data);
    return item;
  }

  deleteGalleryItem(id) {
    const data = this.getData();
    if (!Array.isArray(data.gallery)) return false;
    const prevLen = data.gallery.length;
    data.gallery = data.gallery.filter(item => item.id !== id);
    if (data.gallery.length !== prevLen) {
      this.saveData(data);
      return true;
    }
    return false;
  }

  // --- Contact Messages Queries ---
  addContactMessage(message) {
    const data = this.getData();
    if (!Array.isArray(data.contactMessages)) data.contactMessages = [];
    data.contactMessages.unshift(message);
    this.saveData(data);
    return message;
  }

  getContactMessages() {
    const data = this.getData();
    return Array.isArray(data.contactMessages) ? data.contactMessages : [];
  }
}

export const db = new DataStore();
