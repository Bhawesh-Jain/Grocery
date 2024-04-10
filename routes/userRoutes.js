const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { verifyPhone, verifyOtp, signup } = require('../controllers/userController')

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

router.use(bodyParser.json())
    
router.post("/verifyPhone", (req, res) => verifyPhone(req, res)); 
router.post("/verifyOtp", (req, res) => verifyOtp(req, res)); 
router.post("/signup", (req, res) => signup(req, res)); 

router.get("*", (req, res) => res.send("PAGE NOT FOUND")); 

module.exports = router;


