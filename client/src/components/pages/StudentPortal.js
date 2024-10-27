import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const StudentPortal = () => {
  const [certificateId, setCertificateId] = useState('');
  const [certificate, setCertificate] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/certificates/${certificateId}`);
      setCertificate(response.data);
      toast.success('Certificate found successfully!');
    } catch (error) {
      toast.error('Certificate not found'); 
    }
  };

  const handleDownload = () => {
    window.open(`http://localhost:5000/download-certificate/${certificateId}`);
    toast.info('Downloading certificate...'); 
  };

  const handleCopyLink = () => {
    const link = `http://localhost:5000/verify-certificate?id=${certificateId}`;
    navigator.clipboard.writeText(link).then(() => {
      toast.success('Certificate link copied to clipboard!'); 
    });
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const Certificate = ({ studentName, courseName, issueDate, credentialId, startDate, endDate }) => {
    return (
      <div className="w-full h-auto flex justify-center items-center py-10 bg-gray-100">
        <div className="border-8 border-yellow-500 p-8 rounded-lg shadow-lg max-w-2xl bg-white mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4 text-blue-700">Certificate of Completion</h1>
          <h2 className="text-2xl text-center mb-2 text-gray-700">This Certificate is proudly presented to</h2>
          <p className="text-4xl font-semibold text-center text-gray-800 mb-6">{studentName}</p>

          <p className="text-xl text-center mb-6 text-gray-600">
            For successfully completing the internship
          </p>
          <p className="text-2xl text-center font-bold text-blue-600 mb-4">{courseName}</p>

          <div className="flex justify-between items-center mt-10">
            <div>
              <p className="text-gray-600">Issued on: {issueDate}</p>
              <p className="text-gray-600">Credential ID: {credentialId}</p>
            </div>
            <div className="text-right">
              <p className="text-blue-600 text-lg font-semibold">Tech Fire Pvt. Ltd.</p>
              <p className="text-sm italic text-gray-500">www.techfire.com</p>
            </div>
          </div>

          {/* New Section for Start and End Dates */}
          <div className="flex flex-col items-center mt-10">
            <p className="text-gray-600">Internship Duration:</p>
            <p className="text-gray-600">Start Date: {startDate}</p>
            <p className="text-gray-600">End Date: {endDate}</p>
          </div>

          <div className="flex justify-center items-center mt-10">
            <p className="text-center text-sm text-gray-500">
              This certificate is valid and issued by Tech Fire Pvt. Ltd..
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center p-6">
      <ToastContainer /> 
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 w-full bg-gray-50 p-6 flex flex-col">
            <h2 className="text-3xl font-bold text-center text-blue-600 mb-4">Search Certificate</h2>
            <input
              type="text"
              placeholder="Enter Certificate ID"
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 mt-4"
            />
            <button
              onClick={handleSearch}
              className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg mt-4 hover:bg-blue-700 shadow-md transition duration-300"
            >
              Search Certificate
            </button>

            {certificate && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-center text-gray-800">Certificate Found</h3>
                <button
                  onClick={handleDownload}
                  className="w-full bg-green-500 text-white font-bold py-2 rounded-lg mt-2 hover:bg-green-600 shadow-md transition duration-300"
                >
                  Download Certificate
                </button>

                <div className="mt-2">
                  <p className="text-center text-gray-500 mb-1">Share this certificate:</p>
                  <input
                    type="text"
                    readOnly
                    value={`http://localhost:5000/verify-certificate?id=${certificateId}`}
                    className="w-full border border-gray-300 rounded-lg p-2 text-center shadow-sm"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg mt-2 hover:bg-blue-600 shadow-md transition duration-300"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="md:w-2/3 w-full bg-white p-4 flex flex-col items-center justify-center">
            {certificate ? (
              <Certificate
                studentName={certificate.studentName}
                courseName={certificate.courseName}
                issueDate={formatDate(new Date())} 
                credentialId={certificate.certificateId}
                startDate={formatDate(certificate.startingDate)}
                endDate={formatDate(certificate.endingDate)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Welcome to the Certificate Portal</h2>
                <p className="text-gray-500 mb-2 text-center">
                  Please enter a Certificate ID on the left to search for your certificate.
                </p>
                <p className="text-gray-500 text-center">
                  Once found, you can view and download it directly from this page.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPortal;
