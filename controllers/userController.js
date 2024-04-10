const MobileVerifyModel = require("../models/MobileVerifyModel");
const UserModel = require("../models/UserModel");

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
    res.status(200).header('Content-Type', 'text/json')

    var phone = req.body.phone
    var username = req.body.username
    var email = req.body.email
    var password = req.body.password

    var result
    var msg
    var data

    var err = []

    if (!phone || phone.length != 10) {
        err.push("Invalid Phone Number")
    }
    if (!username || username.length == 0) {
        err.push("Enter User Name")
    }
    if (!email || email.length == 0) {
        err.push("Enter Email")
    }
    if (!password || password.length == 0) {
        err.push("Enter Password")
    }

    if (err.length == 0) {
        try {
            const user = await UserModel.where({ phone: phone }).findOne();

            if (user) {
                result = false
                msg = "Phone already exists!"
            } else {
                item = new UserModel({
                    phone:phone,
                    username:username,
                    email:email,
                    password:password
                })

                
                data = await item.save()

                result = true
                msg = "Signup Successful!"
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

module.exports = { verifyPhone, verifyOtp, signup }