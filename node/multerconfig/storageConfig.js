const multer = require("multer");


// storage config
const storage = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,"./uploads")
    },
    filename:(req,file,callback)=>{
        const filename = `image-${Date.now()}.${file.originalname}`
        callback(null,filename)
    }
});

// filter 
const filefilter = (req, file, callback) => {
    const allowedImageFormats = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/svg+xml"]; // Add more formats as needed
    if (allowedImageFormats.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(null, false);
        return callback(new Error("Only .png, .jpg, .jpeg, .gif, and .svg formatted files are allowed"));
    }
};


const upload = multer({
    storage:storage,
    fileFilter:filefilter
});

module.exports = upload;