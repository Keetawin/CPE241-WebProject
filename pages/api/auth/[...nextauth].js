import axios from "axios";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";


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
        session.user.user_role = token.user_role
      }
      await axios
      .get(`https://ticketapi.fly.dev/get_user?email=${session.user.email}`)
      .then((res)=>{
        if (res.data.length == 0){
          session.callbackUrl = "/users/create"
        }else{
          session.user.user_id = res.data[0].user_id
          session.user.dob = res.data[0].dob
          session.user.tel = res.data[0].tel
          session.user.gender = res.data[0].gender
          session.user.f_name = res.data[0].f_name
          session.user.l_name = res.data[0].l_name
          session.user.user_role = res.data[0].user_role

        }
      })
      // console.log(session)
      return session
    },
    async jwt({ token, trigger, session }) {
      if(trigger === 'update') {
        if(session.user) {
          token.user_id = session.user.user_id
          token.DOB = session.user.DOB
          token.f_name = session.user.f_name
          token.l_name = session.user.l_name
          token.tel = session.user.tel
          token.user_role = session.user.user_role
        }
      }
      
      return token;
    }
  }
};

export default NextAuth(authOptions);
