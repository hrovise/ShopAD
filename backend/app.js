const express = require('express');
const fs = require('fs');

const mongoose = require ('mongoose');
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
const shopRoutes = require('./routes/shop');
const User = require('./models/user');
const Auth = require("./middleware/check-auth");
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')

mongoose.set('strictQuery', true);
const bodyParser = require('body-parser');
const path = require("path");

const app = express();

mongoose.connect('mongodb+srv://Max:<pass>@cluster0.vvzzal8.mongodb.net/additives')
.then(()=>{
  console.log('we are connected');
})
.catch(()=>{
  console.log('Connection failed');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use("/images", express.static(path.join("./images")))

app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader('Access-Control-Allow-Methods',"GET, POST, PATCH, DELETE, PUT, OPTIONS");
  next();
});




app.use("/api/posts", postsRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/user", userRoutes);

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})

app.use(helmet());
app.use(compression());
app.use(morgan('combined', {stream:accessLogStream}));


module.exports = app;
