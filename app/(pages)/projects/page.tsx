import Image from "next/image";
import Section from "../../components/retro/Section";
import RetroWindow from "../../components/retro/RetroWindow";
import { NewBadge } from "../../components/retro/Badges";
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
        sizes="(min-width: 780px) 560px, 100vw"
      />
    );
  }

  // No screenshot yet: a scanlined poster in the project's colour.
  return (
    <div className="project__poster" aria-hidden="true">
      {project.logoUrl ? (
        <Image src={project.logoUrl} alt="" width={64} height={64} className="project__poster-logo" />
      ) : (
        <span className="project__poster-glyph">{project.title.slice(0, 1)}</span>
      )}
      <span className="project__poster-title">{project.title}</span>
      <span className="project__poster-stack">{project.techStack.slice(0, 2).join(" / ")}</span>
    </div>
  );
}

function ProjectScreen({ project }: { project: Project }) {
  const primaryUrl = project.liveUrl ?? project.githubUrl;
  const frame = project.videoUrl ? (
    <a
      href={project.videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="project__frame"
      aria-label={`Watch the ${project.title} video`}
    >
      <ProjectMedia project={project} />
      <span className="project__play" aria-hidden="true">&#9658; PLAY</span>
    </a>
  ) : (
    <div className="project__frame">
      <ProjectMedia project={project} />
    </div>
  );

  return (
    <RetroWindow title={primaryUrl ? displayUrl(primaryUrl) : project.title} icon="e" className="project__window">
      {frame}
    </RetroWindow>
  );
}

export default function ProjectsPage() {
  return (
    <Section id="projects" title="My Projects" divider="flame" lede="Stuff I actually built and shipped. Click around, they're real.">
      {projects.map((project, index) => (
        <article
          key={project.id}
          className={[
            "project",
            project.featured && "project--featured",
            project.tone && `project--${project.tone}`,
          ].filter(Boolean).join(" ")}
          aria-labelledby={`project-${project.id}`}
        >
          {index > 0 && <hr />}
          <div className="project__row">
            <div className="project__media">
              <ProjectScreen project={project} />
            </div>
            <div className="project__content">
              <h3 id={`project-${project.id}`} className="project__title">
                {project.title} {project.featured && <NewBadge />}
              </h3>
              <p>{project.description}</p>
              <p className="project__stack">
                <b>Built with:</b> {project.techStack.join(", ")}
              </p>
              <p className="project__links">
                {project.liveUrl && (
                  <>
                    [ <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">Live site</a> ]{" "}
                  </>
                )}
                {project.videoUrl && (
                  <>
                    [ <a href={project.videoUrl} target="_blank" rel="noopener noreferrer">Watch video</a> ]{" "}
                  </>
                )}
                {project.githubUrl && (
                  <>
                    [ <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">Source code</a> ]
                  </>
                )}
              </p>
            </div>
          </div>
        </article>
      ))}
    </Section>
  );
}
