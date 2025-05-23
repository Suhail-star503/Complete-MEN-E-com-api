
import multer from "multer";
import path from 'path';
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./src/uploads');

    },
      filename:(req,file,cb)=>{
       cb(null,Date.now()+path.extname(file.originalname));

    }
})
const uploads=multer({storage:storage});
export { uploads };