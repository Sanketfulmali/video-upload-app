import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [videoFile, setVideoFile] = useState(null);
  const [subtitleText, setSubtitleText] = useState('');
  const [videoURL, setVideoURL] = useState('');
  const [subtitles, setSubtitles] = useState([]);

  useEffect(() => {
    // Fetch existing subtitles when the component mounts
    axios.get('/api/subtitles')
      .then(response => setSubtitles(response.data))
      .catch(error => console.error('Error fetching subtitles:', error));
  }, []);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
    setVideoURL(URL.createObjectURL(file));
  };

  const uploadVideo = () => {
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('subtitles', subtitleText);

    axios.post('/api/upload', formData)
      .then(response => {
        console.log(response.data);
        alert('Video uploaded successfully!');
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <div className="App">
      <h1>Video Subtitle Sync</h1>

      <input type="file" accept="video/*" onChange={handleVideoChange} />
      {videoURL && <video controls src={videoURL}></video>}

      <textarea placeholder="Add subtitles..." value={subtitleText} onChange={(e) => setSubtitleText(e.target.value)}></textarea>

      <button onClick={uploadVideo}>Upload Video</button>

      <h2>Existing Subtitles</h2>
      <ul>
        {subtitles.map((subtitle, index) => (
          <li key={index}>{subtitle.text} - {subtitle.timestamp}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

