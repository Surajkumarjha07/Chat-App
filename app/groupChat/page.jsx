'use client'
import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Image from 'next/image'
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { io } from 'socket.io-client';
import '../globals.css'
import { useAppDispatch, useAppSelector } from '../redux/hooks';

export default function GroupChat() {
    const [message, setMessage] = useState('')
    const [receiveMsgArray, setreceiveMsgArray] = useState([])
    const [sendingemail, setSendingemail] = useState('')
    const [receivingEmail, setReceivingEmail] = useState('')
    const isDarkMode = useAppSelector(state => state.darkMode.isDarkMode)
    let time = new Date()

    const socket = io('http://127.0.0.1:4000', {
        withCredentials: true
    });

    useEffect(() => {
        socket.on('connect', (client) => {
            console.log('user connected');
        })

        let email = localStorage.getItem('email')
        setSendingemail(email)

    }, [])

    socket.on('user-message', (msg, email) => {
        setReceivingEmail(email),
            setreceiveMsgArray([...receiveMsgArray, { msg, email }])
    })

    const handleMessage = () => {
        if (message !== '') {
            socket.emit('message', message, sendingemail)
            setMessage('')
        }
    }

    return (
        <>
            <section>
                <Sidebar />
                <section className='h-screen w-screen overflow-hidden'>
                    <Image src={`${isDarkMode? 'https://wallpapercave.com/wp/wp7130410.jpg': 'https://www.techgrapple.com/wp-content/uploads/2016/07/WhatsApp-Chat-theme-iPhone-stock-744.jpg'}`} width={500} height={500} alt='Group Chat' className='h-screen w-full fixed' />

                    <div className={`my-div flex flex-col items-end space-y-4 h-[530px] w-full overflow-y-scroll fixed right-7 top-20 px-3 py-2 font-black`}>
                        {
                            receiveMsgArray.map(({ msg, email }, index) => (
                                email === sendingemail ?
                                    <div key={index} className={`${isDarkMode? 'bg-gray-300' : 'bg-green-400'} w-fit text-sm self-end mr-10 rounded-md px-3 py-2 font-medium max-w-96`}>
                                        {msg}
                                        <p className='text-xs text-gray-600 text-end'>
                                            {
                                                time.getHours() + ':' + time.getMinutes()
                                            }
                                        </p>
                                    </div> :
                                    <div key={index} className={`${isDarkMode? 'bg-gray-300' : 'bg-green-400'} ml-32 text-sm self-start w-fit rounded-md px-3 py-2 font-medium max-w-96`}>
                                        {msg}
                                        <p className='text-xs text-gray-600 text-end'>
                                            {
                                                time.getHours() + ':' + time.getMinutes()
                                            }
                                        </p>
                                    </div>
                            ))
                        }
                    </div>


                    <div className='flex justify-center items-center w-full gap-7 fixed bottom-8'>
                        <input type="text" name="messageBox" className='w-10/12 h-12 rounded-full px-7' placeholder='Enter Message' value={message} onChange={e => setMessage(e.target.value)} />

                        <button className=' bg-green-600 px-3 py-3 rounded-full flex justify-center items-center text-white' onClick={handleMessage}>
                            <SendRoundedIcon />
                        </button>
                    </div>

                </section>
            </section>

        </>
    )
}
