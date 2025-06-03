import { useState } from 'react';
import axios from '../api/axios';

export default function Upload() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post('/employees/upload/', formData);
      alert(res.data.message);
    } catch (err) {
      alert('Upload failed');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Upload Employees</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} className="mb-4" />
      <button onClick={handleUpload} className="bg-green-500 text-white px-4 py-2 rounded">Upload</button>
    </div>
  );
}