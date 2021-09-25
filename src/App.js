import React, { useState, useEffect }  from 'react';
import Tesseract from 'tesseract.js';
import './App.css';
import ImageWrapper from './Components/ImageWrapper';
import TextWrapper from './Components/TextWrapper';
import axios from "axios";
const API_KEY="f3c4921518f6a42a65233aff576d5365";

function App() {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [text, setText] = useState(null);

  const convertImageToText = async () => {
    setLoading(true);
    const result = await Tesseract.recognize(imageUrl, "eng");
    setText(result.data.text);
    setLoading(false);
  };

  const uploadFile = async e => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", e.target.files[0]);
      const config = {
        headers: {
          "content-type": "multipart/form-data"
        }
      };

      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${API_KEY}`,
        formData,
        config
      );
      setImageUrl(res.data.data.url);
      setLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (imageUrl != null) {
      convertImageToText();
    }
  }, [imageUrl]);
  console.log(`${process.env.REACT_APP_API_KEY}`);
  return (
    <div className="App">
      <h1>Shivam Image To Text Converter</h1>
      {/* <img src="imagetotextapp/static/myphoto.png" className="logo" width="200px" height="200px" alt="Shivam Image To Text Converter" /> */}
      <div className="container">
      {loading && <div className="loader"></div>}
        {text == null ? (
          <ImageWrapper loading={loading} uploadFile={uploadFile} />
        ) : (
          <TextWrapper text={text} />
        )}
      </div>
    </div>
  );
}

export default App;
