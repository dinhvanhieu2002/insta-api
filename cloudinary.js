const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const dotnv = require('dotenv')
const multer = require('multer')

dotnv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET  
})

const storagePost = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'posts',
    },
    allowedFormats: ['jpg', 'png'],
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})

const storageAvatar = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'avatars',
    },
    allowedFormats: ['jpg', 'png'],
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})

const uploadPostCloud = multer({ storage:  storagePost})
const uploadAvatarCloud = multer({ storage: storageAvatar })

module.exports = { uploadPostCloud, uploadAvatarCloud }

// exports.uploads = (file, folder) => {
//     return new Promise(resolve => {
//         cloudinary.uploader.upload(file, (result) => {
//             resolve ({
//                 url: result.url,
//                 id: result.public_id
//             })
//         },
//         {
//             resource_type: "auto",
//             folder: folder
//         })
//     })
// }