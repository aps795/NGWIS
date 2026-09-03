import type { Notice, SchoolEvent, Facility, ActivityItem, GalleryItem, Testimonial, SchoolSettings, AdmissionEnquiry } from '../types/school';

export const initialSchoolSettings: SchoolSettings = {
  schoolName: 'New Global Wisdom International School',
  tagline: 'Inspiring Young Minds. Building Bright Futures.',
  subtitle: 'An environment where learning, values, creativity and confidence come together to help every child grow.',
  address: {
    line1: 'Bhujehuan, Sauna',
    subLocality: 'Sauna',
    tehsil: 'Saidpur',
    district: 'Ghazipur',
    state: 'Uttar Pradesh',
    pincode: '233307',
    country: 'India',
  },
  phonePlaceholder: '+91 94XXXXXXXX (Official number to be updated)',
  emailPlaceholder: 'info@newglobalwisdom.edu.in (Placeholder)',
  whatsappPlaceholder: '+91 94XXXXXXXX',
  officeHours: 'Monday – Saturday: 8:00 AM – 2:00 PM (Office Timings)',
  facebookUrl: 'https://www.facebook.com/NewGlobalWisdom',
  youtubeUrl: '',
  instagramUrl: '',
  principalTitle: 'Managing Director & Founder',
  principalName: 'Hon. Mr. Rajnikant Singh',
  principalPhotoUrl: './rajnikant-singh.jpg',
  principalMessage: [
    "Welcome to New Global Wisdom International School, Bhujehuan, Sauna, Ghazipur. At our institution, we firmly believe that every child possesses innate curiosity, immense potential, and a unique spark of intellect waiting to be nurtured.",
    "Our educational philosophy centers around fostering a holistic atmosphere where rigorous academic foundations meet character building, discipline, and moral values. We do not merely prepare students for examinations; we prepare them for life with strong moral compasses, self-confidence, and critical thinking capabilities.",
    "True education is a collaborative journey between devoted educators and caring parents. We invite you to join us in shaping a bright, disciplined, and purposeful future for your child in Ghazipur."
  ],
  showStatistics: false, // Strict adherence: Hidden unless verified data is officially supplied
  stats: [
    { label: 'Campus Environment', value: 'Serene & Safe', description: 'Conducive to focused learning' },
    { label: 'Curriculum Focus', value: 'Holistic & Modern', description: 'Academic & practical skill building' },
    { label: 'Co-curricular Wings', value: 'Active', description: 'Sports, Arts & Cultural Pursuits' },
    { label: 'Student-Teacher Ratio', value: 'Optimal', description: 'Individualized student attention' }
  ],
  admissionsOpen: true,
  admissionNote: 'Admissions Open for Foundational, Primary & Upper-Primary levels. Submit your enquiry below or visit the administrative office.'
};

export const initialNotices: Notice[] = [
  {
    id: 'not-01',
    title: 'Admissions Open for the Upcoming Academic Session',
    date: '2026-09-01',
    category: 'Admission',
    summary: 'Enquiry and registration process commences for Foundational & Primary stages.',
    content: 'Parents seeking admission for their wards at New Global Wisdom International School are invited to submit their enquiries online or collect registration forms from the administrative school counter during office hours (8:00 AM – 2:00 PM).',
    isPinned: true,
    isPublished: true,
    fileDownloadName: 'Admission_Information_Guide.pdf'
  },
  {
    id: 'not-02',
    title: 'Upcoming Inter-House Sports & Athletic Meet Announcement',
    date: '2026-08-28',
    category: 'Event',
    summary: 'Annual physical fitness and sports schedule for track, field, and team sports.',
    content: 'Students from all houses are encouraged to register their names with the physical education coordinator for athletics, badminton, football, and yoga events scheduled for the upcoming sports week.',
    isPinned: false,
    isPublished: true,
  },
  {
    id: 'not-03',
    title: 'Parent-Educator Interaction Schedule & Academic Progress Review',
    date: '2026-08-20',
    category: 'Circular',
    summary: 'Periodic developmental review meeting to discuss student growth and learning targets.',
    content: 'A scheduled interaction between educators and parents will take place on the upcoming Saturday. Parents are requested to adhere to the designated time slots to review classroom progress, notebook maintenance, and learning support.',
    isPinned: false,
    isPublished: true,
  },
  {
    id: 'not-04',
    title: 'Assessment & Periodic Evaluation Guidelines',
    date: '2026-08-10',
    category: 'Examination',
    summary: 'Timetable and syllabus guidelines for continuous evaluation assessments.',
    content: 'The syllabus and assessment scheme for the ongoing academic cycle have been displayed on class notice boards. Students are advised to maintain revision discipline and seek clarification from teachers.',
    isPinned: false,
    isPublished: true,
  }
];

