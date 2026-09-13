import React from "react";
const projects = [
  {
    title: "Portfolio Website",
    desc: "A personal portfolio built with React and Tailwind.",
    link: "https://github.com/yourgithub/portfolio",
  },
  {
    title: "Weather App",
    desc: "A real-time weather forecast app using OpenWeatherMap API.",
    link: "https://github.com/yourgithub/weather-app",
  },
];

const Projects = () => (
  <section id="projects" className="py-5 bg-light">
    <div className="container" data-aos="fade-up">
      <h2 className="h3 mb-4">Projects</h2>
      <div className="row">
        {projects.map((p, i) => (
          <div key={i} className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{p.title}</h5>
                <p className="card-text">{p.desc}</p>
                <a href={p.link} className="btn btn-primary">
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Projects;
