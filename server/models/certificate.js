const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certificateId: String,
  studentName: String,
  internshipDomain: String,
  startingDate: Date,
  endingDate: Date,
});

const Certificate = mongoose.model('Certificate', certificateSchema);

module.exports = Certificate;