export const initialEvents: SchoolEvent[] = [
  {
    id: 'evt-01',
    title: 'Annual Sports & Athletic Meet',
    date: '2026-09-22',
    time: '08:30 AM – 02:00 PM',
    venue: 'School Sports Ground',
    category: 'Sports',
    description: 'A vibrant day of track events, relay races, march-past, and physical wellness activities fostering team spirit and sportsmanship.',
    imageUrl: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'evt-02',
    title: 'Science & Art Exhibition',
    date: '2026-10-15',
    time: '09:00 AM – 01:30 PM',
    venue: 'Main Academic Block & Courtyard',
    category: 'Academic',
    description: 'Students present working scientific models, eco-friendly innovations, and creative artwork demonstrating hands-on conceptual learning.',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'evt-03',
    title: 'Cultural Celebrations & National Festival Gathering',
    date: '2026-11-14',
    time: '09:00 AM – 12:30 PM',
    venue: 'Assembly & Cultural Hall',
    category: 'Cultural',
    description: 'Traditional dance, patriotic songs, speech competitions, and drama performances celebrating India\'s rich cultural diversity.',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'evt-04',
    title: 'Parent-Teacher Orientation & Progress Meet',
    date: '2026-11-28',
    time: '08:30 AM – 01:00 PM',
    venue: 'Designated Classrooms',
    category: 'Meeting',
    description: 'Individualized dialogue between teachers and parents focusing on child strengths, areas for encouragement, and study routines.',
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80'
  }
];

