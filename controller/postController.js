const User = require("../models/user");
const Post = require("../models/post");
const Tag = require("../models/tag");
const Comment = require('../models/comment')
// const fs = require("fs");
const cloudinary = require('../utils/cloudinary')
const moment = require('moment'); 
const { validationResult } = require("express-validator");
const escapeHtml = require('escape-html');
const { allowedNodeEnvironmentFlags } = require("process");
const { stripHtml } = require('string-strip-html');
const paginate = require("../middleware/pagination");

const PostController = {
  form: async (req, res, next) => {
    const cekNav = res.locals.nav;
    const tags = await Tag.find();
    const category = ["Code", "Tutorial", "History", "Math", "Entertainment", "Information"];
    let x = 0;
    res.render("posts/form-post", {
      title: "Halaman Post",
      layout: "layouts/main",
      cekNav,
      tags,
      category,
      old: [],
      x
    });
  },

  find: async (req, res, next) => {
    try {
      const currentPage = parseInt(req.query.page)
      const data = await paginate.find(Post, currentPage, 3)
      const cekNav = res.locals.nav;
      const posts = data.data;
      const startIndex = currentPage >= 3 ? currentPage - 1 :  1;
      const endIndex = currentPage >= 3 ? currentPage + 1 > data.totalPage ? data.totalPage : currentPage + 1 : 3;
      const page = {
        startIndex,
        endIndex,
        currentPage: data.currentPage,
        totalPage: data.totalPage,
        next: data.next || null,
        prev: data.previous || null,
      }
      const createdAt = posts.map(post => moment(post.createdAt).calendar() )
      const snippet = posts.map(post => stripHtml(post.body).result)
      res.render("posts/post", {
        title: "Halaman Post",
        layout: "layouts/main",
        posts,
        cekNav,
        createdAt,
        snippet,
        page,
        msg: req.flash('success')
      });
    } catch (err) {
      console.log(err);
    }
  },

  myPost: async(req, res, next) => {
    try {
      const cekNav = res.locals.nav;
      const currentPage = parseInt(req.query.page)
      const data = await paginate.myPost(Post, currentPage, 3, req.params.userId)
      const posts = data.data
      const page = {
        currentPage: data.currentPage,
        userId: req.params.userId,
        totalPage: data.totalPage,
        next: data.next || null,
        prev: data.previous || null,
      }
      const createdAt = posts.map(post => moment(post.createdAt).calendar() )
      const snippet = posts.map(post => stripHtml(post.body).result)
      req.flash('success', `Your Post`)
      res.render("posts/my-post", {
        title: "Halaman Post",
        layout: "layouts/main",
        posts,
        cekNav,
        msg:req.flash('success'),
        createdAt,
        snippet,
        page
      });
    } catch (err) {
      console.log(err);
    }
  },

  search: async (req, res, next) => {
    try {
      const currentPage = parseInt(req.query.page)
      const data = await paginate.search(Post, currentPage, 3, req.query.search)
      const cekNav = res.locals.nav;
      const posts = data.data
      const page = {
        currentPage: data.currentPage,
        search : req.query.search,
        totalPage: data.totalPage,
        next: data.next || null,
        prev: data.previous || null,
      }
      const createdAt = posts.map(post => moment(post.createdAt).calendar() )
      const snippet = posts.map(post => stripHtml(post.body).result)
      req.flash('success', `Berikut adalah hasil pencarian dari kata Kunci '${req.query.search}'`)
      res.render("posts/search-post", {
        title: "Halaman Post",
        layout: "layouts/main",
        posts,
        cekNav,
        msg:req.flash('success'),
        createdAt,
        snippet,
        page
      });
    } catch (err) {
      console.log(err);
    }
  },

  store: async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      const cekNav = res.locals.nav;
      const tags = await Tag.find();
      const category = ["Code", "Tutorial", "History", "Math", "Entertainment", "Information"];
      let x = 0;
      res.render("posts/form-post", {
        title: "Halaman Post",
        layout: "layouts/main",
        cekNav,
        tags,
        category,
        errors: errors.array(),
        old: req.body,
        x,
      });
    }else{
      try {
        const tags = req.body.tags;
        const tagsId = [];
        for (let i = 0; i < tags.length; i++) {
          const temp = await Tag.findOne({ tag: tags[i] });
          tagsId.push(temp._id);
        }
        let image = 'https://res.cloudinary.com/bdonglot/image/upload/v1629700706/sa21pvyktvltvlqprgs8.png';
        let image_id = 'sa21pvyktvltvlqprgs8'
        if(typeof req.file != 'undefined'){
          const uploadImage = await cloudinary.uploader.upload(req.file.path)
          image = uploadImage.secure_url;
          image_id = uploadImage.public_id
        }
        const user = await User.findById(res.locals.user.id);
        const title = escapeHtml(req.body.title)
        const body = req.body.body
        const category = escapeHtml(req.body.category)
        const postData = {
          title,
          body,
          category,
          image,
          image_id,
          createdAt: Date.now(),
          user: user._id,
          tags: tagsId,
        };
        const newPost = await Post.insertMany(postData);
        user.posts.push(newPost[0]._id);
        await user.save();
  
        for (let i = 0; i < tags.length; i++) {
          const temp = await Tag.findOne({ tag: tags[i] });
          await temp.posts.push(newPost[0]._id);
          await temp.save();
        }
        req.flash('success', 'Berhasil Menambah Data')
        res.redirect('/post')
      } catch (err) {
        console.log(err);
      }
    }
  },

  updateForm: async (req, res, next) => {
    try {
      const cekNav = res.locals.nav;
      const post = await Post.findOne({ _id: req.params.id }).populate({ path: "tags", select: "tag" });
      const tags = await Tag.find();
      const category = ["Code", "Tutorial", "History", "Math", "Entertainment", "Information"];
      let unselected = tags
                        .map(tag => tag.tag)
                        .filter(x => !post.tags
                          .map(tag => tag.tag)
                          .includes(x));
      // console.log(unselected)
      res.render("posts/edit-form", {
        title: "Halaman Post",
        layout: "layouts/main",
        cekNav,
        post,
        tags,
        category,
        unselected,
        old: [],
      });
    } catch (err) {
      console.log(err);
    }
  },

  update: async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      try {
        const cekNav = res.locals.nav;
        const tags = await Tag.find();
        const category = ["Code", "Tutorial", "History", "Math", "Entertainment", "Information"];
        let unselected = tags
                        .map(tag => tag.tag)
                        .filter(x => !req.body.tags
                          .map(tag => tag)
                          .includes(x));
        // console.log(unselected);
        res.render("posts/edit-form", {
          title: "Halaman Post",
          layout: "layouts/main",
          cekNav,
          category,
          unselected,
          post: [],
          old: req.body,
          errors: errors.array()
        });
      } catch (err) {
        console.log(err);
      }
    }else{
      try {
      
        //buat array baru yang berisi id dari tag yang dipilih user
        let tagsId = [];
        for (let i = 0; i < req.body.tags.length; i++) {
          const temp = await Tag.findOne({ tag: req.body.tags[i] });
          tagsId.push(temp._id);
        }
  
        //hapus semua post id dari collection Tag 
        const post = await Post.findOne({_id: req.body.postId}).populate({ path: "tags", select: "tag" })
        for(let i = 0; i < post.tags.length; i++){
          const temp = await Tag.findOne({_id : post.tags[i]._id})
          await temp.posts.pull(post._id)
          await temp.save()
        }
  
        //setting image, jika image tidak diubah maka akan tetap menggunakan image lama
        let image = post.image;
        let image_id = post.image_id;
        if(typeof req.file != 'undefined'){
          if(post.image == 'https://res.cloudinary.com/bdonglot/image/upload/v1629700706/sa21pvyktvltvlqprgs8.png'){
            const uploadImage = await cloudinary.uploader.upload(req.file.path)
            image = uploadImage.secure_url;
            image_id = uploadImage.public_id
          }else{
            await cloudinary.uploader.destroy(post.image_id)
            const uploadImage = await cloudinary.uploader.upload(req.file.path)
            image = uploadImage.secure_url;
            image_id = uploadImage.public_id
          }
        }
  
        //update data post
        await Post.updateOne({_id : req.body.postId}, 
          {
            $set: {
              title: req.body.title,
              body: req.body.body,
              category: req.body.category,
              image,
              image_id,
              tags: tagsId,
            }
          }
          )
          req.flash('success', 'Berhasil Update Data')
          res.redirect('/post')
      } catch (err) {
        console.log(err);
      }
    }
    
  },

  detail: async (req, res, next) => {
    try {
      const cekNav = res.locals.nav;
      const comments = await Comment.find({post:req.params.id}).populate({path: 'user', select: ['nama', 'image']})
      const post = await Post.findOne({ _id: req.params.id })
        .populate({ path: "tags", select: "tag" })
        .populate({ path: "user", select: ["nama", "email", "image"] })
        .exec();
      const cek = res.locals.user.id == post.user._id ? true : false;
      const createdAt = moment(post.createdAt).calendar();  // Selasa lalu pukul 10.53
      res.render("posts/details", {
        title: "Halaman Detail",
        layout: "layouts/main",
        post,
        cek,
        cekNav,
        createdAt,
        comments
      });
    } catch (err) {
      console.log(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      const post = await Post.findOne({ _id: req.body.id });
      const user = await User.findOne({ _id: res.locals.user.id });
      for (let i = 0; i < post.tags.length; i++) {
        const temp = await Tag.findOne({ _id: post.tags[i]._id });
        temp.posts.pull(post._id);
        await temp.save();
      }
      user.posts.pull(post._id);
      await user.save();

      await Comment.deleteMany({post: req.body.id})

      if(post.image != 'https://res.cloudinary.com/bdonglot/image/upload/v1629700706/sa21pvyktvltvlqprgs8.png'){
        await cloudinary.uploader.destroy(post.image_id)
        await Post.deleteOne({ _id: post._id });
      }else{
        await Post.deleteOne({ _id: post._id });
      }
      
      req.flash('success', 'Berhasil Delete Data')
      res.redirect('/post')
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = PostController;
