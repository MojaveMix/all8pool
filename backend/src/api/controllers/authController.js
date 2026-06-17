const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../../infrastructure/database/models");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "player",
    });

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ message: "Your account has been suspended. Please contact the administrator." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    // Check for daily bonus
    let bonusAwarded = false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!user.lastBonusDate || new Date(user.lastBonusDate) < today) {
      user.virtualMoney += 100; // Daily bonus amount
      user.lastBonusDate = new Date();
      await user.save();
      bonusAwarded = true;
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        virtualMoney: user.virtualMoney,
      },
      token,
      bonusAwarded,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  register,
  login,
};
