import React from 'react'
import { useUserStore } from '../stores/useUserStore'

const ProfilePage = () => {
    const {user,userInfo} = useUserStore();
    
   

    const ispresent = user.email !== undefined;

    if(ispresent===false) {
        console.log("User not found");
    }
    else{
        console.log(`hello ji  ${user.email}`);
    }


  return (
    <div>
        {/* <h1 className='text-lg text-white '>Hello {user}</h1> */}
        <h1 className=' container   mt-14 py-20'> Hello, {user.name}  </h1>
    </div>
  )
}

export default ProfilePage