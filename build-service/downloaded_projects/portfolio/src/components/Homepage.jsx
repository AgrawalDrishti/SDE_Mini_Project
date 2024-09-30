import React from 'react'

function Homepage() {
  return (
    <div>
      <div className="left-home">
        <div className="profile-img">
          <img src='/images/profile.png'/>
        </div>
      </div>
      <div class="right-home">
        <div class="head1">
          <p class="hello-text">Hello, myself</p>
          <p class="name">Soham Parikh</p>
          
          <p>I possess a fervent enthusiasm for technology, particularly in the domain of software development. My passion extends to the meticulous design process and rigorous research methodologies. Furthermore, I exhibit a keen interest in exploring avant-garde technologies, as well as delving into space-related endeavors. Additionally, I have a profound appreciation for cinematic artistry, dedicating time to immerse myself in a diverse array of films.</p>
        </div>
      </div>
      <img src="/images/qaurter.png" alt="" class="bottom-img"/>
    </div>
  )
}

export default Homepage;
