const { body, check } = require('express-validator');
const User = require('../models/user')
const bcrypt = require('bcryptjs')

const userValidator = [
    body('email')
        .custom(async (value, {
            req
        }) => {
            const duplikat = await User.findOne({email : value});
            if (value != req.body.oldEmail  && duplikat) {
                throw new Error('Email Sudah Terdaftar')
            }
            return true
        })
        .isEmail()
        .withMessage('Email Tidak Valid'),
        
    body('password')
        .custom(async(value, {req}) => {
            const user = await User.findById(req.body.userId);
            const cek = await bcrypt.compare(value, user.password);
            if(!cek){
                throw new Error('Password Salah')
            }
            return true
        }),
        
    check('nama')
        .isAlpha('en-US', {
            ignore: ' ',
        })
        .withMessage('Nama Hanya Boleh Huruf'),

    ]

module.exports = userValidator;