// importing the requirements

const express = require('express')
const app = express()
const mongoose = require("mongoose")

app.use(express.json())
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const jwt = require('jsonwebtoken')
const userModel = require('./donor');
const reqModel = require('./Request')

require('dotenv').config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
// 
// MONGODB_URI=mongodb+srv://neha2212:221200@cluster0.lhaoo6g.mongodb.net/test

//connection of mongoose
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('connection is success')
}).catch((err) => {
  console.log(err)
})

app.get("/foo", async (req, res) => {
  try {
    const donor = await userModel.find({});
    res.send(donor);
    console.log(donor);
  } catch (err) {
    console.log(err);
  }
});


app.post('/register', async (req, res) => {
  try {
    const { donor_name, donor_email, password, blood_group, age, mobile_no, state, city } = req.body;
    // Check if user already exists
    const existingUser = await userModel.findOne({ donor_email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    // Create a new user
    const newUser = new userModel({ donor_email, password, donor_name, blood_group, age, mobile_no, state, city });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' , error});
  }
});

app.post('/login', async (req, res) => {
  try {
    const { donor_email, password } = req.body;
    // Check if user exists
    const user = await userModel.findOne({ donor_email, password });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    
    const token = jwt.sign({ userId: user._id }, 'your_secret_key');
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.put('/profile', async (req, res) => {

  const { donor_name, donor_email, password, blood_group, age, mobile_no, state, city } = req.body;
  const old_user = await userModel.findOne();


  try {
    const user = await userModel.findByIdAndUpdate(
      old_user._id,
      { donor_name, donor_email, password, blood_group, age, mobile_no, state, city },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

app.delete('/delete', async(req, res) => {
  const old_user = await userModel.findOne();

  userModel.findByIdAndDelete(old_user._id, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.json('Item deleted successfully');
    }
  });
});


app.post('/req', (req, res) => {
  try {
    const { req_city, req_blood_group } = req.body;
    const user = req.body;
    const newUser = new reqModel(user);
    newUser.save()
    console.log(req.body)
    app.get("/data", async (req, res) => {
      try {
        const donor = await userModel.find({ city: req_city, blood_group: req_blood_group });
        res.send(donor);
        console.log("request is accepted", donor);
      } catch (err) {
        console.log(err);
      }
    })
  }
  catch (error) {
    console.log(error)
  }
})

app.get('/', (req, res) => {
  res.send("hello world")
})


app.listen(PORT, (req, res) => {
  console.log("server is responding")
})
