"use client"

import { useRouter } from 'next/navigation'
import Image from "next/image";
import styles from "./page.module.css";

import { SignOn, loginUser } from '@/redux/reducer/user';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';


export default function Home() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const dispatch = useDispatch();
  const userState = useSelector(state => state.user)
  const login = async() => {
    
      var User = {
        email, pass
      }

      // keanu@gmail.com
      // secret123
     
      // dispatch(loginUser(User)).unwrap();
      
      try {
        const result = await dispatch(loginUser(User)).unwrap();
        
      
          router.push('/Admin/Official', { scroll: false })
      
        // Handle success, e.g., navigate to another page
      } catch (error) {
        
        // Handle error, e.g., show an error message
      }



      // dispatch(SignOn(User))
   
    
  }

  useEffect(() => {
  
    
    if(userState.status == "failed"){
      alert("Invalid credentials, please try again.")
    }
    else if(userState.status == "succeeded"){
     router.push('/Admin/Official', { scroll: false })
    }
   
  }, [userState.status])
  

  return (
    <main className={`container-fluid ${styles.fullHeight}`}>
      <div className="row vh-100">

        <div className="col-lg-7 d-flex align-items-center justify-content-center bg-2">
          
        </div>

        <div className="col-lg-5 p-5 d-flex flex-column align-items-center justify-content-center bg-1">

    {/* u */}
          <div>
          <Image
            className='logo-size'
            src={require('../assets/central.png')}
          />
            <Image
            className='logo-size'
            src={require('../assets/taguig.png')}
          />
            <Image
            className='logo-size'
            src={require('../assets/sk.png')}
          />
          </div> 
          
          <h3 className="f-white fw-bold">
            BARANGAY CENTRAL BICUTAN
          </h3>
          <h4 className="f-white">
            DOCUMENT REQUEST SYSTEM
          </h4>

          <h5 className="f-white mt-5">
            Sign in to start your session.
          </h5>

          <div className="mb-3 mt-5 w-100">
            <input 
              value={email}
              onChange={(v) => {
                setEmail(v.target.value)
              }}
              type="email" className="form-control rounded-pill" id="exampleFormControlInput1" placeholder="Username" />
          </div>

          <div className="mb-3 w-100">
            <input 
                value={pass}
                onChange={(v) => {
                  setPass(v.target.value)
                }}
              type="email" className="form-control rounded-pill" id="exampleFormControlInput1" placeholder="Password" />
          </div>

      
          <div className="d-flex flex-column align-items-center" style={{width:"80%"}}>
          <button onClick={() => login()} type="button" className="btn fw-bold f-white w-100" style={{backgroundColor: "yellow"}}>SIGN IN</button>
            <span className="f-white align-self-end">
              Forgot password?
            </span>
          </div>

        </div>


      </div>
    </main>
  );
}
