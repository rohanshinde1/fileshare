const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public1'));
app.use(express.json());

const connectDB = require('./config/db');
connectDB();

//cors
const corsOptions = {
      origin: process.env.ALLOWED_CLIENTS.split(',')
      //['http://localhost:3000', 'http://localhost:5000', 'http://localhost:3300']
}

app.use(cors(corsOptions));
//Template
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');





//Routes 

app.use('/api/files', require('./routes/files'));
app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'))

app.listen(PORT, () => {
  
      console.log('listen on port ${PORT}');
})