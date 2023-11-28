import React, { useEffect, useState } from 'react';

import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { getGoogleLoginUrl, GoogleUserGetProfile} from '../../Utils/GoogleAuthRequests';
import { setUserSession } from '../../Utils/AuthRequests'
import { useSearchParams } from 'react-router-dom';
import { getCurrUser } from '../../Utils/userState';
import { useNavigate } from 'react-router-dom';

const CLIENT_ID=import.meta.env.VITE_CLIENT_ID;

const GoogleAuthLogin = () => {
  const [queryParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async (code) => {
      return await GoogleUserGetProfile(code);
    }

    if(queryParams.get('code') !== null) {
      let userInfo = getUser(queryParams.get('code')).then(data => {
        let user = data.data.user;
        let token = data.data.token
        setUserSession(token, JSON.stringify(user));
        navigate('/dashboard');        
      })
    }
  }, [])
  
  const redirectURL = async () => {
    const url = await getGoogleLoginUrl().then(res =>{
      window.location.replace(res.data.url);
    });
  }

  const handleLoginCallback = async (e) => {
    e.preventDefault();
    redirectURL();
  }

  return (
      <div className='google-sign-in'>
        <GoogleOAuthProvider clientId={CLIENT_ID}>
          <GoogleLogin
            ux_mode='popup'
            shape='pill'
            theme='filled_blue'
            size='large'
            onSuccess={credentialRes => { console.log(credentialRes) }}
            onError={() => console.log("Login Failed")}
          />
        </GoogleOAuthProvider>
      </div>
  );  

};

export default GoogleAuthLogin;
