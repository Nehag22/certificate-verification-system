const xlsx = require('xlsx');
const pdf = require('html-pdf');
const path = require('path');
const fs = require('fs');
const Certificate = require("../models/certificate")

// Upload Excel file
const uploadExcel = async (req, res) => {
  const workbook = xlsx.read(req.file.buffer);
  const sheetName = workbook.SheetNames[0];
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  const expectedFields = ['Certificate_ID', 'Student_Name', 'Internship_Domain', 'Starting_Date', 'Ending_Date'];

  const isValid = data.every((row) =>
    expectedFields.every((field) => field in row)
  );

  if (!isValid) {
    return res.status(400).send('Uploaded data does not match the expected format.');
  }

  const certificateIds = data.map(row => row.Certificate_ID);

  try {
    const existingCertificates = await Certificate.find({ certificateId: { $in: certificateIds } });
    const existingCertificateIds = new Set(existingCertificates.map(cert => cert.certificateId));

    const newCertificates = data
      .filter(row => !existingCertificateIds.has(row.Certificate_ID))
      .map(row => ({
        certificateId: row.Certificate_ID,
        studentName: row.Student_Name,
        internshipDomain: row.Internship_Domain,
        startingDate: new Date(row.Starting_Date),
        endingDate: new Date(row.Ending_Date)
      }));

    if (newCertificates.length > 0) {
      await Certificate.insertMany(newCertificates);
      res.status(200).send('New data uploaded successfully');
    } else {
      res.status(200).send('No new data to upload; all entries already exist.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading data');
  }
};

// Retrieve certificate by ID
const getCertificateById = async (req, res) => {
  const certificate = await Certificate.findOne({ certificateId: req.params.id });
  if (!certificate) return res.status(404).send('Certificate not found');
  res.json(certificate);
};

// Download certificate as PDF
const downloadCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ certificateId: req.params.id });

    if (!certificate) {
      return res.status(404).send('Certificate not found');
    }

    const formatDate = (dateString) => {
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Certificate of Completion</title>
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f7fafc; /* light gray */
          }
          .certificate {
            border: 8px solid #f6e05e; /* yellow */
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            max-width: 800px;
            width: 100%;
            background-color: #ffffff; /* white */
            text-align: center;
          }
          .title {
            font-size: 36px; /* 4xl */
            font-weight: bold;
            color: #2b6cb0; /* blue */
            margin-bottom: 20px;
          }
          .subtitle {
            font-size: 24px; /* 2xl */
            color: #4a5568; /* gray */
            margin-bottom: 10px;
          }
          .student-name {
            font-size: 36px; /* 4xl */
            font-weight: bold;
            color: #2d3748; /* dark gray */
            margin-bottom: 30px;
          }
          .course-name {
            font-size: 24px; /* 2xl */
            font-weight: bold;
            color: #3182ce; /* blue */
            margin-bottom: 20px;
          }
          .footer {
            display: flex;
            justify-content: space-between;
            margin-top: 40px;
          }
          .footer-left,
          .footer-right {
            color: #4a5568; /* gray */
          }
          .footer-right {
            text-align: right;
          }
          .issuer {
            color: #3182ce; /* blue */
            font-weight: bold;
            font-size: 18px; /* lg */
          }
          .issuer-website {
            font-size: 12px; /* sm */
            font-style: italic;
            color: #a0aec0; /* gray */
          }
          .validity {
            margin-top: 30px;
            font-size: 12px; /* sm */
            color: #a0aec0; /* gray */
          }
          .duration {
            margin-top: 20px;
            font-size: 16px; /* md */
            color: #4a5568; /* gray */
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <h1 class="title">Certificate of Completion</h1>
          <h2 class="subtitle">This Certificate is proudly presented to</h2>
          <p class="student-name">${certificate.studentName}</p>
          <p class="subtitle">For successfully completing the internship</p>
          <p class="course-name">${certificate.internshipDomain}</p>
          <div class="duration">
            <p>Internship Duration:</p>
            <p>Start Date: ${formatDate(certificate.startingDate)}</p>
            <p>End Date: ${formatDate(certificate.endingDate)}</p>
          </div>
          <div class="footer">
            <div class="footer-left">
              <p>Issued on: ${formatDate(new Date())} </p>
              <p>Credential ID: ${certificate.certificateId}</p>
            </div>
            <div class="footer-right">
              <p class="issuer">Tech Fire Pvt. Ltd.</p>
              <p class="issuer-website">www.techfire.com</p>
            </div>
          </div>
          <div class="validity">
            <p>This certificate is valid and issued by Tech Fire Pvt. Ltd..</p>
          </div>
        </div>
      </body>
    </html>
    `;
    const options = { format: 'A4', orientation: 'portrait', border: '10mm' };

    pdf.create(htmlContent, options).toStream((err, stream) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error generating PDF');
      }

      res.setHeader('Content-Disposition', `attachment; filename=certificate_${certificate.certificateId}.pdf`);
      res.setHeader('Content-Type', 'application/pdf');
      stream.pipe(res);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

// Dummy data download
const downloadDummyData = (req, res) => {
  const dummyData = [
    {
      Certificate_ID: 'C123',
      Student_Name: 'Ashish Bhargav',
      Internship_Domain: 'Web Development',
      Starting_Date: '2023-01-01',
      Ending_Date: '2023-06-30',
    },
    {
      Certificate_ID: 'C124',
      Student_Name: 'Neha Gupta',
      Internship_Domain: 'Data Science',
      Starting_Date: '2023-01-15',
      Ending_Date: '2023-07-15',
    },
  ];

  const ws = xlsx.utils.json_to_sheet(dummyData);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, 'Certificates');

  const filePath = path.join(__dirname, '../uploads/dummy_certificates.xlsx');
  xlsx.writeFile(wb, filePath);
  res.download(filePath, 'dummy_certificates.xlsx', (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error downloading file');
    }
  });
};

module.exports = {
  uploadExcel,
  getCertificateById,
  downloadCertificate,
  downloadDummyData,
};
