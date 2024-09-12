'use client'
import Button from "@/components/Button";
import { addResidentApi, applyNewResidentApi, createAppointmentApi, generateOTPapi, otpLoginApi } from "@/redux/reducer/resident";
import Image from "next/image";
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDropzone } from 'react-dropzone'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import 'react-quill/dist/quill.snow.css';
import { getDocumentTypeApi } from "@/redux/reducer/document";
import moment from "moment";
export default function CreateAppointment() {

    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 100);

    const dispatch = useDispatch()
    const router = useRouter()

    // const [birthday, setBirthday] = useState('1992-11-03')
    // const [email, setEmail] = useState('afeil@example.net')

    const [birthday, setBirthday] = useState('')
    const [email, setEmail] = useState('')
    const [purpose, setPurpose] = useState('')
    const [otp, setOTP] = useState('')
    const [success, setSuccess] = useState(null)
    const [successOTP, setSuccessOTP] = useState(false)

    const [accessToken, setAccessToken] = useState('')
    const [files, setFiles] = useState([]);
    const [showImage, setShowImage] = useState(false)
    const [selectedFileForViewing, setSelectedFileForViewing] = useState('')
    const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'))
    const [selectedDoc, setSelectedDoc] = useState(0);
    const documentList = useSelector(state => state.document.list.data)

    const [showSuccess, setShowSuccess] = useState(false)
    const [message, setMessage] = useState('')

    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const [newResident, setNewResident] = useState(null)



    const [startDate, setStartDate] = useState();
    const [resident, setResident] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        pass: '',
        birthday: '',
        cell_number: '',
        civil_status_id: '',
        male_female: '',
        current_address: '',
        voter_status: '',
        file_upload: ''
    })



    useEffect(() => {

        if (accessToken != "") {
            getDocumentList()
        }
    }, [accessToken])


    const onDrop = useCallback((acceptedFiles) => {
        // Convert files to base64 and update state
        const fileReaders = acceptedFiles.map(file => {
            const reader = new FileReader();

            return new Promise((resolve, reject) => {
                reader.onloadend = () => {
                    resolve({
                        fileName: file.name,
                        base64: reader.result
                    });
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });

        Promise.all(fileReaders)
            .then(filesWithBase64 => {
                // Update state with new files
                setFiles(prevFiles => [...prevFiles, ...filesWithBase64]);

                

            })
            .catch(error => {
                // Handle error

            });
    }, []);



    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop, accept: {
            'image/*': [] // Accept only image files
        }
    })


    const getDocumentList = async () => {
        let data = {
            token: accessToken,
            currentPage: 1,
            searchItemList: ''
        }




        try {
            const result = await dispatch(getDocumentTypeApi(data)).unwrap();




            // Handle success, e.g., navigate to another page
        } catch (error) {

            // Handle error, e.g., show an error message
        }


        //   fetchData();

    }



    const submit = () => {

        let merge = {
            email,
            birthday
        }

        const fetchData = async () => {

            try {
                const result = await dispatch(generateOTPapi(merge)).unwrap();
                if (result.error) {
                    setShowSuccess(true)
                    setMessage(result.error_msg)
                }
                else {
                    setIsButtonDisabled(true)
                    setSuccess(result.success)
                }
                // Handle success, e.g., navigate to another page

            } catch (error) {

                // Handle error, e.g., show an error message
            }
        };

        fetchData();

    }

    const addResident = async () => {






        if (resident.first_name == "") {
            document.getElementById('fnameinput').style.border = '1px solid red'
        }

        if (resident.last_name == "") {
            document.getElementById('lnameinput').style.border = '1px solid red'
        }


        if (resident.email == "") {
            document.getElementById('emailinput').style.border = '1px solid red'
        }

        if (resident.birthday == "") {
            // document.getElementById('bdayinput').style.border = '1px solid red'
        }

        if (resident.cell_number == "") {
            document.getElementById('phoneinput').style.border = '1px solid red'
        }
        if (resident.current_address == "") {
            document.getElementById('addressinput').style.border = '1px solid red'
        }

        if (resident.current_address == "") {
            document.getElementById('addressinput').style.border = '1px solid red'
        }

        if (resident.voter_status === "") {
            document.getElementById('voterinput').style.border = '1px solid red'
        }

        if (resident.civil_status_id == "") {
            document.getElementById('civilinput').style.border = '1px solid red'
        }

        if (resident.first_name != "" && resident.last_name != "" && resident.birthday != "" && resident.cell_number != ""
            && resident.male_female !== "" && resident.civil_status_id != ""

        ) {

            let base64List = []
            
            files.map((i, k) => {

                base64List.push(JSON.stringify({
                    data: i.base64,
                    file_name: i.fileName
                }))
            })

            image: {

            }


            let merge = {
                resident,
                birthday: startDate,
                file_upload: base64List
                // token: token.token
            }

            

            try {
                const result = await dispatch(applyNewResidentApi(merge)).unwrap();

                if (result.success == true) {
                    setSuccess(true)
                    setShowSuccess(true)
                    setMessage(`Successfully registered, kindly wait for the approval.`)
                    setResident({
                        first_name: '',
                        middle_name: '',
                        last_name: '',
                        email: '',
                        pass: '',
                        birthday: '',
                        cell_number: '',
                        civil_status_id: '',
                        male_female: '',
                        current_address: '',
                        voter_status: 0,
                        file_upload: ''
                    })
                    setFiles([])
                    setNewResident(null)
                }
                else {
                    setSuccess(false)
                    setShowSuccess(true)
                }
            }
            catch (error) {

            }





        }


    }


  

    const submitOTP = () => {

        let merge = {
            email,
            otp
        }

        const fetchData = async () => {

            try {

                const result = await dispatch(otpLoginApi(merge)).unwrap();


                // Handle success, e.g., navigate to another page

                if (result.success) {
                    setSuccessOTP(result.success)
                    setAccessToken(result.access_token)
                    setIsButtonDisabled(true)
                }
                else {
                    setShowSuccess(true)
                    setMessage(result.error_msg)
                    setIsButtonDisabled(true)
                }


            } catch (error) {

                // Handle error, e.g., show an error message
            }
        };

        fetchData();
    }

    const createAppoint = async () => {

        let base64List = []

        files.map((i, k) => {
            let item = {
                data: i.base64,
                file_name: i.fileName
            };
            let encoded = JSON.stringify(item);
            base64List.push(encoded);
        })

        let data = {
            id: selectedDoc,
            selectedDate: moment(selectedDate).format('YYYY-MM-DD'),
            file_upload: base64List,
            token: accessToken,
            purpose: purpose
        }



        try {

            const result = await dispatch(createAppointmentApi(data)).unwrap();

            console.log(result.success, "--> nani")


            if (result.success = true) {
                setSuccess(true)
                setIsButtonDisabled(false)
                setMessage("Successfully created an appointment please check your email for more details")
                setShowSuccess(true)
                setSuccessOTP(false)
                setAccessToken('')
                setOTP('')
                setFiles([])
                setPurpose('')

            }
            else {
                setMessage("Something went wrong.")
                setShowSuccess(true)
            }

            // Handle success, e.g., navigate to another page


        } catch (error) {

            // Handle error, e.g., show an error message
        }

    }


    useEffect(() => {
        //rotp
        // 


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        let momentDate = moment(birthday, 'YYYY-MM-DD', true).isValid();


        if (emailRegex.test(email) && momentDate) {


            setIsButtonDisabled(false)
        }
        else {

            setIsButtonDisabled(true)
        }

    }, [email, birthday])


    useEffect(() => {
        //rotp



        if (selectedDate != "" && selectedDoc != "" && files.length != 0) {


            setIsButtonDisabled(false)
        }
        else {

            setIsButtonDisabled(true)
        }

    }, [selectedDate, selectedDoc, files.length])



    return (
        <main >
            <div className="d-flex bg-3 bg-white  align-items-center flex-column" style={{ overflow: "scroll" }}>
                <div>
                    <Image
                        className='logo-size'
                        src={require('../../../../assets/central.png')}
                    />
                    <Image
                        className='logo-size'
                        src={require('../../../../assets/taguig.png')}
                    />
                    <Image
                        className='logo-size'
                        src={require('../../../../assets/sk.png')}
                    />
                </div>

                <div className="d-flex flex-column align-items-center justify-content-center w-100 p-5 rounded bg-green mt-3 mb-5">

                    <h1 className="f-white">
                        BARANGAY CENTRAL BICUTAN
                    </h1>

                    <span className="f-white">
                        Sunflower Street, Taguig City, Metro Manila
                    </span>
                </div>


                {
                    newResident == null &&
                    <>

                        <div className="d-flex align-items-center justify-content-around col-6" style={{ height: "50%" }}>

                            <div
                                onClick={() => {
                                    setNewResident(false)
                                }}
                                className="pointer col-5 box bg-green p-5 d-flex align-items-center justify-content-center rounded flex-column">
                                <i class="bi bi-person-check" style={{ fontSize: "56px" }}></i>
                                Registered
                            </div>

                            <div
                                onClick={() => {
                                    setNewResident(true)
                                }}
                                className="pointer col-5 box bg-yellow p-5 d-flex align-items-center justify-content-center rounded rounded flex-column">
                                <i class="bi bi-person-add" style={{ fontSize: "56px" }}></i>
                                Unregistered
                            </div>

                        </div>
                    </>
                }




                {
                    newResident == true &&

                    <div className=" schedule-form p-4 col-6 rounded" style={{}}>
                        <h4>
                            Enter your details below:
                        </h4>
                        <div class="mb-3">
                            <label class="form-label">First name</label>
                            <input
                                id='fnameinput'
                                value={resident.first_name}
                                onChange={(val) => {

                                    if (val.target.value != "") {
                                        document.getElementById('fnameinput').style.border = '1px solid #dee2e6'
                                    }
                                    else {
                                        document.getElementById('fnameinput').style.border = '1px solid red'
                                    }

                                    setResident({
                                        ...resident, ...{
                                            first_name: val.target.value
                                        }
                                    })

                                }}
                                class="form-control" />

                        </div>

                        <div class="mb-3">
                            <label class="form-label">Middle name</label>
                            <input
                                value={resident.middle_name}
                                onChange={(val) => {

                                    setResident({
                                        ...resident, ...{
                                            middle_name: val.target.value
                                        }
                                    })

                                }}
                                class="form-control" />

                        </div>

                        <div class="mb-3">
                            <label class="form-label">Last name</label>
                            <input
                                id='lnameinput'
                                value={resident.last_name}
                                onChange={(val) => {

                                    if (val.target.value != "") {
                                        document.getElementById('lnameinput').style.border = '1px solid #dee2e6'
                                    }
                                    else {
                                        document.getElementById('lnameinput').style.border = '1px solid red'
                                    }

                                    setResident({
                                        ...resident, ...{
                                            last_name: val.target.value
                                        }
                                    })

                                }}
                                class="form-control" />

                        </div>

                        <div class="mb-3">
                            <label class="form-label">Email</label>
                            <input
                                id='emailinput'
                                value={resident.Email == undefined ? resident.email : resident.Email}
                                onChange={(val) => {
                                    if (val.target.value != "") {
                                        document.getElementById('emailinput').style.border = '1px solid #dee2e6'
                                    }
                                    else {
                                        document.getElementById('emailinput').style.border = '1px solid red'
                                    }
                                    setResident({
                                        ...resident, ...{
                                            email: val.target.value
                                        }
                                    })

                                }}
                                class="form-control" />

                        </div>

                        <div class="mb-3 d-flex flex-column">
                            <label class="form-label">Birthday</label>
                            <span>{resident.birthday}</span>
                            <Calendar
                                id='bdayinput'
                                className="mt-3"
                                value={resident.birthday}
                                onChange={(v) => {
                                    // document.getElementById('bdayinput').style.border = '1px solid #dee2e6'

                                    setResident({
                                        ...resident, ...{
                                            birthday: moment(v).format("YYYY-MM-DD")
                                        }
                                    })
                                    setStartDate(moment(v).format("YYYY-MM-DD"))
                                }}
                            />

                        </div>

                        <div class="mb-3">
                            <label class="form-label">Current Address</label>
                            <input
                                id='addressinput'
                                value={resident.current_address}
                                onChange={(val) => {

                                    if (val.target.value != "") {
                                        document.getElementById('addressinput').style.border = '1px solid #dee2e6'
                                    }
                                    else {
                                        document.getElementById('addressinput').style.border = '1px solid red'
                                    }

                                    setResident({
                                        ...resident, ...{
                                            current_address: val.target.value
                                        }
                                    })

                                }}
                                class="form-control" />

                        </div>


                        <div class="mb-3">
                            <label class="form-label">Phone number</label>
                            <input
                                id='phoneinput'
                                value={resident.cell_number}
                                onChange={(val) => {

                                    if (val.target.value != "") {
                                        document.getElementById('phoneinput').style.border = '1px solid #dee2e6'
                                    }
                                    else {
                                        document.getElementById('phoneinput').style.border = '1px solid red'
                                    }

                                    setResident({
                                        ...resident, ...{
                                            cell_number: val.target.value
                                        }
                                    })

                                }}
                                class="form-control" />

                        </div>



                        <div id='genderinput' class="mb-3">
                            <label class="form-label">Gender</label>
                            <div class="form-check">
                                <input
                                    checked={resident.male_female === 0 ? true : false}
                                    onChange={() => {


                                        document.getElementById('genderinput').style.border = '0px solid #dee2e6'


                                        setResident({
                                            ...resident, ...{
                                                male_female: 0
                                            }
                                        })
                                    }}
                                    class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                                <label class="form-check-label" for="flexRadioDefault2">
                                    Male
                                </label>
                            </div>
                            { }
                            <div class="form-check">
                                <input
                                    checked={resident.male_female === 1 ? true : false}
                                    onChange={() => {


                                        document.getElementById('genderinput').style.border = '0px solid #dee2e6'

                                        setResident({
                                            ...resident, ...{
                                                male_female: 1
                                            }
                                        })
                                    }}
                                    class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                                <label class="form-check-label" for="flexRadioDefault2">
                                    Female
                                </label>
                            </div>

                        </div>


                        <div class="mb-3">
                            <label class="form-label">Civil Status</label>
                            <select
                                value={resident.civil_status_id}
                                id='civilinput'
                                onChange={(v) => {
                                    document.getElementById('civilinput').style.border = '1px solid #dee2e6'
                                    setResident({
                                        ...resident, ...{
                                            civil_status_id: v.target.value
                                        }
                                    })
                                }}
                                class="form-select" aria-label="Default select example">
                                <option value="null">Civil Status</option>
                                <option value={1}>Single</option>
                                <option value={2}>Married</option>
                                <option value={3}>Widowed</option>
                                <option value={4}>Legally Separated</option>
                            </select>

                        </div>



                        <div id='voterinput' class="mb-3">
                            <label class="form-label">Voter status</label>
                            <div class="form-check">
                                <input
                                    checked={resident.voter_status === 0 ? true : false}
                                    onChange={() => {


                                        document.getElementById('voterinput').style.border = '0px solid #dee2e6'


                                        setResident({
                                            ...resident, ...{
                                                voter_status: 0
                                            }
                                        })
                                    }}
                                    class="form-check-input" type="radio" name="voter" id="voter" />
                                <label class="form-check-label" for="voter">
                                    No
                                </label>
                            </div>
                            { }
                            <div class="form-check">
                                <input
                                    checked={resident.voter_status === 1 ? true : false}
                                    onChange={() => {


                                        document.getElementById('voterinput').style.border = '0px solid #dee2e6'

                                        setResident({
                                            ...resident, ...{
                                                voter_status: 1
                                            }
                                        })
                                    }}
                                    class="form-check-input" type="radio" name='voter' id="voter" />
                                <label class="form-check-label" for="voter">
                                    Yes
                                </label>
                            </div>

                        </div>


                        <div className="mt-5 mb-5" >
                            <label class="form-label">Supporting Documents: <span className="fw-bold" style={{ color: "red" }}>Valid ID</span></label>
                            <div {...getRootProps()} style={{ borderStyle: "dotted" }}>
                                <input {...getInputProps()} />
                                {
                                    isDragActive ?
                                        <p>Drop the files here ...</p> :
                                        <p>Drag 'n' drop some files here, or click to select files</p>
                                }


                            </div>

                            <div className="mt-3">
                                {
                                    files.length != 0 && files.map((i, k) => {
                                        return (
                                            <div
                                                className="d-flex align-items-center justify-content-between mt-2"
                                            >
                                                <span
                                                    className="pointer"
                                                    onClick={() => {

                                                        setSelectedFileForViewing(i)
                                                        setShowImage(true)
                                                    }}
                                                >{i.fileName}</span>

                                                <div className="pointer"

                                                    onClick={() => {
                                                        let tmpArr = files
                                                        tmpArr.splice(k, 1);


                                                        setFiles([...tmpArr])
                                                    }}

                                                >
                                                    <i class="bi bi-trash" style={{ fontSize: "30px", color: "red" }}></i>
                                                </div>

                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>

                        <button type="button" onClick={() => {
                            addResident()
                        }} class="btn btn-primary bg-green">Submit</button>


                    </div>
                }



                {
                    newResident == false &&

                    <div className="schedule-form p-4 col-6 rounded">
                        <h4>
                            Scheduling Form
                        </h4>

                        {
                            !success &&

                            <div>
                                <div className="d-flex flex-column mt-5">
                                    <span className="">Email address</span>
                                    <input
                                        // onKeyDown={handleKeyDown}
                                        onChange={(v) => setEmail(v.target.value)}
                                        value={email}
                                        type="email" className="form-control rounded mt-3" placeholder="Enter your email" />
                                </div>

                                <div className="d-flex flex-column mt-3">
                                    <span className="">Birthday</span>
                                    <input
                                        // onKeyDown={handleKeyDown}
                                        value={birthday}
                                        onChange={(v) => setBirthday(v.target.value)}
                                        className="form-control rounded mt-3" placeholder="YYYY-MM-DD" />
                                </div>

                            </div>
                        }
                        {
                            success && !successOTP &&

                            <div className="d-flex flex-column mt-5">
                                <span className="">OTP</span>
                                <input
                                    // onKeyDown={handleKeyDown}
                                    onChange={(v) => {

                                        if (v.target.value != "") {
                                            setIsButtonDisabled(false)
                                        }
                                        else {
                                            setIsButtonDisabled(true)
                                        }
                                        setOTP(v.target.value)


                                    }}
                                    value={otp}
                                    type="email" className="form-control rounded mt-3" placeholder="Enter otp received in your email address" />
                            </div>
                        }

                        {
                            success && successOTP &&
                            <div>



                                <div className="d-flex flex-column" >

                                    <label>Select date</label>
                                    <label className="fw-bold mt-3">{selectedDate}</label>
                                    <Calendar
                                        className="mt-3"
                                        onChange={(v) => {

                                            setSelectedDate(moment(v).format("YYYY-MM-DD"))

                                        }}
                                    />
                                </div>
                                
                                <div className="d-flex flex-column mt-3">
                                    <span className="">Purpose</span>
                                    <input
                                        // onKeyDown={handleKeyDown}
                                        onChange={(v) => setPurpose(v.target.value)}
                                        value={purpose}
                                        className="form-control rounded mt-3" placeholder="Enter your purpose" />
                                </div>


                                <div className="mt-3">


                                    <label>Select service</label>

                                    <select

                                        onChange={(v) => {
                                            setSelectedDoc(v.target.value)
                                        }}
                                        class="form-select" aria-label="Default select example">

                                        {documentList.map((i, k) => {

                                            return (
                                                <option value={i.id} key={k}>{i.service}</option>
                                            )

                                        })}
                                    </select>
                                </div>


                                <div {...getRootProps()} className="mt-5" style={{ borderStyle: "dotted" }}>
                                    <input {...getInputProps()} />
                                    {
                                        isDragActive ?
                                            <p>Drop the files here ...</p> :
                                            <p>Drag 'n' drop some files here, or click to select files</p>
                                    }


                                </div>

                                <div className="mt-3">
                                    {
                                        files.length != 0 && files.map((i, k) => {
                                            return (
                                                <div
                                                    className="d-flex align-items-center justify-content-between mt-2"
                                                >
                                                    <span
                                                        className="pointer"
                                                        onClick={() => {

                                                            setSelectedFileForViewing(i)
                                                            setShowImage(true)
                                                        }}
                                                    >{i.fileName}</span>

                                                    <div className="pointer"

                                                        onClick={() => {
                                                            let tmpArr = files
                                                            tmpArr.splice(k, 1);


                                                            setFiles([...tmpArr])
                                                        }}

                                                    >
                                                        <i class="bi bi-trash" style={{ fontSize: "30px", color: "red" }}></i>
                                                    </div>

                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        }

                        {
                            !success && !successOTP &&
                            <button
                                id='rotp'
                                disabled={isButtonDisabled}
                                onClick={(v) => {
                                    submit()
                                    v.preventDefault()
                                }} type="button" class="btn btn-primary bg-green mt-5 col-12" >Request OTP</button>


                        }

                        {
                            success && !successOTP &&
                            <button
                                disabled={isButtonDisabled}
                                onClick={(v) => {
                                    submitOTP()
                                    v.preventDefault()
                                }} type="button" class="btn btn-primary bg-green mt-5 col-12" >Verify OTP</button>


                        }

                        {
                            success && successOTP &&
                            <button
                                disabled={isButtonDisabled}
                                onClick={() => {
                                    createAppoint()
                                }} type="button" class="btn btn-primary bg-green mt-5 col-12" >Create appointment</button>


                        }
                    </div>
                }

                {
                    showSuccess &&
                    <div id="statusModal " class="modal fade show d-block">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    {/* <h5 class="modal-title">Delete</h5> */}
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    {message}
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" onClick={() => setShowSuccess(false)}>Close</button>

                                </div>
                            </div>
                        </div>
                    </div>
                }

                {
                    showImage &&
                    <div id="statusModal " class="modal fade show d-flex align-items-center justify-content-center">
                        <div className="col-6  d-flex flex-column align-items-center justify-content-center box mt-5">
                            <div>
                                <h4>
                                    {selectedFileForViewing.fileName}
                                </h4>
                            </div>
                            <div class="d-flex align-items-center flex-column justify-content-center w-100 p-5" >
                                <div style={{ height: "700px", width: "100%" }}>
                                    <img
                                        style={{ position: "relative", height: "700px", width: "100%" }}
                                        src={selectedFileForViewing.base64} alt="Base64 Image" />
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" onClick={() => setShowImage(false)}>Close</button>

                                </div>
                            </div>
                        </div>
                    </div>
                }


            </div>
        </main>
    );
}
