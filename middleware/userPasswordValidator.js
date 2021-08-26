const { body, check } = require('express-validator');
const User = require('../models/user')
const bcrypt = require('bcryptjs')

const userPasswordValidator = [
    body('n_password')
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
        
    body('password')
        .custom(async(value, {req}) => {
            const user = await User.findById(req.body.userId);
            const cek = await bcrypt.compare(value, user.password);
            if(!cek){
                throw new Error('Password Lama Salah')
            }
            return true
        }),
        
    ]

module.exports = userPasswordValidator;