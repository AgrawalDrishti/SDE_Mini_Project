import React from 'react'
import ProjectCard from './ProjectCard'
import jsonData from '../JSONs/projects.json'

function Mywork() {
    const projects = jsonData["projects"];
   return (
    <div class="mywork-section">
        <h1>Have a look at my <span class="projects_span">projects</span></h1>
        <div class="projects">
            {
                projects.map((project) => (
                    <ProjectCard name={project.name} desc={project.desc} techstack={project.techstack} image={project.image} key={project.name}/>
                ))
            }
        </div>
        <img src="/images/qaurter.png" alt="" class="bottom-img"/>
    </div>
   )
  }
  

export default Mywork;
