const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { createUser } = require('../controllers/adminController')

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

router.use(bodyParser.json())
    
router.get("*", (req, res) => res.send("PAGE NOT FOUND")); 
    
router.post('/createUser', (req, res) => createUser(req, res))

module.exports = router;


