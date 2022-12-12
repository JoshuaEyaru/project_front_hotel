import React from 'react';
import { GoogleLogout } from 'react-google-login';
import { googleLogout } from '@react-oauth/google';

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;


function Logout({ setUser }) {
    
    const onSuccess = () => {
        googleLogout();  // helper for logging out
        setUser(null);
        localStorage.setItem("login", null);  // clearing local storage
        console.log('Logout made successfully');
      };

    return (

        <div>
            <div onClick={onSuccess}>Logout</div>

            {/* <GoogleLogout
                clientId={clientId}
                buttonText="Logout"
                onLogoutSuccess={onSuccess}

            ></GoogleLogout> */}
            
        </div>
    );
}

export default Logout;