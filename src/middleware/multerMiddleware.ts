import multer from "multer";
import { Request } from "express";
const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: any) {
    const allowedFileType = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedFileType.includes(file.mimetype)) {
      cb(new Error("this filetype is not accepted"));
    }
    cb(null, "./src/uploads");
  },

  filename: function (req: Request, file: Express.Multer.File, cb: any) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export { multer, storage };
