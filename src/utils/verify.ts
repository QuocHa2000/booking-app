import admin from 'firebase-admin';
import axios from 'axios';

async function verifyGoogleToken(access_token: string) {
  try {
    const data = await admin.auth().getUser(access_token);
    return data;
  } catch (error) {
    throw new Error('Wrong access_token !');
  }
}

async function verifyFacebookToken(access_token: string) {
  try {
    const data = await axios.get(
      `https://graph.facebook.com/me?fields=name,gender,picture,email,first_name,last_name,link&access_token=${access_token}`,
    );
    return data.data;
  } catch (error) {
    throw new Error('Wrong access_token !');
  }
}

export { verifyGoogleToken, verifyFacebookToken };
