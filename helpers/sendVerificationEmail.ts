import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import VerificationEmail from '../emails/VerificationEmail';
import { ApiResponse } from '../types/ApiResponse';

if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
  throw new Error('Missing environment variables: GMAIL_USER or GMAIL_PASS');
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587, 
  secure: false, //bhai ssl hoga to use 465 port
  auth: {
    user: process.env.GMAIL_USER, 
    pass: process.env.GMAIL_PASS, 
  },
});

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const html = await render(VerificationEmail({ username, otp: verifyCode }));

    const textContent = `Hello ${username},\n\nThank you for registering. Your verification code is: ${verifyCode}\n\nIf you did not request this code, please ignore this email.`;

    // Send email
    const info = await transporter.sendMail({
      from: `"CollegeCompass" <${process.env.GMAIL_USER}>`, 
      to: email, 
      subject: 'Verification Code for CollegeCompass',
      text: textContent, 
      html, 
    });

    console.log('Email sent successfully:', info.messageId);
    return { success: true, message: 'Verification email sent successfully.' };
  } catch (error: any) {
    console.error('Error sending email:', error.message || error);
    return { success: false, message: error.message || 'Failed to send verification email.' };
  }
}
