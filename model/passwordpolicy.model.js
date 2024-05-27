const mongoose = require("mongoose");

const passwordPolicySchema = mongoose.Schema({
    // min_length: { type: Number, required: true},
    
    min_length: { type: Number, required: true, default: 8 },
    max_length: { type: Number, required: true, default: 15 },

    uppercase_required: { type: Number, required: true },
    lowercase_required: { type: Number, required: true },
    number_required: { type: Number, required: true },
    specialcharacter_required: { type: Number, required: true },
    expiration_hours: { type: Number, default: 90 },
    password_history_count: { type: Number, required: true, default: 3 },
    lockout_threshold: { type: Number },
    lockout_duration_minutes: { type: Number },
    enforce_mfa: { type: Boolean, default: false}
});

const passwordPolicyModel = mongoose.model("PasswordPolicy", passwordPolicySchema);

module.exports = {
    passwordPolicyModel
}