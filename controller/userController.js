const User = require("../models/user");
const cloudinary = require('../utils/cloudinary')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

const UserController = {
    form: async(req, res) =>{
        try {
            const cekNav = res.locals.nav;
            const userData = await User.findById(res.locals.user.id)
                                            .populate({path:'post', select: ['title', 'body']})
                                            .exec()
            
            res.render('user/profile-form', {
                title: 'Halaman Profile',
                layout: 'layouts/main',
                cekNav,
                userData,
                old:{},
                msg: req.flash('success'),
            })
        } catch (error) {
            console.log(error)
        }
    },
    update: async(req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const cekNav = res.locals.cekNav;
            res.render('user/profile-form', {
                title: 'Halaman Profile',
                layout: 'layouts/main',
                cekNav,
                userData:{},
                old:req.body,
                errors:errors.array(),
                msg:req.flash('success')
            })
        }else{
            try {
                
                const {nama, email} = req.body;
                await User.updateOne({_id: req.body.userId},
                    {
                        $set:{
                            nama,
                            email,
                        }
                    })
                req.flash('success', 'Berhasil Edit Profile')
                res.redirect('/profile')
            } catch (error) {
                console.log(error)
            }
        }
    },
    
    updateFoto: async(req, res) =>{
        try{
            const user = await User.findById(req.body.userId)
            let image = user.image;
            let image_id = user.image_id;
            if(typeof req.file != 'undefined'){
                if(user.image == 'https://res.cloudinary.com/bdonglot/image/upload/v1629872092/wbmznxyuvdfhph2gkmkn.jpg'){
                    const uploadImage = await cloudinary.uploader.upload(req.file.path,  {folder: 'user_profile'})
                    image = uploadImage.secure_url;
                    image_id = uploadImage.public_id
                }else{
                    await cloudinary.uploader.destroy(user.image_id, {folder: 'user_profile'})
                    const uploadImage = await cloudinary.uploader.upload(req.file.path, {folder: 'user_profile'})
                    image = uploadImage.secure_url;
                    image_id = uploadImage.public_id
                }
            }
            await User.updateOne({_id: req.body.userId},
                {
                    $set:{
                        image,
                        image_id,
                    }
                })
            req.flash('success', 'Berhasil Mengganti Foto Profile')
            res.redirect('/profile')
        }catch(err){
            console.log(err)
        }
    },

    updatePassword: async(req, res) =>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const cekNav = res.locals.cekNav;
            res.render('user/profile-form', {
                title: 'Halaman Profile',
                layout: 'layouts/main',
                cekNav,
                userData:{},
                old:req.body,
                errors:errors.array(),
                msg:req.flash('success')
            })
        }else{
            try {
                
                const password = await bcrypt.hash(req.body.n_password, 10);
                await User.updateOne({_id: req.body.userId},
                    {
                        $set:{
                            password
                        }
                    })
                req.flash('success', 'Berhasil Ganti Password')
                res.redirect('/profile')
            } catch (error) {
                console.log(error)
            }
        }
    }
}

module.exports = UserController;