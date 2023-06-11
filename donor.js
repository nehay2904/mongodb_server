const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    donor_name:{
        type:String
    },
    donor_email:{
        type:String
    },
    password:{
       type: String
    },
    blood_group:{
        type:String
    },
    age:{
        type:String
    },
    mobile_no:{
        type:String
    },
    state:{
        type:String
    },
    city:{
        type:String
    }
})




const userModel = mongoose.model("donor_info" , UserSchema)


module.exports = userModel;

