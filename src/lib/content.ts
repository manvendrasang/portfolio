/**
 * Single source of truth for site content.
 * Every fact here comes from Manvendra's résumé (Manvendra_Sang_Resume_Updated.pdf).
 * Anything not in the résumé is deliberately left out. See README "Content still to add".
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
  /** Add repo / live demo links here when you have them. */
  links?: { label: string; href: string }[];
  related?: string;
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

export const projects: Project[] = [
  {
    slug: "agentic-it-ticket-manager",
    title: "Agentic AI IT Ticket Manager",
    category: "ai",
    status: "In progress",
    summary:
      "An AI agent that resolves low-urgency support tickets on its own and escalates only the ones that need a person.",
    details: [
      "The goal is to cut the workload on a support team by letting the agent close routine tickets without human review.",
      "Triage uses LLM-based logic to decide whether a ticket is low urgency or needs escalation.",
      "The code is Python with a modular, object-oriented structure.",
    ],
    stack: ["Python", "LLM triage", "OOP"],
  },
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
    related: "Kyushu Institute of Technology internship",
  },
  {
    slug: "mern-team-task-manager",
    title: "MERN Team Task Manager",
    category: "web",
    status: "Live on Railway",
    summary:
      "A full-stack app for assigning tasks to a team, escalating urgent work, and sending warnings.",
    details: [
      "Team members get tasks assigned to them, and the app escalates urgency and issues warnings as work becomes overdue or critical.",
      "The app is deployed live on Railway.",
      "The whole project is under Git version control.",
      "Built on MongoDB, Express, React, and Node.js.",
    ],
    stack: ["MongoDB", "Express", "React", "Node.js", "Railway", "Git"],
  },
  {
    slug: "car1",
    title: "Car Render",
    category: "3d",
    status: "Render",
    summary: "3D render animation of a car model.",
    details: ["Final render output."],
    stack: ["Blender", "3D Rendering"],
    links: [{ label: "Watch Render", href: asset("/images/car1/car.mp4") }],
  },
  {
    slug: "cyberblocks",
    title: "Cyber Blocks",
    category: "3d",
    status: "Render",
    summary: "3D render animation of cybernetic block forms.",
    details: ["Final render output."],
    stack: ["Blender", "3D Rendering"],
    links: [{ label: "Watch Render", href: asset("/images/cyberblocks/0000-0250.mp4") }],
  },
  {
    slug: "fractal",
    title: "Fractal",
    category: "3d",
    status: "Render",
    summary: "3D render animation of a fractal form.",
    details: ["Final render output."],
    stack: ["Blender", "3D Rendering"],
    links: [{ label: "Watch Render", href: asset("/images/fractal/0001-0250.mp4") }],
  },
  {
    slug: "fractal2",
    title: "Fractal II",
    category: "3d",
    status: "Render",
    summary: "3D render animation of a second fractal form.",
    details: ["Final render output."],
    stack: ["Blender", "3D Rendering"],
    links: [{ label: "Watch Render", href: asset("/images/fractal2/0001-0320.mp4") }],
  },
  {
    slug: "goop",
    title: "Goop Simulation",
    category: "3d",
    status: "Render",
    summary: "3D render animation of a fluid goop simulation.",
    details: ["Final render output."],
    stack: ["Blender", "3D Rendering"],
    links: [{ label: "Watch Render", href: asset("/images/goop/Final.mp4") }],
  },
  {
    slug: "loop",
    title: "Loop Animation",
    category: "3d",
    status: "Render",
    summary: "3D render animation of a looping form.",
    details: ["Final render output."],
    stack: ["Blender", "3D Rendering"],
    links: [{ label: "Watch Render", href: asset("/images/loop/0001-0250.mp4") }],
  },
  {
    slug: "loop2",
    title: "Loop Animation II",
    category: "3d",
    status: "Render",
    summary: "3D render animation of a second looping form.",
    details: ["Final render output."],
    stack: ["Blender", "3D Rendering"],
    links: [{ label: "Watch Render", href: asset("/images/loop2/0001-0150.mp4") }],
  },
  {
    slug: "orb",
    title: "Orb",
    category: "3d",
    status: "Render",
    summary: "3D render animation of an orb.",
    details: ["Final render output."],
    stack: ["Blender", "3D Rendering"],
    links: [{ label: "Watch Render", href: asset("/images/orb/0001-0250.mp4") }],
  },
  {
    slug: "planet",
    title: "Planet",
    category: "3d",
    status: "Render",
    summary: "3D render animation of a planet.",
    details: ["Final render output."],
    stack: ["Blender", "3D Rendering"],
    links: [{ label: "Watch Render", href: asset("/images/planet/0001-0315.mp4") }],
  },
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
    items: ["Python", "JavaScript", "TypeScript", "C/C++", "ReactJS", "HTML5", "Tailwind CSS", "Node.js", "MERN Stack", "GDScript"],
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
    items: ["CRM", "HRM", "CRUD apps"],
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
