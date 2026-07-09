// Edit this file to update the Experience page — no HTML/CSS knowledge needed.
export interface Role {
  company: string;
  location: string;
  title: string;
  period: string;
  bullets: string[];
}

export const roles: Role[] = [
  {
    company: 'The Options Clearing Corporation',
    location: 'Chicago, US',
    title: 'Associate Principal Software Engineer — Data Platform',
    period: 'Nov 2025 – Jun 2026',
    // TODO(Rajat): These bullets are drafts — replace them with your actual work at OCC.
    bullets: [
      'Worked on the Data Platform team building and maintaining data infrastructure for clearing and risk operations',
      'Designed and developed data pipelines and platform services supporting business-critical workloads',
      'Collaborated with cross-functional teams to deliver reliable, well-governed data products',
    ],
  },
  {
    company: 'Discover Financial Services',
    location: 'Chicago, US',
    title: 'Application Engineer',
    period: 'Apr 2024 – Oct 2025',
    bullets: [
      'Spearheaded development and enhancement of Config Manager, a Python-based microservice orchestrating artifact generation and deployment of over 200,000 artifacts',
      'Enhanced a custom reconciliation framework in Python enabling reusable validation controls, improving data quality assurance across 400 data pipelines',
      'Led testing and integration of multiple source systems, coordinating with 5 cross-functional teams for seamless deployment and post-launch enhancements',
      'Maintained the legacy Java-based Universal Data Loader processing 1M+ records daily, debugging issues and supporting AWS component integrations',
      'Implemented OpenShift (OCP) deployments with Helm charts and Docker via custom Jenkins CI/CD pipelines for 15 microservices',
    ],
  },
  {
    company: 'Mythics LLC',
    location: 'Arlington, US',
    title: 'Cloud Developer',
    period: 'Jun 2023 – Mar 2024',
    bullets: [
      'Developed a real-time cloud cost monitoring portal using Next.js, Node.js, and Redux, reducing cloud expenses by 20%',
      'Improved portal performance with Redis caching (1 min → 2 sec) and enabled scalability by deploying on Kubernetes as Docker images',
      'Automated patching of Oracle Exadata machines with Ansible playbooks, saving 8+ hours of manual effort quarterly',
      'Deployed a Jenkins pipeline triggered by JIRA ticket transitions, reducing patching time by 60% and enabling parallel patching',
      'Orchestrated OCI resource provisioning for 4 customers using Terraform',
    ],
  },
  {
    company: 'JP Morgan Chase',
    location: 'Mumbai, India',
    title: 'Software Engineer II',
    period: 'Jul 2018 – Jul 2021',
    bullets: [
      'Led development of a Trade Inquiry Chatbot on Symphony using Java Spring Boot, decreasing manual inquiries by 40%',
      'Spearheaded automation of loan claim transactions and built a new ReactJS portal, achieving a 60% automation rate',
      'Led a team of 3 developers building a Python document data extraction service extracting 40+ crucial data points',
      'Implemented a document digitization application with 5 Java microservices processing 700+ transactions daily',
      'Engineered an NLP service in Java Spring Boot with Apache OpenNLP and custom models, attaining 99% accuracy extracting keywords and codes from documents',
      'Established Kafka as the communication medium between microservices; delivered 20 production releases',
    ],
  },
];

export const education = {
  school: 'Northeastern University, Boston',
  degree: "Master's in Computer Science",
  period: 'Aug 2021 – May 2023',
  detail: 'GPA: 4.0',
};

export const certifications = [
  'AWS Certified Solutions Architect – Associate (2025)',
  'Oracle Cloud Infrastructure Associate Architect (2023)',
  'Oracle Cloud Infrastructure Cloud Developer Professional (2023)',
  'Impact Award for 2 consecutive years at JP Morgan Chase',
];
