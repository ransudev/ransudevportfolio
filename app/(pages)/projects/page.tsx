import Image from "next/image";
import { projects, type Project } from "../../data/projects";
import { BackToTop, Divider, NewBadge } from "../../components/retro/Badges";

function displayUrl(url: string) {
  const { host, pathname } = new URL(url);
  return `${host}${pathname === "/" ? "" : pathname}`;
}

function windowTitle(project: Project) {
  return `${project.title.toLowerCase().replace(/\s+/g, "-")}.exe`;
}

function ProjectMedia({ project }: { project: Project }) {
  if (project.imageUrl) {
    return (
      <Image
        src={project.imageUrl}
        alt={`Screenshot of ${project.title}`}
        fill
        sizes="(min-width: 62rem) 46rem, 100vw"
      />
    );
  }

  // No screenshot yet: a pixel "file icon" poster in the project's colour.
  return (
    <div className="project__poster" aria-hidden="true">
      <span className="project__poster-icon">
        {project.logoUrl ? (
          <Image src={project.logoUrl} alt="" width={64} height={64} />
        ) : (
          <span className="project__poster-glyph">{project.title.slice(0, 1)}</span>
        )}
      </span>
      <span className="project__poster-title">{project.title}</span>
      <span className="project__poster-stack">{project.techStack.slice(0, 2).join(" / ")}</span>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <section id="projects" className="scroll-section section" aria-labelledby="projects-title">
      <h2 id="projects-title" className="section-title">
        <span aria-hidden="true">✦ </span>My Projects<span aria-hidden="true"> ✦</span>
      </h2>
      <Divider kind="flame" />
      <p className="section-lede">
        Stuff I actually built and shipped. Click around, they&apos;re real.
      </p>

      <div className="projects">
        {projects.map((project) => {
          const primaryUrl = project.liveUrl ?? project.githubUrl;
          const classes = [
            "window",
            "project",
            project.featured && "project--featured",
            project.tone && `project--${project.tone}`,
          ].filter(Boolean).join(" ");

          return (
            <article key={project.id} className={classes} aria-labelledby={`project-${project.id}`}>
              <div className="window__bar">
                <span className="window__title">
                  <span className="window__icon" aria-hidden="true">▣</span>
                  {windowTitle(project)}
                </span>
                <span className="window__controls" aria-hidden="true">
                  <span>_</span>
                  <span>□</span>
                  <span>×</span>
                </span>
              </div>

              <div className="window__body project__body">
                <div className="project__media">
                  {primaryUrl && (
                    <p className="project__address">
                      <span aria-hidden="true">Address:</span> {displayUrl(primaryUrl)}
                    </p>
                  )}
                  {project.videoUrl ? (
                    <a
                      href={project.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project__frame project__frame--video"
                      aria-label={`Watch the ${project.title} video`}
                    >
                      <ProjectMedia project={project} />
                      <span className="project__play" aria-hidden="true">▶ PLAY</span>
                    </a>
                  ) : (
                    <div className="project__frame">
                      <ProjectMedia project={project} />
                    </div>
                  )}
                </div>

                <div className="project__content">
                  <h3 id={`project-${project.id}`} className="project__title">
                    {project.title}
                    {project.featured && <NewBadge />}
                  </h3>
                  <p>{project.description}</p>
                  <p className="project__stack">
                    <span className="project__stack-label">built with:</span>{" "}
                    {project.techStack.join(" · ")}
                  </p>
                  <div className="project__actions">
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
                        ► Live site
                      </a>
                    )}
                    {project.videoUrl && (
                      <a href={project.videoUrl} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
                        ▶ Watch video
                      </a>
                    )}
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn">
                        {"</>"} Source
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <BackToTop />
    </section>
  );
}
