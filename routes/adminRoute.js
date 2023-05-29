
const {getAllUsers, getAllDoctors, changeReqStatus} = require('../controller/adminCtrl')
const authHelper = require('../controller/middlewares/authHelper');
const express = require('express');


const adminRoute = express.Router();

adminRoute.route('/getAllUsers').
get(authHelper, getAllUsers)

adminRoute.route('/getAllDoctors').
get(authHelper, getAllDoctors)

adminRoute.route('/changeStatus').
post(authHelper, changeReqStatus)

module.exports = adminRoute;