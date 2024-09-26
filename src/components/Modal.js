import { generateOTPForgotapi, otpChangePasswordForgotApi } from '@/redux/reducer/user'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'



export const ForgotModal = (props) => {
    const dispatch = useDispatch();

    const [isChangePass, setIsChangePass] = useState(1)
    const [success, setSuccess] = useState(false)

    const [email, setEmail] = useState('')
    const [newPass, setNewPass] = useState('')
    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)

    const submitChangePass = async () => {
        let merge = {
            email,
            newPass,
            otp
        }
       

        try {
            
            
            const result = await dispatch( otpChangePasswordForgotApi(merge)).unwrap();
            
            if(!result.error){

                setSuccess(false)
                setEmail('')
                alert("Success in changing your password.")
            }
            else{
                alert('Invalid OTP or email address, please try again.')
                
            }
            
      
            // Handle success, e.g., navigate to another page
          } catch (error) {
            alert('Invalid OTP or email address, please try again.')
            // Handle error, e.g., show an error message
          }
    }

    const requestOTP = async () => {
        let merge = {
            email,
            change_pass: 1
        }
       

        try {
            
            
            const result = await dispatch( generateOTPForgotapi(merge)).unwrap();
      
            if(!result.error){

                setSuccess(true)
                setEmail('')
                setOtp('')
                setNewPass('')
            }
            else{
                alert('Invalid email address, please try again.')
                setSuccess(false)
            }
            
      
            // Handle success, e.g., navigate to another page
          } catch (error) {
            
            // Handle error, e.g., show an error message
          }
      
    }

    const checkDisabled = () => {

        if(success){

            if(email == "" || newPass == "" || otp == ""){
                return true
            }
            else{
                return false
            }
        }
        else if(!success){
            if(email == ""){
                return true
            }
            else {
                return false
            }
        }
    }
    return (
        <div className=' d-flex align-items-center justify-content-center position-absolute' style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9, top: 0, left: 0, width: '100%', height: '100%' }}>


            <div className='col-6 p-5 rounded' style={{ backgroundColor: "white" }}>

                <h3>
                    Forgot Password
                </h3>

                <div class="mb-3 mt-5">
                    <label for="exampleFormControlInput1" class="form-label">Email address</label>
                    <input 
                        value={email}
                        onChange={(v) => {
                            setEmail(v.target.value)
                        }}
                        type="email" class="form-control" id="exampleFormControlInput1" />
                </div>


                {
                    success &&

                    <div>
                         <div class="mb-3">
                            <label for="exampleFormControlInput1" class="form-label">OTP</label>
                            <input
                            value={otp}
                            onChange={(v) => {
                                setOtp(v.target.value)
                            }}
                            type="email" class="form-control" id="exampleFormControlInput1" />
                        </div>

                        <div class="mb-3">
                            <label for="exampleFormControlInput1" class="form-label">New password</label>
                            <input 
                            value={newPass}
                                 onChange={(v) => {
                                    setNewPass(v.target.value)
                                }}
                            type="email" class="form-control" id="exampleFormControlInput1" />
                        </div>

                       

                    </div>
                }

                <button
                    disabled={checkDisabled()}
                    onClick={() => success ? submitChangePass() : requestOTP()} type="button" className="btn fw-bold f-white w-100  mybutton">{success ? "Change password" : "Request OTP"}</button>
                <button onClick={props.close} type="button" className="btn fw-bold f-white w-100 mt-3  mybutton" style={{backgroundColor:"red"}}>Close</button>

            </div>


        </div>
    )
}