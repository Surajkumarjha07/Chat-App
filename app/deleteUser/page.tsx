'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Typography } from '@mui/material'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

export default function DeleteUser() {
    const [password, setPassword] = useState<string | null>('')
    const [userEmail, setUserEmail] = useState<string | null>('')
    const router = useRouter()

    useEffect(() => {
        let email = localStorage.getItem('email')
        setUserEmail(email)
    }, [])

    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }

    const handleSubmit = async (e:  React.FormEvent<HTMLElement>) => {
        e.preventDefault()
        try {
            let response = await fetch(`http://127.0.0.1:4000/deleteUser`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password, userEmail })
            })

            switch (response.status) {
                case 200:
                    toast("User deleted successfully!", {
                        hideProgressBar: true,
                        autoClose: 1500,
                        type: 'success',
                        position: 'top-center',
                        bodyClassName: "toastSuccess"
                    });
                    localStorage.removeItem('email')
                    localStorage.removeItem('username')
                    localStorage.removeItem('token')
                    router.push('./login')
                    break;

                case 401:
                    toast("Invalid Password", {
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

                default:
                    toast("Internal Server Error", {
                        hideProgressBar: true,
                        autoClose: 1500,
                        type: 'error',
                        position: 'top-center',
                        bodyClassName: "toastError"
                    });
                    break;
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <section className='flex justify-center items-center w-full h-full text-center overflow-y-hidden'>

                <div className='w-1/2 h-screen flex justify-center items-center'>
                    <form className='bg-white relative mx-auto h-fit  w-3/5 px-10 pt-4 pb-4 rounded-xl shadow-2xl shadow-black' onSubmit={handleSubmit}>
                        <fieldset>
                            <Image src='/icon.gif' alt='Chat App' width={60} height={60} className='rounded-full mx-auto my-2' />

                            <Typography className='text-center font-bold text-xl'> Update Account</Typography>

                            <div className='mt-4 text-left'>

                                <label className='text-sm text-gray-500 font-semibold' htmlFor='password'> Enter Password </label>
                                <br />
                                <input type='text' placeholder='your password' name='password' className='h-12 mt-2 px-3 bg-customBg w-full placeholder:text-sm border-2 border-gray-200 rounded-md' value={password || ''} onChange={handlePassword} />

                                <div className='text-center my-4'>
                                    <input type='submit' className='w-4/5 cursor-pointer bg-red-500 hover:bg-red-600 rounded-lg py-3 text-white font-semibold' value={'Delete Account'} />
                                </div>

                            </div>
                        </fieldset>
                    </form>
                </div>

                <div className='w-1/2 h-screen flex justify-center items-center'>
                    <Image src={'/delete.gif'} width={700} height={700} priority alt='SignUp' />
                </div>

            </section>
        </>
    )
}
