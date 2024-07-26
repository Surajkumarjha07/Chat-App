'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Typography } from '@mui/material'
import Link from 'next/link'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'

export default function UpdateUser() {
    const [userEmail, setUserEmail] = useState<string | null>('')
    const [username, setUsername] = useState<string | null>('')
    const [updatedEmail, setUpdatedEmail] = useState<string | null>()
    const [updatedUsername, setUpdatedUserName] = useState<string | null>('')
    const [currentPassword, setCurrentPassword] = useState<string | null>('')
    const [newPassword, setNewPassword] = useState<string | null>('')
    const router = useRouter()

    useEffect(() => {
        let email = localStorage.getItem('email')
        let username = localStorage.getItem('username')
        setUserEmail(email)
        setUsername(username)
        setUpdatedEmail(email)
        setUpdatedUserName(username)
    }, [])


    function handleEmail(e: React.ChangeEvent<HTMLInputElement>) {
        setUpdatedEmail(e.target.value)
    }

    function handleUserName(e: React.ChangeEvent<HTMLInputElement>) {
        setUpdatedUserName(e.target.value)
        console.log(updatedUsername);

    }

    function handleCurrentPassword(e: React.ChangeEvent<HTMLInputElement>) {
        setCurrentPassword(e.target.value)
    }

    function handleNewPassword(e: React.ChangeEvent<HTMLInputElement>) {
        setNewPassword(e.target.value)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
        e.preventDefault()
        try {
            const response = await fetch('http://127.0.0.1:4000/updateUser', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userEmail, updatedEmail, updatedUsername, currentPassword, newPassword })
            })

            switch (response.status) {
                case 200:
                    toast("User's data updated", {
                        hideProgressBar: true,
                        autoClose: 1500,
                        type: 'success',
                        position: 'top-center',
                        bodyClassName: "toastSuccess"
                    });
                    localStorage.removeItem('email')
                    localStorage.removeItem('username')
                    localStorage.setItem('email', updatedEmail || '')
                    localStorage.setItem('username', updatedUsername || '')
                    router.push('./chat')
                    setTimeout(() => {
                        localStorage.removeItem('token')
                        localStorage.removeItem('username')
                        localStorage.removeItem('email')
                    }, 60 * 30 * 1000);
                    break;
                case 402:
                    toast("Email is already in use!", {
                        hideProgressBar: true,
                        autoClose: 1500,
                        type: 'error',
                        position: 'top-center',
                        bodyClassName: "toastError"
                    });
                    break;
                case 401:
                    toast("Enter correct password!", {
                        hideProgressBar: true,
                        autoClose: 1500,
                        type: 'error',
                        position: 'top-center',
                        bodyClassName: "toastError"
                    });
                    break;
                case 403:
                    toast("Username is already in use!", {
                        hideProgressBar: true,
                        autoClose: 1500,
                        type: 'error',
                        position: 'top-center',
                        bodyClassName: "toastError"
                    });
                    break;
                case 400:
                    toast("Enter Credentials Correctly!", {
                        hideProgressBar: true,
                        autoClose: 1500,
                        type: 'error',
                        position: 'top-center',
                        bodyClassName: "toastError"
                    });
                    break;
                case 500:
                    toast("Internal server error!", {
                        hideProgressBar: true,
                        autoClose: 1500,
                        type: 'error',
                        position: 'top-center',
                        bodyClassName: "toastError"
                    });
                    break;
                default:
                    toast("Unexpected error!", {
                        hideProgressBar: true,
                        autoClose: 1500,
                        type: 'error',
                        position: 'top-center',
                        bodyClassName: "toastError"
                    });
                    break;
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <section className='flex justify-center items-center w-full h-full text-center overflow-y-hidden'>

                <div className='w-1/2 h-screen flex justify-center items-center'>
                    <form className='bg-white relative mx-auto h-fit  w-3/5 px-10 pt-4 pb-4 rounded-xl shadow-2xl shadow-black' onSubmit={handleSubmit}>
                        <fieldset>
                            <Image src='/icon.gif' alt='Chat App' width={60} height={60} className='rounded-full mx-auto my-2' />

                            <Typography className='text-center font-bold text-xl'> Update Account</Typography>

                            <div className='mt-4 text-left'>
                                <label className='text-sm text-gray-500 font-semibold' htmlFor='updatedEmail'>New Email address </label>
                                <br />
                                <input type='text' placeholder='youremail@gmail.com' name='updatedEmail' className='h-12 mt-2 px-3 bg-customBg w-full placeholder:text-sm border-2 border-gray-200 rounded-md' value={updatedEmail || ''} onChange={handleEmail} autoFocus />

                                <label className='text-sm text-gray-500 font-semibold' htmlFor='updatedUsername'> New Username </label>
                                <br />
                                <input type='text' placeholder='your username' name='updatedUsername' className='h-12 mt-2 px-3 bg-customBg w-full placeholder:text-sm border-2 border-gray-200 rounded-md' value={updatedUsername || ''} onChange={handleUserName} />

                                <label className='text-sm text-gray-500 font-semibold' htmlFor='currentPassword'>Current Password </label>
                                <br />
                                <input type='password' placeholder='......' name='currentPassword' className='h-12 mt-2 px-3 bg-customBg w-full placeholder:text-7xl border-2 border-gray-200 rounded-md' onChange={handleCurrentPassword} />

                                <label className='text-sm text-gray-500 font-semibold' htmlFor='newPassword'>New Password </label>
                                <br />
                                <input type='password' placeholder='......' name='newPassword' className='h-12 mt-2 px-3 bg-customBg w-full placeholder:text-7xl border-2 border-gray-200 rounded-md' onChange={handleNewPassword} />

                                <div className='text-center my-4'>
                                    <input type='submit' className='w-4/5 cursor-pointer bg-green-500 hover:bg-green-600 rounded-lg py-3 text-white font-semibold' value={'Update Account'} />
                                </div>

                            </div>
                        </fieldset>
                    </form>
                </div>

                <div className='w-1/2 h-screen flex justify-center items-center'>
                    <Image src={'/Update.gif'} width={700} height={700} priority alt='SignUp' />
                </div>

            </section>
        </>
    )
}
