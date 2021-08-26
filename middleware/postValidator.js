const { body, validationResult, check } = require('express-validator');


const postValidator = [
    check('title').not().isEmpty().withMessage('Title Wajib diisi!'),
    check('body').not().isEmpty().withMessage('Body Wajib diisi!'),
    check('tags').not().isEmpty().withMessage('Tags Wajib diisi!')
];

module.exports = postValidator;