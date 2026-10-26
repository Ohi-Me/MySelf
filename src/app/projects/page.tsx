import { ProjectExplorer } from "@/components/project/ProjectExplorer";
import { toSummary } from "@/components/project/ProjectCard";
import { Container, PageHeader } from "@/components/site/Page";
import { projects } from "@/content";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Projects",
  description:
    "Research programmes, competition systems and engineering projects by Rohit Kumar, each with a five-mode case study: overview, plain English, engineering, research and evaluation, and a recruiter summary.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <Container>
      <PageHeader
        trail={[{ label: "Projects", href: "/projects" }]}
        eyebrow={`${projects.length} case studies`}
        title="Projects"
        lede="Each project has its own page, readable five ways: a 30-second overview, plain English, an engineering deep dive, the research and evaluation, and a summary for recruiters. Status and evidence are stated on every page."
      />
      <ProjectExplorer items={projects.map(toSummary)} />
    </Container>
  );
}
