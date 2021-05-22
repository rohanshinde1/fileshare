const router = require('express').Router();
const File = require('../models/file');

router.get('/:uuid', async (req , res) => {
  try{
    const file = await File.findOne({ uuid: req.params.uuid}); //fetching row uuid from database
    if(!file){
        return res.render('download', { error: 'Link has been expired. '});
    }

    return res.render('download', {
    
        uuid: file.uuid, 
        filename: file.filename,
        fileSize: file.size,
        downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`//link generation
        //http://localhost:3000/files/download/uuidakjfldlfjslfj
          
    });
  } catch(err)  {

    return res.render('download', { error: 'error caugh'});
   }

});//:means dynamic parameter


module.exports = router;