'use client'
import Button from "@/components/Button";
import { addResidentApi, applyNewResidentApi, checkDateAvailabilityApi, createAppointmentApi, generateOTPapi, otpLoginApi } from "@/redux/reducer/resident";
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
        file_upload: '',
        current_address: '',
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

        if (resident.last_name == "") {
            document.getElementById('lnameinput').style.border = '1px solid red'
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

       
        if (resident.current_address == "") {
            document.getElementById('currentinput').style.border = '1px solid red'
        }

        if (resident.first_name != "" && resident.last_name != "" && resident.birthday != "" && resident.cell_number != ""
            && resident.male_female !== "" && resident.civil_status_id != "" && validateEmail && validateNumber && resident.current_address != ""

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
                        file_upload: '',
                        current_address: ''
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

                <div className="d-flex flex-column align-items-center justify-content-center w-100 p-5 rounded bg-green mt-3 mb-5">
                    <h1 className="f-white">BARANGAY CENTRAL BICUTAN</h1>
                    <span className="f-white">Sunflower Street, Taguig City, Metro Manila</span>
                </div>

                {/* Registered Form (default) */}
                {!newResident && (
                    <div className="schedule-form p-4 col-6 rounded">
                        <h4>Scheduling Form</h4>

                        {!success && (
                            <div>
                                <div className="d-flex flex-column mt-5">
                                    <span>Email address</span>
                                    <input
                                        onChange={(v) => setEmail(v.target.value)}
                                        value={email}
                                        type="email"
                                        className="form-control rounded mt-3"
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <div className="d-flex flex-column mt-3">
                                  <span>Birthday</span>
                                  <input
                                      value={birthday || ''}
                                      onFocus={() => setShowCalendar(true)} 
                                      className="form-control rounded mt-3"
                                      placeholder="YYYY-MM-DD"
                                      readOnly
                                  />
                                  {showCalendar && (
                                      <Calendar
                                          onChange={handleBirthdateChange}
                                          value={birthday ? new Date(birthday) : new Date()}
                                          className="mt-3"
                                      />
                                  )}
                                </div>
                            </div>
                        )}

                        {success && !successOTP && (
                            <div className="d-flex flex-column mt-5">
                                <span>OTP</span>
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
                                    type="email"
                                    className="form-control rounded mt-3"
                                    placeholder="Enter OTP received in your email address"
                                />
                            </div>
                        )}

                        {success && successOTP && (
                            <div>
                                <div className="d-flex flex-column">
                                    <label>Select date</label>
                                    <label className="fw-bold mt-3">{selectedDate}</label>
                                    <Calendar
                                        minDate={new Date()}
                                        className="mt-3"
                                        onChange={handleDateChange}
                                    />
                                </div>

                                <div className="d-flex flex-column mt-3">
                                    <span>Purpose</span>
                                    <input
                                        onChange={(v) => setPurpose(v.target.value)}
                                        value={purpose}
                                        className="form-control rounded mt-3"
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

                                <div {...getRootProps()} className="mt-5" style={{ borderStyle: 'dotted' }}>
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

                        {!success && !successOTP && (
                            <button
                                disabled={isButtonDisabled}
                                onClick={(v) => {
                                    submit();
                                    v.preventDefault();
                                }}
                                type="button"
                                className="btn btn-primary bg-green mt-5 col-12"
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
                                className="btn btn-primary bg-green mt-5 col-12"
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
                                className="btn btn-primary bg-green mt-5 col-12"
                            >
                                Create appointment
                            </button>
                        )}

                        <div className="mt-3">
                            <p>
                                Not registered yet?{' '}
                                <a href="#" className="text-primary" onClick={(e) => { e.preventDefault(); setNewResident(true); }}>
                                    Please register here
                                </a>
                            </p>
                        </div>
                    </div>
                )}

                {newResident && (
                    <div className=" schedule-form p-4 col-6 rounded" style={{}}>
                    <h4>
                        Enter your details below:
                    </h4>

                    <div class="mb-3">
                        <label class="form-label">Block</label>
                        <input
                            value={resident.block}
                            onChange={(val) => {
                                setResident({ ...resident, block: val.target.value });
                            }}
                            class="form-control"
                        />
                    </div>
 
                    <div class="mb-3">
                        <label class="form-label">Lot</label>
                        <input
                            value={resident.lot}
                            onChange={(val) => {
                                setResident({ ...resident, lot: val.target.value });
                            }}
                            class="form-control"
                        />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Purok</label>
                        <input
                            value={resident.purok}
                            onChange={(val) => {
                                setResident({ ...resident, purok: val.target.value });
                            }}
                            class="form-control"
                        />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Street</label>
                        <input
                            value={resident.street}
                            onChange={(val) => {
                                setResident({ ...resident, street: val.target.value });
                            }}
                            class="form-control"
                        />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Household No.</label>
                        <input
                            value={resident.household}
                            onChange={(val) => {
                                setResident({ ...resident, household: val.target.value });
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
                            value={resident.relationship_to_owner}
                            onChange={(val) => {
                                setResident({ ...resident, relationship_to_owner: val.target.value });
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
                        <label class="form-label">Pet Details</label>
                        <input
                            value={resident.pet_details}
                            onChange={(val) => {
                                setResident({ ...resident, pet_details: val.target.value });
                            }}
                            class="form-control"
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

                    <button
                        disabled={files.length == 0 ? true : false}
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


            </div>
        </main>
    );
}