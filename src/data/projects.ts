// Edit this file to update the Projects page.
export interface Project {
  name: string;
  description: string;
  tech: string[];
  links: { label: string; url: string }[];
}

export const projects: Project[] = [
  {
    name: 'Mini-S3',
    description:
      'An S3-compatible object storage service built from scratch to understand object storage internals — bucket management, object versioning, custom metadata, and a RESTful API, plus a React/Next.js UI with drag-and-drop uploads.',
    tech: ['Java', 'Spring Boot', 'PostgreSQL', 'React', 'Next.js', 'TypeScript'],
    links: [
      { label: 'Backend', url: 'https://github.com/rajatbhagat/mini-s3' },
      { label: 'UI', url: 'https://github.com/rajatbhagat/mini-s3-ui' },
    ],
  },
  {
    name: 'Hotel Reservation System',
    description:
      'A full-stack hotel booking application with a Spring Boot REST backend and a React frontend covering room search, reservations, and booking management.',
    tech: ['Java', 'Spring Boot', 'React', 'MySQL'],
    links: [
      { label: 'Backend', url: 'https://github.com/rajatbhagat/hotel-reservation-spring-boot' },
      { label: 'Frontend', url: 'https://github.com/rajatbhagat/hotel-reservation-react-app' },
    ],
  },
  {
    name: 'Food Recommender',
    description:
      'Backend server for a food recommendation application that suggests dishes and restaurants based on user preferences.',
    tech: ['Node.js', 'JavaScript', 'MongoDB'],
    links: [{ label: 'GitHub', url: 'https://github.com/rajatbhagat/food-recommender-server' }],
  },
  {
    name: 'Music Recommendation System',
    description:
      'A machine-learning based music recommendation system exploring collaborative filtering and content-based approaches.',
    tech: ['Python', 'Jupyter', 'scikit-learn'],
    links: [{ label: 'GitHub', url: 'https://github.com/rajatbhagat/music-recommendation-system' }],
  },
];
