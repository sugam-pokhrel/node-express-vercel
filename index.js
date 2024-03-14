// Import packages
const express = require("express");
const mongoose = require('mongoose');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
var cors = require('cors')

const home = require("./routes/home");

// Middlewares
const app = express();
app.use(express.json());


// Routes
app.use("/home", home);

// connection

app.use(cors())
// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://sugamf7:yunisha123@pyauto.hkt89gc.mongodb.net/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});

// Define a mongoose schema for notices
const noticeSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
});
const Notice = mongoose.model('Notice', noticeSchema);

// Multer configuration for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST endpoint to save a notice with image
app.post('/notices',  async (req, res) => {
  try {
   

    // Create notice document
    const notice = new Notice({
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.body.image,
    });

    // Save notice to MongoDB
    await notice.save();
    console.log('Notice saved to MongoDB:', notice);

    res.status(201).json({ message: 'Notice saved successfully', notice });
  } catch (error) {
    console.error('Error saving notice:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening to port ${port}`));
