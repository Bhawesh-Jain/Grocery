require('dotenv').config();
const MobileVerifyModel = require("../models/MobileVerifyModel");
const UserModel = require("../models/UserModel");
const LoginRestrictions = require("../models/LoginRestrictions");
const axios = require('axios');
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function getAddressFromCoordinates(latitude, longitude) {
    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
        const address = response.data.address;
        const city = address.city || address.village || address.town || address.hamlet || '';
        const state = address.state || address.county || '';
        const country = address.country || '';
        return { city, state, country };
    } catch (error) {
        console.error('Error fetching address:', error);
        return null;
    }
}

function handleError(error) {
    console.log(error);
}

async function verifyPhone(req, res) {
    res.status(200).header('Content-Type', 'text/json')

    var phone = req.body.phone
    var location = req.body.location
    var source = req.body.source

    var result
    var msg
    var data

    if (phone && phone.length == 10) {
        try {
            var otp = Math.floor(1000 + Math.random() * 9000);

            const user = await MobileVerifyModel.where({ phone: phone }).findOne();

            if (user) {
                if (!location) location = user.location
                if (!source) source = user.source

                var item = await MobileVerifyModel.findByIdAndUpdate(
                    { _id: user._id },
                    {
                        otp: otp,
                        location: location,
                        source: source
                    },
                    { new: true }
                );
            } else {
                if (!location) location = ""
                if (!source) source = ""

                var item = new MobileVerifyModel({
                    phone: phone,
                    otp: otp,
                    location: location,
                    source: source
                });
                await item.save();
            }

            result = true
            msg = "OTP Sent! OTP->" + otp

        } catch (error) {
            res.status(400)
            result = false
            msg = "Server Error"
        }
    } else {
        result = false
        msg = "Invalid Phone Number!"
    }


    if (data)
        res.json({
            "result": result,
            "msg": msg,
            "data": data
        })
    else res.json({
        "result": result,
        "msg": msg
    })
}

async function verifyOtp(req, res) {
    res.status(200).header('Content-Type', 'text/json')

    var phone = req.body.phone
    var otp = req.body.otp

    var result
    var msg
    var data

    var err = []

    if (!phone || phone.length != 10) {
        err.push("Invalid Phone Number")
    }
    if (!otp || otp.length != 4) {
        err.push("Invalid OTP")
    }

    if (err.length == 0) {
        try {

            const mobileItem = await MobileVerifyModel.where({ phone: phone, otp: otp }).findOne();

            if (mobileItem) {
                const user = await UserModel.where({ phone: phone }).findOne();

                if (user) {
                    result = true
                    msg = "Login Successful"
                    data = user
                } else {
                    result = true
                    msg = "New User"
                }
            } else {
                result = false
                msg = "Incorrect OTP"
            }
        } catch (error) {
            res.status(400)
            result = false
            msg = "Server Error"
            handleError(error)
        }
    } else {
        result = false
        msg = err.join(", ")
    }

    if (data)
        res.json({
            "result": result,
            "msg": msg,
            "data": data
        })
    else res.json({
        "result": result,
        "msg": msg
    })
}

async function signup(req, res) {
    res.status(200).header('Content-Type', 'application/json');

    const phone = req.body.phone;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    let result = false;
    let msg = '';
    let data = null;
    const errors = [];

    if (!phone || phone.length !== 10) {
        errors.push("Invalid Phone Number");
    }
    if (!username || username.length === 0) {
        errors.push("Enter User Name");
    }
    if (!email || email.length === 0) {
        errors.push("Enter Email");
    }
    if (!password || password.length === 0) {
        errors.push("Enter Password");
    }

    if (errors.length === 0) {
        try {
            const userExists = await UserModel.exists({ $or: [{ phone: phone },{ email: email}]});
            if (userExists) {
                msg = "Phone/Email already exists!";
            } else {
                const salt = await bcrypt.genSalt(saltRounds);
                const hash = await bcrypt.hash(password, salt);
                const newUser = new UserModel({
                    phone: phone,
                    username: username,
                    email: email,
                    password: hash
                });
                data = await newUser.save();
                result = true;
                msg = "Signup Successful!";
            }
        } catch (error) {
            res.status(500);
            handleError(error);
            msg = "Server Error";
            return res.json({ result: result, msg: msg });
        }
    } else {
        msg = errors.join(", ");
    }

    res.json({ result: result, msg: msg, data: data });
}


async function getLoginMethods(req, res) {
    res.status(200).header('Content-Type', 'text/json')

    var latitude = req.body.latitude
    var longitude = req.body.longitude

    var result
    var msg
    var data

    try {
        var location = null
        if ((latitude && latitude.length > 0) && (longitude && longitude.length > 0)) {
            try {
                await getAddressFromCoordinates(latitude, longitude)
                    .then(address => {
                        location = address.country
                        console.log(location);
                    })
                    .catch(error => {
                        handleError(error)
                    });
            } catch (error) {
                handleError(error)
            }
        }

        if (!location || location.length == 0) {
            location = "default"
        }

        const restrictions = await LoginRestrictions.findOne({ location: { $in: [location, "default"] } });


        if (restrictions) {
            result = true
            msg = "Request successful!"
            data = restrictions
        } else {
            res.status(400)
            result = false
            msg = "Invalid Attempt"
        }


    } catch (error) {
        res.status(400)
        result = false
        msg = "Server Error"
        handleError(error)
    }

    if (data)
        res.json({
            "result": result,
            "msg": msg,
            "data": data
        })
    else res.json({
        "result": result,
        "msg": msg
    })
}

async function login(req, res) {
    res.status(200).header('Content-Type', 'application/json');

    const email = req.body.email;
    const password = req.body.password;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;

    let result = false;
    let msg = '';
    let data = null;
    const errors = [];

    if (!email || email.length === 0) {
        errors.push("Enter Email");
    }
    if (!password || password.length === 0) {
        errors.push("Enter Password");
    }

    if (errors.length === 0) {
        try {
            var user = await UserModel.findOne({ email: email });
            console.log(user);
            if (user) {
                const match = await bcrypt.compare(password, user.password);
                if (match) {
                    if ((latitude && latitude.length > 0) && (longitude && longitude.length > 0)) {
                        const id = user._id;

                        user = await UserModel.findByIdAndUpdate(
                            { _id: id },
                            {
                                latitude: latitude,
                                longitude: longitude
                            },
                            { new: true }
                        );


                    }

                    const sanitizedUser = { ...user.toObject(), password: undefined };

                    result = true;
                    msg = "Login Successful!";
                    data = sanitizedUser;

                } else {
                    msg = "Incorrect Password!";
                }
            } else {
                msg = "Username not found!";
            }
        } catch (error) {
            res.status(500);
            msg = "Server Error";
            handleError(error);
            return res.json({ result: result, msg: msg });
        }
    } else {
        msg = errors.join(", ");
    }

    res.json({ result: result, msg: msg, data: data });
}

module.exports = { verifyPhone, verifyOtp, signup, getLoginMethods, login }