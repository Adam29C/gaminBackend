const multer  = require('multer')

class Upload{
     upload=multer({
        storage:multer.diskStorage({
            filename :function(req,file,cb)
            {
                cb(null,file.fieldname+'-'+Date.now()+'.jpg')
            }
        })
    }).single('upload')
}

module.exports=new Upload()