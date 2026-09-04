import virendraImg from '../assets/faculty/virendra-nath-singh.jpg';
import rkSinghImg from '../assets/faculty/rk-singh.jpg';
import nilayImg from '../assets/faculty/nilay-singh.jpg';
import nikhilImg from '../assets/faculty/nikhil-singh.jpg';
import aditeeImg from '../assets/faculty/aditee-singh.jpg';
import swapnilImg from '../assets/faculty/swapnil-singh.jpg';
import atulImg from '../assets/faculty/atul-singh.jpg';
import manojImg from '../assets/faculty/manoj-kumar.jpg';
import pankajImg from '../assets/faculty/pankaj-dubey.jpg';

export interface FacultyMember {
  id: number;
  name: string;
  designation: string;
  departmentOrSubject: string;
  isSeniorLeadership: boolean; // Bold in official school records (1, 2, 3, 4, 5, 6, 7, 8, 11, 22)
  roleCategory: 'leadership' | 'hod' | 'coordinator' | 'teacher' | 'parent_teacher';
  photoUrl?: string;
}

// Complete 42 staff members in strict Serial Number (S.No. / Kram) order 1 to 42
export const facultyList: FacultyMember[] = [
  {
    id: 1,
    name: 'Mr. Virendra Nath Singh',
    designation: 'Ex. Principal',
    departmentOrSubject: 'Institutional Advisory & Governance',
    isSeniorLeadership: true,
    roleCategory: 'leadership',
    photoUrl: virendraImg
  },
  {
    id: 2,
    name: 'Mr. R.K. Singh',
    designation: 'Chairman',
    departmentOrSubject: 'School Trust & Management',
    isSeniorLeadership: true,
    roleCategory: 'leadership',
    photoUrl: rkSinghImg
  },
  {
    id: 3,
    name: 'Mr. Nilay Singh',
    designation: 'Principal',
    departmentOrSubject: 'Head of Institution & Academic Administration',
    isSeniorLeadership: true,
    roleCategory: 'leadership',
    photoUrl: nilayImg
  },
  {
    id: 4,
    name: 'Mr. Nikhil Singh',
    designation: 'HoD – Leadership and Management',
    departmentOrSubject: 'Institutional Leadership & Operations',
    isSeniorLeadership: true,
    roleCategory: 'hod',
    photoUrl: nikhilImg
  },
  {
    id: 5,
    name: 'Mrs. Aditee Singh',
    designation: 'HoD – Academic Development',
    departmentOrSubject: 'Pedagogy & Curriculum Standards',
    isSeniorLeadership: true,
    roleCategory: 'hod',
    photoUrl: aditeeImg
  },
  {
    id: 6,
    name: 'Mrs. Swapnil Singh',
    designation: 'Coordinator',
    departmentOrSubject: 'Academic & Co-curricular Coordination',
    isSeniorLeadership: true,
    roleCategory: 'coordinator',
    photoUrl: swapnilImg
  },
  {
    id: 7,
    name: 'Mrs. Neelam Prajapati',
    designation: 'Assistant Teacher – Hindi',
    departmentOrSubject: 'Hindi Language & Literature',
    isSeniorLeadership: true,
    roleCategory: 'teacher'
  },
  {
    id: 8,
    name: 'Mr. Atul Singh',
    designation: 'HoD – IT / Planning and Strategy Development',
    departmentOrSubject: 'Information Technology & Strategic Planning',
    isSeniorLeadership: true,
    roleCategory: 'hod',
    photoUrl: atulImg
  },
  {
    id: 9,
    name: 'Mr. Sunil Kumar',
    designation: 'Associate Teacher – Math',
    departmentOrSubject: 'Mathematics & Arithmetic Reasoning',
    isSeniorLeadership: false,
    roleCategory: 'teacher'
  },
  {
    id: 10,
    name: 'Khushbu Vishwakarma',
    designation: 'Parent Teacher',
    departmentOrSubject: 'Parent-Teacher Collaboration & Student Support',
    isSeniorLeadership: false,
    roleCategory: 'parent_teacher'
  },
  {
    id: 11,
    name: 'Mr. Manoj Kumar',
    designation: 'Associate Teacher – Science',
    departmentOrSubject: 'General & Applied Sciences',
    isSeniorLeadership: true,
    roleCategory: 'teacher',
    photoUrl: manojImg
  },
  {
    id: 12,
    name: 'Mr. Chandan Prajapati',
    designation: 'Assistant Teacher – Science',
    departmentOrSubject: 'General Science & Lab Experiments',
    isSeniorLeadership: false,
    roleCategory: 'teacher'
  },
  {
    id: 13,
    name: 'Miss Sandhya Roy',
    designation: 'Assistant Teacher – English',
    departmentOrSubject: 'English Grammar & Literature',
    isSeniorLeadership: false,
    roleCategory: 'teacher'
  },
  {
    id: 14,
    name: 'Mr. Rajan Kumar',
    designation: 'Assistant Teacher – Hindi',
    departmentOrSubject: 'Hindi Language & Composition',
    isSeniorLeadership: false,
    roleCategory: 'teacher'
  },
  {
    id: 15,
    name: 'Mr. Shashank Tiwari',
    designation: 'Assistant Teacher – Math',
    departmentOrSubject: 'Mathematics & Mental Math',
    isSeniorLeadership: false,
    roleCategory: 'teacher'
  },
  {
    id: 16,
    name: 'Mr. Shashikant Prajapati',
    designation: 'Assistant Teacher – SST',
    departmentOrSubject: 'Social Studies & Geography',
    isSeniorLeadership: false,
    roleCategory: 'teacher'
  },
  {
    id: 17,
    name: 'Ms. Purnima Singh',
    designation: 'Assistant Teacher – Art',
    departmentOrSubject: 'Fine Arts, Drawing & Creative Expression',
    isSeniorLeadership: false,
    roleCategory: 'teacher'
  },
  {
    id: 18,
    name: 'Mr. Kishan Singh',
    designation: 'Assistant Teacher – English',
    departmentOrSubject: 'English Language & Communication Skills',
    isSeniorLeadership: false,
    roleCategory: 'teacher'
  },
  {
    id: 19,
    name: 'Mrs. Amrita Singh',
    designation: 'Assistant Teacher – English',
    departmentOrSubject: 'English Phonics & Primary Grammar',
    isSeniorLeadership: false,
    roleCategory: 'teacher'
  },
  {
    id: 20,
    name: 'Mr. Satyam Singh',
    designation: 'Assistant Teacher – SST',
    departmentOrSubject: 'Social Studies, History & Civics',
    isSeniorLeadership: false,
    roleCategory: 'teacher'
  },
  {
    id: 21,
    name: 'Mr. JN Tiwari',
    designation: 'Assistant Teacher – Hindi',
    departmentOrSubject: 'Hindi Language & Moral Education',
    isSeniorLeadership: false,
    roleCategory: 'teacher'
  },
  {
    id: 22,
    name: 'Mr. Pankaj Dubey',
    designation: 'Associate Teacher – Hindi',
    departmentOrSubject: 'Hindi Language & Vyakaran',
    isSeniorLeadership: true,
    roleCategory: 'teacher',
    photoUrl: pankajImg
  },
  {
    id: 23,
    name: 'Mr. Vivek Singh',
    designation: 'Computer Lab Coordinator',
    departmentOrSubject: 'Computer Science, ICT & Lab Supervision',
    isSeniorLeadership: false,
    roleCategory: 'coordinator'
  },
  {
    id: 24,
    name: 'Mrs. Punam Singh',
    designation: 'Assistant Teacher – Hindi',
    departmentOrSubject: 'Hindi Reading, Writing & Poetry',
    isSeniorLeadership: false,
    roleCategory: 'teacher'
  },
  {
    id: 25,
    name: 'Mrs. Ranjana Singh',
    designation: 'Parent Teacher',
    departmentOrSubject: 'Early Childhood Guidance & Parent Liaison',
    isSeniorLeadership: false,
    roleCategory: 'parent_teacher'
  },
  {
    id: 26,
    name: 'Mr. Vivek Maurya',
    designation: 'Assistant Teacher – Physics',
    departmentOrSubject: 'Physics & Applied Physical Science',
    isSeniorLeadership: false,
    roleCategory: 'teacher'
  },
  {
    id: 27,
    name: 'Ms. Menika Sharma',
    designation: 'Parent Teacher',
    departmentOrSubject: 'Parent-Student Engagement & Counseling',
    isSeniorLeadership: false,
    roleCategory: 'parent_teacher'
  },
  {
    id: 28,
    name: 'Ms. Ragini Yadav',
    designation: 'Assistant Teacher – Hindi',
    departmentOrSubject: 'Hindi Sahitya & Vyakaran',
    isSeniorLeadership: false,
    roleCategory: 'teacher'
  },
  {
    id: 29,
    name: 'Ms. Rimjhim Yadav',
    designation: 'Assistant Teacher – Math',
    departmentOrSubject: 'Mathematics & Number Theory',
    isSeniorLeadership: false,
    roleCategory: 'teacher'
  },
  {
    id: 30,
    name: 'Miss Tanu Dubey',
    designation: 'Parent Teacher',
    departmentOrSubject: 'Student Development & Co-Scholastic Support',
    isSeniorLeadership: false,
    roleCategory: 'parent_teacher'
  },
  {
    id: 31,
    name: 'Mrs. Chandan Singh',
    designation: 'Assistant Teacher – English',
    departmentOrSubject: 'English Language & Reading Fluency',
    isSeniorLeadership: false,
    roleCategory: 'teacher'
  },
  {
    id: 32,
    name: 'Ms. Kajal Dube',
    designation: 'Assistant Teacher – Math',
    departmentOrSubject: 'Mathematics & Practical Arithmetic',
    isSeniorLeadership: false,
    roleCategory: 'teacher'
  },
  {
    id: 33,
    name: 'Mr. Satish Kumar',
    designation: 'Assistant Teacher – Hindi',
    departmentOrSubject: 'Hindi Language & Cultural Dialogue',
    isSeniorLeadership: false,
    roleCategory: 'teacher'
  },
  {
    id: 34,
    name: 'Mrs. Rekha Singh',
    designation: 'Parent Teacher',
    departmentOrSubject: 'Student Guidance & Community Connection',
    isSeniorLeadership: false,
    roleCategory: 'parent_teacher'
  },
  {
    id: 35,
    name: 'Miss Aliza Fatima',
    designation: 'Parent Teacher',
    departmentOrSubject: 'Foundational Learning & Mentorship',
    isSeniorLeadership: false,
    roleCategory: 'parent_teacher'
  },
  {
    id: 36,
    name: 'Miss Aaradhya Yadav',
    designation: 'Parent Teacher',
    departmentOrSubject: 'Early Childhood Activities & Student Care',
    isSeniorLeadership: false,
    roleCategory: 'parent_teacher'
  },
  {
    id: 37,
    name: 'Miss Shruti Maurya',
    designation: 'Assistant Teacher – Science',
    departmentOrSubject: 'Integrated Science & Environmental Studies',
    isSeniorLeadership: false,
    roleCategory: 'teacher'
  },
  {
    id: 38,
    name: 'Miss Priti Vishwakarma',
    designation: 'Assistant Teacher – Hindi',
    departmentOrSubject: 'Hindi Grammar & Creative Writing',
    isSeniorLeadership: false,
    roleCategory: 'teacher'
  },
  {
    id: 39,
    name: 'Ms. Anee Yadav',
    designation: 'Assistant Teacher – Biology',
    departmentOrSubject: 'Biology & Life Sciences',
    isSeniorLeadership: false,
    roleCategory: 'teacher'
  },
  {
    id: 40,
    name: 'Miss Priyanka Prajapati',
    designation: 'Assistant Teacher – Chemistry',
    departmentOrSubject: 'Chemistry & Chemical Sciences',
    isSeniorLeadership: false,
    roleCategory: 'teacher'
  },
  {
    id: 41,
    name: 'Ms. Sakshi Singh',
    designation: 'Assistant Teacher – English',
    departmentOrSubject: 'English Communication & Literature',
    isSeniorLeadership: false,
    roleCategory: 'teacher'
  },
  {
    id: 42,
    name: 'Ms. Kajal Singh',
    designation: 'Assistant Teacher – SST',
    departmentOrSubject: 'Social Science & Contemporary Studies',
    isSeniorLeadership: false,
    roleCategory: 'teacher'
  }
];
