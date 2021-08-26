const Comment = require('../models/comment')
const CommentController = {
    store: async(req, res) =>{
        try {
            const commentData = {
                body: req.body.body,
                createdAt: Date.now(),
                user: req.body.userId,
                post: req.body.postId
            }
            const cek = await Comment.insertMany(commentData)
            if(cek){
                res.redirect(`/post/detail/${req.body.postId}`)
            }
        } catch (error) {
            console.log(error)
        }
    },
    delete: async(req, res) => {
        try {
           const cek = await Comment.deleteOne({_id:req.body.id}) 
           if(cek){
            res.redirect(`/post/detail/${req.body.postId}`)
           }
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = CommentController