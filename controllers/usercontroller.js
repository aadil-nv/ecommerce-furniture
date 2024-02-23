const User=require('../models/userModel')
const bcrypt=require('bcrypt')

// const homeLogin= async (req,res)=>{
//         try {
//             res.render('login')
            
//         } catch (error) {
//             console.log(erorr.message)
//         }
// }

const securedPassword = async(password)=>{
    try{
        const passwordHash =await bcrypt.hash(password,10)
        return passwordHash
    } catch (erorr){
        console.log(erorr.message)
    }
}

const loadLogin=async(req,res)=>{
    try{
        res.render('user/login')
    }catch (erorr){
        console.log(erorr.message)
    }
}


const insertUser= async(req,res)=>{
    try{
        const checkemail=await  User.findOne({email:req.body.email})
        if(checkemail){
            res.render('registration',{message:"Email already exist"})

        }else{
            const spassword= await securedPassword(req.body.password)
            const email=req.body.email
        const emailRegex = /^[A-Za-z0-9.%+-]+@gmail\.com$/
        if (!emailRegex.test(email)) {
          res.render('registration', { message: 'Invalid email provided' });
        }
            const name=req.body.name

        if(!name || !/^[a-zA-Z][a-zA-Z\s]*$/.test(name)){
            res.render('registration',{message:"Inavlid name provided"})
        }

            const user = new User({
                name:req.body.name,
                email:req.body.email,
                mobile:req.body.mno,
                password:spassword,
                is_admin:0,
               
            })
            const userData= await user.save()
    
            if(userData){
                res.render('registration',{message:"Succesfilly Registerd Your Form . Please Verify Your Mail"})
            }else{
               res.render('registration',{message:"Your Registration has been Failed "})
    
            }
        }

    }catch (erorr){
        console.log(erorr.message)
    }
}


module.exports={
    
    loadLogin,
    insertUser
}

