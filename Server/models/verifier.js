// models/donorModel.js
const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  Inititutename: { type: String, required: true, trim: true },
  username: { type: String, trim: true },
  password: { type: String, },
  institutionType: { type: String, enum: ['school', 'college',], required: true },
  institutionCode: { type: String, required: true },
  contactEmail: { type: String, required: true, lowercase: true },
  contactperson: { type: String, required: true, trim: true },
  requestMessage: { type: String, trim: true },
  website: { type: String, trim: true },
  approved: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  requestMessage: { type: String, trim: true },
  scholarshipsPosted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Scholarship' }],
}, { timestamps: true });

const Donor = mongoose.model('verifier', donorSchema);
module.exports = Donor;
