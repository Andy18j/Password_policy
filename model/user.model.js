const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
   Email : {type:String,required:true},
   Password : {type:String,required:true},
   Confirm_Password : {type:String,required:true},
   passwordHistory: {
    type: [{
        type: String
    }],
    validate: {
        validator: function(array) {
            // Assuming you want to allow a maximum of 10 passwords in history
            return array.length <= 3;
        },
        message: 'Password history can have at most 10 entries.'
    }
}
})

const userModel = mongoose.model("user",userSchema)



module.exports ={
    userModel
}