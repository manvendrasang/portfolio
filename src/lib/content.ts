/**
 * Single source of truth for site content.
 * Every fact here comes from Manvendra's résumé. Anything not in the résumé is deliberately left out.
 */
import { asset } from "@/lib/asset";

export type Category = "ai" | "web" | "3d";

export interface Project {
  slug: string;
  title: string;
  category: Category;
  status: string;
  summary: string;
  details: string[];
  stack: string[];
  /** Headline number, only when the résumé states one. */
  metric?: { value: string; label: string };
  /** Render clip (3D projects). Shown in the carousel and on the project page. */
  video?: string;
  /** Opens in a lightbox from the "Architecture preview" button on the project page. */
  preview?: { label: string; src: string; alt: string };
}

export interface Role {
  title: string;
  org: string;
  place: string;
  dates: string;
  category: Category | "general";
  points: string[];
}

export const person = {
  name: "Manvendra Sang",
  headline: "make it yourself",
  role: "Full-stack developer and AI/ML builder",
  objective:
    "Full-Stack Developer and AI/ML enthusiast with hands-on experience in MERN, Python, C/C++, and machine learning, including AI/ML alignment workflows. I'm looking for a role where I can build web applications and AI-powered solutions.",
  email: "manvendrasang@gmail.com",
  phone: "+91 9971449601",
  linkedin: "https://www.linkedin.com/in/manvendra-sang",
  linkedinLabel: "linkedin.com/in/manvendra-sang",
  github: "https://github.com/manvendrasang",
  githubLabel: "github.com/manvendrasang",
  resume: "/Manvendra_Sang_Resume.pdf",
  location: "New Delhi, India",
};

/** BigCRM architecture GIF, served from public/bigcrm.gif (the "public" folder is never part of a URL). */
const BIGCRM_GIF = asset("/bigcrm.gif");

/** Every 3D piece is the same shape: a Blender render with a clip. */
const render = (slug: string, title: string, what: string, file: string): Project => ({
  slug,
  title,
  category: "3d",
  status: "Render",
  summary: `3D render animation of ${what}.`,
  details: ["Final render output."],
  stack: ["Blender", "3D Rendering"],
  video: asset(`/images/${slug}/${file}`),
});

export const projects: Project[] = [
  {
    slug: "eeg-phoneme-classifier",
    title: "EEG Phoneme Classifier",
    category: "ai",
    status: "Research project",
    summary:
      "A reservoir computing model that classifies brain-wave responses to phonemes, aimed at a communication aid for paralyzed and coma patients.",
    details: [
      "The model uses Echo State Networks, a form of reservoir computing, to classify EEG responses to spoken phonemes.",
      "The target use is a communication aid for people who cannot speak or move.",
      "It reached 78.7% classification accuracy.",
      "The work grew out of the research internship at Kyushu Institute of Technology (Tanaka Lab), January to March 2026.",
    ],
    stack: ["Echo State Networks", "Reservoir computing", "EEG signals", "Python"],
    metric: { value: "78.7%", label: "classification accuracy" },
  },
  {
    slug: "bigcrm",
    title: "BigCRM",
    category: "web",
    status: "In development",
    summary:
      "A multi-tenant CRM platform where organizations manage customer relationships, sales pipelines, and internal operations.",
    details: [
      "Full-stack platform built with React, TypeScript, Node.js, Express, and PostgreSQL.",
      "Role-based access control keeps each organization's data isolated and secure.",
      "Sales pipeline management, task scheduling, analytics, and notifications.",
      "CSV import and export, saved views, and database-level audit logging for compliance.",
    ],
    stack: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL"],
    preview: { label: "Architecture preview", src: BIGCRM_GIF, alt: "Animated walkthrough of the BigCRM architecture" },
  },
  render("car1", "Car Render", "a car model", "car.mp4"),
  render("cyberblocks", "Cyber Blocks", "cybernetic block forms", "0000-0250.mp4"),
  render("fractal", "Fractal", "a fractal form", "0001-0250.mp4"),
  render("fractal2", "Fractal II", "a second fractal form", "0001-0320.mp4"),
  render("goop", "Goop Simulation", "a fluid goop simulation", "Final.mp4"),
  render("loop", "Loop Animation", "a looping form", "0001-0250.mp4"),
  render("loop2", "Loop Animation II", "a second looping form", "0001-0150.mp4"),
  render("orb", "Orb", "an orb", "0001-0250.mp4"),
  render("planet", "Planet", "a planet", "0001-0315.mp4"),
];

