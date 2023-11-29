import { server } from './hosts';
import { setUserState, getCurrUser } from './userState';
import axios from 'axios';


export const getGoogleLoginUrl = async () => {
    const url = await axios.get(`${server}/google-auth-provider/initGoogleLogin`);
    console.log(url);
    return url;
}

export const GoogleUserGetProfile = async (code) => {
    const user = await axios.get(`${server}/google-auth-provider/initGoogleLogin/callback?code=${code}`);
    return user;
}