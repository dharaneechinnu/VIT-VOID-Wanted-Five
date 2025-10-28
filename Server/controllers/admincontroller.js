// controllers/adminController.js
const Donor = require('../models/donor');
const Scholarship = require('../models/scholarship');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { default: mongoose } = require('mongoose');
const VerifierApplication = require('../models/verifierapplyform');


exports.registerDonorRequest = async (req, res) => {
  try {
    console.log("DEBUG: Starting donor registration process");
    
    const {
      orgName,
      donorType,
      contactPerson,
      contactEmail,
      website,
      requestMessage,
    } = req.body;
    
    console.log("DEBUG: Request Body received:", req.body);

    // Validate required fields
    if (!orgName || !contactEmail) {
      console.log("DEBUG: Missing required fields - orgName or contactEmail");
      return res.status(400).json({
        message: 'Organization name and contact email are required',
        debug: 'Missing required fields validation failed'
      });
    }

    console.log("DEBUG: Checking for existing donor with email:", contactEmail);
    const existing = await Donor.findOne({ contactEmail: contactEmail });
    console.log("DEBUG: Existing donor check result:", existing);
    if (existing) {
      console.log("DEBUG: Email already exists in database");
      return res.status(400).json({ 
        message: 'Email already registered',
        debug: 'Duplicate email check failed'
      });
    }

    console.log("DEBUG: Hashing password");

    console.log("DEBUG: Creating new donor object");

    // Generate a temporary password for donor login (will be hashed by User pre-save hook)
    const tempPassword = crypto.randomBytes(6).toString('base64').replace(/\+/g, 'A').replace(/\//g, 'B').slice(0,12);

    const donor = new Donor({
      // Required User fields (provide safe defaults)
      name: contactPerson || orgName,
      email: contactEmail,
      password: tempPassword,
      dob: req.body.dob ? new Date(req.body.dob) : new Date('1900-01-01'),
      gender: req.body.gender || 'other',
      institution: orgName || req.body.institution || 'DonorOrg',

      // Donor-specific fields
      orgName,
      donorType,
      contactPerson,
      contactEmail,
      website,
      requestMessage,
      approved: false,
      status: 'pending',
    });

    console.log("DEBUG: Saving donor to database");
    await donor.save();
    console.log("DEBUG: Donor saved successfully with ID:", donor._id);

    res.status(201).json({
      message: 'Registration request submitted successfully. Awaiting Super Admin approval.',
      donor: {
        id: donor._id,
        orgName: donor.orgName,
        status: donor.status,
      },
      debug: 'Registration completed successfully'
    });
  } catch (error) {
    console.error("DEBUG: Error in registerDonorRequest:", error);
    console.error("DEBUG: Error stack:", error.stack);
    res.status(500).json({ 
      message: 'registerDonorRequest Error submitting request', 
      error: error.message,
      debug: {
        errorName: error.name,
        errorCode: error.code,
        errorStack: error.stack
      }
    });
  }
};


exports.Loginadmin = async (req,res) =>{
try {
  const{username,password}= req.body;

  if(!username||!password){
    console.log("username and password are missing");
    res.status(404).json({"message":"username and Password are missing"});
  }
  const admin = await Donor.findOne({username:username});

  const ismatch = await bcrypt.compare(password,admin.password);
  if(!ismatch){
    res.status(400).json({"Message":"Password Incorrect"});
  }
  const token = jwt.sign({ id:admin._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
   const { password: _, ...adminWithoutPassword } = admin.toObject();

    res.status(200).json({
      message: 'Login successful',
      token,
      admin: adminWithoutPassword,
    });
} catch (error) {
  console.log(error);
}
};

exports.createScholarship = async (req, res) => {
  try {
    console.log('DEBUG: createScholarship called with body:', req.body);

    const {
      scholarshipName,
      providerName,
      description,
      eligibilityCriteria,
      applicationDeadline,
      scholarshipAmount,
      isActive,
      createdBy // optional donor id (if authentication not wired)
    } = req.body;

    // ✅ Basic validation
    if (!scholarshipName || !providerName || !description || !applicationDeadline || !scholarshipAmount) {
      return res.status(400).json({
        message:
          'Missing required fields. Required: scholarshipName, providerName, description, applicationDeadline, scholarshipAmount',
      });
    }

    // ✅ Get donor ID (from auth or body)
    const donorId = req.user?.id || createdBy;
    if (!donorId) {
      return res.status(400).json({
        message: 'Donor id (createdBy) is required. Provide it in request body or via authentication.',
      });
    }

    // ✅ Validate donor existence
    const donor = await Donor.findById(donorId);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    // ✅ Prepare scholarship data
    const scholarshipData = {
      scholarshipName,
      providerName,
      description,
      eligibilityCriteria: {
        tenthMarks: eligibilityCriteria?.tenthMarks || null,
        twelfthMarks: eligibilityCriteria?.twelfthMarks || null,
        collegeCGPA: eligibilityCriteria?.collegeCGPA || null,
        maxParentIncome: eligibilityCriteria?.maxParentIncome || null,
        womenPreference: eligibilityCriteria?.womenPreference || false,
        academicPerformance: eligibilityCriteria?.academicPerformance || 'Any',
        disabilityAllowed: eligibilityCriteria?.disabilityAllowed || ['None'],
        extracurricular: eligibilityCriteria?.extracurricular || [],
        firstGenGraduate: eligibilityCriteria?.firstGenGraduate || false,
        specialCategory: eligibilityCriteria?.specialCategory || [],
      },
      applicationDeadline: new Date(applicationDeadline),
      scholarshipAmount,
      createdBy: donor._id,
      isActive: typeof isActive === 'boolean' ? isActive : true,
    };

    // ✅ Save to DB
    const scholarship = new Scholarship(scholarshipData);
    await scholarship.save();

    console.log('DEBUG: Scholarship created with ID:', scholarship._id);

    // ✅ Send response
    res.status(201).json({
      message: 'Scholarship created successfully 🎓',
      scholarship,
    });
  } catch (error) {
    console.error('❌ Error in createScholarship:', error.message);
    res.status(500).json({ message: 'Error creating scholarship', error: error.message });
  }
};

// Admin: view all scholarship applications (with optional filters)
exports.viewAllApplications = async (req, res) => {
  try {
    const { scholarshipId, status, page = 1, limit = 25 } = req.query;
    const filter = {};

    if (scholarshipId) {
      if (!mongoose.Types.ObjectId.isValid(scholarshipId)) return res.status(400).json({ message: 'Invalid scholarshipId' });
      filter.scholarshipId = scholarshipId;
    }
    if (status) {
      filter.status = status;
    }

    const skip = (Math.max(parseInt(page, 10), 1) - 1) * Math.max(parseInt(limit, 10), 1);

    const [total, applications] = await Promise.all([
      VerifierApplication.countDocuments(filter),
      VerifierApplication.find(filter)
        .populate('scholarshipId', 'scholarshipName title')
        .populate('verifierId', 'institutionName contactEmail')
        .populate('studentid', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
    ]);

    res.status(200).json({ total, page: parseInt(page, 10), limit: parseInt(limit, 10), applications });
  } catch (error) {
    console.error('Error in viewAllApplications:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin: get single application details
exports.getApplicationDetails = async (req, res) => {
  try {
    const applicationId = req.params.applicationId || req.query.applicationId;
    if (!applicationId) return res.status(400).json({ message: 'applicationId is required' });
    if (!mongoose.Types.ObjectId.isValid(applicationId)) return res.status(400).json({ message: 'Invalid applicationId' });

    const application = await VerifierApplication.findById(applicationId)
      .populate('scholarshipId')
      .populate('verifierId', 'institutionName contactEmail')
      .populate('studentid', 'name email');

    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.status(201).json({ "applicationLength": application.length, "application": application });
  } catch (error) {
    console.error('Error in getApplicationDetails:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin: update a document inside an application (mark verified/unverified or change docType)
// PATCH /admin/applications/:applicationId/documents/:documentId
exports.updateApplicationDocumentandapplication = async (req, res) => {
  try {
    const { applicationId, documentId } = req.params;
    const { status } = req.body;
    // status should be 'approved' or 'rejected' (string)
    if (!applicationId || !documentId) return res.status(400).json({ message: 'applicationId and documentId are required in URL' });
    if (!mongoose.Types.ObjectId.isValid(applicationId)) return res.status(400).json({ message: 'Invalid applicationId' });

    const application = await VerifierApplication.findById(applicationId);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    const doc = application.documents.id(documentId);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    // Always set verified true
    doc.verified = true;

    // Optionally update docType if provided
    if (req.body.docType !== undefined) doc.docType = req.body.docType;

    // Set application status if provided and valid
    if (status === 'approved' || status === 'rejected') {
      application.status = status;
      application.donorDecision = status;
    }

    await application.save();

    res.status(200).json({ message: 'Document verified and application status updated', document: doc, applicationStatus: application.status });
  } catch (error) {
    console.error('Error in updateApplicationDocumentandapplication:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

