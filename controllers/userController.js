const bcrypt = require('bcrypt');
const User = require('../models/User');
const Task = require('../models/Task');
const Attendance = require('../models/Attendance');

async function login(req, res) {
    res.status(200).header('Content-Type', 'text/json')

    var username = req.body.username;
    var password = req.body.password;
    
    if (username && username.length > 0 && password && password.length > 0) {

        const user = await User.where({ username: username }).findOne();

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
            "msg": "Parameter Required username, password"
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

    var id = req.query.id;

    if (id && id.length > 0) {
        const task = await Task.where({ userId: id }).find();

        if (task.length > 0) {
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

async function attendanceUpdate(req, res, mode) {
    res.status(200).header('Content-Type', 'text/json')

    var id = req.body.id;
    var lat = req.body.lat;
    var long = req.body.long;
    var time = req.body.time;
    var date = req.body.date;

    if (id && id.length > 0) {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        
        var currentTime = String(today.getHours()) + ":" + String(today.getMinutes());

        today = dd + '-' + mm + '-' + yyyy;

        if(!lat) lat = "";
        if(!long) long = "";
        if(!time) time = currentTime;
        if(!date) date = today;

        var data;


        if (mode == 1) {
            data = new Attendance({
                userId: id,
                inTime: time,
                inLat: lat,
                inLong: long,
                date: date
            });
        } else {
            data = new Attendance({
                userId: id,
                outTime: time,
                outLat: lat,
                outLong: long,
                date: date
            });
        }

        const dataToSave = await data.save();
        res.json({
            "result": "true",
            "msg": "Attendance Marked",
            data: dataToSave
        });

    } else {
        res.send(JSON.stringify({
            "result": "false",
            "msg": "Invalid id"
        }));
    }
}



module.exports = { login, getProfile, getTaskList, attendanceUpdate };