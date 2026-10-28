import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";
import type { CSSProperties } from "react";
import { projects, type Project } from "../../data/projects";

function displayUrl(url: string) {
  const { host, pathname } = new URL(url);
  return `${host}${pathname === "/" ? "" : pathname}`;
}

function ProjectMedia({ project }: { project: Project }) {
  if (project.imageUrl) {
    return (
      <Image
        src={project.imageUrl}
        alt={`Screenshot of ${project.title}`}
        fill
        sizes={project.featured ? "(min-width: 60rem) 60vw, 100vw" : "(min-width: 60rem) 45vw, 100vw"}
      />
    );
  }

  return (
    <div className="project-card__poster" aria-hidden="true">
      {project.logoUrl ? (
        <span className="project-card__poster-logo">
          <Image src={project.logoUrl} alt="" width={72} height={72} />
        </span>
      ) : (
        <span className="project-card__poster-stack">{project.techStack.slice(0, 2).join(" / ")}</span>
      )}
      <span className="project-card__poster-title">{project.title}</span>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <section id="projects" className="page projects-page scroll-section" aria-labelledby="projects-title">
      <header className="page-intro" data-reveal="heading">
        <h2 id="projects-title" className="page-title">Projects</h2>
      </header>

      <div className="project-grid">
        {projects.map((project, index) => {
          const primaryUrl = project.liveUrl ?? project.githubUrl;
          const classes = [
            "project-card",
            project.featured && "project-card--featured",
            project.tone && `project-card--${project.tone}`,
          ].filter(Boolean).join(" ");

          return (
            <article key={project.id} className={classes} data-reveal="item" style={{ "--reveal-index": index } as CSSProperties}>
              <div className="project-card__media">
                {primaryUrl && <span className="project-card__bar">{displayUrl(primaryUrl)}</span>}
                <div className="project-card__frame">
                  <ProjectMedia project={project} />
                </div>
              </div>

              <div className="project-card__content">
                <h3>
                  {primaryUrl ? (
                    <a href={primaryUrl} target="_blank" rel="noopener noreferrer" className="project-card__link">
                      {project.title}
                    </a>
                  ) : (
                    project.title
                  )}
                </h3>
                <p>{project.description}</p>
                <ul className="project-card__tags" aria-label="Technologies">
                  {project.techStack.map((tech) => <li key={tech}>{tech}</li>)}
                </ul>
                <div className="project-card__actions">
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-link">
                      <ExternalLink size={17} aria-hidden="true" /> Live site
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-link project-card__source">
                      <Github size={17} aria-hidden="true" /> Source
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
