import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../../../lib/connectDb';
import { UserModel } from '../../../../../model/User';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error('No user found with this email');
          }
          if (!user.isVerified) {
            throw new Error('Please verify your account before logging in');
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            return {
              _id: user._id?.toString(),
              username: user.username,
              email: user.email,
              isVerified: user.isVerified,
              isTeacher: user.isTeacher,
              isAdmin: user.isAdmin,
              isStudent: user.isStudent,
              sid_verification: user.sid_verification
            };
          } else {
            throw new Error('Incorrect password');
          }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id; // User ID
        token.username = user.username;
        token.isVerified = user.isVerified;
        token.isTeacher = user.isTeacher;
        token.isAdmin = user.isAdmin;
        token.isStudent = user.isStudent;
        token.sid_verification = user.sid_verification;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.username = token.username;
        session.user.isVerified = token.isVerified;
        session.user.isTeacher = token.isTeacher;
        session.user.isAdmin = token.isAdmin;
        session.user.isStudent = token.isStudent;
        session.user.sid_verification = token.sid_verification;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/sign-in',
  },
};
