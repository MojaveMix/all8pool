const { OwnerRequest, User } = require('../../infrastructure/database/models');
const bcrypt = require("bcryptjs");

const createOwnerRequest = async (req, res) => {
  try {
    const { fullName, email, phone, hallName, city, message } = req.body;
    
    // Check if email already applied
    const existingRequest = await OwnerRequest.findOne({ where: { email, status: 'pending' } });
    if (existingRequest) {
      return res.status(400).json({ message: "An application with this email is already pending." });
    }

    const request = await OwnerRequest.create({
      fullName,
      email,
      phone,
      hallName,
      city,
      message,
    });

    res.status(201).json({ message: "Application submitted successfully.", request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getOwnerRequests = async (req, res) => {
  try {
    const requests = await OwnerRequest.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateOwnerRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const request = await OwnerRequest.findByPk(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // If status is being changed to approved
    if (status === 'approved' && request.status !== 'approved') {
      // Find or create user
      const [user, created] = await User.findOrCreate({
        where: { email: request.email },
        defaults: {
          name: request.fullName,
          password: await bcrypt.hash('Partner123!', 10), // Default password
          role: 'owner',
          status: 'active'
        }
      });

      // If user existed but wasn't owner, upgrade them
      if (!created && user.role !== 'owner') {
        user.role = 'owner';
        await user.save();
      }
    }

    request.status = status;
    await request.save();

    res.json({ 
      message: status === 'approved' ? "Request approved and owner account ready." : "Request status updated", 
      request 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createOwnerRequest,
  getOwnerRequests,
  updateOwnerRequestStatus,
};
