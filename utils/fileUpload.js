import multer,{diskStorage} from "multer"
export const fileUpload = () => {
    const fileFilter = (req,file,cb) => {
        //check mimetype
        if (!["image/png", "image/jpeg","image/jpg"].includes(file.mimetype))
            return cb(new Error("invalid format"), false);
        return cb(null, true);

    }
    return multer({ storage: diskStorage({}), fileFilter })
};