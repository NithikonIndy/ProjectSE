import passport from "passport";
import OAuth2Strategy from "passport-oauth2";
import axios from "axios";
import User from "../models/userModel.js";

passport.serializeUser((user, done) => {
  console.log("inside Serialize User");
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
  try {
    const findUser = await User.findById(id);
    return findUser ? done(null, findUser) : done(null, null);
  } catch (error) {
    done(error, null);
  }
});

export default passport.use(
  new OAuth2Strategy(
    {
      authorizationURL: "https://oauth.cmu.ac.th/v1/Authorize.aspx?response_type=code&client_id=wzYRm9XYn550dErgMmRETG799n0zGBGZ7SHKtsca&redirect_uri=http://localhost:3000/cmuOAuthCallback&scope=cmuitaccount.basicinfo&state=xyz",
      tokenURL: "https://oauth.cmu.ac.th/v1/GetToken.aspx",
      clientID: "wzYRm9XYn550dErgMmRETG799n0zGBGZ7SHKtsca",
      clientSecret: "4cfue2YSv6jUpK30CYS8kxrWzf3y7S0uhRMRBQ5g",
      callbackURL: "http://localhost:3000/cmuOAuthCallback",
    },
    async (accessToken, refreshToken, information, done) => {
      console.log("Access Token: ", accessToken);
      console.log("Refresh Token: ", refreshToken);

      const response = await axios.get(process.env.CMU_OAUTH_GET_BASIC_INFO, {
        headers: { Authorization: "Bearer " + accessToken },
      });

      // console.log(response.data);
      information = response.data;
      console.log("information: ", information);

      let findUser;
      try {
        findUser = await User.findOne(
          { name: information.firstname_EN + " " + information.lastname_EN},
          { email: information.cmuitaccount },
        );
      } catch (error) {
        return done(error, null);
      }

      try {
        if(!findUser){
          const newUser = new User({
            accountType: information.itaccounttype_EN,
            name: information.firstname_EN + " " + information.lastname_EN,
            email: information.cmuitaccount,
            organization: information.organization_name_EN,
            organizationCode: information.organization_code,
          });

          const newSavedUser = await newUser.save();
          return done(null, newSavedUser);
        }
        return done(null, findUser);
      } catch (error) {
        console.log(error);
        return done(error, null);
      }
    }
  )
);
