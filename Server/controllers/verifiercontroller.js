// controllers/verifierController.js
const Verifier = require('../models/verifier');


// ✅ Register Verifier Request (Institution Registration)
exports.registerVerifierRequest = async (req, res) => {
  try {
    const {
      Inititutename,
      institutionType,
      institutionCode,
      contactEmail,
      contactperson,
      requestMessage,
      website,

    } = req.body;

    const existing = await Verifier.findOne({ contactEmail });
    if (existing) {
      return res.status(400).json({ message: 'Institution already registered' });
    }

    const verifier = new Verifier({
    
      Inititutename,
      institutionType,
      institutionCode,
      contactEmail,
      contactperson,
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

