import Google from "next-auth/providers/google";
import db from "@/db";

export const authOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (profile?.email) {
        if (!profile.email.endsWith('@srmap.edu.in')) {
          return false;
        }

        let dbUser = await db.user.findUnique({
          where: { email: profile.email },
        });

        if (!dbUser) {
          const nameParts = user.name?.split('|').map(part => part.trim()) || [];
          
          let name, admissionNo;
          
          if (nameParts.length > 1) {
            name = nameParts[0];
            admissionNo = nameParts[1];
          } else {
            name = user.name || '';
            admissionNo = profile.email.split('@')[0] || '';
          }
          try {
            dbUser = await db.user.create({
              data: {
                name,
                email: profile.email,
                admissionNo,
                image: user.image,
              },
            });
          } catch (error) {
            console.error("Error creating user:", error);
            return false;
          }
        }
        return true;
      }
      return false;
    },
    async jwt({ token, user, account, profile }) {
      if (account && profile) {
        const dbUser = await db.user.findUnique({
          where: { email: profile.email },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.admissionNo = dbUser.admissionNo;
          token.washes = dbUser.washes;
          token.isSubscribed = dbUser.isSubscribed;
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.admissionNo = token.admissionNo;
        session.user.washes = token.washes;
        session.user.isSubscribed = token.isSubscribed;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};