const express = require("express")


const {passwordPolicyModel} = require("../model/passwordpolicy.model")

// async function validatePassword(password, policy) {
//     // Count lowercase letters
//     const lowercaseCount = (password.match(/[a-z]/g) || []).length;

//     // Count uppercase letters
//     const uppercaseCount = (password.match(/[A-Z]/g) || []).length;

//     // Count numbers
//     const numberCount = (password.match(/[0-9]/g) || []).length;

//     // Count special characters
//     const specialCharacterCount = (password.match(/[^A-Za-z0-9]/g) || []).length;

//     // Check counts against policy requirements
//     if (
//         lowercaseCount < policy.lowercase_required ||
//         uppercaseCount < policy.uppercase_required ||
//         numberCount < policy.number_required ||
//         specialCharacterCount < policy.specialcharacter_required
//     ) {
//         return false;
//     }

//     if (lowercaseCount < 6) {
//         return { isValid: false, msg: "Password must contain at least 6 lowercase letters." };
//     }

//     if (uppercaseCount < 2){
//         return {isValid:false,msg:"password must contain at least 2 uppercase letter."}
//     }

//     if (numberCount){
//         return {isValid:false,msg:"password must contain at least 2 Numbers"}
//     }

//     if (specialCharacterCount ){
//         return {isValid:false,msg:"password must contain at least 2 specialCharacterCount "}
//     }

//     // Password meets all requirements
//     return true;
// }




async function validatePassword(password, policy) {
    const lowercaseCount = (password.match(/[a-z]/g) || []).length;
    const uppercaseCount = (password.match(/[A-Z]/g) || []).length;
    const numberCount = (password.match(/[0-9]/g) || []).length;
    const specialCharacterCount = (password.match(/[^A-Za-z0-9]/g) || []).length;


    // Check counts against policy requirements
    if (lowercaseCount < policy.lowercase_required) {
        return { isValid: false, msg: `Password must contain at least ${policy.lowercase_required} lowercase letters.` };
    }

    if (uppercaseCount < policy.uppercase_required) {
        return { isValid: false, msg: `Password must contain at least ${policy.uppercase_required} uppercase letters.` };
    }

    if (numberCount < policy.number_required) {
        return { isValid: false, msg: `Password must contain at least ${policy.number_required} numbers.` };
    }

    if (specialCharacterCount < policy.specialcharacter_required) {
        return { isValid: false, msg: `Password must contain at least ${policy.specialcharacter_required} special characters.` };
    }

    
    if (password.length != 12) {
        return { isValid: false, msg: "Password must be exactly 12 characters long." };
    }


    // Password meets all requirements
    return { isValid: true };
}


module.exports = {
    validatePassword
}