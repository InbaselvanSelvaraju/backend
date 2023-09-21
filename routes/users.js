const express = require("express");
const {
  signUp,
  login,
  getUser,
  forgetPassword,
  resetPassword,
  updatePassword,
  updateUser,
} = require("../conterollers/auth");
const TryAndCAtch = require("../utilitis/tryAndCatch");
const users = require("../models/userSchema");
const { isAuth } = require("../middleware/isAuth");
const crypto = require("crypto");

const router = express.Router();
router.post("/", signUp);
router.post("/login", login);
// router.get("/me", isAuth, getUser);
router.route("/me").get(isAuth, getUser);
router.route("/updateUser").put(isAuth, updateUser);
router.route("/forgetPassword").post(forgetPassword);
router.route("/resetpassword/:token").patch(resetPassword);
router.route("/updatePassword").patch(isAuth, updatePassword);

// this is convert json method and find all user with help of .find keyword

/*router.get('/', async(req, res, next) => {
console.log(req.requstTimen);
    try {
        const allUsers  =await users.find()
        res.status(200).json({
        staus: 'sucess',
        data:allUsers
    })
    } catch (error) {
        res.json({
            status: 'fail', 
            message : "user id not found"
        })
            
        
   }
});
*/

router.get(
  "/",
  TryAndCAtch(async (req, res, next) => {
    const User = await users.find(req.body);
    res.status(200).json({
      status: "sucess",
      data: User,
    });
  })
);

/*router.get('/', async(req, res, next) => {
console.log(req.requstTimen);
    try {
        const particularUser  =await users.findById(req.params.userId)
        res.status(200).json({
        staus: 'sucess',
        data:particularUser
    })
    } catch (error) {
        res.json({
            status: 'fail', 
            message : "user id not found"
        })
            
        
   }
});
*/

router.get(
  "/:userId",
  TryAndCAtch(async (req, res, next) => {
    const particularUser = await users.findById(req.params.userId);
    res.status(200).json({
      status: "sucess",
      data: particularUser,
    });
  })
);

/*router.post('/',async (req, res, next) => {
    try {
        const createUser = await users.create(req.body)
        createUser.save()
    res.status(201).json({
        staus: 'sucess',
        data:createUser
    })
    } catch (error) {
        console.log(error.name)
        console.log(error)
        if (error.name === "ValidationError") {
            // const errors = Object.values(error.errors).map(el => el.message) this is show whole error
            const errors = Object.values(error.errors).reduce((acc,el) => {
                acc[el.path] = el.message

                return acc
            },{})
            res.status(400).json({
                status: 'fail',
                message : errors
            })
        } else if (error.code === 11000) {
            res.status(500).json({
                status: "fail",
                message : "Email is already exist"
                
            })
        } else {
            res.json({
                status: "fail",
                message : "sign up was unsucessful"
                
            }) 
      }
   }
});
*/

router.post(
  "/",
  signUp
  // , TryAndCAtch(async (req,res,next) => {
  //     const createuser = await users.create(req.body)
  //     res.status(201).json({
  //         status: 'success',
  //         message: "your create a account sucessful ",
  //         data :createuser

  //     })
  // })
);

/*router.put('/:userId', async(req, res, next) => {
    try {
       
        const updateUser = await users.findByIdAndUpdate(req.params.userId, req.body)
        res.status(200).json({
            status: "success",
            data: updateUser
        })

    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: 'your update was unsuccessful' 
        })
     }


});
*/

router.put(
  "/:userId",
  TryAndCAtch(async (req, res, next) => {
    const updateuser = await users.findByIdAndUpdate(
      req.params.userId,
      req.body
    );
    res.status(200).json({
      staus: "success",
      data: updateuser,
      message: "your account update is sucessful",
    });
  })
);

/*router.delete('/:userId', async (req, res, next) => {
    try {

        const deleteUser = await users.findByIdAndDelete(req.params.userId)
        res.status(204).json({
            status: "success",
            data: deleteUser
        })
       
      
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: 'your account was not deletecd' 
        })
  }
});
*/

router.delete(
  "/:userId",
  TryAndCAtch(async (req, res, next) => {
    const deleteuser = await users.findByIdAndDelete(req.params.userId);
    res.status(204).json({
      staus: "success",
      message: "your acoount is deletecd",
    });
  })
);

module.exports = router;
