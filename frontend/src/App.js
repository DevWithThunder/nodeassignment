import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import Modal from "react-modal";
const serverUrl = `http://127.0.0.1:5000`;

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [inputValue, setinputValue] = useState("");
  const [filter, setFilter] = useState('No Filter');
  const [imageClass, setImageClass] = useState('preview-image');
  const [imageData, setImageData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [modalimageClass, setmodalimageClass] = useState('preview-image');

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    let filter = event.target.value;
    if (filter === 'grayscale') {
      setImageClass('grayscale-img')
    } else if (filter === 'sepia') {
      setImageClass('sepia-img')
    } else {
      setImageClass('preview-image')
    }
  };

  const uploadImage = () => {
    if (selectedImage == null) {
      console.log('please select the image')
    } else {
      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("filter", filter);
      axios
        .post(`${serverUrl}/upload`, formData)
        .then((response) => {
          console.log(response.data);
          const res = response.data;
          alert(res.data)
          setSelectedImage(null);
          setinputValue("")
          setImageData([])
          // fetchImages();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const fetchImages = () => {
    axios
      .get(`${serverUrl}/images`)
      .then((response) => {
        console.log(response.data);
        setImageData(response?.data?.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const openModal = async (iname, imageClass) => {
    try {
      const imageName = iname;
      const response = await fetch(`${serverUrl}/getimage/${imageName}`);
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageSrc(imageUrl);
      setShowModal(true);
      if (imageClass === 'grayscale') {
        setmodalimageClass('grayscale-img')
      } else if (imageClass === 'sepia') {
        setmodalimageClass('sepia-img')
      } else {
        setmodalimageClass('preview-image')
      }
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "white",
      width: 400,
    },
  };

  return (
    <div className="App">
      <div className="top-half">
        <h1>Image Upload and Display</h1>
        <input type="file" accept="image/*" value={inputValue} onChange={handleImageChange} />

        {selectedImage && (
          <div>
            <h2>Preview:</h2>
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Preview"
              className={imageClass}
            />
            <br />
            <div className="separate">
              <select onChange={handleFilterChange}>
                <option value="">No Filter</option>
                <option value="grayscale">Grayscale</option>
                <option value="sepia">Sepia</option>
              </select>
              <button className="uploadbtn" onClick={uploadImage}>Upload</button>
            </div>
          </div>
        )}
      </div>
      <div className="bottom-half">

        <h1>Fetch Uploaded Images</h1>
        <button className="uploadbtn" onClick={fetchImages}>Fetch</button>
        {(imageData.length !== 0) &&
          (<div >
            <h2 style={{ textAlign: 'center' }}>Image Table</h2>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
              <table style={{ borderCollapse: 'collapse', width: '50%' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f2f2f2' }}>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Image</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {imageData.map((image, index) => (
                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#f2f2f2' }}>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                        <h4>{image.name}</h4>
                        <h5>Filter Used: {image.filter}</h5>
                        <p>Uploaded Date: {image.uploadDate}</p>
                      </td>
                      <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                        <button style={{ cursor: 'pointer', backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px' }} onClick={() => {
                          openModal(image.name, image.filter)
                        }}>View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>)
        }
      </div>
      {showModal && (
        <Modal
          isOpen={showModal}
          onRequestClose={() => setShowModal(false)}
          style={customStyles}
        >
          <img
            src={imageSrc}
            alt="Preview"
            className={modalimageClass}
          />

          <button onClick={() => setShowModal(false)}>Close Modal</button>
        </Modal>
      )}
    </div>
  );
}

export default App;
