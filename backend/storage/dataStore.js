import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'schoolData.json');
const SEED_FILE = path.join(DATA_DIR, 'seedData.json');

class DataStore {
  constructor() {
    this._ensureDataFile();
  }

  _ensureDataFile() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      if (fs.existsSync(SEED_FILE)) {
        const seedContent = fs.readFileSync(SEED_FILE, 'utf-8');
        fs.writeFileSync(DB_FILE, seedContent, 'utf-8');
      } else {
        const initial = {
          adminUsers: [],
          notices: [],
          events: [],
          enquiries: [],
          contactMessages: []
        };
        fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      }
    }
  }

  getData() {
    try {
      this._ensureDataFile();
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    } catch (err) {
      console.error('Error reading database file:', err);
      return {
        adminUsers: [],
        notices: [],
        events: [],
        enquiries: [],
        contactMessages: []
      };
    }
  }

  saveData(data) {
    try {
      this._ensureDataFile();
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
      return true;
    } catch (err) {
      console.error('Error writing to database file:', err);
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
      return data.enquiries;
    }
    return data.enquiries.filter(e => e.status === statusFilter);
  }

  addEnquiry(enquiry) {
    const data = this.getData();
    data.enquiries.unshift(enquiry);
    this.saveData(data);
    return enquiry;
  }

  updateEnquiry(id, updates) {
    const data = this.getData();
    const index = data.enquiries.findIndex(e => e.id === id);
    if (index === -1) return null;
    data.enquiries[index] = { ...data.enquiries[index], ...updates };
    this.saveData(data);
    return data.enquiries[index];
  }

  deleteEnquiry(id) {
    const data = this.getData();
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
    if (publishedOnly) {
      return data.notices.filter(n => n.isPublished);
    }
    return data.notices;
  }

  addNotice(notice) {
    const data = this.getData();
    data.notices.unshift(notice);
    this.saveData(data);
    return notice;
  }

  updateNotice(id, updates) {
    const data = this.getData();
    const index = data.notices.findIndex(n => n.id === id);
    if (index === -1) return null;
    data.notices[index] = { ...data.notices[index], ...updates };
    this.saveData(data);
    return data.notices[index];
  }

  deleteNotice(id) {
    const data = this.getData();
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
    return this.getData().events;
  }

  addEvent(event) {
    const data = this.getData();
    data.events.push(event);
    this.saveData(data);
    return event;
  }

  deleteEvent(id) {
    const data = this.getData();
    const prevLen = data.events.length;
    data.events = data.events.filter(e => e.id !== id);
    if (data.events.length !== prevLen) {
      this.saveData(data);
      return true;
    }
    return false;
  }

  // --- Contact Messages Queries ---
  addContactMessage(message) {
    const data = this.getData();
    data.contactMessages.unshift(message);
    this.saveData(data);
    return message;
  }

  getContactMessages() {
    return this.getData().contactMessages;
  }
}

export const db = new DataStore();
