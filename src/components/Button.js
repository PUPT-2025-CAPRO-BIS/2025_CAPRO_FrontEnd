'use client'
import React from 'react'


const Button = ({ onClick, children }) => {
    return (
      <div className='my-button rounded'>
        {children}
      </div>
    );
  };
  
  export default Button;