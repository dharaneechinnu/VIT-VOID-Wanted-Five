const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

// ✅ Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// ✅ Student Registration
exports.registerStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      dob,
      gender,
      mobileNo,
      address,
      parentAddress,
      institution,
      classOrYear,
      marksPercentage,
      familyIncome,
      hasIncomeCertificate,
    } = req.body;

    if (!email || !name || !password || !dob || !gender || !institution) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    // ✅ Hash password manually
    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new User({
      name,
      email,
      password: hashedPassword, // save hashed password
      dob,
      gender,
      mobileNo,
      address,
      parentAddress,
      institution,
      classOrYear,
      marksPercentage,
      familyIncome,
      hasIncomeCertificate,
    });

    await student.save();

    const token = generateToken(student._id);
    res.status(201).json({
      message: 'Student registered successfully.',
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        institution: student.institution,
        verifiedByInstitution: student.verifiedByInstitution,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering student', error: error.message });
  }
};

// ✅ Student Login
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await User.findOne({ email });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

    const token = generateToken(student._id);
    res.status(200).json({
      message: 'Login successful',
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        institution: student.institution,
        verifiedByInstitution: student.verifiedByInstitution,
        applicationStatus: student.applicationStatus,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};
