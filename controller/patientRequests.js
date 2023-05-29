const patientModel = require('../model/patientsModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nm = require('nodemailer');
const doctorModel = require('../model/doctorModel');
const appointmentModel = require('../model/appointmentModel')
const moment = require('moment');

// user registeration

module.exports.addpatient = async function (req, res) {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(password, salt);

        req.body.password = hashpassword;

        const user = await patientModel.create(req.body);

        console.log(user);

        res.status(201).send({
            message: 'user successfully added',
            success: true
        })

    } catch (err) {
        console.log(err)
        res.status(500).send({
            message: `Register error ${err.message}`,
            success: false
        })
    }

}

// login user

module.exports.loginUser = async (req, res) => {
    try {
        const data = await patientModel.findOne({
            email: req.body.email
        })
        if (!data) {
            return res.status(200).send({
                message: "User does not exist",
                success: false
            })
        }

        const actualPassword = bcrypt.compare(req.body.password, data.password);

        if (!actualPassword) {
            return res.status(200).send({
                message: "Invalid Email or Password",
                success: false
            })
        }

        const token = jwt.sign({
            id: data._id
        }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        res.status(200).send({
            message: "Login Successful",
            success: true,
            username: data.name,
            token
        })

    } catch (err) {
        res.status(500).send({
            message: `User login failed: ${err.message}`,
            success: false
        })
    }
}

// contact controller

module.exports.requestCall = function (req, res) {
    try {
        const transporter = nm.createTransport({
            service: 'gmail',
            auth: {
                user: 'chitvangarg0305@gmail.com',
                pass: 'ltmxfrvtbkanyypm'
            }
        });
        const mailOptions = {
            from: 'chitvangarg0305@gmail.com',
            to: 'chitvangarg888@gmail.com',
            subject: 'Patient Info',
            text: JSON.stringify(req.body)
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                res.status(201).send({
                    message: `Mail does not sent : ${error.message}`,
                    success: false
                })
            } else {
                res.status(201).send({
                    message: `Mail sent successfully`,
                    success: true
                })
            }
        })
    } catch (err) {

        res.status(500).send({
            message: err.message,
            success: false
        })
    }
}

// AuthController

module.exports.authController = async (req, res) => {
    try {

        const user = await patientModel.findOne({
            _id: req.body.userId
        });
        user.password = undefined;

        if (!user) {
            return res.status(200).send({
                message: "User not found",
                success: false
            })
        }

        res.status(200).send({
            message: "User Found",
            success: true,
            data: user
        })

    } catch (error) {

        res.status(500).send({
            message: "Something went wrong",
            success: false,
            error
        })
    }
}

// Apply Doctor 

module.exports.applyDoctorController = async (req, res) => {
    try {
        const newDoctor = await doctorModel({
            ...req.body,
            status: "pending"
        });
        await newDoctor.save();
        const adminUser = await patientModel.findOne({
            isAdmin: true
        });
        console.log(adminUser);
        const notification = adminUser.notification;
        console.log(notification);
        notification.push({
            type: "apply-doctor-request",
            message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor Account`,
            data: {
                doctorId: newDoctor._id,
                name: newDoctor.firstName + " " + newDoctor.lastName,
                onClickPath: "/admin/doctors",
            },
        });
        await patientModel.findByIdAndUpdate(adminUser._id, {
            notification
        });
        res.status(201).send({
            success: true,
            message: "Doctor Account Applied Successfully",
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            err,
            message: "Error WHile Applying For Doctor",
        });
    }
}

module.exports.getAllNotifications = async (req, res) => {
    try {
        const user = await patientModel.findOne({
            _id: req.body.userId
        });

        if (user) {
            let notification = user.notification;
            let seennotification = user.seennotification;
            seennotification.push(...notification);
            user.seennotification = seennotification;
            user.notification = [];
            let updateduser = await user.save();

            res.status(201).send({
                message: "All message seen succesffuly",
                success: true,
                data: updateduser
            })
        } else {
            res.status(404).send({
                message: "User Not Found",
                success: false
            })
        }

    } catch (error) {
        
        res.status(500).send({
            message: "Notification request not successfull",
            success: false,
            error
        })
    }
}

// delete Notifications
module.exports.deleteAllNotifications = async (req, res) => {
    try {

        const user = await patientModel.findOne({
            _id: req.body.userId
        });

        if (user) {
            user.notification = [];
            user.seennotification = [];

            let updatedUser = await user.save();

            updatedUser.password = undefined;

            res.status(201).send({
                message: "Notifications Successfully deleted",
                success: true,
                data: updatedUser
            })

        } else {
            res.status(404).send({
                message: "User not found",
                success: false
            })
        }

    } catch (error) {
        
        res.status(500).send({
            message: "Internal server error notification not deleted",
            success: false,
            error
        })
    }
}

// get All Users

module.exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({
            status: "approved"
        });

        if (doctors) {
            res.status(201).send({
                message: "All doctors fetched",
                success: true,
                data: doctors
            })
        } else {
            res.status(404).send({
                message: "No doctors found",
                success: false
            })
        }
    } catch (error) {
        
        res.status(500).send({
            message: "Internal server error",
            success: false,
            error
        })
    }
}

// make appointment

module.exports.makeAppointment = async (req, res) => {
    try {
        const newAppointment = new appointmentModel(req.body);
        await newAppointment.save();

        let user = await patientModel.findById(
            req.body.doctorInfo.userId
        );

        user.notification.push({
            type: "New-appointment-request",
            message: `A new Appointment Request from ${req.body.userInfo.name}`,
            onCLickPath: "/users/appointments",
        });
        await user.save();

        res.status(200).send({
            success: true,
            message: "Appointment Book succesfully",
        });
    } catch (error) {
        
        res.status(500).send({
            success: false,
            error,
            message: "Error While Booking Appointment",
        });
    }
}

// check Availability
module.exports.doctorAvailability = async (req, res) => {
    try {
        const fromtime = moment(req.body.time, "HH:mm").subtract(1, "hours").toISOString();
        const totime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();

        const doctorId = req.body.doctorId;

        const appointments = await appointmentModel.find({
            doctorId,
            date: date,
            time: {
                $gte: fromtime,
                $lte: totime
            }
        })

        if (appointments.length > 0) {
            res.status(201).send({
                message: "Appointment not available at this time",
                success: true,
            })
        } else {
            res.status(201).send({
                message: "Appointment Available",
                success: true,
            })
        }
    } catch (error) {
        
        res.status(500).send({
            message: "Error In Booking",
            success: false,
            error,
        });
    }
}

module.exports.getUserAppointment = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({
            userId: req.body.userId,
        });
        res.status(200).send({
            success: true,
            message: "Users Appointments Fetch SUccessfully",
            data: appointments,
        });
    } catch (error) {
        
        res.status(500).send({
            success: false,
            error,
            message: "Error In User Appointments",
        });
    }
}