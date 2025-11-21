const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/schema')(require('../db/connect_database')(process.env.MONGO_URI_USER));

// Register a new user
const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user already exists FIRST (before hashing)
        const existingUser = await User.findOne({email})
        
        if(existingUser){
            return res.status(409).json({ 
                message: "Email already registered",
                error: "This email is already in use. Please use a different email or login."
            })
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({
            email: email,
            password: hashedPassword,
        });

        // Save the user to the database
        const result = await user.save();

        res.status(201).send({
            message: 'User Created Successfully',
            result,
        });
    } catch (error) {
        console.error('Error in /register route:', error.message);
        res.status(500).send({
            message: 'Error creating user or hashing password',
            error,
        });
    }
};

// Login a user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: 'Email not found' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({ message: 'Invalid credentials' });
        }

        // Generate a token
        const token = jwt.sign(
            { userId: user._id, userEmail: user.email },
            'RANDOM-TOKEN',
            { expiresIn: '24h' }
        );

        res.status(200).send({
            message: 'Login Successful',
            email: user.email,
            token,
        });
    } catch (error) {
        console.error('Error in /login route:', error.message);
        res.status(500).send({
            message: 'Error logging in',
            error,
        });
    }
};


const requestPoint = async(req,res,next)=>{
    try{
        // Check if authorization header exists
        if (!req.headers.authorization) {
            return res.status(401).json({ error: "No authorization header provided" });
        }
        
        //   get the token from the authorization header
        console.log("requestPoint middleware triggered");
        const token = req.headers.authorization.split(" ")[1];
        
        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        //check if the token matches the supposed origin
        const decodedToken = await jwt.verify(token, "RANDOM-TOKEN");

        // retrieve the user details of the logged in user
        console.log("Decoded user details:", decodedToken)

        // pass the user down to the endpoints here
        req.user = decodedToken;

        // pass down functionality to the endpoint
        next();

    }
    catch(error)
    {
        console.error("Auth middleware error:", error.message);
        res.status(401).json({error: "Invalid or expired token"})
    }
}


module.exports = { register, login ,requestPoint};