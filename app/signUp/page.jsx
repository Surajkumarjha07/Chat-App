"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import '../globals.css'
import { Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
    const [email, setEmail] = useState('')
    const [username, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [profileImage, setProfileImage] = useState(null)
    const router = useRouter()

    const handleEmail = (e) => {
        setEmail(e.target.value)
    }

    const handlePassword = (e) => {
        setPassword(e.target.value)
    }

    const handleUserName = (e) => {
        setUserName(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch('http://127.0.0.1:4000/signUp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, username, password })
            })

            console.log(response);

            switch (response.status) {
                case 200: toast("Let's have a great Chat", {
                    hideProgressBar: true,
                    autoClose: 1500,
                    type: 'success',
                    position: 'top-center',
                    bodyClassName: "toastSuccess"
                })
                    router.push('./chat')
                    break;

                case 409: toast("Email already in use", {
                    hideProgressBar: true,
                    autoClose: 1500,
                    type: 'error',
                    position: 'top-center',
                    bodyClassName: "toastError"
                })
                    break;

                case 410: toast("Username already in use", {
                    hideProgressBar: true,
                    autoClose: 1500,
                    type: 'error',
                    position: 'top-center',
                    bodyClassName: "toastError"
                })
                    break;

                case 400: toast("Enter Details Correctly!", {
                    hideProgressBar: true,
                    autoClose: 1500,
                    type: 'error',
                    position: 'top-center',
                    bodyClassName: "toastError"
                })
            }
        } catch (error) {
            console.log(error);
        }

    }

    return (
        <>
            <section className='flex justify-center items-center w-full h-full text-center overflow-y-hidden'>

                <div className='w-1/2 h-screen flex justify-center items-center'>
                    <Image src={'/signup.gif'} width={700} height={700} priority alt='SignUp' />
                </div>

                <div className='w-1/2 h-screen flex justify-center items-center'>
                    <form className='bg-white relative mx-auto h-fit  w-3/5 px-10 pt-4 pb-4 rounded-xl shadow-2xl shadow-black' onSubmit={handleSubmit}>
                        <fieldset>
                            <Image src='/icon.gif' alt='Chat App' width={60} height={60} className='rounded-full mx-auto my-2' />

                            <Typography className='text-center font-bold text-xl'> Create Account</Typography>
                            <p className='text-center text-xs text-gray-500 my-2'>Please enter your Credentials to Connect with Us</p>

                            <div className='mt-4 text-left'>
                                <label className='text-sm text-gray-500 font-semibold' htmlFor='email'>Email address </label>
                                <br />
                                <input type='text' placeholder='youremail@gmail.com' name='email' className='h-12 mt-2 px-3 bg-customBg w-full placeholder:text-sm border-2 border-gray-200 rounded-md' onChange={handleEmail} autoFocus />

                                <label className='text-sm text-gray-500 font-semibold' htmlFor='username'> Username </label>
                                <br />
                                <input type='text' placeholder='your username' name='username' className='h-12 mt-2 px-3 bg-customBg w-full placeholder:text-sm border-2 border-gray-200 rounded-md' onChange={handleUserName} />

                                <label className='text-sm text-gray-500 font-semibold' htmlFor='password'>Password </label>
                                <br />
                                <input type='password' placeholder='......' name='password' className='h-12 mt-2 px-3 bg-customBg w-full placeholder:text-7xl border-2 border-gray-200 rounded-md' onChange={handlePassword} />

                                <div className='flex justify-between items-center my-4'>
                                    <div className='flex items-center justify-center'>
                                        <input type='checkbox' defaultChecked className='h-5 w-5 rounded-lg mr-2 border-gray-700' />
                                        <span className='text-sm text-gray-500 font-medium'>Remember Password</span>
                                    </div>
                                    <p className='text-sm text-gray-500 font-medium'>Forget Password?</p>
                                </div>

                                <div className='text-center my-2'>
                                    <input type='submit' className='w-4/5 cursor-pointer bg-green-500 hover:bg-green-600 rounded-lg py-3 text-white font-semibold' value={'Sign Up'} />
                                </div>

                                <p className='text-center text-sm text-gray-500 font-medium my-4'>Already have an account? <Link href={'./login'} className='text-sm text-green-500 underline'> Sign In </Link></p>
                            </div>
                        </fieldset>
                    </form>
                </div>

            </section>
        </>
    );
}

export default SignUp
