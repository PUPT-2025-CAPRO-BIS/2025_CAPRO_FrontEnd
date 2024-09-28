
'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';



const Auth = ({ onClick, children }) => {
    const router = useRouter()
    const [userRole, setUserRole] = useState(0)
    const user = useSelector(state => state)

  
    useEffect(() => {
        if(user.user.signedIn == 0){
            // alert('You are not allowed to access this page')
            router.push('/', { scroll: false })
        }
    })
    
    return (
      <>
        {children}
      </>
    );
  };
  
  export default Auth;