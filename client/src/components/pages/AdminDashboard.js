import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminDashboard = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/upload-excel', formData);
      toast.success(response.data); // Show success message
    } catch (error) {
      toast.error('Error uploading file'); // Show error message
    }
  };

  const handleDownload = async () => {
    const response = await fetch('http://localhost:5000/download-dummy-data');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'dummy_data.xlsx';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Download started'); // Show success message
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Toast Container */}
      <ToastContainer />

      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
        <div className="container mx-auto flex justify-center">
          <h1 className="text-white text-3xl font-bold">TechFire</h1>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-5">
        <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-lg transition-transform transform hover:scale-105 duration-300">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Dashboard</h2>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Actions</h3>
            <button
              onClick={handleDownload}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mb-4 transition duration-200 transform hover:scale-105"
            >
              Download Dummy Data Excel
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Upload Data</h3>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4"
            />
            <button
              onClick={handleUpload}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition duration-200 transform hover:scale-105"
            >
              Upload
            </button>
          </div>

          <div className="text-center">
            <p className="text-gray-500">Manage your data efficiently</p>
            <p className="text-gray-500">All actions are logged for security.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-600 p-4 mt-4">
        <div className="container mx-auto text-center text-white">
          <p>© 2024 TechFire. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
