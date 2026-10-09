export const site = {
  name: "Charisiss",
  tagline: "PREMIUM WEB SOLUTIONS",
  title: "Κατασκευή Ιστοσελίδων | Charisiss",
  description:
    "Εκεί όπου η εντυπωσιακή σχεδίαση συναντά την άψογη λειτουργικότητα. Με σκοπό να δώσουμε ζωή στην ιστοσελίδα σας. Κατασκευή Ιστοσελίδων",
  shareTitle: "Charisis Samaras — Senior Full-Stack Engineer",
  shareDescription:
    "I build reliable, scalable digital products with clean code, thoughtful architecture, and great user experience.",
  url: "https://charisiss.gr",
  email: "info@charisiss.gr",
  meetUrl: "/meet",
  calendarEmbed:
    "https://calendar.google.com/calendar/appointments/schedules/AcZssZ04fC6qf7yKt5tHniWrvRg-YOunu4I3zkUPWEF1__ZblxHGTClu3LzYL29aJL9AfW8Wam1CWbwK?gv=true",
  social: {
    facebook: "https://www.facebook.com/charisissam",
    instagram: "https://www.instagram.com/charisiss.gr/",
    linkedin: "https://www.linkedin.com/company/charisiss/",
  },
};

export const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Work", href: "/#work" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "Contact me", href: "/meet" },
] as const;

export const hero = {
  role: "Senior Full-Stack Engineer",
  firstName: "CHARISIS",
  lastName: "SAMARAS",
  cta: "Contact",
  tagline:
    "I build reliable, scalable digital products with a focus on clean code, thoughtful architecture, and great user experience.",
  portrait: "/images/portrait.jpg",
};

export const about = {
  label: "ABOUT ME",
  body: "I'm a software engineer with experience in designing, developing, and launching end-to-end web solutions. I enjoy solving complex problems, collaborating with teams, and turning ideas into polished, functional products.",
  images: [
    {
      src: "/images/about-lifestyle.jpg",
      alt: "Charisis by the sea",
      objectPosition: "top",
    },
    {
      src: "/images/about-code.jpg",
      alt: "Laptop showing code on screen",
      objectPosition: "top",
    },
    {
      src: "/images/about-dog.webp",
      alt: "Golden retriever",
      objectPosition: "top",
    },
    {
      src: "/images/about-design.jpg",
      alt: "UI design sketches and wireframes",
      objectPosition: "top",
    },
  ],
};

export const skills = [
  {
    id: "frontend",
    title: "Frontend",
    description:
      "Fast, accessible interfaces built with modern React, with pixel-precise attention to motion and detail.",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML/CSS", "JavaScript"],
  },
  {
    id: "uiux",
    title: "UI/UX",
    description:
      "From the first wireframe to a polished design system, shaping products that feel obvious to use.",
    items: ["Figma", "Wireframing", "Prototyping", "Design Systems", "User Flows", "Responsive Design"],
  },
  {
    id: "fullstack",
    title: "Fullstack",
    description:
      "End-to-end products with solid APIs, databases, authentication and cloud deployments that scale.",
    items: ["Node.js", "Supabase", "PostgreSQL", "REST APIs", "Auth", "Cloud Deployments"],
  },
];

export const projects = [
  {
    title: "Crocs.gr",
    role: "Lead Frontend Developer",
    description:
      "In collaboration with Elegento, I led the front-end development of an outstanding website, which won seven awards in its very first year of operation.",
    image: "/images/project-crocs.jpg",
    href: "https://crocs.gr",
  },
  {
    title: "MyScout.gr",
    role: "SASS Product",
    description:
      "After conducting an in-depth analysis, I developed a product that supports the Scouting program and enhances the overall operation of Greek Scouting.",
    image: "/images/project-myscout.png",
    href: "https://myscout.gr",
  },
  {
    title: "The Lemon Project",
    role: "UI/UX Developer",
    description:
      "Working closely with my team, we developed this unique tool, fully tailored to meet the specific needs of the project.",
    image: "/images/project-lemon.jpg",
    href: null,
  },
  {
    title: "Memorybox.gr",
    role: "Lead Front End Developer",
    description:
      "In collaboration with Elegento, I led and coordinated a team to develop a modern, dynamic website tailored to meet all of the company's needs.",
    image: "/images/project-memorybox.jpg",
    href: "https://memorybox.gr",
  },
];

export const testimonials = [
  {
    quote:
      "Our old system was slow and messy. Charis not only rebuilt the parts that were breaking but also improved things we didn't realize were hurting us. The whole product feels smoother now. He's the kind of developer who thinks ahead",
    name: "Dimitris Papadopoulos",
    company: "infinitygreece.com",
  },
  {
    quote:
      "We described our vision, and Charis brought it to life with surprising accuracy. The process felt straightforward, and he kept us updated the whole time. Super positive experience.",
    name: "John Harhas",
    company: "saldoagency.com",
  },
  {
    quote:
      "I came in with a rough idea and no real plan. Charisis helped me shape it, built exactly what I needed, and explained everything in a way that made sense. Working with him never felt stressful, he's calm, patient, and genuinely cares about the end result",
    name: "Sotiris Magionas",
    company: "unireview.gr",
  },
  {
    quote:
      "Charis led the frontend with real ownership. Deadlines were tight, the brief kept shifting, and he still shipped something polished that the whole team was proud of. Communication was clear from day one.",
    name: "Elena Vasileiou",
    company: "elegento.com",
  },
  {
    quote:
      "We needed a product that could grow with the organization, not just a pretty website. Charis understood the operational side, challenged our assumptions, and delivered a platform people actually use every day.",
    name: "Nikos Theodorou",
    company: "myscout.gr",
  },
  {
    quote:
      "Working with Charisis felt like having a senior partner on the project. He cares about details most people skip, and the site launched looking and performing better than we expected.",
    name: "Maria Kontou",
    company: "memorybox.gr",
  },
];

export const contact = {
  title: "Let's work together!",
  body: "Great projects start with a simple conversation. Tell me what you're trying to build, and I'll help you figure out the best way forward.",
  cta: "Contact",
  avatar: "/images/avatar.jpg",
  copyright: "CHARISISS",
  subtitle: "PREMIUM WEB SOLUTIONS",
};

export const meetPage = {
  title: "Κλείσε online meeting - Charisiss",
  description:
    "Σχεδιαστής Ιστοσελίδων με έδρα τη Θεσσαλονίκη, βοηθώντας παθιασμένους ανθρώπους να ξεκινήσουν τις ιδέες τους με την αυτοπεποίθηση του επιτυχημένου σχεδιασμού.",
};

export const linktreePage = {
  title: "Linktree | Charisiss",
  description: "All Charisiss links in one place — website, socials, and booking.",
};

export const linktreeLinks = [
  {
    id: "website",
    label: "Website",
    href: "/",
    external: false,
    icon: "globe" as const,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/charisiss/",
    external: true,
    icon: "linkedin" as const,
  },
  {
    id: "instagram",
    label: "Instagram",
    href: site.social.instagram,
    external: true,
    icon: "instagram" as const,
  },
  {
    id: "facebook",
    label: "Facebook",
    href: site.social.facebook,
    external: true,
    icon: "facebook" as const,
  },
  {
    id: "call",
    label: "Schedule a call",
    href: site.meetUrl,
    external: false,
    icon: "calendar" as const,
  },
];
