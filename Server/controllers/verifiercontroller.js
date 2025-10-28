const Verifier = require('../models/verifier');
const Scholarship = require('../models/scholarship');
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


