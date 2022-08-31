const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const async = require("hbs/lib/async");
const res = require("express/lib/response");

const employeeSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
})

// Token Generation
employeeSchema.methods.generateAuthToken = async function () {
    try {
        // console.log(this._id)
        const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({ token: token });
        await this.save()
        return token
    } catch (error) {
        res.send("the error part" + error);
        console.log("the error part " + error);
    }
}

// now we create collection
const Register = new mongoose.model("Register", employeeSchema);

module.exports = Register;