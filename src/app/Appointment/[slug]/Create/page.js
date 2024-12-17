'use client'
import Button from "@/components/Button";
import { addResidentApi, applyNewResidentApi, checkDateAvailabilityApi, createAppointmentApi, generateOTPapi, otpLoginApi, updateEmailApi } from "@/redux/reducer/resident";
import Image from "next/image";
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";
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

    const [isDateValid, setIsDateValid] = useState(false);

    const [birthday, setBirthday] = useState('')
    const [showCalendar, setShowCalendar] = useState(false);
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

    const [hasAgreedToPrivacy, setHasAgreedToPrivacy] = useState(false);
    const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
    const webcamRef = useRef(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);

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
        voter_status: '',
        file_upload: '',
        block: '',
        lot: '',
        purok: '',
        street: '',
        household: '',
        house_and_lot_ownership: '',
        living_with_owner: '',
        renting: '',
        relationship_to_owner: '',
        pet_details: '',
        pet_vaccination: ''
    })

    const [resetEmail, setResetEmail] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [oldEmail, setOldEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');

    const toggleResetEmailForm = () => {
      setResetEmail(!resetEmail);
    };

    const validateForm = () => {
      if (!firstName || !lastName || !birthday || !oldEmail || !newEmail) {
        setMessage("All fields are required.");
        setShowSuccess(true);
        return false;
      }
      return true;
    };

    const updateEmail = async () => {
      if (!validateForm()) return;
      // Prepare the data to send
      let data = {
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        birthday: moment(birthday).format('YYYY-MM-DD'),
        old_email: oldEmail,
        new_email: newEmail,
      };
    
      try {
        // Call the API using a Redux thunk or direct Axios call
        const result = await dispatch(updateEmailApi(data)).unwrap();
    
        // Handle response
        if (result.success) {
          setMessage("Email updated successfully. Please check your new email for verification.");
          setShowSuccess(true);
          // Optionally reset the form
          setResetEmail(false);
          setFirstName('');
          setMiddleName('');
          setLastName('');
          setBirthday('');
          setOldEmail('');
          setNewEmail('');
        } else {
          setMessage(result.message || "Failed to update email.");
          setShowSuccess(true);
        }
      } catch (error) {
        setMessage(error);
        setShowSuccess(true);
      }
    };    

    useEffect(() => {

        if (accessToken != "") {
            getDocumentList()
        }
    }, [accessToken])

    const handlePrivacyChange = () => {
        setHasAgreedToPrivacy(!hasAgreedToPrivacy); // Toggle checkbox state
    };


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



    const captureImage = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setFiles((prevFiles) => [
            ...prevFiles,
            { fileName: `captured_image_${Date.now()}.jpg`, base64: imageSrc },
        ]);
        setIsCameraOpen(false); // Close the camera after capturing
    };


    const getDocumentList = async () => {
        let data = {
            token: accessToken,
            currentPage: 1,
            searchItemList: '',
            per_page: 999999999
        }




        try {
            const result = await dispatch(getDocumentTypeApi(data)).unwrap();




            // Handle success, e.g., navigate to another page
        } catch (error) {

            // Handle error, e.g., show an error message
        }


        //   fetchData();

    }

    const handleBirthdateChange = (date) => {
      setBirthday(moment(date).format('YYYY-MM-DD'));
      setShowCalendar(false);
    };

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

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let validateEmail = emailPattern.test(resident.email);


        const numberPattern = /^09\d{9}$/;
        let validateNumber = numberPattern.test(resident.cell_number);


        if (resident.first_name == "") {
            document.getElementById('fnameinput').style.border = '1px solid red'
        }

        if (resident.middle_name == "") {
            document.getElementById('mnameinput').style.border = '1px solid red'
        }

        if (resident.last_name == "") {
            document.getElementById('lnameinput').style.border = '1px solid red'
        }

        if (!hasAgreedToPrivacy) { // Check if privacy statement is agreed upon
            alert("You must agree to the privacy policy before proceeding.");
            return;
        }

        if (resident.email == "" || !validateEmail) {
            document.getElementById('emailinput').style.border = '1px solid red'
        }

        if (resident.birthday == "") {
            // document.getElementById('bdayinput').style.border = '1px solid red'
        }

        if (resident.cell_number == "" || !validateNumber) {
            document.getElementById('phoneinput').style.border = '1px solid red'
        }

        if (resident.male_female === "") {
            document.getElementById('genderinput').style.border = '1px solid red';
        }

        if (resident.voter_status === "") {
            document.getElementById('voterinput').style.border = '1px solid red'
        }

        if (resident.civil_status_id == "") {
            document.getElementById('civilinput').style.border = '1px solid red'
        }

        if (resident.block == "") {
            document.getElementById('blockinput').style.border = '1px solid red';
        }
    
        if (resident.lot == "") {
            document.getElementById('lotinput').style.border = '1px solid red';
        }
    
        if (resident.purok == "") {
            document.getElementById('purokinput').style.border = '1px solid red';
        }
    
        if (resident.street == "") {
            document.getElementById('streetinput').style.border = '1px solid red';
        }
    
        if (resident.household == "") {
            document.getElementById('housenoinput').style.border = '1px solid red';
        }
    
        if (resident.relationship_to_owner == "") {
            document.getElementById('relationinput').style.border = '1px solid red';
        }
    
        if (resident.pet_details == "") {
            document.getElementById('haspetsinput').style.border = '1px solid red';
        }
    
        if (resident.house_and_lot_ownership == "") {
            alert("Please select House and Lot Ownership.");
        }
    
        if (resident.living_with_owner == "") {
            alert("Please select Living with Owner.");
        }
    
        if (resident.renting == "") {
            alert("Please select Renting.");
        }
        if (files.length === 0) {
            alert("Please capture at least one supporting document before submitting.");
        }

        if (
            resident.first_name != "" &&
            resident.middle_name != "" &&
            resident.last_name != "" &&
            resident.email != "" &&
            validateEmail &&
            resident.birthday != "" &&
            resident.cell_number != "" &&
            validateNumber &&
            resident.block != "" &&
            resident.lot != "" &&
            resident.purok != "" &&
            resident.street != "" &&
            resident.household != "" &&
            resident.relationship_to_owner != "" &&
            resident.pet_details != "" &&
            resident.civil_status_id != "" &&
            resident.voter_status !== "" &&
            resident.male_female !== "" &&
            resident.house_and_lot_ownership != "" &&
            resident.living_with_owner != "" &&
            resident.renting != "" &&
            files.length > 0
        ) {

            let base64List = files.map((file) =>
                JSON.stringify({
                    data: file.base64,
                    file_name: file.fileName,
                })
            );

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
                        voter_status: 0,
                        file_upload: '',
                        block: "",
                        lot: "",
                        purok: "",
                        street: "",
                        household: "",
                        relationship_to_owner: "",
                        pet_details: "",
                        house_and_lot_ownership: "",
                        living_with_owner: "",
                        renting: "",
                    })
                    setFiles([])
                    setNewResident(null)
                }
                else {
                    setMessage(result.error_msg || 'An error occurred');
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

                setShowSuccess(true)
                setMessage("Invalid OTP")
                setIsButtonDisabled(true)
                // Handle error, e.g., show an error message
            }
        };

        fetchData();
    }

    const handleDateChange = async (v) => {
      const selectedDate = moment(v).format('YYYY-MM-DD');
      setSelectedDate(selectedDate);
  
      try {
          const result = await dispatch(checkDateAvailabilityApi({ selectedDate, token: accessToken })).unwrap();
  
          if (result.error) {
              setMessage(result.message);
              setShowSuccess(true);
              setIsDateValid(false);  
          } else {
              setIsDateValid(true);
          }
      } catch (error) {
          console.error('Error checking date availability:', error);
          setIsDateValid(false);
      }
    };
  

    const createAppoint = async () => {

        if (!isDateValid) {
          setMessage("The selected date is full. Please choose another date.");
          setShowSuccess(true);
          return;
        }

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


            if (result.error == false || result.success == true) {
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
                setMessage(result.error_msg)
                setShowSuccess(true)
            }

            // Handle success, e.g., navigate to another page


        } catch (error) {
            setMessage("Something went wrong.")
            setShowSuccess(true)
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



        if (selectedDate != "" && selectedDoc != "" && files.length != 0 && purpose != "") {


            setIsButtonDisabled(false)
        }
        else {

            setIsButtonDisabled(true)
        }

    }, [selectedDate, selectedDoc, files.length, purpose])



    return (
        <main>
            <div className="d-flex bg-3 bg-white align-items-center flex-column" style={{ overflow: "scroll" }}>
                {newResident !== null && (
                    <>
                        <div>
                            <Image 
                                className="logo-size" 
                                src={require('../../../../assets/central.png')} />
                            <Image 
                                className="logo-size" 
                                src={require('../../../../assets/taguig.png')} />
                            <Image 
                                className="logo-size" 
                                src={require('../../../../assets/sk.png')} />
                        </div>

                        <div className="d-flex flex-column align-items-center justify-content-center w-100 p-2 rounded bg-green mt-3 mb-5">
                            <h1 className="f-white">BARANGAY CENTRAL BICUTAN</h1>
                            <span className="f-white">Sunflower Street, Taguig City, Metro Manila</span>
                        </div>
                    </>
                )}

                {newResident === null && (
                  <div className="container mt-5">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-8 col-lg-7">
                            <div className="logo-bg" style={{ height: "350px", width: "100%" }}></div>
                        </div>
                    </div>
                    <div className="row justify-content-center mt-3">
                        <div className="col-12 col-md-8 col-lg-7">
                            <button
                                onClick={() => setNewResident(false)}  // Change state to show form
                                type="button"
                                className="btn fw-bold f-white w-100 bg-yellow d-flex align-items-center justify-content-center"
                                style={{ padding: "10px", fontSize: "1rem" }}  // Use rem units for font size
                            >
                                <i className="bi bi-calendar-month me-3" style={{ fontSize: "2rem" }}></i>  
                                SCHEDULE AN APPOINTMENT
                            </button>
                        </div>
                    </div>
                  </div>              
                )}

                {/* Registered Form (default) */}
                {newResident === false && (
                  <div className="container mb-5">
                    <div className="row justify-content-center">
                      <div className="col-12 col-md-8 col-lg-6">
                        <div className="schedule-form p-2 p-md-4 rounded">
                          <h4>Scheduling Form</h4>
          
                          {!resetEmail && !success && (
                            <div>
                              <div className="d-flex flex-column mt-4">
                                  <label>Email address</label>
                                  <input
                                      onChange={(v) => setEmail(v.target.value)}
                                      value={email}
                                      type="email"
                                      className="form-control rounded mt-2"
                                      placeholder="Enter your email"
                                  />
                              </div>
            
                              <div className="d-flex flex-column mt-3">
                                  <label>Birthday</label>
                                  <input
                                      value={birthday || ''}
                                      onFocus={() => setShowCalendar(true)}
                                      className="form-control rounded mt-2"
                                      placeholder="YYYY-MM-DD"
                                      readOnly
                                  />
                                  {showCalendar && (
                                      <div className="w-100 mt-3">
                                          <Calendar
                                              onChange={handleBirthdateChange}
                                              value={birthday ? new Date(birthday) : new Date()}
                                              className="calendar-component"
                                          />
                              </div>
                                        )}
                            </div>
                            <button
                              className="btn btn-link mt-3 p-0 text-primary"
                              onClick={toggleResetEmailForm}
                            >
                              Reset Email
                            </button>
                          </div>
                            )}

                          {resetEmail && (
                            <div>
                              <div className="d-flex flex-column mt-4">
                                <label>First Name</label>
                                <input
                                  onChange={(e) => setFirstName(e.target.value)}
                                  value={firstName}
                                  type="text"
                                  className="form-control rounded mt-2"
                                  placeholder="Enter first name"
                                />
                              </div>

                              <div className="d-flex flex-column mt-3">
                                <label>Middle Name</label>
                                <input
                                  onChange={(e) => setMiddleName(e.target.value)}
                                  value={middleName}
                                  type="text"
                                  className="form-control rounded mt-2"
                                  placeholder="Enter middle name"
                                />
                              </div>

                              <div className="d-flex flex-column mt-3">
                                <label>Last Name</label>
                                <input
                                  onChange={(e) => setLastName(e.target.value)}
                                  value={lastName}
                                  type="text"
                                  className="form-control rounded mt-2"
                                  placeholder="Enter last name"
                                />
                              </div>

                              <div className="d-flex flex-column mt-3">
                                <label>Birthday</label>
                                <input
                                  value={birthday || ''}
                                  onFocus={() => setShowCalendar(true)}
                                  className="form-control rounded mt-2"
                                  placeholder="YYYY-MM-DD"
                                  readOnly
                                />
                                {showCalendar && (
                                  <div className="w-100 mt-3">
                                    <Calendar
                                      onChange={handleBirthdateChange}
                                      value={birthday ? new Date(birthday) : new Date()}
                                      className="calendar-component"
                                    />
                                  </div>
                                )}
                              </div>

                              <div className="d-flex flex-column mt-3">
                                <label>Old Email</label>
                                <input
                                  onChange={(e) => setOldEmail(e.target.value)}
                                  value={oldEmail}
                                  type="email"
                                  className="form-control rounded mt-2"
                                  placeholder="e.g john@gmail.com"
                                />
                              </div>

                              <div className="d-flex flex-column mt-3">
                                <label>New Email</label>
                                <input
                                  onChange={(e) => setNewEmail(e.target.value)}
                                  value={newEmail}
                                  type="email"
                                  className="form-control rounded mt-2"
                                  placeholder="e.g john@gmail.com"
                                />
                              </div>

                              <button
                                onClick={(v) => {
                                  updateEmail();
                                  // Call your reset email function
                                  v.preventDefault();
                                  // Add reset logic here
                                }}
                                type="button"
                                className="btn btn-primary bg-green mt-4 col-12"
                              >
                                Reset Email
                              </button>
                              <button
                                className="btn btn-link mt-3 p-0 text-primary"
                                onClick={toggleResetEmailForm}
                              >
                                Scheduling Form
                              </button>
                            </div>
                            )}
            
                            {success && !successOTP && (
                                <div className="d-flex flex-column mt-4">
                                    <label>OTP</label>
                                    <input
                                        onChange={(v) => {
                                            if (v.target.value !== '') {
                                                setIsButtonDisabled(false);
                                            } else {
                                                setIsButtonDisabled(true);
                                            }
                                            setOTP(v.target.value);
                                        }}
                                        value={otp}
                                        type="text"
                                        className="form-control rounded mt-2"
                                        placeholder="Enter OTP received in your email address"
                                    />
                                </div>
                            )}
            
                            {success && successOTP && (
                                <div>
                                    <div className="d-flex flex-column mt-4">
                                        <label>Select date</label>
                                        <label className="fw-bold mt-2">{selectedDate}</label>
                                        <Calendar
                                            minDate={new Date()}
                                            className="calendar-component mt-3"
                                            onChange={handleDateChange}
                                        />
                                    </div>
            
                                    <div className="d-flex flex-column mt-3">
                                        <label>Purpose</label>
                                        <input
                                            onChange={(v) => setPurpose(v.target.value)}
                                            value={purpose}
                                            className="form-control rounded mt-2"
                                            placeholder="Enter your purpose"
                                        />
                                    </div>
            
                                    <div className="mt-3">
                                        <label>Select service</label>
                                        <select
                                            onChange={(v) => setSelectedDoc(v.target.value)}
                                            className="form-select"
                                            aria-label="Default select example"
                                        >
                                            {documentList.map((i, k) => (
                                                <option value={i.id} key={k}>
                                                    {i.service}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
            
                                    <div {...getRootProps()} className="mt-4 p-3" style={{ borderStyle: 'dotted', width: '100%' }}>
                                        <input {...getInputProps()} />
                                        {isDragActive ? (
                                            <p>Drop the files here ...</p>
                                        ) : (
                                            <p>Drag 'n' drop some files here, or click to select files</p>
                                        )}
                                    </div>
            
                                    <div className="mt-3">
                                        {files.length !== 0 &&
                                            files.map((i, k) => (
                                                <div
                                                    className="d-flex align-items-center justify-content-between mt-2"
                                                    key={k}
                                                >
                                                    <span
                                                        className="pointer"
                                                        onClick={() => {
                                                            setSelectedFileForViewing(i);
                                                            setShowImage(true);
                                                        }}
                                                    >
                                                        {i.fileName}
                                                    </span>
                                                    <div
                                                        className="pointer"
                                                        onClick={() => {
                                                            let tmpArr = [...files];
                                                            tmpArr.splice(k, 1);
                                                            setFiles(tmpArr);
                                                        }}
                                                    >
                                                        <i className="bi bi-trash" style={{ fontSize: '30px', color: 'red' }}></i>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
            
                            {!resetEmail && !success && !successOTP && (
                                <button
                                    disabled={isButtonDisabled}
                                    onClick={(v) => {
                                        submit();
                                        v.preventDefault();
                                    }}
                                    type="button"
                                    className="btn btn-primary bg-green mt-4 col-12"
                                >
                                    Request OTP
                                </button>
                            )}
            
                            {success && !successOTP && (
                                <button
                                    disabled={isButtonDisabled}
                                    onClick={(v) => {
                                        submitOTP();
                                        v.preventDefault();
                                    }}
                                    type="button"
                                    className="btn btn-primary bg-green mt-4 col-12"
                                >
                                    Verify OTP
                                </button>
                            )}
            
                            {success && successOTP && (
                                <button
                                    disabled={isButtonDisabled}
                                    onClick={() => {
                                        createAppoint();
                                    }}
                                    type="button"
                                    className="btn btn-primary bg-green mt-4 col-12"
                                >
                                    Create appointment
                                </button>
                            )}
            
                            <div className="mt-5">
                                <p>
                                    Not registered yet?{' '}
                                    <a 
                                      className="text-primary" 
                                      //onTouchStart={() => console.log('Touched')}
                                      onClick={(e) => { e.preventDefault(); setNewResident(true); }}>
                                      Please register here
                                    </a>
                                </p>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                
                )}

                {newResident && !showPrivacyPolicy && (
                    <div className="new-resident-form mb-5 p-4 col-6 rounded">
                    <h4>
                        Enter your details below:
                    </h4>

                    <div class="mb-3">
                        <label class="form-label">Block</label>
                        <input
                            id='blockinput'
                            value={resident.block}
                            onChange={(val) => {
                                if (val.target.value != "") {
                                    document.getElementById('blockinput').style.border = '1px solid #dee2e6'
                                  }
                                  else {
                                    document.getElementById('blockinput').style.border = '1px solid red'
                                  }
                                setResident({ 
                                    ...resident, ...{
                                        block: val.target.value 
                                    }
                                });
                            }}
                            class="form-control"
                        />
                    </div>
 
                    <div class="mb-3">
                        <label class="form-label">Lot</label>
                        <input
                            id='lotinput'
                            value={resident.lot}
                            onChange={(val) => {
                                if (val.target.value != "") {
                                    document.getElementById('lotinput').style.border = '1px solid #dee2e6'
                                  }
                                  else {
                                    document.getElementById('lotinput').style.border = '1px solid red'
                                  }
                                setResident({ 
                                    ...resident, ...{
                                        lot: val.target.value
                                    }
                                });
                            }}
                            class="form-control"
                        />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Purok</label>
                        <input
                            id='purokinput'
                            value={resident.purok}
                            onChange={(val) => {
                                if (val.target.value != "") {
                                    document.getElementById('purokinput').style.border = '1px solid #dee2e6'
                                  }
                                  else {
                                    document.getElementById('purokinput').style.border = '1px solid red'
                                  }
                                setResident({ 
                                    ...resident, ...{
                                        purok: val.target.value 
                                    }
                                });
                            }}
                            class="form-control"
                        />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Street</label>
                        <input
                            id='streetinput'
                            value={resident.street}
                            onChange={(val) => {
                                if (val.target.value != "") {
                                    document.getElementById('streetinput').style.border = '1px solid #dee2e6'
                                  }
                                  else {
                                    document.getElementById('streetinput').style.border = '1px solid red'
                                  }
                                setResident({ 
                                    ...resident, ...{
                                        street: val.target.value 
                                    }
                                });
                            }}
                            class="form-control"
                        />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Household No.</label>
                        <input
                            id='housenoinput'
                            value={resident.household}
                            onChange={(val) => {
                                if (val.target.value != "") {
                                    document.getElementById('housenoinput').style.border = '1px solid #dee2e6'
                                  }
                                  else {
                                    document.getElementById('housenoinput').style.border = '1px solid red'
                                  }
                                setResident({ 
                                    ...resident, ...{
                                        household: val.target.value 
                                    }
                                });
                            }}
                            class="form-control"
                        />
                    </div>

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
                             id='mnameinput'
                            value={resident.middle_name}
                            onChange={(val) => {

                                if (val.target.value != "") {
                                    document.getElementById('mnameinput').style.border = '1px solid #dee2e6'
                                  }
                                  else {
                                    document.getElementById('mnameinput').style.border = '1px solid red'
                                  }

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

                    {/* House and Lot Ownership (Yes/No/Other: Please specify) */}
                    <div class="mb-3">
                        <label class="form-label">House and Lot Ownership (Yes/No/Other: Please specify)</label>
                        <select
                            value={resident.house_and_lot_ownership.startsWith('Other') ? 'Other' : resident.house_and_lot_ownership}
                            onChange={(val) => {
                                if (val.target.value === 'Other') {
                                    setResident({ ...resident, house_and_lot_ownership: 'Other, ' });
                                } else {
                                    setResident({ ...resident, house_and_lot_ownership: val.target.value });
                                }
                            }}
                            class="form-select"
                        >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                            <option value="Other">Other</option>
                        </select>
                        {resident.house_and_lot_ownership.startsWith('Other') && (
                            <input
                                type="text"
                                placeholder="Please specify"
                                value={resident.house_and_lot_ownership.split(', ')[1] || ''}
                                onChange={(val) => {
                                    setResident({ ...resident, house_and_lot_ownership: `Other, ${val.target.value}` });
                                }}
                                class="form-control mt-2"
                            />
                        )}
                    </div>

                    {/* Living with Owner (Yes/No/Other: Please specify) */}
                    <div class="mb-3">
                        <label class="form-label">Living with Owner (Yes/No/Other: Please specify)</label>
                        <select
                            value={resident.living_with_owner.startsWith('Other') ? 'Other' : resident.living_with_owner}
                            onChange={(val) => {
                                if (val.target.value === 'Other') {
                                    setResident({ ...resident, living_with_owner: 'Other, ' });
                                } else {
                                    setResident({ ...resident, living_with_owner: val.target.value });
                                }
                            }}
                            class="form-select"
                        >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                            <option value="Other">Other</option>
                        </select>
                        {resident.living_with_owner.startsWith('Other') && (
                            <input
                                type="text"
                                placeholder="Please specify"
                                value={resident.living_with_owner.split(', ')[1] || ''}
                                onChange={(val) => {
                                    setResident({ ...resident, living_with_owner: `Other, ${val.target.value}` });
                                }}
                                class="form-control mt-2"
                            />
                        )}
                    </div>

                    {/* Renting (Yes/No/Other: Please specify) */}
                    <div class="mb-3">
                        <label class="form-label">Renting (Yes/No/Other: Please specify)</label>
                        <select
                            value={resident.renting.startsWith('Other') ? 'Other' : resident.renting}
                            onChange={(val) => {
                                if (val.target.value === 'Other') {
                                    setResident({ ...resident, renting: 'Other, ' });
                                } else {
                                    setResident({ ...resident, renting: val.target.value });
                                }
                            }}
                            class="form-select"
                        >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                            <option value="Other">Other</option>
                        </select>
                        {resident.renting.startsWith('Other') && (
                            <input
                                type="text"
                                placeholder="Please specify"
                                value={resident.renting.split(', ')[1] || ''}
                                onChange={(val) => {
                                    setResident({ ...resident, renting: `Other, ${val.target.value}` });
                                }}
                                class="form-control mt-2"
                            />
                        )}
                    </div>

                    {/* Relationship to House and Lot Owner */}
                    <div class="mb-3">
                        <label class="form-label">Relationship to House and Lot Owner</label>
                        <input
                            id='relationinput'
                            value={resident.relationship_to_owner}
                            onChange={(val) => {
                                if (val.target.value != "") {
                                    document.getElementById('relationinput').style.border = '1px solid #dee2e6'
                                  }
                                  else {
                                    document.getElementById('relationinput').style.border = '1px solid red'
                                  }
                                setResident({ 
                                    ...resident, ...{
                                        relationship_to_owner: val.target.value 
                                    }
                                });
                            }}
                            class="form-control"
                            placeholder="Please specify relationship"
                        />
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

                    {/* Pet Details */}
                    <div class="mb-3">
                      <label class="form-label">Has Pets (Specify Type and Number - if none N/A)</label>
                      <input
                        id='haspetsinput'
                        value={resident.pet_details}
                        onChange={(val) => {
                          if (val.target.value != "") {
                            document.getElementById('haspetsinput').style.border = '1px solid #dee2e6'
                          }
                          else {
                            document.getElementById('haspetsinput').style.border = '1px solid red'
                          }
                          setResident({
                            ...resident, ...{ 
                            pet_details: val.target.value
                            }
                          });
                        }}
                        class="form-control"
                        placeholder="e.g., 2 Dogs, 1 Cat"
                      />
                    </div>

                    {/* Pet Vaccination */}
                    <div class="mb-3">
                        <label class="form-label">Pets Vaccinated (Yes - When / No)</label>
                            <>
                                <select
                                    value={resident.pet_vaccination ? (resident.pet_vaccination.startsWith('Yes') ? 'Yes' : 'No') : ''}
                                    onChange={(val) => {
                                        const selectedValue = val.target.value;
                                        if (selectedValue === 'No') {
                                            setResident({ ...resident, pet_vaccination: 'No', vaccination_date: null });
                                        } else {
                                            setResident({ ...resident, pet_vaccination: 'Yes' });
                                        }
                                    }}
                                    class="form-select"
                                >
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>

                                {resident.pet_vaccination.startsWith('Yes') && (
                                    <div class="mb-3 mt-2">
                                        <label class="form-label">Vaccination Date</label>
                                        <input
                                            type="text"
                                            placeholder="YYYY/MM/DD"
                                            value={resident.pet_vaccination.split(', ')[1] || ''} 
                                            onChange={(val) => {
                                                const newDate = val.target.value;
                                                setResident({ ...resident, pet_vaccination: `Yes, ${newDate}` });
                                            }}
                                            class="form-control"
                                        />
                                    </div>
                                )}
                            </>
                    </div>

                    <div class="mb-3 d-flex flex-column">
                        <label class="form-label">Birthday</label>
                        <span>{moment(resident.birthday).format('YYYY-MM-DD')}</span>
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
                        <label class="form-label">Phone number</label>
                        <small className="ms-3">Format: 09xxxxxxxxx</small>
                        <input
                            id='phoneinput'
                            value={resident.cell_number}
                            onChange={(val) => {

                                const numberPattern = /^\d+(\.\d+)?$/; // Matches integers and decimals
                                let validate = numberPattern.test(val.target.value);

                                if (validate) {
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
                                }

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
                                Yes
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
                                No
                            </label>
                        </div>

                    </div>


                    <div className="mt-4 mb-4">
                        <label className="form-label d-block mb-2">Capture ID</label>
                        
                        {/* Camera Capture Button */}
                        {!isCameraOpen && (
                            <button
                                className="btn btn-primary"
                                onClick={() => setIsCameraOpen(true)}
                            >
                                Open Camera
                            </button>
                        )}

                        {/* Camera Feed */}
                        {isCameraOpen && (
                            <div className="d-flex flex-column align-items-center">
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    videoConstraints={{
                                        width: 640,
                                        height: 480,
                                        facingMode: "user", // Change to "environment" for rear camera
                                    }}
                                    className="custom-webcam"
                                />
                                <div className="mt-3 d-flex justify-content-center gap-2">
                                    <button
                                        className="btn btn-success"
                                        onClick={captureImage}
                                    >
                                        Capture Photo
                                    </button>

                                    <button
                                        className="btn btn-danger"
                                        onClick={() => setIsCameraOpen(false)}
                                    >
                                        Close Camera
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Display Captured Images */}
                    <div className="mt-3">
                        {files.length !== 0 &&
                            files.map((file, index) => (
                                <div key={index} className="d-flex align-items-center justify-content-between mt-2">
                                    <span
                                        className="pointer"
                                        onClick={() => {
                                            const newWindow = window.open();
                                            newWindow.document.write(
                                                `<img src="${file.base64}" alt="Captured Image" />`
                                            );
                                        }}
                                    >
                                        {file.fileName}
                                    </span>
                                    <div
                                        className="pointer"
                                        onClick={() => {
                                            let tmpArr = [...files];
                                            tmpArr.splice(index, 1);
                                            setFiles(tmpArr);
                                        }}
                                    >
                                        <i className="bi bi-trash" style={{ fontSize: '30px', color: 'red' }}></i>
                                    </div>
                                </div>
                            ))}
                    </div>


                    {/* Add privacy statement checkbox */}
                    <div className="form-check mt-3 mb-4">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="privacyCheck"
                            checked={hasAgreedToPrivacy}
                            onChange={handlePrivacyChange}
                        />
                        <label className="form-check-label" htmlFor="privacyCheck">
                            By submitting your registration form, you confirm that you have read, understood, and agree to this 
                            <span
                                className="text-primary"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowPrivacyPolicy(true); 
                                }}
                                style={{ cursor: "pointer", textDecoration: "underline" }}
                            >
                                Data Privacy Policy
                            </span>.
                        </label>
                    </div>


                    <button
                        disabled={hasAgreedToPrivacy == 0 ? true : false}
                        type="button" onClick={() => {
                            addResident()
                        }} class="btn btn-primary bg-green">Submit</button>


                </div>

                )}

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

                {showPrivacyPolicy && (
                    <div className="data-privacy-wrapper">
                    <div className="data-privacy-container">
                        {/* Privacy Policy Section */}
                        <h2>Data Privacy Policy</h2>
                        <section>
                            <h3>1. Introduction</h3>
                            <p>
                                This Data Privacy Policy is in accordance with the Data Privacy Act of 2012 (RA 10173) of the 
                                Philippines. At Barangay Central Bicutan, we are committed to protecting your personal data and ensuring 
                                that it is processed in accordance with the principles of transparency, legitimate purpose, and 
                                proportionality.
                            </p>
                        </section>
                        <section>
                            <h3>2. Information We Collect</h3>
                            <p>
                                In compliance with the Data Privacy Act, we collect only the necessary personal information for 
                                legitimate purposes. These may include:
                            </p>
                            <ul>
                                <li>Full Name</li>
                                <li>Date of Birth</li>
                                <li>Address (Block, Lot, Purok, Street, Barangay)</li>
                                <li>Contact Information (Phone Number, Email Address)</li>
                                <li>Household Information (Household ID, Relationship to Owner)</li>
                                <li>Pet Details (if applicable)</li>
                                <li>Other information necessary to fulfill barangay services</li>
                            </ul>
                        </section>
                        <section>
                            <h3>3. Purpose of Data Collection</h3>
                            <p>
                                The personal data collected will be used for the following purposes:
                            </p>
                            <ul>
                                <li>Verification of residency and household composition</li>
                                <li>Processing of barangay services (e.g., certifications, document requests, appointments)</li>
                                <li>Compliance with legal and regulatory obligations</li>
                                <li>Statistical purposes to improve barangay operations</li>
                            </ul>
                            <p>
                                Your personal data will not be used for purposes other than those declared, unless you provide 
                                your explicit consent.
                            </p>
                        </section>
                        <section>
                            <h3>4. Legal Basis for Data Processing</h3>
                            <p>
                                We process personal data based on any of the following legal bases as required by the Data Privacy Act:
                            </p>
                            <ul>
                                <li>Your explicit consent</li>
                                <li>Compliance with legal or regulatory requirements</li>
                                <li>Performance of public authority or legitimate public interest</li>
                                <li>Fulfillment of contractual obligations</li>
                            </ul>
                        </section>
                        <section>
                            <h3>5. Data Sharing and Disclosure</h3>
                            <p>
                                Your personal data will be kept confidential. We will share your data only under the following circumstances:
                            </p>
                            <ul>
                                <li>When required by law (e.g., court orders, law enforcement authorities)</li>
                                <li>To service providers under a data-sharing agreement ensuring compliance with the Data Privacy Act</li>
                                <li>For legitimate public interest purposes or when necessary for public safety</li>
                            </ul>
                        </section>
                        <section>
                            <h3>6. Data Retention</h3>
                            <p>
                                Your personal data will be retained only for as long as necessary to fulfill the stated purposes 
                                or as required by applicable laws. Once the retention period expires, data will be securely deleted 
                                or anonymized.
                            </p>
                        </section>
                        <section>
                            <h3>7. Your Rights as a Data Subject</h3>
                            <p>
                                As stipulated in the Data Privacy Act of 2012, you have the following rights concerning your personal data:
                            </p>
                            <ul>
                                <li>
                                    <strong>Right to Be Informed:</strong> You have the right to know how your data will be collected, used, and stored.
                                </li>
                                <li>
                                    <strong>Right to Access:</strong> You can request access to the personal data we hold about you.
                                </li>
                                <li>
                                    <strong>Right to Rectification:</strong> You can request corrections to your data if it is inaccurate or incomplete.
                                </li>
                                <li>
                                    <strong>Right to Erasure:</strong> You can request that your personal data be deleted under certain conditions.
                                </li>
                                <li>
                                    <strong>Right to Object:</strong> You can object to the processing of your personal data.
                                </li>
                                <li>
                                    <strong>Right to Data Portability:</strong> You can request that your data be transferred to another entity in a commonly used format.
                                </li>
                                <li>
                                    <strong>Right to File a Complaint:</strong> You can file a complaint with the National Privacy Commission (NPC) if your rights are violated.
                                </li>
                            </ul>
                        </section>
                        <section>
                            <h3>8. Data Security Measures</h3>
                            <p>
                                We implement appropriate physical, organizational, and technical security measures to protect 
                                your personal data. This includes secure storage, access control, encryption, and regular security 
                                assessments.
                            </p>
                        </section>
                        <section>
                            <h3>9. Updates to This Privacy Policy</h3>
                            <p>
                                We may update this policy to reflect changes in legal requirements or operational procedures. 
                                Any updates will be communicated to you through our website or other appropriate channels.
                            </p>
                        </section>
                        <section>
                            <h3>10. Contact Information</h3>
                            <p>
                                For any concerns or inquiries, please reach out to us via:
                            </p>
                            <ul>
                                <li><strong>Email:</strong> bistaguig@gmail.com</li>
                                <li><strong>Address:</strong> Barangay Central Bicutan, Taguig, Philippines</li>
                            </ul>
                        </section>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setShowPrivacyPolicy(false)}
                        >
                            Back
                        </button>
                    </div>
                </div>
                )}

            </div>
        </main>
    );
}