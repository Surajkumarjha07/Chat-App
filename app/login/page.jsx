"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import '../globals.css'
import { Typography } from '@mui/material';
import Image from 'next/image';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()

    const handleEmail = (e) => {
        setEmail(e.target.value)
    }

    const handlePassword = (e) => {
        setPassword(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            let userData = {
                email,
                password
            }
            const response = await fetch('http://127.0.0.1:4000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })
            const data = await response.json()
            
            if (response.status === 200) {
                toast("Let's have a great Chat", {
                    hideProgressBar: true,
                    autoClose: 1500,
                    type: 'success',
                    position: 'top-center',
                    bodyClassName: "toastSuccess"
                })
                localStorage.setItem('token',data.token)
                localStorage.setItem('username',data.existingUser.username)
                localStorage.setItem('email',data.existingUser.email)
                router.push('./chat')
                setTimeout(() => {
                    localStorage.removeItem('token')
                    localStorage.removeItem('username')
                    localStorage.removeItem('email')
                }, 60*30*1000);
            }
            else if (response.status === 401) {
                toast("Invalid User or Password", {
                    hideProgressBar: true,
                    autoClose: 1500,
                    type: 'error',
                    position: 'top-center',
                    bodyClassName: "toastError"
                })
            }
            else if (response.status === 404) {
                toast("User doesn't Exists", {
                    hideProgressBar: true,
                    autoClose: 1500,
                    type: 'error',
                    position: 'top-center',
                    bodyClassName: "toastError"
                })
            }
            else if(response.status === 400) {
                toast("Enter Details Correctly!", {
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
                    <Image src={'/login.gif'} width={700} height={700} />
                </div>

                <div className='w-1/2 h-screen flex justify-center'>
                    <form method='post' className='bg-white relative mx-auto h-4/5 mt-12 w-3/5 px-10 pt-4 pb-8 rounded-xl shadow-2xl shadow-black' onSubmit={handleSubmit}>
                        <fieldset>
                            <Image src='/icon.gif' alt='Chat App' width={80} height={80} className='rounded-full mx-auto my-4' />

                            <Typography className='text-center font-bold text-2xl'>Login to Account</Typography>
                            <p className='text-center text-xs text-gray-500 my-2'>Please enter your email and password to continue</p>

                            <div className='mt-8 text-left'>
                                <label className='text-sm text-gray-500 font-semibold' htmlFor='email'>Email address </label>
                                <br />
                                <input type='text' placeholder='youremail@gmail.com' name='email' className='h-12 mt-2 px-3 w-full placeholder:text-sm border-2 border-gray-200 rounded-md' autoFocus onChange={handleEmail}/>
                                <br /><br />

                                <label className='text-sm text-gray-500 font-semibold' htmlFor='password'>Password </label>
                                <br />
                                <input type='password' placeholder='......' name='password' className='h-12 mt-2 px-3 w-full placeholder:text-7xl border-2 border-gray-200 rounded-md' onChange={handlePassword}/>

                                <div className='flex justify-between items-center my-4'>
                                    <div className='flex items-center justify-center'>
                                        <input type='checkbox' defaultChecked className='h-5 w-5 rounded-lg mr-2 border-gray-700' />
                                        <span className='text-sm text-gray-500 font-medium'>Remember Password</span>
                                    </div>
                                    <p className='text-sm text-gray-500 font-medium'>Forget Password?</p>
                                </div>

                                <div className='text-center my-4'>
                                    <input type='submit' className='w-4/5 cursor-pointer bg-green-500 rounded-lg py-3 text-white font-semibold' value={'Sign In'} />
                                </div>

                                <p className='text-center text-sm text-gray-500 font-medium '>Don&apos;t have an account? <Link href={'./signUp'} className='text-sm text-green-500 underline'> Create Account</Link></p>
                            </div>
                        </fieldset>
                    </form>
                </div>

            </section>
        </>
    );
}

export default Login
