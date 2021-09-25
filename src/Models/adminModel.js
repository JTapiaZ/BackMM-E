'use strict'

const { Schema, model } = require("mongoose");

const adminSchema = new Schema({
    name: {
        type: String,
        required: true,
        max: 30
    },
    username: {
        type: String,
        required: true,
        max: 30
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        max: 20,
    },
    role: {
        type: String,
        default: "user",
        enum: ["admin", "user"]
    },
}, { timestamps: true })

module.exports = model("Admin", adminSchema);