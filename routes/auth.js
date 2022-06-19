//importing different utility
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
const { findOne } = require("../models/User");


const JWT_SECRET = "@#@%$";   //our secret key

//Route 1:  Create a new User using POST: "/api/auth/createuser"
router.post(
  "/createuser",                                    //endpoint
  [
    body("name").isLength({ min: 3 }),              //form validation
    body("email", "Enter a valid e-mail").isEmail(),
    body("password",'Enter a valid password').isLength({ min: 5 }),
  ],
  //req and res function
  async (req, res) => {
    // If there is any error return bad request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // Check whether the user with this email exists already
      let user = await User.findOne({ email: req.body.email });   //array of user details
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
        id: user.id,
      };  // data contains id of a user
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json(authToken); // gives a response of webtoken.
    } catch (error) {
      console.error(error.messege);
      res.status(500).send("Internal Server Error");
    }
  }
);

// creating an endpoint for login using POST at /api/auth/login
router.post(
  "/login",
  [body("email", 'Enter a valid e-mail').isEmail(), body("password","Password can't be blank").exists()], //input given by user

  async (req, res) => {
    // If there is any error return bad request.
    const errors = validationResult(req);
    //handling random errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    };

    const {email, password} = req.body;
    try{
      let user = await User.findOne({email});
      //crendentials matching
      if(!user){
        return res.status(400).json({error : "Please enter valid credential"});
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ error: "Please enter valid credential" });
      }

     const data = {
       id: user.id,
     };
     const authToken = jwt.sign(data, JWT_SECRET);
     res.json(authToken);
    }catch(errors){
       console.error(error.messege);
       res.status(500).send("Internal Server Error");
    }

  }
);

// Route 3 : Get logged in user details using Post at /api/auth/getuser --- login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
