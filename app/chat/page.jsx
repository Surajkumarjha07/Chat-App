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
import { useAppDispatch, useAppSelector } from '../redux/hooks';

export default function Chat() {
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedUserEmail, setSelectedUserEmail] = useState('');
    const [selectedUserName, setSelectedUserName] = useState('');
    const [color, setColor] = useState('');
    const [receiveMsgArray, setreceiveMsgArray] = useState([]);
    const [sendingemail, setSendingemail] = useState('');
    const [data, setData] = useState([]);
    const isDarkMode = useAppSelector(state => state.darkMode.isDarkMode);
    const dispatch = useAppDispatch();

    let time = new Date()

    const socket = io('http://127.0.0.1:4000', {
        withCredentials: true
    });

    useEffect(() => {
        socket.on('connect', (client) => {
            console.log('user connected');
        })

        const SelectedUserEmail = localStorage.getItem('selectedUserEmail');
        const SelectedUserName = localStorage.getItem('selectedUserName');

        if (SelectedUserEmail) {
            setSelectedUserEmail(SelectedUserEmail);
        }

        if (SelectedUserName) {
            setSelectedUserName(SelectedUserName);
        }

        let colors = ['bg-red-400', 'bg-green-500', 'bg-yellow-400', 'bg-orange-600', 'bg-gray-400', 'bg-red-700', 'bg-emerald-500'];
        let color = colors[Math.floor(Math.random() * colors.length)];
        setColor(color);

        let email = localStorage.getItem('email');
        setSendingemail(email);

        return () => {
            socket.on('disconnect', (client) => {
                console.log('user connected');
            })    
        }
    }, []);

    const fetchData = async () => {
        const response = await fetch(`http://localhost:4000/chat?toUser=${selectedUserEmail}&userMsg=${message}&fromUser=${sendingemail}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json();
        setAllUsers(data.users);
        setFilteredUsers(data.users);
        let { receiverChat } = data
        setreceiveMsgArray(receiverChat)
    }

    useEffect(() => {
        if (selectedUserEmail) {
            fetchData();
        }
    }, [selectedUserEmail]);

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

    socket.on('user-message', (sender, receiver, userMsg) => {
        setreceiveMsgArray([...receiveMsgArray, { sender, receiver, userMsg }])
    })

    const handleMessage = () => {
        if (message !== '') {
            socket.emit('message', sendingemail, selectedUserEmail, message)
            setMessage('')
            fetchData()
        }
    }

    return (
        <>
            <section>
                <Sidebar />
                <section className='flex justify-center items-center'>
                    <section className={`my-div h-screen w-2/6 ${isDarkMode ? 'bg-gray-500' : 'bg-gray-50'} ml-16 overflow-y-scroll overflow-x-hidden`}>
                        <div className={`${isDarkMode ? 'bg-gray-500 text-white' : 'bg-gray-50'} w-full h-auto py-3 mt-16 items-center justify-between`}>
                            <h2 className='text-2xl font-bold ml-8 w-full my-3 -mt-2'> Chats </h2>
                            <div className='flex justify-center px-7'>
                                <input type="search" name="search" className={`w-full border-b-4 border-b-green-600 ${isDarkMode ? 'bg-gray-400 placeholder:text-white' : 'bg-gray-100 placeholder:text-black'} px-4 rounded-md h-8 placeholder:text-sm`} placeholder='Search' onChange={handleSearch} />
                            </div>
                        </div>

                        {
                            filteredUsers?.map(user => (
                                <div key={user.id} className={`flex gap-7 rounded-xl mx-5 py-2 px-4 mt-4 cursor-pointer ${selectedUserEmail === user.email ? `${isDarkMode ? 'bg-gray-600 font-bold text-white' : 'bg-gray-100 font-bold'}` : `${isDarkMode ? 'bg-gray-500 text-white' : 'bg-gray-50'}`}`} onClick={chooseUser}>
                                    <div className={`rounded-full w-12 h-12 ${color} flex justify-center items-center text-2xl ${selectedUserName === user.username ? 'animate-bounce' : ''}`}>
                                        {user.username[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <h2 className='font-bold'>{user.username}</h2>
                                        <p className='text-xs w-fit'>{user.email}</p>
                                    </div>
                                </div>
                            ))}

                    </section>

                    <section className='h-screen w-4/6 overflow-x-hidden my-div'>
                        <div className={`${isDarkMode ? 'bg-gray-500 text-white' : 'bg-gray-100'} z-20 w-full h-auto fixed top-16`}>
                            <div className={`flex gap-4 w-60 justify-start items-center rounded-xl mt-1 py-1 px-4 cursor-pointer`}>
                                <Avatar src='' />
                                <h2 className='font-bold'> {selectedUserName} </h2>
                            </div>
                        </div>

                        <Image src={`${isDarkMode ? 'https://wallpapercave.com/wp/wp7130410.jpg' : 'https://www.techgrapple.com/wp-content/uploads/2016/07/WhatsApp-Chat-theme-iPhone-stock-744.jpg'}`} alt='Chat' width={500} height={500} className='h-screen w-full' />

                        <div className='absolute top-20'>

                            <div className={`my-div flex flex-col items-end space-y-4 h-[530px] w-4/6 overflow-y-scroll fixed right-2 top-20 px-3 py-2 font-black`}>
                                {
                                    receiveMsgArray?.map(({ sender, receiver, userMsg }, index) => (
                                        ((sender === sendingemail && receiver === selectedUserEmail) || (sender === selectedUserEmail && receiver === sendingemail)) ?

                                            sender === sendingemail ?
                                                <div className='w-full flex justify-end mt-10'>
                                                    <div key={index} className={`${isDarkMode ? 'bg-gray-300' : 'bg-green-400'} w-fit text-sm rounded-md px-3 py-2 font-medium`}>
                                                        {userMsg}
                                                        <p className='text-xs text-gray-600 text-end'>
                                                            {
                                                                time.getHours() + ':' + time.getMinutes()
                                                            }
                                                        </p>
                                                    </div>
                                                </div> :
                                                <div className='w-full flex justify-start mt-10'>
                                                    <div key={index} className={`${isDarkMode ? 'bg-gray-300' : 'bg-green-400'} w-fit text-sm ml-16 rounded-md px-3 py-2 font-medium`}>
                                                        {userMsg}
                                                        <p className='text-xs text-gray-600 text-end'>
                                                            {
                                                                time.getHours() + ':' + time.getMinutes()
                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                            : ""
                                    ))
                                }
                            </div>

                            <div className='flex justify-center w-3/5 mx-auto items-center gap-7 fixed bottom-8 right-0'>
                                <input type="text" name="messageBox" className='w-3/4 h-12 rounded-full px-7' placeholder='Enter Message' value={message} onChange={e => setMessage(e.target.value)}/>

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
