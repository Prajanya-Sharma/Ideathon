import dbConnect from '../../../../lib/connectDb';
import { UserModel } from '../../../../model/User';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '../../../../helpers/sendVerificationEmail';
export async function POST(request: Request) {
    await dbConnect();
    
    try {
      const { username, email, password, isStudent, reqAdmin, reqTeacher } = await request.json();
      console.log('Received data:', { username, email, password });

      if ((!isStudent && !reqAdmin && !reqTeacher) || (isStudent && (reqAdmin || reqTeacher)) || (reqAdmin && (isStudent || reqTeacher)) || (reqTeacher && (isStudent || reqAdmin))) {
        return Response.json({
          success: false,
          message: 'Out of student, admin, and teacher, the user can select only one',
        }, { status: 400 });
      }
  
      // Check if the username or email already exists
      const existingVerifiedUserByUsername = await UserModel.findOne({
        username,
        isVerified: true,
      });
  
      if (existingVerifiedUserByUsername) {
        console.log('Username already taken:', username);
        return Response.json({
          success: false,
          message: 'Username is already taken',
        }, { status: 400 });
      }
  
      const existingUserByEmail = await UserModel.findOne({ email });
      const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
      console.log('Generated verification code:', verifyCode);
  
      if (existingUserByEmail) {
        if (existingUserByEmail.isVerified) {
          console.log('User already verified:', email);
          return Response.json({
            success: false,
            message: 'User already exists with this email',
          }, { status: 400 });
        } else {
          console.log('Updating existing user:', email);
          existingUserByEmail.password = await bcrypt.hash(password, 10);
          existingUserByEmail.verifyCode = verifyCode;
          existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour expiry
          await existingUserByEmail.save();
        }
      } else {
        console.log('Creating new user:', email);
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1); // 1 hour expiry
  
        const newUser = new UserModel({
          username,
          email,
          password: hashedPassword,
          verifyCode,
          verifyCodeExpiry: expiryDate,
          isVerified: false,
          isStudent:true
        });
  
        await newUser.save();
        console.log('New user saved:', newUser);
      }
  
      const emailResponse = await sendVerificationEmail(email, username, verifyCode);
      console.log('Email response:', emailResponse);
  
      if (!emailResponse.success) {
        return Response.json({
          success: false,
          message: emailResponse.message,
        }, { status: 500 });
      }
  
      return Response.json({
        success: true,
        message: 'User registered successfully. Please verify your account.',
      }, { status: 201 });
  
    } catch (error) {
      console.error('Error registering user:', error);
      return Response.json({
        success: false,
        message: 'Error registering user',
      }, { status: 500 });
    }
  }
  