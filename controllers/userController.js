const bcrypt = require('bcrypt');
const Task = require('../models/Task');
const User = require('../models/User');

async function login(req, res) {
    res.status(200).header('Content-Type', 'text/json')

    var userId = req.body.userId;
    var password = req.body.password;
    if (userId && userId.length > 0 && password && password.length > 0) {

        const user = await User.where({ userId: userId }).findOne();

        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    res.status(400).json({ "result": "true", "message": "Server Error" })
                } else {
                    if (result) {
                        const sanitizedUser = { ...user._doc, password: undefined };

                        res.json({
                            "result": "true",
                            "msg": "Login Successful!",
                            data: sanitizedUser
                        })
                    }
                    else {
                        res.send(JSON.stringify({
                            "result": "false",
                            "msg": "Incorrect Password!"
                        }));
                    }
                }
            });
        } else {
            res.send(JSON.stringify({
                "result": "false",
                "msg": "User Not Found!"
            }));
        }
    } else {
        res.send(JSON.stringify({
            "result": "false",
            "msg": "Parameter Required userId, password"
        }));
    }
}

async function getProfile(req, res) {
    res.status(200).header('Content-Type', 'text/json')

    var id = req.body.id;

    if (id && id.length > 0) {
        const user = await User.where({ _id: id }).findOne();
        const sanitizedUser = { ...user._doc, password: undefined };

        if (user) {
            res.json({
                "result": "true",
                "msg": "User Found!",
                data: sanitizedUser
            })
        } else {
            res.send(JSON.stringify({
                "result": "false",
                "msg": "User Not Found!"
            }));
        }
    } else {
        res.send(JSON.stringify({
            "result": "false",
            "msg": "Invalid Id"
        }));
    }
}

async function getTaskList(req, res) {
    res.status(200).header('Content-Type', 'text/json')

    var id = req.body.id;

    if (id && id.length > 0) {
        const task = await Task.where({ userId: id }).find();

        if (task) {
            res.json({
                "result": "true",
                "msg": "Task Found!",
                data: task
            })
        } else {
            res.send(JSON.stringify({
                "result": "false",
                "msg": "No Task Found!!"
            }));
        }
    } else {
        res.send(JSON.stringify({
            "result": "false",
            "msg": "Invalid Id"
        }));
    }
}


module.exports = { login, getProfile, getTaskList };