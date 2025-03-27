const catchAsync = require("../utils/catchAsync");
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs')
const crypto = require('crypto');
const Email = require("../utils/email");
const AppError = require("../utils/appError");
const jsonwebtoken = require('jsonwebtoken')

exports.signup = catchAsync(async(req,res,next)=>{
    const user = {
        username:req.body.username,
        email:req.body.email,
        password:req.body.password,
        firstName:req.body.firstName,
        lastName:req.body.lastName
    }
    user.password = await bcrypt.hash(user.password,12)
    const verifyToken = crypto.randomInt(100000,1000000);
    user.verificationToken = crypto.createHash('sha256').update(verifyToken.toString()).digest('hex')
    user.verificationTokenExpiresAt = new Date(Date.now() + 15*60*1000)
    const newUser = await prisma.user.create({data:{
        ...user
    }})
    const email  = new Email(newUser.firstName,newUser.email)
    email.sendVerificationMail(verifyToken)
    res.status(201).json({
        status:'success',
        message:"User created successfully Please Enter the token."
    })
})
exports.verifyAccount = catchAsync(async (req, res, next) => {
    const { verificationToken, email } = req.body;
    const hashedToken = crypto.createHash("sha256").update(verificationToken).digest("hex");
    // Find user by email
    const candidateUser = await prisma.user.findUnique({
        where: { email }
    });
    if (!candidateUser) {
        return next(new AppError("There is no user found with that email", 400));
    }
    // Check if token is valid and not expired
    if (
        candidateUser.verificationToken !== hashedToken || 
        !candidateUser.verificationTokenExpiresAt || 
        candidateUser.verificationTokenExpiresAt < new Date()
    ) {
        return next(new AppError("The token you provided is wrong or has expired", 400));
    }
    // Update user as verified
    await prisma.user.update({
        where: { id: candidateUser.id },
        data: {
            verificationToken: null,
            verificationTokenExpiresAt: null,
            verified: true
        }
    });
    res.status(200).json({
        status: "success",
        message: "You have been verified successfully"
    });
});

exports.login = catchAsync(async(req,res,next)=>{
    const usernameOrEmail = req.body.usernameOrEmail
    const password=req.body.password;
    const user = await prisma.user.findFirst({
        where:{
            OR:[
                {
                    email:usernameOrEmail,
                },
                {
                    username:usernameOrEmail
                }
            ]
        }
    })

    if(!user){
        return next(new AppError("The email or username is not found",400))
    }
    if(!user.verified){
        return next(new AppError("You are account is not verified yet",403))
    }

    if(!password || !await bcrypt.compare(password,user.password)){
        return next(new AppError("The password is wrong",401))
    }

    const token = jsonwebtoken.sign({id:user.id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    })

    res.status(200).json({
        status:"success",
        token
    })
})


exports.protect = catchAsync(async(req,res,next)=>{
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        const token = req.headers.authorization.split(" ")[1]
        const validToken = jsonwebtoken.verify(token,process.env.JWT_SECRET)
        if(validToken){
            req.user = await prisma.user.findUnique({
                where:{
                    id:validToken.id
                }
            })
        }
        console.log(validToken);
        
        next()
    }else{
        return next(new AppError("You are forbidden to access that resource",403))
    }
})