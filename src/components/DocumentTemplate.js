'use client'

import React from 'react'

import Html from 'react-pdf-html';



// return (
//   <Document>
//     <Page>
//       <Html>{html}</Html>
//     </Page>
//   </Document>
// );

export const DocumentTemplate = () => {

    return (
        <div className='w-100 d-flex'>
            <div className='col-4 bg-green'>

                <div className='d-flex align-items-center justify-content-center mt-4'>
                <img    
                    className='ms-5'
                            style={{
                                height: "150px",
                                width: "150px"
                            }}
                            // src={require('../assets/')}
                            src='/images/central.png'
                        />
                </div>

                <div className='mt-5 d-flex alig-items-center justify-content-center'>
                    <span className='f-white fw-bold'>
                        Barangay Council
                    </span>
                </div>

                <div className='mt-5 d-flex flex-column  justify-content-center ms-3'>
                    <span className='f-white fw-bold tempate-font-officials'>
                        HON. RODOLFO E. TANGPUZ II
                    </span>
                    <span className='f-white tempate-font-officials'>
                        BARANGAY CHAIRMAN
                    </span>
                </div>

                <div className='mt-4 d-flex flex-column  justify-content-center ms-3'>
                    <span className='f-white fw-bold tempate-font-officials'>
                        HON. MARIA CECILIA T. BALMORI
                    </span>
                    <span className='f-white tempate-font-officials'>
                        KAGAWAD FOR CULTURAL & SPORT
                    </span>
                </div>

                <div className='mt-4 d-flex flex-column  justify-content-center ms-3'>
                    <span className='f-white fw-bold tempate-font-officials'>
                        HON. VENADIK M. CASTRO
                    </span>
                    <span className='f-white tempate-font-officials'>
                        KAGAWAD CHAIRMAN FOR PEACE & ORDER
                    </span>
                </div>

                <div className='mt-4 d-flex flex-column  justify-content-center ms-3'>
                    <span className='f-white fw-bold tempate-font-officials'>
                        HON. LEAH M. PEREZ
                    </span>
                    <span className='f-white tempate-font-officials'>
                        KAGAWAD
                        CHAIRMAN FOR APPROPRIATION,
                        EDUCATION & INFORMATION
                        DISSEMINATION
                    </span>
                </div>


                <div className='mt-4 d-flex flex-column  justify-content-center ms-3'>
                    <span className='f-white fw-bold tempate-font-officials'>
                        HON. CRISTINA O. SANARES
                    </span>
                    <span className='f-white tempate-font-officials'>
                        KAGAWAD
                        CHAIRMAN FOR ELDERLY & PDAO,
                        FAMILY AFFAIRS
                    </span>
                </div>


                <div className='mt-4 d-flex flex-column  justify-content-center ms-3'>
                    <span className='f-white fw-bold tempate-font-officials'>
                        HON. OLIVER G. OSANO
                    </span>
                    <span className='f-white tempate-font-officials'>
                        KAGAWAD CHAIRMAN FOR TRANSPORTATION
                    </span>
                </div>

                <div className='mt-4 d-flex flex-column  justify-content-center ms-3'>
                    <span className='f-white fw-bold tempate-font-officials'>
                        HON. PIULY B. DULANG
                    </span>
                    <span className='f-white tempate-font-officials'>
                        CHAIRMAN FOR HEALTH & ENVIRONMENT SANITATION
                    </span>
                </div>


                <div className='mt-4 d-flex flex-column  justify-content-center ms-3'>
                    <span className='f-white fw-bold tempate-font-officials'>
                        HON. ALYNN REIGN A. RAFIÑAN
                    </span>
                    <span className='f-white tempate-font-officials'>
                        SK CHAIRPERSON
                    </span>
                </div>

                <div className='mt-4 d-flex flex-column  justify-content-center ms-3'>
                    <span className='f-white fw-bold tempate-font-officials'>
                        OLGA H. CALAYO
                    </span>
                    <span className='f-white tempate-font-officials'>
                        BARANGAY SECRETARY
                    </span>
                </div>

                <div className='mt-4 d-flex flex-column  justify-content-center ms-3'>
                    <span className='f-white fw-bold tempate-font-officials'>
                        LILIA T. AMADOR
                    </span>
                    <span className='f-white tempate-font-officials'>
                        BARANGAY TREASURER
                    </span>
                </div>


            </div>

            <div className='col-8 bg-white'>
                <div className='d-flex align-items-center justify-content-center mt-5'>
                    <div>
                        <div className='d-flex flex-column align-items-center justify-content-center'>
                            <h4 className='fw-normal'>
                                REPUBLIC OF THE PHILIPPINES
                            </h4>
                            <h4 className='fw-normal'>
                                CITY OF TAGUIG
                            </h4>
                        </div>

                        <div className='d-flex flex-column align-items-center justify-content-center'>
                            <h4 className='bold'>
                                BARANGAY CENTRAL BICUTAN
                            </h4>
                        </div>
                    </div>

                    <img    
                    className='ms-5'
                            style={{
                                height: "100px",
                                width: "100px"
                            }}
                            // src={require('../assets/')}
                            src='/images/taguig.png'
                        />
                </div>


                <div className='mt-5 d-flex flex-column align-items-center justify-content-center'>
                    <h4 className='fw-normal'>
                        OFFICE OF THE BARANGAY CHAIRMAN
                    </h4>
                </div>

                <div className='mt-4 d-flex flex-column align-items-center justify-content-center'>
                    <h4 id='document-title' className=''>
                        BARANGAY CLEARANCE
                    </h4>
                </div>


                <div id='document-body' className='' style={{ height: "520px" }}>
                    {/* BODY */}
                </div>

                <div className='flex-column d-flex align-items-end pe-5'>
                    <span className='fw-bold'>
                        HON. RODOLFO E. TANGPUZ II
                    </span>
                    <span className='fst-italic'>
                        Barangay Chairman
                    </span>
                </div>


            </div>

        </div>
    )
}