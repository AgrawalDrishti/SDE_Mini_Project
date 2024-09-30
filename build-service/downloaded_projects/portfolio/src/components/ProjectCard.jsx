import React from 'react'

function ProjectCard({name , desc , techstack, image}) {
    return (
      <div class="project-card">
        <div class="hidden">
            GITHUB
        </div>
        <div class="empty">
            <img src={image} alt=""/>
        </div>
        <div class="bottom-half">
          <p class="project-head">{name}</p>
          <p class="project-desc">{desc}</p>
          <p class="techstack"><span>Tech stack : </span>{techstack}</p>
        </div>
      </div>
    )
}
   

export default ProjectCard;
