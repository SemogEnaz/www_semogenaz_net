"use client"

import { useState } from 'react';
import './NavBar.css';

export default function NavBar() {

    const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
    const toggleSignIn = () => setIsSigningIn(prevState => !prevState);

    return (
        <>
        <div className="nav-bar">

            <div className="">Store</div>

            <button 
                className={'sign-in-button'}
                onClick={toggleSignIn}>
                Sign {isSigningIn ? 'Out' : 'In'}
            </button>

        </div>

        {
        isSigningIn ?
            <SignInWindow setIsSigningIn={setIsSigningIn}/> :
            null
        }

        </>
    );
}

const SignInWindow = ({ setIsSigningIn }) => {

    const [isCreate, setIsCreate] = useState<boolean>(false);

    const makeRequest = async (formData: FormData, action: string): Promise<Response> => {
        return await fetch(`api/shop/user?action=${action}`, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({ 
                userName: formData.get('userName') || 'placeholder',
                email: formData.get('email'),
                password: formData.get('password')
            })
        });
    }

    const submit = async (formData: FormData) => {
    
        if (isCreate){
           const res = await makeRequest(formData, 'create');
            if (res.ok)
                // TODO: For now, console.log, later a more obvious closure
                console.log(`Account created`);
            else{
                // TODO: closure here too
                setIsSigningIn(false);
                return;
            }
        }

        // Signing the user in
        const res = await makeRequest(formData, 'signIn');
        if (!res.ok) return '';

        // TODO: Figure out where to store the token, local or cookie...
        const token = await res.json().then(data => data.Token);
        console.log(token);

        // TODO: Need more closure here
        setIsSigningIn(false);
    }

    return (
        <>
        <div className='background'></div>
        <div className='sign-in-window'>

            <h1>{isCreate ? 'Create Account' : 'Sign In'}</h1>

            <form className="center col" action={submit}>

                {isCreate ? 
                    <input type='text' name="userName" placeholder='Name' autoFocus required/> :
                    null}

                <input type="email" name="email" placeholder='Email' required/>
                <input type="password" name="password" placeholder='Password' required maxLength={10}/>
                <button type="submit" className='sign-in-button'> {isCreate ? 'Create Account' : 'Sign In'} </button>
            </form>

            <div className='center row mt-[10px]'>
                <p>{isCreate ? 'Or, ' : 'Don\'t have an account?'}&nbsp;</p>
                <div className="form-button" onClick={() => setIsCreate(prev => !prev)}> {isCreate ? 'Sign In...' : 'Create One!'} </div>
            </div>


        </div>
        </>
    );
}