export const initialFacilities: Facility[] = [
  {
    id: 'fac-01',
    title: 'Modern & Well-Ventilated Classrooms',
    iconName: 'LayoutGrid',
    category: 'Academic Infrastructure',
    description: 'Spacious, illuminated, and airy classrooms equipped with comfortable ergonomic furniture designed to foster interactive and engaged learning.',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    highlights: ['Natural light & ventilation', 'Ergonomic seating', 'Interactive teaching boards', 'Clean & clutter-free environment']
  },
  {
    id: 'fac-02',
    title: 'School Library & Reading Resource Corner',
    iconName: 'BookOpen',
    category: 'Academic Infrastructure',
    description: 'A dedicated reading haven stocked with age-appropriate storybooks, encyclopedias, reference texts, and language enhancement literature.',
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
    highlights: ['Curated children\'s literature', 'Quiet study atmosphere', 'Periodic reading hours', 'Subject reference material']
  },
  {
    id: 'fac-03',
    title: 'Spacious Outdoor Playground & Sports Arena',
    iconName: 'Trophy',
    category: 'Sports & Health',
    description: 'Expansive open ground allowing students to participate in track events, football, cricket, badminton, and supervised physical education routines.',
    imageUrl: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=800&q=80',
    highlights: ['Dedicated athletic tracks', 'Multi-sport open area', 'Physical wellness sessions', 'Annual sports preparation']
  },
  {
    id: 'fac-04',
    title: 'Computer & Digital Literacy Corner',
    iconName: 'Monitor',
    category: 'Technology',
    description: 'Foundational computer learning facilities introducing students to fundamental computer skills, educational software, and digital awareness.',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    highlights: ['Hands-on computer sessions', 'Guided digital literacy', 'Curriculum-aligned software', 'Safe supervised access']
  },
  {
    id: 'fac-05',
    title: 'Purified RO Drinking Water System',
    iconName: 'Droplets',
    category: 'Health & Hygiene',
    description: 'Multi-stage RO water purification units across campus providing tested, clean, and safe drinking water to all children and staff throughout the day.',
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
    highlights: ['RO filtration standard', 'Hygienic water dispensing points', 'Routine quality checks', 'Accessible for all grades']
  },
  {
    id: 'fac-06',
    title: 'Comprehensive Student Safety & CCTV Monitoring',
    iconName: 'ShieldCheck',
    category: 'Safety & Discipline',
    description: 'Round-the-clock perimeter monitoring, gated campus entry control, and continuous faculty supervision ensuring a secure educational space.',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
    highlights: ['Gated campus security', 'CCTV monitored premises', 'Strict visitor verification', 'Dedicated staff supervision']
  },
  {
    id: 'fac-07',
    title: 'Creative Activity & Performing Arts Space',
    iconName: 'Palette',
    category: 'Holistic Development',
    description: 'A lively creative studio for drawing, craft, music, public speaking rehearsals, and cultural festival preparations.',
    imageUrl: 'https://images.unsplash.com/photo-1460518451282-474b15672083?auto=format&fit=crop&w=800&q=80',
    highlights: ['Art & craft supplies', 'Speech & drama practice', 'Cultural program rehearsals', 'Exhibition showcase']
  },
  {
    id: 'fac-08',
    title: 'Hygienic Sanitation & Clean Environment',
    iconName: 'Sparkles',
    category: 'Health & Hygiene',
    description: 'Separate, clean, and well-maintained washroom facilities for boys and girls with continuous sanitization and housekeeping protocols.',
    imageUrl: 'https://images.unsplash.com/photo-1584697964190-7bb8c313264c?auto=format&fit=crop&w=800&q=80',
    highlights: ['Separate gender facilities', 'Regular sanitization schedules', 'Running water supply', 'Trained housekeeping staff']
  }
];

export const initialActivities: ActivityItem[] = [
  {
    id: 'act-01',
    title: 'Physical Education & Athletics',
    category: 'Sports',
    description: 'Daily drills, track races, sprint practice, and endurance games promoting physical strength, discipline, and stamina.',
    imageUrl: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'act-02',
    title: 'Yoga, Mindfulness & Morning Assembly',
    category: 'Sports',
    description: 'Cultivating inner focus, mental calmness, posture discipline, and patriotic pride through daily morning assembly and yoga sessions.',
    imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'act-03',
    title: 'Visual Arts, Painting & Craft Workshop',
    category: 'Art & Creativity',
    description: 'Encouraging self-expression through color exploration, sketching, clay modeling, origami, and cultural handicrafts.',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'act-04',
    title: 'Public Speaking, Recitation & Debates',
    category: 'Competitions',
    description: 'Structured elocution, poetry recitation in English & Hindi, and inter-house debates building fluent communication and confidence.',
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'act-05',
    title: 'National Celebrations & Festivals',
    category: 'Celebrations',
    description: 'Vibrant commemorations of Independence Day, Republic Day, Gandhi Jayanti, and Saraswati Puja instilling values and heritage.',
    imageUrl: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'act-06',
    title: 'Environmental & Science Projects',
    category: 'Educational',
    description: 'Practical exploration of nature, plant growth observation, clean campus drives, and foundational science experiments.',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80'
  }
];

