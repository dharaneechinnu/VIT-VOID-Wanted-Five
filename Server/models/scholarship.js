// models/scholarshipModel.js
const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema(
  {
    // ✅ Basic Details
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    eligibilityCriteria: {
      type: String,
      required: true,
      trim: true,
    },

    deadline: {
      type: Date,
      required: true,
    },

    // ✅ Link to Donor (Who created it)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donor',
      required: true,
    },

    // ✅ Applied Students
    applicants: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'UsersLogins' },
        status: {
          type: String,
          enum: ['pending', 'verified', 'approved', 'funded', 'rejected'],
          default: 'pending',
        },
        appliedAt: { type: Date, default: Date.now },
      },
    ],

    // ✅ Additional Info
    category: {
      type: String,
      enum: ['School', 'College', 'Research', 'Other'],
      default: 'School',
    },

    region: {
      type: String,
      trim: true,
    },

    totalFunded: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Scholarship = mongoose.model('Scholarship', scholarshipSchema);
module.exports = Scholarship;
