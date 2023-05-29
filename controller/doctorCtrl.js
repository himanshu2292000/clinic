const appointmentModel = require('../model/appointmentModel');
const doctorModel = require('../model/doctorModel');
const patientModel = require('../model/patientsModel');

const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({
      userId: req.body.userId
    });
    res.status(200).send({
      success: true,
      message: "doctor data fetch success",
      data: doctor,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error in Fetching Doctor Details",
    });
  }
};

// update doc profile
const updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate({
      userId: req.body.userId
    }, {
      ...req.body,
      timings: [...req.body.timings]
    });
    res.status(201).send({
      success: true,
      message: "Doctor Profile Updated",
      data: doctor,
    });
  } catch (error) {
    
    res.status(500).send({
      success: false,
      message: "Doctor Profile Update issue",
      error,
    });
  }
};

const bookAppointment = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({
      _id: req.body.doctorId
    });

    if (doctor) {
      res.status(201).send({
        message: "Doctor returned successfully",
        success: true,
        data: doctor,
      })
    }
  } catch (error) {
    
    res.status(500).send({
      message: "Internal Server Error",
      success: false,
      error
    })
  }
}

const doctorAppointmentsController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({
      userId: req.body.userId
    });

    const appointments = await appointmentModel.find({
      doctorId: doctor._id
    });

    res.status(200).send({
      success: true,
      message: "Doctor Appointments fetch Successfully",
      data: appointments,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error in Doc Appointments",
    });
  }
};

const updateStatusController = async (req, res) => {
  try {
    const {
      appointmentsId,
      status
    } = req.body;
    const appointments = await appointmentModel.findByIdAndUpdate(
      appointmentsId, {
        status
      }
    );
    const user = await patientModel.findById(
      appointments.userId
    );
    let notification = user.notification;
    notification.push({
      type: "status-updated",
      message: `your appointment has been updated ${status}`,
      onCLickPath: "/doctor-appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment Status Updated",
    });
  } catch (error) {
    
    res.status(500).send({
      success: false,
      error,
      message: "Error In Update Status",
    });
  }
};

module.exports = {
  getDoctorProfile,
  updateDoctorProfile,
  bookAppointment,
  doctorAppointmentsController,
  updateStatusController
};