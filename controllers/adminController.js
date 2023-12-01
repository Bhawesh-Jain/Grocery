const bcrypt = require('bcrypt');
const User = require('../models/User');
const Task = require('../models/Task');

async function createUser(req, res) {
    res.status(200).header('Content-Type', 'text/json')

    var username = req.body.username;
    var password = req.body.password;
    var name = req.body.name;
    var phone = req.body.phone;
    var fcm_token = req.body.fcm_token;

    if (username && username.length > 0 && password && password.length > 0) {
        const user = await User.where({ username: username }).findOne();

        if (user) {
            res.send(JSON.stringify({
                "result": "false",
                "msg": "Username Already Exists!"
            }));
        } else {
            // Validate and sanitize inputs
            if (!name) name = "";
            if (!phone) phone = "";
            if (!fcm_token) fcm_token = "";

            const saltRounds = 10;

            bcrypt.genSalt(saltRounds, (err, salt) => {
                if (err) {
                    console.error('Error generating salt:', err);
                    res.status(500).json({ "result": "false", "message": "Server Error" });
                } else {
                    bcrypt.hash(password, salt, async (err, hash) => {
                        if (err) {
                            console.error('Error hashing password:', err);
                            res.status(500).json({ "result": "false", "message": "Server Error" });
                        } else {
                            try {
                                const data = new User({
                                    username: username,
                                    password: hash,
                                    name: name,
                                    phone: phone,
                                    userType: "employee",
                                    FCM_TOKEN: fcm_token
                                });

                                const dataToSave = await data.save();
                                res.json({
                                    "result": "true",
                                    "msg": "New User Created",
                                    data: dataToSave
                                });
                            } catch (error) {
                                console.error('Error saving user to database', error);
                                res.status(400).json({ "result": "false", "message": "Server Error" });
                            }
                        }
                    });
                }
            });
        }
    } else {
        res.send(JSON.stringify({
            "result": "false",
            "msg": "Parameter Required username, password"
        }));
    }
}


async function createTask(req, res) {
    res.status(200).header('Content-Type', 'text/json')

    var userId = req.body.userId;
    var message = req.body.message;
    var taskDate = req.body.taskDate;
    var assignedBy = req.body.assignedBy;

    if (userId && userId.length > 0) {

        if (!message) message = "";
        if (!taskDate) taskDate = "";
        if (!assignedBy) assignedBy = "Admin";

        try {
            const data = new Task({
                userId: userId,
                message: message,
                taskDate: taskDate,
                assignedBy: assignedBy
            });

            const dataToSave = await data.save();
            res.json({
                "result": "true",
                "msg": "Task Created!",
                data: dataToSave
            });
        } catch (error) {
            console.error('Error saving user to database', error);
            res.status(400).json({ "result": "false", "message": "Server Error" });
        }

    } else {
        res.send(JSON.stringify({
            "result": "false",
            "msg": "Parameter Required userId, message, taskDate, assignedBy"
        }));
    }
}


module.exports = { createUser, createTask };