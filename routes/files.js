const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const { v4: uuid4 } = require('uuid');

let storage = multer.diskStorage({

  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {

    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;

    cb(null, uniqueName);

  }

})


let upload = multer({

  storage,
  limit: { fileSize: 1000000 * 100 },


}).single('myfile');

router.post('/', (req, res) => {
  //validate request


  //store file

  upload(req, res, async (err) => {

    if (!req.file) {
      return req.json({ error: 'All fields are require' });
    }
    if (err) {
      return res.status(500).send({ error: err.message })
    }
    // store to Database

    const file = new File({

      filename: req.file.filename,
      uuid: uuid4(),
      path: req.file.path,
      size: req.file.size,

    });

    const responce = await file.save();
    return res.json({ file: `${process.env.APP_BASE_URL}/files/${responce.uuid}` });

  });




});


router.post('/send', async (req, res) => {

  const { uuid, emailTo, emailFrom } = req.body;

  //validatae request
  if (!uuid || !emailTo || !emailFrom) {

    return res.status(422).send({ error: 'All fields are require' });
  }

  //get data from database
  const file = await File.findOne({ uuid: uuid });
  if (file.sender) {
    return res.status(422).send({ error: 'email Already send' });
  }

  file.sender = emailFrom;
  file.receiver = emailTo;
  const responce = await file.save();;

  //send email
  const sendMail = require('../services/emailService');
  sendMail({
    from: emeilFrom,
    to: emailTo,
    subject: 'file sharing',
    text: `${emailFrom} shared a file with you`,
    html: require('../services/emailTemplate')({
      emailFrom: emailFrom,
      downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
      seze: parseInt(file.seze / 1000) + ' KB',
      expires: '24 hours'
    })
  });

  return res.send({ success: true });
});



module.exports = router;