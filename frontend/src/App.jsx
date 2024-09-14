import { useState } from "react";

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

  function uploadZip() {
    if (!fileSelected) {
      alert("Please choose a zip file before uploading");
      return;
    }

    console.log("zip uploaded", fileSelected);
    fetch("uploads/" + encodeURIComponent(fileSelected.name), {
      method: "PUT",
      body: fileSelected,
    })
      .then((response) => {
        if (response.ok) {
          alert("Your file has been uploaded successfully");
        } else {
          alert("File upload failed");
        }
      })
      .catch((error) => {
        alert("An error occurred while uploading the file");
        console.error("Upload error:", error);
      });
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
                <button type="submit" id="submit_button">
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
