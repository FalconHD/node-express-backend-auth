const express = require('express');
const UserModel = require('../models/users');
const jwt = require('jsonwebtoken');


const router = express.Router();



const singup =  router.post('/signup', async (req , res) => {
    const User = req.body;
       UserModel.create(User)
       .then((result) => {
        jwt.sign({User}, 'secretkey',{ expiresIn: '15s' }, (err, token) => {
            if(err) {
                res.sendStatus(403);
            }else {
                res.status(200)
                res.json({
                    result,
                    token
                })
                
            }
          });
           
       }).catch((err) => res.json({
           error : err.message
        }))

})


const signIn = router.post('/signin' , async(req, res,next) => {
    
        const User = await UserModel.findOne({username : req.body.username});
        
            if(User){
                console.log("text 1");
                User.comparePassword(req.body.password , (err , isMatch) => {
                    if(err) next({message : err})
                    if(isMatch){
                        jwt.sign({User}, 'secretkey',{ expiresIn: '1h' }, (err, token) => {
                            if(err) {
                                res.sendStatus(403);
                            }else {
                                res.json({
                                    User,
                                    token
                                });
                            }
                        });
                    }
                }) 
        }else{
           next({
               message : "waloo"
           })
        }
    
})

const getAllUsers = router.get('/Users',  verifyToken ,  (req,res,next) => {
    
    
     jwt.verify(req.token, 'secretkey', async (err, authData) => {
         if(err){
            
            res.sendStatus(403)
            res.json({
                message : "authrntication failed try to login "
            })
            
         }else {
            await UserModel.find().sort()
            .then((data) => {
            res.json({
                data :data,
            })
            res.status(200);
            
        })
         
        }
        
})
})


// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
      // Split at the space
      const bearer = bearerHeader.split(' ');
      // Get token from array
      const bearerToken = bearer[1];
      
      // Set the token

      req.token = bearerToken;
      // Next middleware
      next();
    } else {
      // Forbidden
      res.sendStatus(403);
    }

}
module.exports = {
    singup,
    signIn,
    getAllUsers
}