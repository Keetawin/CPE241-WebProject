import axios from "axios";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { useRouter } from 'next/router';


export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
  callbacks: {
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      // console.log("token", token, session)
      session.accessToken = token.accessToken
      session.user.id = token.id
      if(token){
        session.user.user_id = token.user_id
        session.user.DOB = token.DOB
        session.user.tel = token.tel
        session.user.gender = token.gender
        session.user.f_name = token.f_name
        session.user.l_name = token.l_name
      }
      await axios
      .get(`https://ticketapi.fly.dev/get_user?email=${session.user.email}`)
      .then((res)=>{
        if (res.data.length == 0){
          // console.log("not in database")
          session.callbackUrl = "/users/create"
          // console.log(session)
        }else{
          // console.log("in database1", res.data[0])
          session.user.user_id = res.data[0].user_id
          session.user.dob = res.data[0].dob
          session.user.tel = res.data[0].tel
          session.user.gender = res.data[0].gender
          session.user.f_name = res.data[0].f_name
          session.user.l_name = res.data[0].l_name
          // console.log("in database2", session)
        }
      })
      // console.log(session)
      return session
    },
    async jwt({ token, trigger, session }) {
      if(trigger === 'update') {
        // console.log("test", token, session)
        if(session.user) {
          token.user_id = session.user.user_id
          token.DOB = session.user.DOB
          token.f_name = session.user.f_name
          token.l_name = session.user.l_name
          token.tel = session.user.tel
        }
      }
      
      // console.log("test", token)
      return token;
    }
  }
};

export default NextAuth(authOptions);
