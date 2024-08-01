
'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';



const Auth = ({ onClick, children }) => {
    const router = useRouter()
    const [userRole, setUserRole] = useState(0)


    useEffect(() => {
        if(userRole == 0){
            // alert('You are not allowed to access this page')
            // router.push('/', { scroll: false })
        }
    })
    
    return (
      <div>
        {children}
      </div>
    );
  };
  
  export default Auth;