export const initialGallery: GalleryItem[] = [
  {
    id: 'gal-01',
    title: 'School Campus Building & Main Entrance',
    category: 'Campus',
    imageUrl: './campus-building.jpg',
    caption: 'Official building facade and illuminated frontage of New Global Wisdom International School in Bhujehuan, Sauna, Ghazipur.'
  },
  {
    id: 'gal-insta-01',
    title: 'Holi Celebrations — Festival of Colors & Joy',
    category: 'Celebrations',
    imageUrl: './gallery/holi1_1.jpg',
    caption: 'Students and teachers at New Global Wisdom International School celebrating Holi with flower petals, gulal, and joyful cultural camaraderie.'
  },
  {
    id: 'gal-insta-02',
    title: 'Holi Festivities & Creative Harmony',
    category: 'Celebrations',
    imageUrl: './gallery/holi2_1.jpg',
    caption: 'Joyous festive moments, laughter, and enthusiastic celebrations during the annual school Holi gathering.'
  },
  {
    id: 'gal-insta-03',
    title: 'Dussehra Utsav — Student Cultural Presentation',
    category: 'Celebrations',
    imageUrl: './gallery/dussehra_1.jpg',
    caption: 'Students celebrating Vijayadashami / Dussehra at New Global Wisdom International School with traditional attire, artistic displays, and festive cheer.'
  },
  {
    id: 'gal-children-dandiya',
    title: 'Student Cultural Dandiya & Festive Celebration',
    category: 'Celebrations',
    imageUrl: './school-children.jpg',
    caption: 'Students of New Global Wisdom International School dressed in vibrant traditional attire performing folk dance and celebrating cultural harmony.'
  },
  {
    id: 'gal-insta-summercamp',
    title: 'Summer Camp 2024 — Joyful Learning & Fun',
    category: 'Activities',
    imageUrl: './gallery/post_c7_1.jpg',
    caption: 'Glimpse of Summer Camp 2024 at New Global Wisdom International School where students enthusiastically participated in creative workshops and educational games.'
  },
  {
    id: 'gal-insta-quotewriting',
    title: 'Quote Writing Activity — Class 7 Creative Minds',
    category: 'Activities',
    imageUrl: './gallery/post_da_1.jpg',
    caption: 'Class 7 students presenting inspiring quote writing posters and thoughts, showcasing their creativity and expressive language skills.'
  },
  {
    id: 'gal-insta-educationaltour',
    title: 'Educational Excursion — Gorakhpur & Kushinagar Heritage Tour',
    category: 'Events',
    imageUrl: './gallery/post_dc_1.jpg',
    caption: 'Students of New Global Wisdom International School on an educational excursion exploring historical landmarks and cultural heritage in Gorakhpur and Kushinagar.'
  },
  {
    id: 'gal-insta-cbse',
    title: 'CBSE Board Examination Results & Academic Pride',
    category: 'Events',
    imageUrl: './gallery/post_c6_1.jpg',
    caption: 'Celebrating the outstanding academic achievements and excellent performance of New Global Wisdom International School students in CBSE Board Examinations.'
  }
];

export const initialTestimonials: Testimonial[] = [
  {
    id: 'test-01',
    authorName: 'Parent Testimonial Slot (Pending Official Submission)',
    relationship: 'Parent / Guardian',
    text: '“This is a designated official testimonial placeholder. Once verified testimonials are submitted by parents of enrolled students, the school administrator can publish them directly from the Admin Dashboard.”',
    isPlaceholder: true,
    verified: false
  },
  {
    id: 'test-02',
    authorName: 'Parent Testimonial Slot (Pending Official Submission)',
    relationship: 'Parent / Guardian',
    text: '“Verified feedback regarding academic environment, faculty support, and student development will be displayed in this section after administrative verification.”',
    isPlaceholder: true,
    verified: false
  }
];

export const initialEnquiries: AdmissionEnquiry[] = [
  {
    id: 'enq-sample-1',
    studentName: 'Aarav Kumar (Sample Demo)',
    parentName: 'Ramesh Kumar',
    classApplying: 'Class 3',
    mobile: '9876543210',
    email: 'ramesh.sample@example.com',
    address: 'Saidpur Market, Saidpur, Ghazipur',
    message: 'Inquiring regarding curriculum, school bus facility, and books requirements for the upcoming term.',
    submittedAt: '2026-09-02 10:15 AM',
    status: 'New',
    adminNotes: 'Sample enquiry generated for demonstration of CMS features.'
  }
];
