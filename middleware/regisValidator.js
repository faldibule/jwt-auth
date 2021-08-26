const { body, validationResult, check } = require('express-validator');
const User = require('../models/user')

const regisValidator = [
    body('email')
        .custom(async (value, {
            req
        }) => {
            const duplikat = await User.findOne({email : value});
            if (duplikat) {
                throw new Error('Email Sudah Terdaftar')
            }
            return true
        })
        .isEmail()
        .withMessage('Email Tidak Valid'),
        
    body('password')
        .custom((value, {req}) => {
            if(value != req.body.r_password){
                throw new Error('Password tidak Sama')
            }
            return true
        })  
        .isLength({
                min: 8,
                max: 12
            })
        .withMessage('Password minimal 8 karakter dan maksimal 12 karakter'), 
        
    check('nama')
        .isAlpha('en-US', {
            ignore: ' ',
        })
        .withMessage('Nama Hanya Boleh Huruf'),

    ]

module.exports = regisValidator;