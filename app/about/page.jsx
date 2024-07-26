import React from 'react'
import Sidebar from '../components/Sidebar'
import Image from 'next/image'

export default function About() {
    return (
        <>
            <section>
                <Sidebar />
                <Image src={'/leaves.gif'} width={50} height={50} alt='leaves' className='w-screen h-screen'/>
                <section className='text-center absolute top-40 w-full'>
                    <div>
                    <h1 className='text-4xl text-green-700 font-bold'> Chatin-Go </h1>
                    <h3 className='w-[600px] mx-auto font-semibold text-green-700 mt-10'> We Provide the best Chatting support in the world. This app is made by the NextJs it&apos;s Database is MongoDB and it&apos;s backend is written in Express.js, this app has all the features like one-to-one chat and group chat you first have to LogIn to your Account if you do not have any Account then create it. Your data will be saved on the Database which is fully secure because we use bcrypt for Password Encryption. Use Our App and Chat with your Friends. </h3>
                    </div>

                </section>
            </section>
        </>
    )
}
