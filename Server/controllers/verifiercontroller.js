const Verifier = require('../models/verifier');
const Scholarship = require('../models/scholarship');
const VerifierApplication = require('../models/verifierapplyform');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ✅ Register Verifier Request (Institution Registration)
exports.registerVerifierRequest = async (req, res) => {
  try {
    const {
      institutionName,
      institutionType,
      institutionCode,
      contactEmail,
      contactPerson,
      requestMessage,
      website,
    } = req.body;

    // Check for missing fields
    if (!institutionName || !contactEmail) {
      return res.status(400).json({ message: 'Institution name and contact email are required.' });
    }

    // Check for existing record
    const existing = await Verifier.findOne({ contactEmail });
    if (existing) {
      return res.status(400).json({ message: 'Institution already registered' });
    }

    const verifier = new Verifier({
      institutionName,
      institutionType,
      institutionCode,
      contactEmail,
      contactPerson,
      requestMessage,
      website,
      approved: false,
      status: 'pending',
    });

    await verifier.save();

    res.status(201).json({
      message: 'Verifier registration request submitted successfully. Awaiting Super Admin approval.',
      verifier: {
        id: verifier._id,
        institutionName: verifier.institutionName,
        status: verifier.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting request', error: error.message });
  }
};

// ✅ Login Verifier
exports.loginVerifier = async (req, res) => {
  try {
    // Ensure req.body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'Request body is missing' });
    }

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const verifier = await Verifier.findOne({ username });
    if (!verifier) {
      return res.status(404).json({ message: 'Verifier not found' });
    }

    const isMatch = await bcrypt.compare(password, verifier.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ id: verifier._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Remove password before sending
    const { password: _, ...verifierWithoutPassword } = verifier.toObject();

    res.status(200).json({
      message: 'Login successful',
      token,
      verifier: verifierWithoutPassword,
    });
  } catch (error) {
    console.error('Error in loginVerifier:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Verifier: view all scholarships
exports.viewAllScholarships = async (req, res) => {
  try {
    // Optional query param: onlyActive=true to filter active scholarships
    const { onlyActive } = req.body;
    const filter = {};
    if (onlyActive === 'true') filter.isActive = true;

    const scholarships = await Scholarship.find(filter)
      .populate({ path: 'createdBy', select: 'orgName contactPerson contactEmail' })
      .populate({ path: 'applicants.studentId', select: 'name email' })
      .sort({ createdAt: -1 });

    res.status(200).json({ count: scholarships.length, scholarships });
  } catch (error) {
    console.error('Error in viewAllScholarships:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Verifier: apply for a scholarship on behalf of a student (JSON only)
exports.applyForScholarship = async (req, res) => {
  try {
    const data = req.body;

    // Basic required fields validation
    const required = ['verifierId', 'scholarshipId', 'studentname', 'studentemail', 'studentid', 'gender', 'institutionname', 'classoryear', 'familyIncome'];
    for (const f of required) {
      if (!data[f]) return res.status(400).json({ message: `${f} is required` });
    }

    // Validate object ids
    if (!mongoose.Types.ObjectId.isValid(data.verifierId)) return res.status(400).json({ message: 'Invalid verifierId' });
    if (!mongoose.Types.ObjectId.isValid(data.scholarshipId)) return res.status(400).json({ message: 'Invalid scholarshipId' });
    if (!mongoose.Types.ObjectId.isValid(data.studentid)) return res.status(400).json({ message: 'Invalid studentid' });

    // Ensure scholarship exists
    const scholarship = await Scholarship.findById(data.scholarshipId);
    if (!scholarship) return res.status(404).json({ message: 'Scholarship not found' });

    // Validate numeric fields
    if (data.tenthMarks !== undefined) {
      let val = Number(data.tenthMarks);
      if (Number.isNaN(val)) return res.status(400).json({ message: 'tenthMarks must be a number' });
      if (val < 0) return res.status(400).json({ message: 'tenthMarks must be >= 0' });
      if (val > 100) {
        let max = 100;
        if (val <= 500) max = 500;
        else if (val <= 600) max = 600;
        else if (val <= 1000) max = 1000;
        else return res.status(400).json({ message: 'tenthMarks seems too large; provide percentage (0-100) or valid total marks' });
        const percent = (val / max) * 100;
        if (percent > 100) return res.status(400).json({ message: 'tenthMarks normalized to percentage exceeds 100' });
        val = parseFloat(percent.toFixed(2));
      }
      if (val < 0 || val > 100) return res.status(400).json({ message: 'tenthMarks must be between 0 and 100' });
      data.tenthMarks = val;
    }
    if (data.twelfthMarks !== undefined) {
      let val = Number(data.twelfthMarks);
      if (Number.isNaN(val)) return res.status(400).json({ message: 'twelfthMarks must be a number' });
      if (val < 0) return res.status(400).json({ message: 'twelfthMarks must be >= 0' });
      if (val > 100) {
        let max = 100;
        if (val <= 500) max = 500;
        else if (val <= 600) max = 600;
        else if (val <= 1000) max = 1000;
        else return res.status(400).json({ message: 'twelfthMarks seems too large; provide percentage (0-100) or valid total marks' });
        const percent = (val / max) * 100;
        if (percent > 100) return res.status(400).json({ message: 'twelfthMarks normalized to percentage exceeds 100' });
        val = parseFloat(percent.toFixed(2));
      }
      if (val < 0 || val > 100) return res.status(400).json({ message: 'twelfthMarks must be between 0 and 100' });
      data.twelfthMarks = val;
    }

    // Normalize semesterCgpa entries
    if (Array.isArray(data.semesterCgpa)) {
      for (let i = 0; i < data.semesterCgpa.length; i++) {
        const item = data.semesterCgpa[i];
        if (item && item.cgpa !== undefined) {
          const cg = Number(item.cgpa);
          if (Number.isNaN(cg)) return res.status(400).json({ message: `semesterCgpa[${i}].cgpa must be a number` });
          if (cg < 0 || cg > 10) return res.status(400).json({ message: `semesterCgpa[${i}].cgpa must be between 0 and 10` });
          data.semesterCgpa[i].cgpa = cg;
        }
        if (item && item.semester !== undefined) {
          const sem = Number(item.semester);
          if (Number.isNaN(sem) || sem < 1) return res.status(400).json({ message: `semesterCgpa[${i}].semester must be a positive integer` });
          data.semesterCgpa[i].semester = Math.floor(sem);
        }
      }
    }

    // Prepare application payload (no documents from this route)
    const applicationPayload = {
      verifierId: data.verifierId,
      scholarshipId: data.scholarshipId,
      studentname: data.studentname,
      studentemail: data.studentemail,
      studentid: data.studentid,
      gender: data.gender,
      institutionname: data.institutionname,
      classoryear: data.classoryear,
      tenthMarks: data.tenthMarks,
      twelfthMarks: data.twelfthMarks,
      semesterCgpa: Array.isArray(data.semesterCgpa) ? data.semesterCgpa : undefined,
      familyIncome: data.familyIncome,
      firstGenGraduate: data.firstGenGraduate || false,
      documents: Array.isArray(data.documents) ? data.documents : [], // Accept documents metadata if provided
      remarks: data.remarks,
    };

    // payoutDetails is required for admin to pay to verifier
    if (!data.payoutDetails || typeof data.payoutDetails !== 'object') {
      return res.status(400).json({ message: 'payoutDetails is required for payment to verifier' });
    }
    applicationPayload.payoutDetails = {
      beneficiaryId: data.payoutDetails.beneficiaryId,
      accountHolderName: data.payoutDetails.accountHolderName,
      accountNumber: data.payoutDetails.accountNumber,
      maskedAccountNumber: data.payoutDetails.maskedAccountNumber,
      ifsc: data.payoutDetails.ifsc,
      bankName: data.payoutDetails.bankName,
      email: data.payoutDetails.email,
      phone: data.payoutDetails.phone,
      beneficiaryVerified: data.payoutDetails.beneficiaryVerified,
    };

    const app = new VerifierApplication(applicationPayload);
    await app.save();

    res.status(201).json({ 
      message: 'Application submitted successfully', 
      application: app,
      note: 'Use /verifier/uploaddocuments to upload files for this application'
    });
  } catch (error) {
    console.error('Error in applyForScholarship:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Verifier: upload documents for an existing application (form-data with files)
exports.uploadDocuments = async (req, res) => {
  try {
    // Accept applicationId from URL param or request body
    const applicationId = req.params.applicationId || req.body.applicationId;

    if (!applicationId) {
      return res.status(400).json({ message: 'applicationId is required as URL param or in body' });
    }

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({ message: 'Invalid applicationId' });
    }

    // Find the application
    const application = await VerifierApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Process uploaded files
    const files = Array.isArray(req.files) ? req.files : [];
    if (files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // Parse optional metadata
    let metaDocs = [];
    if (req.body.documents && typeof req.body.documents === 'string') {
      try {
        metaDocs = JSON.parse(req.body.documents);
      } catch (e) {
        // ignore invalid JSON
      }
    }

    // Build documents array from uploaded files
    const newDocuments = files.map((file, idx) => {
      const meta = Array.isArray(metaDocs) ? metaDocs[idx] || {} : {};
      const fileUrl = path.posix.join('/uploads/verifier', file.filename).replace(/\\\\/g, '/');
      return {
        docType: meta.docType || file.fieldname || file.originalname,
        fileUrl,
        verified: meta.verified === true || meta.verified === 'true' || false,
      };
    });

    // Add new documents to existing application
    application.documents.push(...newDocuments);
    await application.save();

    res.status(200).json({ 
      message: 'Documents uploaded successfully', 
      uploadedDocuments: newDocuments,
      totalDocuments: application.documents.length
    });
  } catch (error) {
    console.error('Error in uploadDocuments:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Verifier: get application status or details
// Usage:
// - GET /.../?applicationId=...  -> returns single application
// - GET /.../?verifierId=...    -> returns all applications for verifier (paginated optional)
exports.getApplicationStatus = async (req, res) => {
  try {
    const { applicationId, verifierId, page = 1, limit = 25 } = req.query;

    if (applicationId) {
      if (!mongoose.Types.ObjectId.isValid(applicationId)) return res.status(400).json({ message: 'Invalid applicationId' });
      const application = await VerifierApplication.findById(applicationId)
        .populate('scholarshipId', 'title description')
        .populate('studentid', 'name email')
        .populate('verifierId', 'institutionName contactEmail');

      if (!application) return res.status(404).json({ message: 'Application not found' });
      return res.status(200).json({ application });
    }

    if (verifierId) {
      if (!mongoose.Types.ObjectId.isValid(verifierId)) return res.status(400).json({ message: 'Invalid verifierId' });
      const skip = (Math.max(parseInt(page, 10), 1) - 1) * Math.max(parseInt(limit, 10), 1);
      const applications = await VerifierApplication.find({ verifierId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10))
        .populate('scholarshipId', 'title')
        .populate('studentid', 'name email');

      const total = await VerifierApplication.countDocuments({ verifierId });
      return res.status(200).json({ total, page: parseInt(page, 10), limit: parseInt(limit, 10), applications });
    }

    return res.status(400).json({ message: 'Provide applicationId or verifierId as query parameter' });
  } catch (error) {
    console.error('Error in getApplicationStatus:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

