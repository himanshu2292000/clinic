const express = require('express');
const {
    addpatient, 
    loginUser, 
    requestCall,
     authController, 
     applyDoctorController, 
     getAllNotifications, 
     deleteAllNotifications,
    getAllDoctors,
    makeAppointment,
    doctorAvailability,
    getUserAppointment
    } = require('../controller/patientRequests');
const authHelper = require('../controller/middlewares/authHelper');

const authroute = express.Router();


// register patient
authroute.route('/register').
post(addpatient)


// login patient
authroute.route('/login').
post(loginUser)

// recieve call
authroute.route('/contact').
post(requestCall)

// Authentication

authroute.route('/authenticate').
post(authHelper, authController)

// apply-doctor
authroute.route('/apply-doctor').
post(authHelper, applyDoctorController)


// get-all-navigations
authroute.route('/get-all-notification').
post(authHelper, getAllNotifications)


// delete All Notifications
authroute.route('/delete-all-notification').
post(authHelper, deleteAllNotifications)

// get-all-doctors
authroute.route("/getAllDoctors").
get(authHelper, getAllDoctors)

// booking route
authroute.route('/bookAppointment').
post(authHelper, makeAppointment)

authroute.route('/checkAvailability').
post(authHelper, doctorAvailability)

authroute.route('/userAppointments').
get(authHelper, getUserAppointment)

module.exports = authroute;