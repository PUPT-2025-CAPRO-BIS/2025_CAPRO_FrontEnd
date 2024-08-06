'use client'

import React from 'react'

import Html from 'react-pdf-html';


let html = `
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
                                height: "120px",
                                width: "120px"
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
`

// return (
//   <Document>
//     <Page>
//       <Html>{html}</Html>
//     </Page>
//   </Document>
// );

export const IDTemplate = () => {

    <div>
        BRGY ID
    </div>
}

export const DocumentTemplate = () => {

    return (
        <div style={{ width: "100%", display: "flex" }}>
            <div style={{ backgroundColor: "#058c61", width: "20%" }}>

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

                <div
                    style={{ marginTop: "30px", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                    <span style={{ color: "white", fontWeight: "bold" }}>
                        Barangay Council
                    </span>
                </div>

                <div
                    style={{ marginTop: "30px", display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: "15px" }}
                >
                    <span
                        style={{ color: "white", fontWeight: "bold", fontSize: "10px" }}
                    >
                        HON. RODOLFO E. TANGPUZ II
                    </span>
                    <span
                        style={{ color: "white", fontSize: "10px" }}
                    >
                        BARANGAY CHAIRMAN
                    </span>
                </div>

                <div
                    style={{ marginTop: "30px", display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: "15px" }}
                >
                    <span
                        style={{ color: "white", fontWeight: "bold", fontSize: "10px" }}
                    >
                        HON. MARIA CECILIA T. BALMORI
                    </span>
                    <span
                        style={{ color: "white", fontSize: "10px" }}
                    >
                        KAGAWAD FOR CULTURAL & SPORT
                    </span>
                </div>

                <div
                    style={{ marginTop: "30px", display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: "15px" }}
                >
                    <span
                        style={{ color: "white", fontWeight: "bold", fontSize: "10px" }}
                    >
                        HON. VENADIK M. CASTRO
                    </span>
                    <span
                        style={{ color: "white", fontSize: "10px" }}
                    >
                        KAGAWAD CHAIRMAN FOR PEACE & ORDER
                    </span>
                </div>

                <div
                    style={{ marginTop: "30px", display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: "15px" }}
                >
                    <span
                        style={{ color: "white", fontWeight: "bold", fontSize: "10px" }}
                    >
                        HON. LEAH M. PEREZ
                    </span>
                    <span
                        style={{ color: "white", fontSize: "10px" }}
                    >
                        KAGAWAD
                        CHAIRMAN FOR APPROPRIATION,
                        EDUCATION & INFORMATION
                        DISSEMINATION
                    </span>
                </div>

                <div
                    style={{ marginTop: "30px", display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: "15px" }}
                >
                    <span
                        style={{ color: "white", fontWeight: "bold", fontSize: "10px" }}
                    >
                        HON. OLIVER G. OSANO
                    </span>
                    <span
                        style={{ color: "white", fontSize: "10px" }}
                    >
                        KAGAWAD CHAIRMAN FOR TRANSPORTATION
                    </span>
                </div>

                <div
                    style={{ marginTop: "30px", display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: "15px" }}
                >
                    <span
                        style={{ color: "white", fontWeight: "bold", fontSize: "10px" }}
                    >
                        HON. PIULY B. DULANG
                    </span>
                    <span
                        style={{ color: "white", fontSize: "10px" }}
                    >
                        CHAIRMAN FOR HEALTH & ENVIRONMENT SANITATION
                    </span>
                </div>

                <div
                    style={{ marginTop: "30px", display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: "15px" }}
                >
                    <span
                        style={{ color: "white", fontWeight: "bold", fontSize: "10px" }}
                    >
                        HON. ALYNN REIGN A. RAFIÑAN
                    </span>
                    <span
                        style={{ color: "white", fontSize: "10px" }}
                    >
                        SK CHAIRPERSON
                    </span>
                </div>




                <div
                    style={{ marginTop: "30px", display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: "15px" }}
                >
                    <span
                        style={{ color: "white", fontWeight: "bold", fontSize: "10px" }}
                    >
                        OLGA H. CALAYO
                    </span>
                    <span
                        style={{ color: "white", fontSize: "10px" }}
                    >
                        BARANGAY SECRETARY
                    </span>
                </div>

                <div
                    style={{ marginTop: "30px", display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: "15px" }}
                >
                    <span
                        style={{ color: "white", fontWeight: "bold", fontSize: "10px" }}
                    >
                        LILIA T. AMADOR
                    </span>
                    <span
                        style={{ color: "white", fontSize: "10px" }}
                    >
                        BARANGAY TREASURER
                    </span>
                </div>






            </div>

            <div 
                style={{backgroundClip:"white", width:"70%"}}
            >
                <div
                    style={{
                        display:"flex", alignItems:'center', justifyContent:"space-between", marginTop:"50px",
                    }}
                >
                    <div style={{width: "150px"}}>
                    </div>
                    <div>
                        <div
                            style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}
                        >
                            <h4  style={{fontWeight:"normal"}}>
                                REPUBLIC OF THE PHILIPPINES
                            </h4>
                            <h4  style={{fontWeight:"normal"}}>
                                CITY OF TAGUIG
                            </h4>
                        </div>

                        <div 
                             style={{flexDirection:"column", alignItems:"center", justifyContent:"center"}}
                        >
                            <h4  style={{fontWeight:"bold"}}>
                                BARANGAY CENTRAL BICUTAN
                            </h4>
                        </div>
                    </div>

                    <img
                        style={{
                            height: "120px",
                            width: "120px",
                            marginLeft:"50px"
                        }}
                        // src={require('../assets/')}
                        src='/images/taguig.png'
                    />
                </div>


                <div 
                    style={{display:'flex', alignItems:'center', justifyContent:"center", marginTop:"50px"}}
                >
                    <h4 className='fw-normal'>
                        OFFICE OF THE BARANGAY CHAIRMAN
                    </h4>
                </div>

                <div 
                    style={{marginTop:"50px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}
                >
                    <h4 id='document-title' >
                        BARANGAY CLEARANCE
                    </h4>
                </div>


                <div id='document-body' style={{ height: "520px" }}>
                    {/* BODY */}
                </div>

                <div className='flex-column d-flex align-items-end pe-5'
                    style={{flexDirection:"column", display:"flex", alignItems:"center", paddingRight: "50px"}}
                >
                    <span    style={{fontWeight:"bold"}}>
                        HON. RODOLFO E. TANGPUZ II
                    </span>
                    <span style={{fontStyle: "italic"}}>
                        Barangay Chairman
                    </span>
                </div>


            </div>

        </div>
    )
}