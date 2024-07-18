'use client'
import React from 'react'
import Sidebar from '../components/Sidebar'
import Avatar from '@mui/material/Avatar';
import '../globals.css'
import Image from 'next/image';
import { useEffect, useState } from 'react';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { io } from 'socket.io-client';
import '../globals.css'

export default function Chat() {
    const [allUsers, setAllUsers] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([])
    const [message, setMessage] = useState('')
    const [selectedUserEmail, setSelectedUserEmail] = useState('')
    const [selectedUserName, setSelectedUserName] = useState('')
    const [UserToChat, setUserToChat] = useState('')
    const [color, setColor] = useState('')
    const [receiveMsgArray, setreceiveMsgArray] = useState([])
    const [sendingemail, setSendingemail] = useState('')
    const [receivingEmail, setReceivingEmail] = useState('')
    let time = new Date()
    const socket = io('http://127.0.0.1:4000', {
        withCredentials: true
    });

    useEffect(() => {

        const fetchData = async () => {
            const response = await fetch(`http://localhost:4000/chat?selectedUserEmail=${selectedUserEmail}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            const data = await response.json()
            setAllUsers(data.users)
            setFilteredUsers(data.users)
            setUserToChat(data.selectedUserEmail)
        }
        fetchData()
        
    }, [])

    const handleSearch = (e) => {
        const newArray = allUsers.filter(
            user => user.username.toLowerCase().includes((e.target.value.toLowerCase()))
        )
        setFilteredUsers(newArray)
    }

    const chooseUser = (e) => {
        const div = e.target

        const userDiv = div.closest('.flex')
        const h2 = userDiv.querySelector('h2')
        const p = userDiv.querySelector('p')

        localStorage.setItem('selectedUserName', h2.innerHTML)
        localStorage.setItem('selectedUserEmail', p.innerHTML)
        setSelectedUserEmail(p.innerHTML)
        setSelectedUserName(h2.innerHTML)
    }

    useEffect(() => {
        const SelectedUserEmail = localStorage.getItem('selectedUserEmail')
        const SelectedUserName = localStorage.getItem('selectedUserName')

        if (SelectedUserEmail) {
            setSelectedUserEmail(SelectedUserEmail)
        }

        if (SelectedUserName) {
            setSelectedUserName(SelectedUserName)
        }

        let colors = ['bg-red-400', 'bg-green-500', 'bg-yellow-400', 'bg-orange-600', 'bg-gray-400', 'bg-red-700', 'bg-emerald-500']
        let color = colors[Math.floor(Math.random(0, 6) * 10)]
        setColor(color)

        let email = localStorage.getItem('email')
        setSendingemail(email)
    }, [])

    socket.on('user-message', (msg, email) => {
        setUserToChat(email),
            // setreceiveMsgArray([...receiveMsgArray, { msg, email }])
            UserToChat.chatTo.push({sendingemail,msg});
            console.log(UserToChat);
    })

    const handleMessage = () => {
        if (message !== '') {
            socket.emit('message', message, UserToChat.email)
            setMessage('')
        }
    }

    return (
        <>
            <section>
                <Sidebar />
                <section className='flex justify-center items-center'>
                    <section className='my-div h-screen w-2/6 bg-gray-50 ml-16 overflow-y-scroll overflow-x-hidden'>
                        <div className='bg-gray-50 w-full h-auto py-3 mt-16 items-center justify-between '>
                            <h2 className='text-2xl font-bold ml-8 w-full my-3 -mt-2'> Chats </h2>
                            <div className='flex justify-center px-7'>
                                <input type="search" name="search" className='w-full border-b-4 border-b-green-600 bg-gray-100 px-4 rounded-md h-8 placeholder:text-sm placeholder:text-black' placeholder='Search' onChange={handleSearch} />
                            </div>
                        </div>

                        {
                            filteredUsers?.map(user => (
                                <div key={user.id} className={`flex gap-7 rounded-xl mx-5 py-2 px-4 mt-4 cursor-pointer ${selectedUserEmail === user.email ? 'bg-gray-100 font-bold' : 'bg-gray-50'}`} onClick={chooseUser}>
                                    <div className={`rounded-full w-12 h-12 ${color} flex justify-center items-center text-2xl hover:bg-green-500 ${selectedUserName === user.username ? 'animate-bounce' : ''}`}>
                                        {user.username[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <h2 className='font-bold'>{user.username}</h2>
                                        <p>{user.email}</p>
                                    </div>
                                </div>
                            ))}

                    </section>

                    <section className='h-screen w-4/6 overflow-y-scroll overflow-x-hidden my-div'>
                        <div className='w-full h-auto bg-gray-100 opacity-75 fixed top-16'>
                            <div className={`flex gap-4 w-60 justify-start items-center rounded-xl mt-1 py-1 px-4 cursor-pointer`}>
                                <Avatar src='' />
                                <h2 className='font-bold'> {selectedUserName} </h2>
                            </div>
                        </div>

                        <Image src={'https://www.techgrapple.com/wp-content/uploads/2016/07/WhatsApp-Chat-theme-iPhone-stock-744.jpg'} alt='Chat' width={500} height={500} className='h-screen w-full' />

                        <div className='absolute top-20'>

                            <div className={`my-div flex flex-col items-end space-y-4 h-[530px] w-4/6 overflow-y-scroll fixed right-7 top-20 px-3 py-2 font-black`}>
                                {
                                        receiveMsgArray.map(({ msg, email }, index) => (
                                            email === UserToChat ?
                                                <div key={index} className='bg-green-400 w-fit self-end mt-10 mr-2 rounded-md px-3 py-2 font-medium'>
                                                    {msg}
                                                    <p className='text-xs text-gray-600 text-end'>
                                                        {
                                                            time.getHours() + ':' + time.getMinutes()
                                                        }
                                                    </p>
                                                </div> :
                                                <div key={index} className='bg-green-400 ml-20 self-start w-fit mt-10 rounded-md px-3 py-2 font-medium'>
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

                            <div className='flex justify-center w-3/5 mx-auto items-center gap-7 fixed bottom-8 right-0'>
                                <input type="text" name="messageBox" className='w-3/4 h-12 rounded-full px-7' placeholder='Enter Message' value={message} onChange={e => setMessage(e.target.value)} />

                                <button className=' bg-green-600 px-3 py-3 rounded-full flex justify-center items-center text-white' onClick={handleMessage}>
                                    <SendRoundedIcon />
                                </button>
                            </div>

                        </div>
                    </section>

                </section>

            </section>
        </>
    )
}
