import { useState } from "react";
import axios from "axios";

function App() {
  const [selectedOption, setSelectedOption] = useState("github");
  const [placeholder, setPlaceholder] = useState("Link to github");
  const [fileSelected, setFileSelected] = useState(null);

  const handleDropdownChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);

    if (value === "github") {
      setPlaceholder("Link to github");
    } else if (value === "docker") {
      setPlaceholder("Link to Docker Image");
    } else if (value === "zip") {
      setPlaceholder("Upload zip file");
    }
  };

  const handleFileChange = (event) => {
    setFileSelected(event.target.files[0]);
  };

  async function uploadZip() {
    if (!fileSelected) {
      alert("Please choose a zip file before uploading");
      return;
    }
    console.log("zip uploaded", fileSelected);
    const formData = new FormData();
    formData.append('codebase' , fileSelected);
    try {
      const response = await axios.post('http://localhost:3000/upload/zip_file' , formData)
      console.log(response);
      alert("Successfully Uploaded Your Zip!");
    } catch (err) {
      console.error('Error ' , err);
      alert("Something went wrong");
    }
  };

  const sendLink = async (event) => {
    event.preventDefault();
    if(selectedOption === "github"){
      try {
        const response = await axios.post('http://localhost:3000/upload/github_url',{
          "github_url": document.getElementById('input_type').value
        });
        console.log(response);
        console.log("Provided GitHub Link:",document.getElementById('input_type').value);
        alert("Successfully Sent the GitHub Link!");
      } catch (err) {
        console.error('Error ' , err);
        alert("Something went wrong ",err);
      }
    } else {
      try {
        const response = await axios.post('http://localhost:3000/upload/docker_image',{
          "docker_image": document.getElementById('input_type').value
        });
        console.log(response);
        console.log("Provided GitHub Link:",document.getElementById('input_type').value);
        alert("Successfully Sent the Docker Image!");
      } catch (err) {
        console.error('Error ' , err);
        alert("Something went wrong ",err);
      }
    }
  }

  return (
    <div>
      <div className="navbar">
        <p>Deployment Bot</p>
      </div>

      <div className="container">
        <div className="main">
          <div>
            <p>
              <span className="start_text">Effortless <span className="mid_text">Deployment</span> <br></br>with Our Bot</span><br></br>
              <br></br>
              <span className="end_text">
              Streamline your website deployment process with our advanced
              deployment bot. Whether <br></br>you’re using a GitHub link, Docker image,
              or a GitHub folder, our bot automates the entire deployment
              pipeline, ensuring a smooth and hassle-free setup. Save time and
              reduce errors—deploy with confidence today!
              </span>
            </p>
          </div>
          <div className="links">
            {selectedOption !== "zip" ? (
              <form id="link_form">
                <div className="form-row">
                  <input
                    type="text"
                    id="input_type"
                    name="input_type"
                    placeholder={placeholder}
                  />
                  <select
                    name="dropdown"
                    id="dropdown"
                    onChange={handleDropdownChange}
                    value={selectedOption}
                  >
                    <option value="github">Github</option>
                    <option value="docker">Docker</option>
                    <option value="zip">Upload zip</option>
                  </select>
                </div>
                <button type="submit" id="submit_button" onClick={sendLink}>
                  Submit
                </button>
              </form>
            ) : (
              <form id="link_form">
                <div className="form-row">
                  <input
                    type="file"
                    id="input_file"
                    onChange={handleFileChange}
                    accept=".zip"
                  />
                  <select
                    name="dropdown"
                    id="dropdown"
                    onChange={handleDropdownChange}                    
                    value={selectedOption}
                  >
                    <option value="github">Github</option>
                    <option value="docker">Docker</option>
                    <option value="zip">Upload zip</option>
                  </select>
                </div>
                <button type="button" onClick={uploadZip} id="choose_file">
                  Upload Zip
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
