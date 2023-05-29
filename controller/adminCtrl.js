const patientModel = require('../model/patientsModel');
const doctorModel = require('../model/doctorModel');


const getAllUsers = async (req, res) => {
    try {
        
        const user = await patientModel.find({});

        if(user){
            res.status(200).send({
                message: "All users listed",
                success: true,
                data:user
            })
        }
        else{
            res.status(404).send({
                message: "Cannot get user",
                success:false
        })
    }

    } catch (error) {
        res.status(500).send({
            message: 'error while fetching users',
            success: false,
            error
        });
    }
}

const getAllDoctors = async (req, res) => {
    try {
        
        const user = await doctorModel.find({});

        if(user){
            res.status(200).send({
                message: "All doctors listed",
                success: true,
                data:user
            })
        }
        else{
            res.status(404).send({
                message: "Cannot get doctors",
                success:false
        })
    }

    } catch (error) {
        res.status(500).send({
            message: 'error while fetching doctors',
            success: false,
            error
        });
    }
}

const changeReqStatus = async (req, res) => {
try {
    const { doctorId, status } = req.body;
    const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status });
    const user = await patientModel.findOne({ _id: doctor.userId });
    const notification = user.notification;
    notification.push({
      type: "doctor-account-request-updated",
      message: `Your Doctor Account Request Has ${status} `,
      onClickPath: "/notification",
    });
    user.isDoctor= status === "approved" ? true : false;
    await user.save();
    res.status(201).send({
      success: true,
      message: "Account Status Updated",
      data: doctor,
    });
  } catch (error) {

    res.status(500).send({
      success: false,
      message: "Eror in Account Status",
      error,
    });
  }

}

module.exports = {
    getAllUsers,
    getAllDoctors,
    changeReqStatus
}