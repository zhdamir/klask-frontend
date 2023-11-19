import { useRef, useState, useEffect } from 'react';
//import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
// ...

//Test Remote Repo
const LoginPage = () => {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg]=useState();

    
    const handleSignIn = async (e) => {
       //console.log("Here the Logic of sign in!")
       e.preventDefault();
       // Replace this with your actual sign-in logic
        // Example: Check user credentials, set authentication state, etc.
        const isAuthenticated = await signInUser(username, password);

        if (isAuthenticated) {
        // If sign-in is successful, navigate to the home page (Uebersicht)
        navigate("/Uebersicht");
        } else {
        // Handle sign-in failure (show an error message, etc.)
        setErrMsg("Sign In failed. Please check your credentials.");
        }
    };

   
    const signInUser = async (username, password) => {
        // Simulate sign-in (replace with actual sign-in logic)
        // Return true if sign-in is successful, false otherwise
        return new Promise((resolve) => {
          setTimeout(() => {
            // Simulating a successful sign-in (replace with your logic)
            const validUsername = "user123";
            const validPassword = "password123";
            resolve(username === validUsername && password === validPassword);
          }, 1000);
        });
      };

    return (
        <>  
                <section>
                    <h1>Anmelden</h1>
                    <form onSubmit={handleSignIn}>
                        <label htmlFor="username">
                            Benutzername:
                        </label>
                        <input
                            type="text"
                            id="username"
                            
                            autoComplete="off"
                            onChange={(e)=>setUsername(e.target.value)}
                            value={username}
                            required
                            aria-describedby="uidnote"
                        />
                        <p id="uidnote" >
                            
                        </p>
                        <label htmlFor="password">
                            Passwort:
                           
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                            aria-describedby="pwdnote"
                        />
                        <p id="pwdnote" >
                           
                        </p>
                        
                        <button >Anmelden</button>
                    </form>
                    <p className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
                        {errMsg}
                    </p>
                   
                </section>
        </>
    )
};

export default LoginPage;