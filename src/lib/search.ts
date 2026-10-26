import { papers, projects } from "@/content";
import { skillGroups } from "@/content/site";
import { paperStatusLabel, projectStatusLabel } from "./site";

export interface SearchItem {
  title: string;
  href: string;
  type: "Page" | "Project" | "Research" | "Skill";
  summary: string;
  /** Extra words that should match: technologies, domains, statuses. */
  keywords: string;
}

const pages: SearchItem[] = [
  { title: "Home", href: "/", type: "Page", summary: "Overview of research, projects and verified results.", keywords: "home start" },
  { title: "Research and publications", href: "/research", type: "Page", summary: "Papers, manuscripts, the dataset and their statuses.", keywords: "papers publications manuscripts zenodo" },
  { title: "Projects", href: "/projects", type: "Page", summary: "Every project, searchable and filterable.", keywords: "projects case studies" },
  { title: "Experience and education", href: "/experience", type: "Page", summary: "Degrees, research experience, competitions and positions.", keywords: "education cgpa competitions ratings" },
  { title: "Competitions", href: "/competitions", type: "Page", summary: "Kaggle results, coding ratings, problems solved and rating history.", keywords: "kaggle leetcode codeforces codechef rating contests competitive programming stats" },
  { title: "Skills and engineering", href: "/skills", type: "Page", summary: "Capabilities, each linked to the work that shows it.", keywords: "skills stack capabilities" },
  { title: "About", href: "/about", type: "Page", summary: "Academic journey, research interests and how I work.", keywords: "about philosophy interests" },
  { title: "Contact and CV", href: "/contact", type: "Page", summary: "Email, profiles and the CV download.", keywords: "contact email cv resume download" },
];

export function buildSearchIndex(): SearchItem[] {
  return [
    ...pages,
    ...projects.map<SearchItem>((p) => ({
      title: p.title,
      href: `/projects/${p.slug}`,
      type: "Project",
      summary: p.tagline,
      keywords: [...p.stack, ...p.domains, projectStatusLabel[p.status], p.kind].join(" "),
    })),
    ...papers.map<SearchItem>((p) => ({
      title: p.shortTitle,
      href: `/research/${p.slug}`,
      type: "Research",
      summary: `${paperStatusLabel[p.status]} · ${p.venue}`,
      keywords: [p.title, ...p.topics, ...p.authors.map((a) => a.name)].join(" "),
    })),
    ...skillGroups.map<SearchItem>((g) => ({
      title: g.title,
      href: `/skills#${g.id}`,
      type: "Skill",
      summary: g.summary,
      keywords: g.skills.join(" "),
    })),
  ];
}
