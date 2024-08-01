'use client'

import React from 'react'


export const HeaderItem = (props) => {

    return(
        <div className='col-lg-2 d-flex align-items-center justify-content-center'>
          {/* <span className='f-white'> */}
            <span className='f-white'>
            {props.children}
            </span>
          {/* </span> */}
        </div>
    )
}

export const RowItem = (props) => {

    return(
        <div className='col-lg-2 d-flex align-items-center pb-3 pt-3 justify-content-center' >
          {/* <span className='f-white'> */}
          {props.children}
          {/* </span> */}
        </div>
    )
}