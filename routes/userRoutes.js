const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { login, getProfile, getTaskList, attendanceUpdate } = require('../controllers/userController')

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

router.use(bodyParser.json())
    
router.get('/getTaskList', (req, res) => getTaskList(req, res))
    
router.post('/login', (req, res) => login(req, res))
router.post('/getProfile', (req, res) => getProfile(req, res))
router.post('/attendanceIn', (req, res) => attendanceUpdate(req, res, 1))
router.post('/attendanceOut', (req, res) => attendanceUpdate(req, res, 2))


router.get("*", (req, res) => res.send("PAGE NOT FOUND")); 

module.exports = router;


