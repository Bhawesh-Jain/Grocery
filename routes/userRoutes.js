const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

router.use(bodyParser.json())
    
router.get("*", (req, res) => res.send("PAGE NOT FOUND")); 

module.exports = router;


