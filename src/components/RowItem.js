'use client'

import React from 'react'


export const HeaderItem = (props) => {

    return(
        <div style={props.style} className='col-lg-1 d-flex align-items-center pb-3 pt-3 justify-content-center'>
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
        <div className='col-lg-1 d-flex align-items-center pb-3 pt-3 justify-content-center' >
          {/* <span className='f-white'> */}
          {props.children}
          {/* </span> */}
        </div>
    )
}