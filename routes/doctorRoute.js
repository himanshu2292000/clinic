const authhelper = require('../controller/middlewares/authHelper')
const express = require('express');
const { getDoctorProfile, updateDoctorProfile, bookAppointment,
updateStatusController, doctorAppointmentsController
} = require('../controller/doctorCtrl');

const doctorRoute = express.Router();

doctorRoute.route('/getprofile').
post(authhelper, getDoctorProfile)

doctorRoute.route('/updateprofile').
post(authhelper, updateDoctorProfile)

doctorRoute.route('/bookdoctor').
post(authhelper, bookAppointment)

doctorRoute.route('/getDoctorAppointments').
post(authhelper, doctorAppointmentsController)

doctorRoute.route('/update-status').
post(authhelper, updateStatusController)

module.exports = doctorRoute;