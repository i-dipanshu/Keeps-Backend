const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const { findOne } = require("../models/User");

const JWT_SECRET = 'asdsnf&5a%^$';

// Create a new User using POST: "/api/auth/createuser"
router.post(
  "/createuser",
  [
    body("name").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],

  async (req, res) => {
    // If there is any error return bad request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // Check whether the user with this email exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry, a user with this email already exists" });
      }

      const salt = await bcrypt.genSaltSync(10);
      secPass = await bcrypt.hash(req.body.password, salt);

      // creating a new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });

      const data = {
        id:user.id
      }
      const authToken = jwt.sign(data, JWT_SECRET);      
      res.json(authToken);
    } catch (error) {
      console.error(error.messege);
      res.status(500).send('some error occured')
    }
  }
);

module.exports = router;
