import multer from "multer";
const storage=multer.memoryStorage();
const upload=multer({
    storage:storage,
    limits:{
        fileSize:10*1024*1024
    },
    fileFilter:(req,file,cb)=>{
        if(file.mimetype ===
            "application/vnd.ms-powerpoint" ||
            file.mimetype ===
            "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
            file.mimetype === 
            "application/pdf"
        ){
            cb(null,true);
        }
        else{
            cb(new Error("Only ppt,pptx,and pdf are allowed"))
        }
    }
})
export default upload
