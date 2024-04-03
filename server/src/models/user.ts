import mongoose from "mongoose";
import validator from "validator";

interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    photo: string;
    role: "admin" | "user";
    gender: "male" | "female";
    dob: Date;
    createdAt: Date;
    updatedAt: Date;
    //   Virtual Attribute
    age: number;
}

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: [true, "Please enter ID."]
    },
    name: {
        type: String,
        required: [true, "Please enter your Name."]
    },
    email: {
        type: String,
        unique: [true, "Email already exist."],
        required: [true, "Please enter your email."],
        validate: validator.default.isEmail
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: [true, "Please enter your Gender."]
    },
    dob: {
        type: Date,
        required: [true, "Please enter Date of birth."]
    },
    photo: {
        type: String,
        required: [true, "Please add Photo."]
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"

    }
}, { timestamps: true });

// Create a virtual property `age` that's computed from `dob`.
userSchema.virtual("age").get(function () {
    const currentDate = new Date();
    const birthDate = this.dob;
    let age:number = currentDate.getFullYear() - birthDate.getFullYear(); //Error coming here. Used Explicit Type

    const monthDiff = currentDate.getMonth() - birthDate.getMonth(); // Can use < sign, currentDate.getMonth() < birtDate.getMonth(); then we will get boolean value
    //const dateDiff = currentDate.getDate() - birtDate.getDate();

    //Q: HOW TO CALCULATE ACTUAL AGE OF USER?
    //Check for two condition if any one conditon is true when minus age by 1 as his birthday ha snot come yet.
    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() - birthDate.getDate() < 0)) { // Can use dateDiff < 0.
        age--;
    }

    return age;
});

export const User = mongoose.model<IUser>("User", userSchema); 
