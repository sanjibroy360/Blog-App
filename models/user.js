const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema( {
    name : {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true   
    },

    password : {
        type: String,
        minlength: 8
    }
},{timestamps : true} );

userSchema.pre("save", function(next) {
    this.password = bcrypt.hash(this.password, 10, (err, hashedPassword) => {
        if(err) return next(err);
        console.log("password: ",this.password)
        this.password = hashedPassword;
       
        next();
    });
})

userSchema.methods.varifyPassword = function(password, callBack) {

    bcrypt.compare(password, this.password, function(err, result) {
        if(err) return next(err);
        callBack(null, result)
    });

}

module.exports = mongoose.model("User", userSchema);