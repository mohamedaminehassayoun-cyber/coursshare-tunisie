export type CategorySlug = 'cours' | 'resumes' | 'fiches-revision' | 'devoirs' | 'exercices';

export interface CategoryInfo {
  slug: CategorySlug;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  color: string;
  bgLight: string;
  iconName: string;
  accentBorder: string;
  accentText: string;
}

export interface Author {
  name: string;
  avatar: string;
  role: string;
  university: string;
  badge?: string;
  isProfessor?: boolean;
}

export interface SupervisorProfessor {
  name: string;
  title: string;
  department: string;
  university: string;
  email?: string;
}

export interface DocumentComment {
  id: string;
  author: string;
  university: string;
  rating: number;
  date: string;
  content: string;
  helpful: number;
}

export interface PreviewPage {
  pageNumber: number;
  title: string;
  content: string;
  keyPoints?: string[];
  formulas?: string[];
  tableData?: { headers: string[]; rows: string[][] };
}

export interface DocumentItem {
  id: string;
  title: string;
  category: CategorySlug;
  subject: string;
  domain: string;
  level: string;
  university: string;
  facultyId?: string;
  facultyName?: string;
  licenseId?: string;
  sessionType?: 'DS' | 'Examen Principal' | 'Examen Contrôle' | 'Série TD' | 'Cours' | 'Mini-Projet';
  academicYear?: string;
  author: Author;
  supervisorProf?: SupervisorProfessor;
  date: string;
  description: string;
  previewPages: PreviewPage[];
  pageCount: number;
  fileFormat: 'PDF' | 'DOCX' | 'EPUB';
  fileSize: string;
  rating: number;
  reviewsCount: number;
  downloadsCount: number;
  viewsCount: number;
  tags: string[];
  verified: boolean;
  semester: string;
  featured?: boolean;
  comments: DocumentComment[];
}

export interface LicenseField {
  id: string;
  name: string;
  shortCode: string;
  level: string;
  semesters: string[];
  modules: string[];
}

export interface FacultyProfessor {
  id: string;
  name: string;
  title: string; // e.g. "Professeur des Universités", "Maître de Conférences", "Maître-Assistante"
  department: string;
  specialty: string;
  avatar: string;
  courses: string[];
  isDepartmentHead?: boolean;
  bio?: string;
}

export interface FacultyInfo {
  id: string;
  name: string;
  shortName: string;
  university: string;
  region: string;
  logoColor: string;
  bgBadge: string;
  description: string;
  studentCountEstimate: string;
  websiteUrl: string;
  portalUrl?: string; // Parent University portal
  address?: string;
  phone?: string;
  officialEmail?: string;
  establishedYear: number;
  badgeSymbol: string;
  licenses: LicenseField[];
  professors: FacultyProfessor[];
}

export interface FilterState {
  searchQuery: string;
  category: 'all' | CategorySlug;
  domain: string;
  level: string;
  facultyId?: string;
  licenseId?: string;
  sortBy: 'popular' | 'recent' | 'rating' | 'downloads';
}
