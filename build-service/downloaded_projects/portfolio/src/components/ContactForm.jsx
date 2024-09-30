import React, { useState } from 'react';
import emailjs from 'emailjs-com';

export default function ContactForm() {
const [email, setEmail] = useState('');
const [name, setName] = useState(''); 
const [subject, setSubject] = useState('');
const [message, setMessage] = useState('');
const [formKey, setFormKey] = useState(Date.now());

const sendEmail = (e) => {
e.preventDefault();

emailjs.send('service_zrl9tlo', 'template_ajtvsmp', {
to_name: email,
from_name: name,
subject: subject,
message: message,
}, 'GlZ2laDdbV1BmxN4f')
.then((result) => {
    alert('Successfully sent email!');
    setEmail('');
    setName('');
    setSubject('');
    setMessage('');
    setFormKey(Date.now());
}, (error) => {
    alert('Failed to send email. Error: ', error);
});
};

return (
<div className='contactPage'>
    <div class="leftContact">
        <img src='/images/soham.png' alt=""/>
    </div>
    <div class="rightContact">
        <h1 class="contact-head">Let's <span>talk</span></h1>
        <p class="form-below">I am a talkative guy with a good sense of humour.</p>
        <p class="form-below">To know more about each other, let's connect....</p>
        <form action="" class="contact-form" onSubmit={sendEmail} key={formKey}>
            <div class="boxes">
                <label for="">Enter your name
                <br/>
                <input type="text" placeholder="Your Name" onChange={(e) => setName(e.target.value)}/>
                </label>
            </div>
            <div class="boxes">
                <label for="">Enter your message
                <br/>
                <textarea type="text" placeholder="Enter your message in max 400 words" onChange={(e) => setMessage(e.target.value)}/>
                </label>
                <br/>
            </div>
            
            <button type="submit">Submit</button>
        </form>
        <div class="links">
            <p class="info">For more info : </p>
            <div class="icon">
                <a href="https://www.linkedin.com/in/soham-parikh-b344a922b/" target="_blank">
                    <img src="/images/ll2.png" alt=""/>
                </a>
            </div>
            <div class="icon">
                <a href="#" target="_blank">
                    <img src="/images/sqM.png" alt=""/>
                </a>
            </div>
            <div class="icon">
                <a href="https://github.com/sohamp321" target="_blank">
                    <img src="/images/gt.png" alt=""/>
                </a>
            </div>
            <div class="icon">
                <a href="#" target="_blank">
                    <img src="/images/insta.png" alt=""/>
                </a>
            </div>
            <div class="icon">
                <a href="#" target="_blank">
                    <img src="/images/dco.png" alt=""/>
                </a>
            </div>
        </div>
        <img src="/images/qaurter.png" alt="" class="bottom-img"/>
    </div>
</div>
)
}
