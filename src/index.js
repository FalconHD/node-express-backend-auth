const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routers = require('../routers/AuthRouters')
const middlewares = require('../middlewares/errors');




const app = express();
app.use(express.json());
app.use(express.static('public'))
app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));
app.use('/auth',routers.singup);
app.use('/auth',routers.signIn);
app.use('/auth',routers.getAllUsers);

app.get('/hello' , (req , res) => {
    res.json({
        message : "hello ❤" ,
    });
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

dbUrl = "mongodb+srv://Falcon:falcon123@cluster0.rt1zo.mongodb.net/imdb?retryWrites=true&w=majority"
mongoose.connect(dbUrl ,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
    .then((result) => {
        app.listen(5000);
        console.log("app connected");
    })
    .catch((err => {
        console.error(err)
    }))


    

//api key : 81df64ae8891d649c66e065f5daaf83e