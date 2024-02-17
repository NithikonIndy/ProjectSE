import asyncHandler from "express-async-handler";
import axios from "axios";

async function getOAuthAccessToken(authorizationCode) {
  console.log("authorizationCode from getOAuthAccessToken:", authorizationCode);
  try {
    const response = await axios.post(
      process.env.CMU_OAUTH_GET_TOKEN_URL,
      {},
      {
        params: {
          code: authorizationCode,
          redirect_uri: process.env.CMU_OAUTH_REDIRECT_URL,
          client_id: process.env.CMU_OAUTH_CLIENT_ID,
          client_secret: process.env.CMU_OAUTH_CLIENT_SECRET,
          grant_type: "authorization_code",
        },
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log("accessToken from getOAuthAccessToken:" ,response.data.access_token);
    return response.data.access_token;
  } catch (error) {
    throw new Error("Can't access token");
  }
}

async function getCMUBasicInfo(access_token) {
  try {
    const res = await axios.get(process.env.CMU_OAUTH_GET_BASIC_INFO, {
      headers: { Authorization: "Bearer " + access_token },
    });
    return res.data;
  } catch (error) {
    throw new Error("Can't get cmu basic info");
  }
}

export { getOAuthAccessToken, getCMUBasicInfo };
