const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'A user must provide name!!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email!!'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide valid email!!']
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    photo: {
        type: String
    },
    password: {
        type: String,
        required: [true, 'Please provide your password!!'],
        minLength: 8,
        select: false // this will only hide password while find query is done, not while save/create

    },
    passwordChangedAt: {    // this will mark the time when password is created or modified
        type: Date
    },
    passwordResetToken: {
        type: String
    },
    passwordResetTokenExpiredAt: {
        type: Date
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    }
})
userSchema.pre(/^find/, function(next) {
    this.find({active: {$ne: false}})       // this will omit every doc with active status false in every find query
    next();
})
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    this.password = await bcrypt.hash(this.password, 12) // encrypt password
    if (!this.isNew && this.isModified('password')) {
        this.passwordChangedAt = Date.now() - 1000; // only update if password is changed and the document is not new
    }
    next();
})

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.changedPasswordAfter = function(JWTtimestamp) {
    if (this.passwordChangedAt) {
        const passwordTime = parseInt(this.passwordChangedAt.getTime() / 1000)
        return JWTtimestamp<passwordTime;
    }
    return false;
}

userSchema.methods.createForgetPasswordToken= function() {
    const resetToken = crypto.randomBytes(32).toString('hex')
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetTokenExpiredAt = Date.now() + 10*60*1000;  // 10 minutes till
    return resetToken;
}

const User = mongoose.model('User',userSchema);
module.exports = User;