export const roles: Role[] = [
  {
    title: "Research Intern, Deep Learning and Reservoir Computing",
    org: "Kyushu Institute of Technology (Tanaka Lab)",
    place: "Fukuoka, Japan",
    dates: "Jan 2026 to Mar 2026",
    category: "ai",
    points: [
      "Studied deep learning architectures from fundamentals to advanced: MLP, CNN, RNN, and autoencoders.",
      "Worked through Echo State Network theory and implementation under direct mentorship.",
      "Applied query modelling and retrieval quality analysis to improve signal-to-label mapping in the classification pipeline.",
      "Built an edge-based EEG speech emotion decoder on reservoir computing, with a peak classification accuracy of 78.7%.",
    ],
  },
  {
    title: "Research Intern, AI/ML and Deep Learning (Hybrid)",
    org: "IIT Delhi",
    place: "Hauz Khas, New Delhi",
    dates: "Jun 2025 to Sep 2025",
    category: "ai",
    points: [
      "Trained and fine-tuned LLMs through external API calls to Hugging Face and Grok.",
      "Fine-tuned models on target-language and translated datasets and tracked accuracy across iterations.",
      "Built RAG pipelines that ground model outputs in verified reference data, which improved retrieval quality for low-resource languages.",
      "Applied RLHF to align fine-tuned outputs with human-rated translation quality.",
      "Benchmarked inference with Nvidia NIM microservices to measure deployment latency and throughput.",
    ],
  },
  {
    title: "Intern, Full-Stack Development (Remote)",
    org: "Spoken Tutorial, EduPyramids, SINE, IIT Bombay",
    place: "Remote",
    dates: "Sep 2025 to Oct 2025",
    category: "web",
    points: [
      "Built and maintained features for the Spoken Tutorial website with full-stack web technologies.",
      "Migrated selected components to TypeScript to improve type safety and cut runtime errors.",
      "Kept a clean commit history and collaborative Git workflow.",
      "Worked in HTML5 and related frontend technologies on the EduPyramids/SINE team.",
    ],
  },
  {
    title: "Internship Trainee",
    org: "Innovate Intern",
    place: "Bengaluru, Karnataka, India",
    dates: "Jun 2024 to Jul 2024",
    category: "web",
    points: [
      "Internship trainee working on frontend development and dynamic visuals.",
    ],
  },
  {
    title: "Internship",
    org: "Externsclub Pvt Ltd",
    place: "Remote",
    dates: "Feb 2023 to Mar 2023",
    category: "web",
    points: [
      "Worked with frontend and created dynamic visuals compatible with backend.",
      "Used version control for collaborative development.",
    ],
  },
];

export const skills: { group: string; items: string[] }[] = [
  {
    group: "Languages and web",
    items: ["Python", "JavaScript", "TypeScript", "C/C++", "ReactJS", "HTML5", "Tailwind CSS", "Node.js", "MERN Stack", "Lua"],
  },
  {
    group: "Data and cloud",
    items: ["MySQL", "MongoDB", "REST APIs", "Google Cloud Platform", "AWS", "Data Analysis"],
  },
  {
    group: "AI and ML",
    items: [
      "Deep learning (MLP, CNN, RNN, autoencoders)",
      "Reservoir computing (ESN)",
      "LLM fine-tuning",
      "RAG",
      "RLHF",
      "MCPs",
      "Query modelling",
      "Retrieval quality and modelling",
      "AI",
      "ML",
      "NLP",
      "EEG",
      "Neuromorphic Engineering",
      "Research Skills",
      "Research Projects",
      "Edge Computing",
    ],
  },
  {
    group: "Tools and DevOps",
    items: ["Git", "Railway", "Godot", "Blender", "Nvidia NIM", "Hugging Face", "Linux (Arch, KDE Plasma, Hyprland)"],
  },
  {
    group: "App types",
    items: ["CRM", "CRUD apps"],
  },
];

export const certifications = [
  "MongoDB Python Developer",
  "Data Structures (UC San Diego)",
  "NPTEL Java",
  "NPTEL Cloud Computing",
  "NPTEL Introduction to Internet of Things",
  "Publication: ICDAM 2024, Voice Recognition Systems",
];

export const education = [
  {
    degree: "Bachelor of Technology",
    school: "Dronacharya College of Engineering, New Delhi",
    dates: "2022 to 2026",
  },
  {
    degree: "Secondary School (CBSE Board)",
    school: "CBSE Board, India",
    dates: "2008 to 2022",
  },
];

export const hobbies = [
  "Watercolor painting",
  "Glass painting",
  "Sketching",
  "Watching F1",
  "Gaming",
];

export interface Destination {
  href: string;
  label: string;
  world: string;
  blurb: string;
  theme: "observatory" | "nebula" | "midway" | "render" | "portal";
}

export const destinations: Destination[] = [
  { href: "/", label: "Launchpad", world: "Cosmic Observatory", blurb: "Start here: who I am, what I've built, and my résumé.", theme: "observatory" },
  { href: "/ai/", label: "AI Projects", world: "Neural Nebula", blurb: "Agents, reservoir computing, RAG, and alignment work.", theme: "nebula" },
  { href: "/web/", label: "Web Development", world: "Pixel Midway", blurb: "Full-stack apps and interface work.", theme: "midway" },
  { href: "/3d/", label: "3D Projects", world: "Render Dimension", blurb: "Blender and Godot, plus what is on the render queue.", theme: "render" },
  { href: "/contact/", label: "Contact", world: "Portal Garden", blurb: "Email, LinkedIn, and the quickest way to reach me.", theme: "portal" },
];

export const bySlug = (slug: string) => projects.find((p) => p.slug === slug);
export const byCategory = (c: Category) => projects.filter((p) => p.category === c);
