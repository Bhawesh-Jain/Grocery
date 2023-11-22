const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { login, getProfile, getTaskList } = require('../controllers/userController')

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

router.use(bodyParser.json())
    
router.get("*", (req, res) => res.send("PAGE NOT FOUND")); 
    
router.post('/login', (req, res) => login(req, res))
router.post('/getProfile', (req, res) => getProfile(req, res))
router.post('/getTaskList', (req, res) => getTaskList(req, res))

module.exports = router;


