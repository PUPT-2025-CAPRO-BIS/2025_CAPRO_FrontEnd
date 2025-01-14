'use client'
import Button from "@/components/Button";
import { HeaderItem, RowItem } from "@/components/RowItem";
import { addOfficials, dashboardViewApi, deleteOffialsApi, filterData, loadOfficials, updateOfficials } from "@/redux/reducer/officials";
import { addResidentApi, approveNewResidentApi, approveOrRejectAppointmentApi, markAsPaidApi, deleteResidentInformationApi, editBlotterReportApi, editResidentApi, fileBlotterReportApi, importExcelResidentsApi, loadAllUsers, logOutResident, settingPeding, viewAllBlottersApi, viewAppointmentListApi } from "@/redux/reducer/resident";
import { LogOut, viewAdminLogsApi, updateSlotLimitApi } from "@/redux/reducer/user";
import Auth from "@/security/Auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import 'react-calendar/dist/Calendar.css';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import 'react-quill/dist/quill.snow.css';
import ReactQuill from "react-quill";
import { addDocumentTypeApi, deleteDocumentTypeApi, getDocumentTypeApi, updateDocumentTypesApi } from "@/redux/reducer/document";
import Calendar from "react-calendar";
import moment from "moment";
import { useDropzone } from "react-dropzone";

const timeCount = 3000
let timerVariable = '';
export default function Official({ params }) {

  const dispatch = useDispatch();
  const router = useRouter()
  const officials = useSelector(state => state)
  const alluser = useSelector(state => state.alluser)

  const documentList = useSelector(state => state.document)
  const dashboard = useSelector(state => state.officials.dashboardData)
  const dashboarFilter = useSelector(state => state.officials.dashboard_filter)
  
  const token = useSelector(state => state.user)

  const [openSide, setOpenSide] = useState(false)

  const logs = useSelector(state => state.user.list)


  const [sample, setSample] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9
  ])
  const [showImport, setShowImport] = useState(false)

  const [showImage, setShowImage] = useState(false)
  const [selectedFileForViewing, setSelectedFileForViewing] = useState('')

  //get indx 1 in url
  const [currentPage, setCurrentPage] = useState(params.page[1])
  const [totalPage, setTotalPage] = useState(0)

  const [searchItemList, setSearchItemList] = useState('')
  const [showModal, setShowModal] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [category, setCategory] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
  const [isAppointments, setIsAppointments] = useState(true);
  const [tab, seTab] = useState(null)

  const [showAddResident, setShowAddResident] = useState(false)
  const [dashboard_filter, setDashboardFilter] = useState('all')

  const [isPending, setIsPending] = useState(0)

  const [slotLimit, setSlotLimit] = useState(5);

  const [showReasonModal, setShowReasonModal] = useState(false);
  const [showReasonDeniedModal, setShowReasonDeniedModal] = useState(false);
  const [reason, setReason] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    if (tab === 2 && fromDate && toDate) { 
        // Schedule (Appointments) tab: Requires both From and To Dates
        setIsAppointments(true);
        fetchFilteredData(searchItemList, fromDate, toDate, currentPage);
    } else if (tab === 4) { 
        // Blotter tab logic:
        
        // Case 1: Category is selected but no dates
        if (category && (!fromDate && !toDate)) {
            setIsAppointments(false);
            fetchFilteredDataBlotters(null, null, category, currentPage);

        // Case 2: Both From and To Dates are selected (regardless of category)
        } else if (fromDate && toDate) {
            setIsAppointments(false);
            fetchFilteredDataBlotters(fromDate, toDate, category, currentPage);

        // Case 3: All of From Date, To Date, and Category are selected
        } else if (fromDate && toDate && category) {
            setIsAppointments(false);
            fetchFilteredDataBlotters(fromDate, toDate, category, currentPage);

        // If only one date is selected or nothing matches, do nothing
        } else {
            console.log("Either both dates must be selected or category must be picked for Blotter data.");
        }
    }
  }, [tab, fromDate, toDate, category, currentPage]);
  
  // Function to reset filters and refresh data for both tabs
  const resetFilters = () => {
    setFromDate(null);
    setToDate(null);
    setCategory('');
    setCurrentPage(1);
  
    // Fetch data without filters based on the active tab
    if (isAppointments) {
      fetchFilteredData('', null, null, 1);  // Fetch appointments
    } else {
      fetchFilteredDataBlotters('', null, null, '', 1);  // Fetch blotters
    }
  };
  
  // Fetching Schedule (Appointments) data
  const fetchFilteredData = async (searchValue, fromDate, toDate, currentPage = 1) => {
    setLoading(true);
    const data = {
      token: token.token,
      currentPage,
      searchItemList: searchValue,
      from_date: fromDate ? moment(fromDate).format('YYYY-MM-DD') : null,
      to_date: toDate ? moment(toDate).format('YYYY-MM-DD') : null,
    };
  
    try {
      const result = await dispatch(viewAppointmentListApi(data)).unwrap();
      setTotalPage(result.total_pages);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Error fetching data');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetching Blotter data
  const fetchFilteredDataBlotters = async (fromDate, toDate, category, currentPage = 1) => {
    setLoading(true);
    const data = {
        token: token.token,
        currentPage,
        from_date: fromDate ? moment(fromDate).format('YYYY-MM-DD') : null,
        to_date: toDate ? moment(toDate).format('YYYY-MM-DD') : null,
        category: category || null,
    };

    try {
        const result = await dispatch(viewAllBlottersApi(data)).unwrap();
        setTotalPage(result.total_pages);
        setErrorMessage('');
    } catch (error) {
        setErrorMessage('Error fetching blotter data');
    } finally {
        setLoading(false);
    }
};

  const handleDownloadSchedule = () => {
    // Clear error if dates are valid
    setErrorMessage("");

    // Construct the dynamic URL for downloading appointments based on fromDate and toDate
    let url = 'https://000040122.xyz/api/downloadAppointments?';

    if (fromDate && toDate) {
      // Append both from_date and to_date to the URL
      url += `from_date=${moment(fromDate).format('YYYY-MM-DD')}&to_date=${moment(toDate).format('YYYY-MM-DD')}`;
    }
    // Open the dynamically constructed URL
    window.open(url);
  };

  const NonDisclosureModal = ({ show, onClose, onConfirm }) => {
    if (!show) return null;
  
    return (
      <div className="nda-overlay">
        <div className="nda-content">
          <h4>Non-Disclosure Notice</h4>
          <p>
            By downloading blotter records, you acknowledge that this information is confidential and 
            protected under the Data Privacy Act of 2012 and other Philippine laws. 
            The data must only be used for its intended, lawful purpose and should not be shared or 
            disclosed to unauthorized parties. Any misuse of this information may result in 
            legal consequences. By proceeding, you agree to comply with these terms.
          </p>
          <div className="nda-actions">
            <button onClick={onConfirm} className="btn btn-primary">I Agree</button>
            <button onClick={onClose} className="btn btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    );
  };  

  const handleDownloadBlotter = () => {
    let url = 'https://000040122.xyz/api/downloadBlotters?';

    if (fromDate && toDate) {
      // Append both from_date and to_date to the URL
      url += `from_date=${moment(fromDate).format('YYYY-MM-DD')}&to_date=${moment(toDate).format('YYYY-MM-DD')}&`;
    }

    if (category) {
      // Append category if selected
      url += `category=${category}`;
    }
    // Open the dynamically constructed URL
    window.open(url);
  };

  // Function to show the Non-Disclosure modal before downloading
  const handleDownloadClick = () => {
    setShowModal(true); // Show the Non-Disclosure modal
  };

  // Confirm download after user accepts the notice
  const handleConfirm = () => {
    setShowModal(false);  // Close the modal
    handleDownloadBlotter();  // Proceed with download
  };

  // Close modal without downloading
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const typingTimeoutRef = useRef(null);

  // Function to handle navigation
  const handleNavigation = (searchItem) => {
    const paths = [
      '/Admin/Official/Staff/1/',
      '/Admin/Official/Resident/1/',
      '/Admin/Official/Schedule/1/',
      '/Admin/Official/Services/1/',
      '/Admin/Official/Blotter/1/',
      '/Admin/Official/Dashboard',
      '/Admin/Official/Logs/1/'
    ];

    const path = tab < paths.length ? paths[tab] + searchItem : paths[paths.length - 1];
    router.push(path);
  };

  // Handle input change
  const handleKeyDown = (val) => {

    const value = val;
    setSearchItemList(value);

    // Clear the previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a new timeout to handle navigation after user stops typing
    typingTimeoutRef.current = setTimeout(() => {
      handleNavigation(value);
    }, 1000); // Adjust delay as needed
  };


  const [success, setSuccess] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [message, SetMessage] = useState('')

  const [isEdit, setIsEdit] = useState(false);
  const [isViewing, setIsViewing] = useState(false);


  const [selectedItem, setSelectedItem] = useState(null)


  // 0 - BO,   MR -1,    SCHEDULES - 2, BR - 3, Services - 4 Dashboard -10

  const [searchVal, setSearchVal] = useState('')
  const [searchOfficial, setSearchOfficial] = useState([])

  const [searchUserList, setSearchUser] = useState([])

  const [selectedSearchItem, setSelectedSearchItem] = useState('')
  const [count, setCount] = useState(0)

  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState([])
  // Resident

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
    voter_status: '',
    male_female: '',
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
    pet_vaccination: '',
    id_type: '',
    isPendingResident: 0,
    supporting_files_obj: []
  })

  const [selectedSchedule, setSelectedSchedule] = useState({
    "appointment_id": '',
    "user_id": '',
    "full_name": "",
    "document_type_id": '',
    "document_type": "",
    "schedule_date": "",
    "status": "",
    "supporting_file_ids": [
    ]
  })

  const [selectedResident, setSelectedResident] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    pass: '',
    birthday: '',
    cell_number: '',
    civil_status_id: '',
    male_female: '',
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
    pet_vaccination: '',
    isPendingResident: 0
  })
  // male 0 female 1
  // Resident

  const [disabledBlotterButton, setDisabledBlotterButton] = useState(true)

  const [blotter, setBlotter] = useState({
    complainee_name: '',
    id: '',
    complainant_name: '',
    status_resolved: '',
    complaint_remarks: '',
    is_resident: null,
    is_resident_complainant: null,
    complainee_id: '',
    complainant_id: '',
    search: '',
    searchFirst: '',
    officer_on_duty: '',
    category: '',
    otherCategory: '',
    complainant_phone_number: '',
    complainee_phone_number: '',
    non_resident_address: '',
    remarks: ''
  })

  const handleChangeResidentStatus = (type, value) => {
    if (type === "complainant") {
        if (!value) {
            setBlotter(prevState => ({
                ...prevState,
                is_resident_complainant: value,
                is_resident: true 
            }));
        } else {
            // Allow both to be residents
            setBlotter(prevState => ({
                ...prevState,
                is_resident_complainant: value
            }));
        }
    } else if (type === "complainee") {
        if (!value) {
            setBlotter(prevState => ({
                ...prevState,
                is_resident: value, 
                is_resident_complainant: true
            }));
        } else {
            // Allow both to be residents
            setBlotter(prevState => ({
                ...prevState,
                is_resident: value // complainee becomes resident
            }));
        }
    }
};


  useEffect(() => {
    const isFormValid = () => {
        if (blotter.is_resident && blotter.is_resident_complainant) {
            return (
                blotter.complainee_id !== "" &&
                blotter.complainant_id !== "" &&
                blotter.complaint_remarks !== "" &&
                blotter.officer_on_duty !== "" &&
                blotter.status_resolved !== ""
            );
        } else if (!blotter.is_resident && blotter.is_resident_complainant) {
            return (
                blotter.complainee_name !== "" &&
                blotter.complainant_id !== "" &&
                blotter.complaint_remarks !== "" &&
                blotter.officer_on_duty !== "" &&
                blotter.status_resolved !== ""
            );
        } else if (blotter.is_resident && !blotter.is_resident_complainant) {
            return (
                blotter.complainee_id !== "" &&
                blotter.complainant_name !== "" &&
                blotter.complaint_remarks !== "" &&
                blotter.officer_on_duty !== "" &&
                blotter.status_resolved !== ""
            );
        } else {
            return (
                blotter.complainant_name !== "" &&
                blotter.complainee_name !== "" &&
                blotter.complaint_remarks !== "" &&
                blotter.officer_on_duty !== "" &&
                blotter.status_resolved !== ""
            );
        }
    };

    setDisabledBlotterButton(!isFormValid());

}, [
    blotter.complainee_name,
    blotter.complainant_name,
    blotter.status_resolved,
    blotter.complaint_remarks,
    blotter.is_resident,
    blotter.is_resident_complainant,
    blotter.complainee_id,
    blotter.complainant_id,
    blotter.search,
    blotter.searchFirst,
    blotter.officer_on_duty,
    blotter.category,
    blotter.complainant_phone_number,
    blotter.complainee_phone_number,
    blotter.non_resident_address,
    blotter.remarks
]);

  useEffect(() => {
    // If editing, check if the category is one of the predefined options
    if (isViewing && blotter.category && !options.includes(blotter.category) && blotter.category !== "Others") {
      console.log("Setting 'Others' and custom category:", blotter.category);
      setBlotter({
        ...blotter,
        category: "Others", // Set the dropdown to "Others"
        otherCategory: blotter.category, // Display the actual category in the input field
      });
    }
  }, [isViewing, blotter.category]);

  const options = [
    "Theft", 
    "Vandalism", 
    "Assault", 
    "Harassment", 
    "Verbal Abuse", 
    "Domestic Violence", 
    "Trespassing", 
    "Public Disturbance", 
    "Disorderly Conduct",
    "Child Welfare Concern",
    "Property Conflict",
    "Neighbor Conflict"
  ];

  const [showBlotter, setShowBlotter] = useState(false)

  const onDrop = useCallback((acceptedFiles) => {
    // Convert files to base64 and update state
    const fileReaders = acceptedFiles.map(file => {
      const reader = new FileReader();

      reader.onloadend = () => {
        // Process file as base64 here if needed
        const base64String = reader.result;

        // Update state with new file
        setFiles(prevFiles => [...prevFiles, file]);
      };

      reader.readAsDataURL(file);
      return reader;
    });
  }, []);


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: {
      // 'image/*': [] // Accept only image files
    }
  })

  // Barangay services

  //Barangay Paid Handler

  const [sss, setSSS] = useState({
    service: '',
  })
  const [cost, setCost] = useState(0)
  const [isCert, setIsCert] = useState(1)
  const [docId, setDocId] = useState('')

  const [serviceDesc, setServiceDesc] = useState('')



  // Baranay services

  const [value, setValue] = useState('');


  useEffect(() => {

    let getPage = params.page[0]
    let getPageNumber = params.page[1]
    let getSearchItem = params.page[2]




    if (getPage == "Staff") {
      setCurrentPage(getPageNumber)
      seTab(0)
    }
    if (getPage == "Services") {
      setCurrentPage(getPageNumber)
      seTab(3)
    }

    if (getPage == "Schedule") {
      setCurrentPage(getPageNumber)
      seTab(2)
    }

    if (getPage == "Resident") {
      setCurrentPage(getPageNumber)
      seTab(1)
    }

    if (getPage == "Blotter") {
      setCurrentPage(getPageNumber)
      seTab(4)
    }

    if (getPage == "Dashboard") {
      setCurrentPage(getPageNumber)
      seTab(10)
    }

    if (getPage == "Logs") {
      setCurrentPage(getPageNumber)
      seTab(6)
    }

    setSearchItemList(getSearchItem)

  }, [])




  useEffect(() => {
    setLoading(true)

    let data = {
      token: token.token,
      currentPage,
      searchItemList,
      isPending: alluser.isPending,
      per_page: tab == 0 ? 100000 : 10,
    }


    if (tab == 10) {
      const fetchData = async () => {

        try {
          const result = await dispatch(dashboardViewApi(token.token)).unwrap();

          // Handle success, e.g., navigate to another page
        } catch (error) {

          // Handle error, e.g., show an error message
        }

        setLoading(false)
      };

      fetchData();
    }

    if (tab == 0) {




      const fetchData = async () => {

        try {
          const result = await dispatch(loadOfficials(data)).unwrap();


          setTotalPage(result.total_pages)

          if (currentPage > result.total_pages) {
            // alert("Invalid url")
            let page = result.total_pages
            router.replace('/Admin/Official/Staff/' + page)
          }

          // Handle success, e.g., navigate to another page
        } catch (error) {

          // Handle error, e.g., show an error message
        }
        setLoading(false)
      };

      fetchData();
    }
    if (tab == 1 || tab == 0) {

      data = {
        ...data,
        dashboard_filter: dashboarFilter
      }

      const fetchData = async () => {

        try {

          const result = await dispatch(loadAllUsers(data)).unwrap();


          setTotalPage(result.total_pages)

          // Handle success, e.g., navigate to another page
        } catch (error) {

          // Handle error, e.g., show an error message
        }

        setLoading(false)
      };


      fetchData();
    }

    if (tab == 6) {
      const fetchData = async () => {

        try {
          const result = await dispatch(viewAdminLogsApi(data)).unwrap();


          setTotalPage(result.total_pages)

          if (currentPage > result.total_pages) {
            let page = result.total_pages
            router.replace('/Admin/Official/Logs/' + page)
          }

          // Handle success, e.g., navigate to another page
        } catch (error) {

          // Handle error, e.g., show an error message
        }
        setLoading(false)
      };

      fetchData();
    }


    if (tab == 3) {

      const fetchData = async () => {

        try {
          const result = await dispatch(getDocumentTypeApi(data)).unwrap();

          setTotalPage(result.total_pages)

          if (currentPage > result.total_pages) {
            let page = result.total_pages
            router.replace('/Admin/Official/Services/' + page)

          }

          // Handle success, e.g., navigate to another page
        } catch (error) {

          // Handle error, e.g., show an error message
        }
        setLoading(false)
      };

      fetchData();
    }

    if (tab == 2) {

      const fetchData = async () => {

        try {
          const result = await dispatch(viewAppointmentListApi(data)).unwrap();

          setTotalPage(result.total_pages)

          if (currentPage > result.total_pages) {
            // alert("Invalid url")
            let page = result.total_pages
            router.replace('/Admin/Official/Schedule/' + page)
          }

          // Handle success, e.g., navigate to another page
        } catch (error) {

          // Handle error, e.g., show an error message
        }
        setLoading(false)
      };

      fetchData();

    }


    if (tab == 4) {

      data = {
        ...data,
        dashboard_filter: dashboarFilter
      }

      loadAll()
      const fetchData = async () => {

        try {
          const result = await dispatch(viewAllBlottersApi(data)).unwrap();

          setTotalPage(result.total_pages)

          if (currentPage > result.total_pages) {
            // alert("Invalid url")
            let page = result.total_pages
            router.replace('/Admin/Official/Blotter/' + page)
          }

          // Handle success, e.g., navigate to another page
        } catch (error) {

          // Handle error, e.g., show an error message
        }
        setLoading(false)
      };

      fetchData();


    }


  }, [tab, count]);


  const searchAddOfficial = (v) => {


    setSearchVal(v)
    //v search val
    // officials list
    let tmpArr = []

    alluser.list.data.map((i, k) => {

      let fullname = i.first_name + " " + i.middle_name + " " + i.last_name


      // Create a regular expression dynamically with case-insensitive flag
      const regex = new RegExp(v, 'i');

      // Perform the search
      const found = regex.test(fullname);

      if (found) {
        tmpArr.push(i)
      }

    })


    setSearchOfficial(tmpArr)
  }

  const searchUser = (v) => {


    setSearchVal(v)
    //v search val
    // officials list
    let tmpArr = []

    alluser.list.data.map((i, k) => {

      let fullname = i.first_name + " " + i.middle_name + " " + i.last_name


      // Create a regular expression dynamically with case-insensitive flag
      const regex = new RegExp(v, 'i');

      // Perform the search
      const found = regex.test(fullname);


      if (found) {
        tmpArr.push(i)
      }

    })


    setSearchUser(tmpArr)
  }

  const loadAll = (v) => {

    let data = {
      token: token.token,
      currentPage,
      searchItemList: '',
      isPending,
      per_page: 1000000
    }

    const fetchData = async () => {

      try {
        const result = await dispatch(loadAllUsers(data)).unwrap();

        // setTotalPage(result.total_pages)


        // Handle success, e.g., navigate to another page
      } catch (error) {

        // Handle error, e.g., show an error message
      }

      setLoading(false)
    };


    fetchData();
  }

  const deleteOffials = () => {
    let merge = {
      selectedItem,
      token: token.token
    }

    const fetchData = async () => {



      try {
        const result = await dispatch(deleteOffialsApi(merge)).unwrap();

        // Handle success, e.g., navigate to another page
        document.getElementById('selctednameadd').value = ''
        setSelectedSearchItem({
          chairmanship: '',
          position: '',
          status: '',
        })
        setCurrentPage
        setSelectedItem(null)

        setCount(count + 1)
        SetMessage('Successfully deleted a barangay official information')
        setShowSuccess(true)
        setSuccess(true)

        if (result.success) {
          setShowSuccess(true)
          setSuccess(true)
        }
        else {
          setShowSuccess(true)
          setSuccess(false)
        }



      } catch (error) {

        // Handle error, e.g., show an error message
      }
    };

    fetchData();



  }


  const updateOfficial = async () => {


    let merge = {
      selectedItem,
      token: token.token
    }

    const fetchData = async () => {



      try {
        const result = await dispatch(updateOfficials(merge)).unwrap();

        // Handle success, e.g., navigate to another page
        document.getElementById('selctednameadd').value = ''
        setSelectedSearchItem({
          chairmanship: '',
          position: '',
          status: '',
        })

        setSelectedItem(null)

        setCount(count + 1)
        SetMessage('Successfully updated a barangay official information')
        setShowSuccess(true)
        setSuccess(true)

        if (result.success) {
          setShowSuccess(true)
          setSuccess(true)
        }
        else {
          setShowSuccess(true)
          setSuccess(false)
        }



      } catch (error) {

        // Handle error, e.g., show an error message
      }
    };

    fetchData();



    dispatch(updateOfficials(merge))
    setTimeout(() => {
      setCount(count + 1)

      document.getElementById('selctednameadd').value = ''
      setSelectedItem(null)
    }, 3000)


  }

  const addOfficial = async () => {


    let merge = {
      selectedSearchItem,
      token: token.token
    }

    const fetchData = async () => {



      try {
        const result = await dispatch(addOfficials(merge)).unwrap();

        // Handle success, e.g., navigate to another page
        document.getElementById('selctednameadd').value = ''
        setSelectedSearchItem({
          chairmanship: '',
          position: '',
          status: '',
        })

        setCount(count + 1)
        SetMessage('Successfully added a barangay official')
        setShowSuccess(true)
        setSuccess(true)

        if (result.success) {
          setShowSuccess(true)
          setSuccess(true)
        }
        else {
          setShowSuccess(true)
          setSuccess(false)
        }



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

    if (resident.male_female === "") {
      document.getElementById('genderinput').style.border = '1px solid red'
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

    if (resident.voter_status === "") {
      document.getElementById('voter_status_input').style.border = '1px solid red'
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

    if (
      resident.first_name != "" &&
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
      resident.renting != ""
  ) {

      let merge = {
        resident,
        birthday: resident.birthday,
        token: token.token
      }

      if (isEdit) {
        try {
          const result = await dispatch(editResidentApi(merge)).unwrap();

          if (result.success == true) {
            setIsEdit(false)
            setSuccess(true)
            setShowSuccess(true)
            SetMessage(`Resident ${resident.first_name} information has been updated`)
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
            setCount(count + 1)
            setShowAddResident(false)
          }
          else {
            setSuccess(false)
            setShowSuccess(true)
          }

        }
        catch (error) {

        }
      }
      else {
        try {
          const result = await dispatch(addResidentApi(merge)).unwrap();

          if (result.success == true) {
            setIsEdit(false)
            setSuccess(true)
            setShowSuccess(true)
            SetMessage(`Resident ${resident.first_name} information has been added`)
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
            setShowAddResident(false)
            setCount(count + 1)
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


  }

  const deleteResident = async () => {
    // deleteResidentInformationApi

    let merge = {
      id: resident.id,

      token: token.token
    }



    try {
      const result = await dispatch(deleteResidentInformationApi(merge)).unwrap();


      if (result.success == true) {

        setShowSuccess(true)
        setSuccess(true)
        SetMessage(`Resident ${resident.first_name} has been deleted.`)
        setCount(count + 1)
      }
      else {

        setShowSuccess(true)
        SetMessage('Something went wrong!!')
      }
    }
    catch (error) {

    }
  }


  const addDocumentType = () => {

    let merge = {
      data: {
        description: serviceDesc,
        service: sss.service,
        isCertificate: isCert,
        doc_id: docId,
        cost: cost
      },
      token: token.token
    }

    setSSS({
      service: '',
      isCertificate: 1,
      doc_id: ''
    })


    setServiceDesc('')

    const fetchData = async () => {




      try {
        let result = ''

        if (isEdit) {
          result = await dispatch(updateDocumentTypesApi(merge)).unwrap();

          SetMessage('Successfully updated a barangay service')

          setCount(count + 1)

          setIsEdit(false)
          setShowSuccess(true)
          setSuccess(true)

          if (result.success) {
            setShowSuccess(true)
            setSuccess(true)
          }
          else {
            setShowSuccess(true)
            setSuccess(false)
          }

        }

        else {
          result = await dispatch(addDocumentTypeApi(merge)).unwrap();



          SetMessage('Successfully added a barangay service')

          setCount(count + 1)

          setIsEdit(false)
          setShowSuccess(true)
          setSuccess(true)

          if (result.success) {
            setShowSuccess(true)
            setSuccess(true)
          }
          else {
            setShowSuccess(true)
            setSuccess(false)
          }

        }

        // Handle success, e.g., navigate to another page




      } catch (error) {

        // Handle error, e.g., show an error message
      }
    };

    fetchData();


  }

  const deleteDocumentType = () => {

    let merge = {
      data: selectedItem,
      token: token.token
    }




    const fetchData = async () => {



      try {
        const result = await dispatch(deleteDocumentTypeApi(merge)).unwrap();

        // Handle success, e.g., navigate to another page

        SetMessage('Successfully deleted a barangay service')
        setSSS({
          service: '',
          isCertificate: 1
        })
        setServiceDesc('')

        setCount(count + 1)

        setShowSuccess(true)
        setSuccess(true)

        if (result.success) {
          setShowSuccess(true)
          setSuccess(true)
        }
        else {
          setShowSuccess(true)
          setSuccess(false)
        }



      } catch (error) {

        // Handle error, e.g., show an error message
      }
    };

    fetchData();


  }

  const viewCreatedTemplate = (val) => {


    window.open(`https://000040122.xyz/api/generatePdf?doc_id=${val.id}&download=0`)
    // https://000040122.xyz/api/generatePdf?doc_id=14&download=0

  }


  const changeTab = (v) => {


    if (v == 0) {
      router.replace('/Admin/Official/Staff/1')
    }
    if (v == 1) {
      router.replace('/Admin/Official/Resident/1')
    }
    if (v == 2) {
      router.replace('/Admin/Official/Schedule/1')
    }
    if (v == 3) {
      router.replace('/Admin/Official/Services/1')
    }
    if (v == 4) {
      router.replace('/Admin/Official/Blotter/1')
    }
    if (v == 10) {
      router.replace('/Admin/Official/Dashboard')
    }
    if (v == 6) {
      router.replace('/Admin/Official/Logs/1')
    }

  }


  const paginate = (v, k) => {


    let slug = ''


    if (tab == 0) slug = "Staff"
    if (tab == 3) slug = "Services"
    if (tab == 1) slug = "Resident"
    if (tab == 4) slug = "Blotter"
    if (tab == 6) slug = "Logs"
    if (tab == 2) slug = "Schedule"


    if (k == 1) {
      //next

      if (currentPage >= totalPage) {
        setCurrentPage(totalPage)

      }
      else {

        //tab 0
        router.replace(`/Admin/Official/${slug}/` + (parseInt(currentPage) + 1))
      }

    }
    else if (k == 0) {
      //previous
      if (currentPage >= 2) {
        //tab 0
        router.replace(`/Admin/Official/${slug}/` + (parseInt(currentPage) - 1))
      }
      else {
        setCurrentPage(1)
      }


    }

  }


  const approveResident = async () => {

    setLoading(true)
    let merge = {
      token: token.token,
      id: resident.id,
      status: 0
    }



    try {
      const result = await dispatch(approveNewResidentApi(merge)).unwrap();
      setLoading(false)

      if (result.success == true) {

        setShowAddResident(false)
        setIsViewing(false)
        setSuccess(true)
        SetMessage('Success in approving ' + resident.first_name + " as resident.")
        setShowSuccess(true)
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
          isPendingResident: 0
        })
        setCount(count + 1)
      }
      else {
        setSuccess(false)
        SetMessage('Something went wrong in approving ' + resident.first_name + " as resident.")
        setShowSuccess(true)
      }

    } catch (error) {
      setSuccess(false)
      SetMessage('Something went wrong in approving ' + resident.first_name + " as resident.")
      setShowSuccess(true)
    }



  }

  const rejectResident = async () => {

    setLoading(true)
    let merge = {
      token: token.token,
      id: resident.id,
      status: 1,
      reason: reason
    }



    try {
      const result = await dispatch(approveNewResidentApi(merge)).unwrap();
      setLoading(false)

      if (result.success == true) {

        setShowAddResident(false)
        setIsViewing(false)
        setSuccess(true)
        SetMessage('Success in rejecting ' + resident.first_name + " as resident.")
        setShowSuccess(true)
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
          isPendingResident: 0
        })
        setCount(count + 1)
      }
      else {
        setSuccess(false)
        SetMessage('Something went wrong in rejecting ' + resident.first_name + " as resident.")
        setShowSuccess(true)
      }

    } catch (error) {

      setSuccess(false)
      SetMessage('Something went wrong in approving ' + resident.first_name + " as resident.")
      setShowSuccess(true)
    }



  }

  const handleSlotLimitChange = () => {
    if (!slotLimit) {
      alert('Please select a valid slot limit.');
      return;
    }
  
    // Dispatch Redux action
    dispatch(updateSlotLimitApi({ slotLimit, token: token.token }))
      .then((res) => {
        // Check if the response has payload and success
        if (res.payload && res.payload.success) {
          alert('Slot limit updated successfully!');
        } else {
          alert('Failed to update slot limit.');
          console.error('Error details:', res.payload || 'No response payload.');
        }
      })
      .catch((err) => {
        console.error('Unexpected error updating slot limit:', err);
        alert('An unexpected error occurred. Check the console for details.');
      });
  };
  

  return (
    <main className={``}>
      <Auth>
        <div className="w-100" style={{ backgroundColor: "white", display: "flex" }}>

          <div id='sidebar'
            className="overflow-auto sidebar bg-green">
         
            <div id='menu' className="w-100">
              { /* asan */}

              <div className="col-lg-12 p-5 d-flex flex-column">
              <div
                  onClick={() => {                 

                    if (document.getElementById("menu").classList.contains("openSidebar")) {
                      document.getElementById("menu").classList.remove("openSidebar");
                      document.getElementById("sidebar").classList.remove("openSidebar-full");

                      document.getElementById("sidebar").classList.add("sidebar");
                      document.getElementById("sidebarbg").classList.remove('logo-bg')
                      // document.getElementById("sidebar").style.width = "auto"
                      setOpenSide(false)
                    }
                    else {
                      document.getElementById("menu").classList.add("openSidebar");
                      document.getElementById("sidebar").classList.add("openSidebar-full");
                      document.getElementById("sidebarbg").classList.add('logo-bg')
                      document.getElementById("sidebar").classList.remove("sidebar");

                      setOpenSide(true)
                    }


                  }}
                  className="pointer">
                  <i class="bi bi-list" style={{ fontSize: "32px" }}></i>
                </div>
                <div id='sidebarbg' className="d-flex flex-column align-items-center  col-lg-12 mt-5" style={{ height: "100px" }}>

                </div>



                {/* Navigation */}

                <div className="flex-column mt-5 mb-5">

                  <div onClick={() => changeTab(10)} className={`p-4 w-100 rounded nav-container ${tab == 10 ? 'active-nav' : ''} pointer`}>
                    <i className="bi bi-grid f-white icon"></i>

                    {
                      openSide 
                       &&   <span className="f-white ms-2 nav-item">
                       Dashboard
                     </span>
                    }
                  
                  </div>



                  <div onClick={() => changeTab(0)} className={`p-4 w-100 rounded nav-container ${tab == 0 ? 'active-nav' : ''} pointer`}>
                    <i class="bi bi-person f-white icon"></i>
                    {
                        openSide  &&
                      <span className="f-white ms-2 nav-item">
                      Barangay Officials
                    </span>
                    }
               
                  </div>


                  <div onClick={() => {
                    dispatch(filterData('all'))
                    changeTab(1)
                  }
                  } className={`p-4 w-100 rounded nav-container ${tab == 1 ? 'active-nav' : ''} pointer`}>

                    <i class="bi bi-people-fill f-white icon"></i>

                    {
                        openSide  &&
                      <span className="f-white ms-2 nav-item">
                      Manage Residents
                    </span>
                    }
                  
                  </div>


                  <div 
                    onClick={() => {
                      changeTab(2);
                      setIsAppointments(true);  // Switch to Appointments (Schedules)
                    }} 
                    className={`p-4 w-100 rounded nav-container ${tab == 2 ? 'active-nav' : ''} pointer`}
                  >
                    <i class="bi bi-calendar-date f-white icon"></i>
                    {openSide && (
                      <span className="f-white ms-2 nav-item">Schedules</span>
                    )}
                  </div>

                  <div 
                    onClick={() => {
                      dispatch(filterData('all'))
                      changeTab(4);
                      setIsAppointments(false);  // Switch to Blotter
                    }} 
                    className={`p-4 w-100 rounded nav-container ${tab == 4 ? 'active-nav' : ''} pointer`}
                  >
                    <i class="bi bi-person-fill-slash f-white icon"></i>
                    {openSide && (
                      <span className="f-white ms-2 nav-item">Blotter</span>
                    )}
                  </div>

                  <div onClick={() => changeTab(3)} className={`p-4 w-100 rounded nav-container ${tab == 3 ? 'active-nav' : ''} pointer`}>
                    <i class="bi bi-file-earmark-diff-fill f-white icon" ></i>

                    {
                        openSide  &&
                      <span className="f-white nav-item ms-2">
                      Services
                    </span>
                    }
                  
                  </div>

                  <div onClick={() => changeTab(6)} className={`p-4 w-100 rounded nav-container ${tab == 6 ? 'active-nav' : ''} pointer`}>
                    <i class="bi bi-activity f-white icon"></i>

                    {
                        openSide  &&
                      <span className="f-white nav-item ms-2">
                      Logs
                    </span>
                    }
                 
                  </div>

                  <div onClick={async () => {
                      try {
                        const result = await dispatch(LogOut());
                        const a = await dispatch(logOutResident());

                        router.replace('/', { scroll: false })
                        // Handle success, e.g., navigate to another page
                      } catch (error) {

                        // Handle error, e.g., show an error message
                      }

                    }
                  } className={`p-4 w-100 rounded nav-container pointer`}>
                    <i className="bi bi-box-arrow-right f-white icon m-2"></i> 
                    {
                      openSide  &&
                      <span className="f-white nav-item ms-2 fw-bold">
                      Log out
                      </span>
                    }
                  </div>
                  
                </div>
                {/* Navigation */}

              </div>
            </div>
          </div>

          <div 
            
            className="mainpage flex-column align-items-center justify-content-center mt-5" style={{}}>
            <div class="dropdown d-flex align-items-center justify-content-between w-100 " >

            <div
                  onClick={() => {                                            

                    if (document.getElementById("menu").classList.contains("openSidebar")){
                      document.getElementById("menu").classList.remove("openSidebar");
                      document.getElementById("sidebar").classList.remove("openSidebar-full");
                      document.getElementById("sidebarbg").classList.remove('logo-bg')
                      setOpenSide(false)
                    }
                    else {                  
                      document.getElementById("menu").classList.add("openSidebar");
                      document.getElementById("sidebar").classList.add("openSidebar-full");
                      document.getElementById("sidebarbg").classList.add('logo-bg')
                      setOpenSide(true)
                    }


                  }}
                  className="pointer menuicon">
                  <i class="bi bi-list" style={{ fontSize: "32px" }}></i>
                </div>

              <div className="d-flex align-items-center justify-content-center">
              
                <h4 className="ms-5">
                  {
                    tab == 10 && "Dashboard"
                  }
                  {
                    tab == 0 && "Barangay Officials"
                  }

                  {
                    tab == 1 && "Manage Residents"
                  }

                  {
                    tab == 3 && "Barangay Services"
                  }

                </h4>
              </div>

              <div style={{ position: "relative" }}>
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{ height: "70px", width: "70px", borderRadius: "35px", border: "1px solid green", backgroundColor: "white", position: "absolute", left: -50, bottom: -10 }}>
                  <i class="bi bi-person-fill" style={{ fontSize: "50px" }}></i>
                </div>
                <button class="btn-remove bg-yellow roundedEnd p-3">



                  <span className="f-white ms-3" style={{ color: "black" }}>
                    Administrator
                  </span>
                </button>
                <ul class="dropdown-menu">



                  <div
                    className="pointer p-2 hover"
                    onClick={async () => {

                      try {
                        const result = await dispatch(LogOut());
                        const a = await dispatch(logOutResident());

                        router.replace('/', { scroll: false })
                        // Handle success, e.g., navigate to another page
                      } catch (error) {

                        // Handle error, e.g., show an error message
                      }

                    }}
                  >
                    <span>
                      Logout
                    </span>
                  </div>
                </ul>
              </div>

            </div>


            <div className="d-flex flex-column align-items-center justify-content-center w-100 p-5 rounded bg-green mt-3 logo-bg-officials" >
              <h1 className="f-white">
                BARANGAY CENTRAL BICUTAN
              </h1>

              <span className="f-white">
                Sunflower Street, Taguig City, Metro Manila
              </span>
            </div>

            {/* Dashboard */}
            {
              tab == 10 &&
              <>
                <div className="container mt-5" style={{ maxWidth: '90%', margin: '0 auto 0 0' }}>
                  {/* Appointment Schedules Section */}
                  <h4 className="mb-4">Appointment Schedules</h4>
                  <div className="row g-3">
                    <div 
                      className="col-md-3 d-flex bg-green p-2 align-items-center rounded pointer"
                      style={{ cursor: 'pointer', height: '130px', justifyContent: 'center' }}
                      onClick={() => {
                        router.push('/Admin/Official/Schedule/1/');
                      }}
                    >
                      <i className="ms-3 bi bi-calendar-date f-white" style={{ fontSize: '35px' }}></i>
                      <div className="ms-3 text-center">
                        <span className="f-white">Count of total schedules</span>
                        <span className="f-yellow mt-2 d-block" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                          {dashboard.schedules}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Resident Information Section */}
                  <div className="mt-5"></div>
                  <h4 className="mb-4">Resident Information</h4>
                  <div className="row g-3">

                    {/* Count of Residents */}
                    <div className="col-12 col-sm-6 col-md-2">
                      <div 
                        className="d-flex bg-green p-3 align-items-center rounded"
                        style={{ cursor: 'pointer', height: '130px', justifyContent: 'center' }}
                        onClick={() => {
                          dispatch(filterData('all'));
                          dispatch(settingPeding(0));
                          router.push('/Admin/Official/Resident/1/');
                        }}
                      >
                        <i className="bi bi-house-door f-white" style={{ fontSize: '30px' }}></i>
                        <div className="ms-3 text-center">
                          <span className="f-white">Residents</span>
                          <span className="f-yellow mt-2 d-block" style={{ fontSize: '20px', fontWeight: 'bold' }}>
                            {dashboard.non_pending_resident}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Count of Pending Residents */}
                    <div className="col-12 col-sm-6 col-md-2">
                      <div 
                        className="d-flex bg-green p-3 align-items-center rounded"
                        style={{ cursor: 'pointer', height: '130px', justifyContent: 'center' }}
                        onClick={() => {
                          dispatch(filterData('all'));
                          dispatch(settingPeding(1));
                          router.push('/Admin/Official/Resident/1/');
                        }}
                      >
                        <i className="bi bi-house-door f-white" style={{ fontSize: '30px' }}></i>
                        <div className="ms-3 text-center">
                          <span className="f-white">Pending Residents</span>
                          <span className="f-yellow mt-2 d-block" style={{ fontSize: '20px', fontWeight: 'bold' }}>
                            {dashboard.pending_resident}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Count of Male */}
                    <div className="col-12 col-sm-6 col-md-2">
                      <div 
                        className="d-flex bg-green p-3 align-items-center rounded"
                        style={{ cursor: 'pointer', height: '130px', justifyContent: 'center' }}
                        onClick={() => {
                          dispatch(filterData('male'));
                          router.push('/Admin/Official/Resident/1/');
                        }}
                      >
                        <i className="bi bi-gender-male f-white" style={{ fontSize: '30px' }}></i>
                        <div className="ms-3 text-center">
                          <span className="f-white">Male</span>
                          <span className="f-yellow mt-2 d-block" style={{ fontSize: '20px', fontWeight: 'bold' }}>
                            {dashboard.males}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Count of Female */}
                    <div className="col-12 col-sm-6 col-md-2">
                      <div 
                        className="d-flex bg-green p-3 align-items-center rounded"
                        style={{ cursor: 'pointer', height: '130px', justifyContent: 'center' }}
                        onClick={() => {
                          dispatch(filterData('female'));
                          router.push('/Admin/Official/Resident/1/');
                        }}
                      >
                        <i className="bi bi-gender-female f-white" style={{ fontSize: '30px' }}></i>
                        <div className="ms-3 text-center">
                          <span className="f-white">Female</span>
                          <span className="f-yellow mt-2 d-block" style={{ fontSize: '20px', fontWeight: 'bold' }}>
                            {dashboard.females}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Count of Seniors */}
                    <div className="col-12 col-sm-6 col-md-2">
                      <div 
                        className="d-flex bg-green p-3 align-items-center rounded"
                        style={{ cursor: 'pointer', height: '130px', justifyContent: 'center' }}
                        onClick={() => {
                          dispatch(filterData('senior'));
                          router.push('/Admin/Official/Resident/1/');
                        }}
                      >
                        <i className="bi bi-person-wheelchair f-white" style={{ fontSize: '30px' }}></i>
                        <div className="ms-3 text-center">
                          <span className="f-white">Seniors</span>
                          <span className="f-yellow mt-2 d-block" style={{ fontSize: '20px', fontWeight: 'bold' }}>
                            {dashboard.count_of_seniors}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Complaints Section */}
                  <div className="mt-5">
                    <h4 className="mb-4">Complaints</h4>
                    <div className="row g-3">

                      {/* Unresolved Complaints */}
                      <div className="col-md-3">
                        <div 
                          className="d-flex bg-green p-3 align-items-center rounded pointer"
                          style={{ cursor: 'pointer', height: '130px', justifyContent: 'center' }}
                          onClick={() => {
                            dispatch(filterData('unresolved'));
                            router.push('/Admin/Official/Blotter/1/');
                          }}
                        >
                          <i className="bi bi-hand-thumbs-down f-white" style={{ fontSize: '35px' }}></i>
                          <div className="ms-3 text-center">
                            <span className="f-white">Unresolved</span>
                            <span className="f-yellow mt-2 d-block" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                              {dashboard.unresolved}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Ongoing Complaints */}
                      <div className="col-md-3">
                        <div 
                          className="d-flex bg-green p-3 align-items-center rounded pointer"
                          style={{ cursor: 'pointer', height: '130px', justifyContent: 'center' }}
                          onClick={() => {
                            dispatch(filterData('ongoing'));
                            router.push('/Admin/Official/Blotter/1/');
                          }}
                        >
                          <i className="bi bi-lightning f-white" style={{ fontSize: '35px' }}></i>
                          <div className="ms-3 text-center">
                            <span className="f-white">Ongoing</span>
                            <span className="f-yellow mt-2 d-block" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                              {dashboard.ongoing}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Settled Complaints */}
                      <div className="col-md-3">
                        <div 
                          className="d-flex bg-green p-3 align-items-center rounded pointer"
                          style={{ cursor: 'pointer', height: '130px', justifyContent: 'center' }}
                          onClick={() => {
                            dispatch(filterData('settled'));
                            router.push('/Admin/Official/Blotter/1/');
                          }}
                        >
                          <i className="bi bi-hand-thumbs-up f-white" style={{ fontSize: '35px' }}></i>
                          <div className="ms-3 text-center">
                            <span className="f-white">Settled</span>
                            <span className="f-yellow mt-2 d-block" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                              {dashboard.settled}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Dismissed Complaints */}
                      <div className="col-md-3">
                        <div 
                          className="d-flex bg-green p-3 align-items-center rounded pointer"
                          style={{ cursor: 'pointer', height: '130px', justifyContent: 'center' }}
                          onClick={() => {
                            dispatch(filterData('dismissed'));
                            router.push('/Admin/Official/Blotter/1/');
                          }}
                        >
                          <i className="bi bi-x-octagon-fill f-white" style={{ fontSize: '35px' }}></i>
                          <div className="ms-3 text-center">
                            <span className="f-white">Dismissed</span>
                            <span className="f-yellow mt-2 d-block" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                              {dashboard.dismissed}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            }

            {/* Dashboard */}



            {/* BO */}
            {tab == 0 &&

              <div className="mt-3 d-flex flex-column  justify-content-center w-100 p-5 rounded bg-green" > 

                <div className="border-bottom p-2 pb-4 mt-3">
                  <h2 className="f-white">Current Barangay Officials</h2>
                </div>

                <div className="d-flex mt-4 justify-content-between pb-4 border-bottom">

                  <div className="d-flex align-items-center">
                    <span className="fw-bold f-white">Search:</span>
                    <input
                      // onKeyDown={handleKeyDown}
                      value={searchItemList}
                      onChange={(v) => {
                        setSearchItemList(v.target.value)
                        handleKeyDown(v.target.value)
                      }}
                      type="email" className="form-control rounded ms-2" 
                        id="exampleFormControlInput1" placeholder="Search Official name" 
                        style={{ width: '250px' }}/>
                  </div>

                  {
                    <div >
                      <button
                        className="primary bg-yellow p-2 rounded" style={{ border: "0px", color: "black" }}
                        data-bs-toggle="modal" data-bs-target="#addOfficialModal"
                      >
                        <i className="bi bi-plus fw-bold" style={{ fontSize: "20px", color: "black" }}></i>
                        <span className="fw-bold" style={{ color: "black" }}>Add official</span>
                      </button>
                    </div>
                  }
                </div>


                {/*  */}
                <div className="border-bottom p-2 pb-4 mt-3 table-container" style={{ overflowY: "auto"}}>

                  {/* Table header */}
                  <div className="w-100 align-items-center justify-content-around border-bottom pb-4 table-mh" style={{}}>
                    <HeaderItem style={{ fontWeight: 'bold' }}>
                      NAME
                    </HeaderItem>
                    <HeaderItem style={{ fontWeight: 'bold' }}>
                      CHAIRMANSHIP
                    </HeaderItem>
                    <HeaderItem style={{ fontWeight: 'bold' }}>
                      POSITION
                    </HeaderItem>
                    <HeaderItem style={{ fontWeight: 'bold' }}>
                      STATUS
                    </HeaderItem>
                    <HeaderItem style={{ fontWeight: 'bold' }}>
                      ACTION
                    </HeaderItem>
                  </div>



                  {/* Table body */}

                  <div className="flex-column w-100 align-items-center justify-content-between table-mh" >


                    {
                      officials.officials.list.length != 0 && officials.officials.list.data.map((i, k) => {


                        return (

                          // Put dynamic className
                          <div className='nav-container d-flex col-lg-12 justify-content-around  row-item-container w-100'>
                            <RowItem>
                              <span className="f-white">
                                {i.full_name}
                              </span>
                            </RowItem>
                            <RowItem>
                              <span className="f-white">
                                {i.chairmanship}
                              </span>
                            </RowItem>
                            <RowItem>
                              <span className="f-white">
                                {i.position}
                              </span>
                            </RowItem>
                            <RowItem>
                              <span className="f-white">
                                {i.status}
                              </span>
                            </RowItem>
                            <RowItem>

                              <div id={k + i.full_name + "button"} className="d-flex">

                                <button
                                  data-bs-toggle="modal" data-bs-target="#exampleModal"
                                  onClick={() => {


                                    setSelectedItem(i)

                                  }}
                                  type="button" class="btn btn-primary">Edit</button>

                                <button
                                  data-bs-toggle="modal" data-bs-target="#deleteConfirmModal"

                                  onClick={() => {
                                    setSelectedItem(i)
                                  }}
                                  type="button" class="btn btn-danger ms-3">Delete</button>

                              </div>
                            </RowItem>
                          </div>

                        )
                      })
                    }

                  </div>

                  {/* Table body */}


                </div>

              </div>
            }
            {/* BO */}

            {/* MANAGE RESIDENT */}

            {
              tab == 1 &&
              <div className="mt-3 d-flex flex-column  justify-content-center w-100 p-5 rounded bg-green">

                <div className="border-bottom p-2 pb-4 mt-3">
                  <h2 className="f-white">Resident Records</h2>
                </div>

                <div className="d-flex mt-4 justify-content-between pb-4 border-bottom">

                  <div className="d-flex align-items-center col-6">
                    <span className="fw-bold f-white">Search:</span>
                    <input
                      value={searchItemList}
                      onChange={(v) => {
                        setSearchItemList(v.target.value)
                        handleKeyDown(v.target.value)
                      }}
                      type="email" className="form-control rounded ms-2" placeholder="Search Name" />
                    
                    <div className="col-6 ms-3 d-flex">
                      <button
                        onClick={() => {
                          setShowImport(true)
                        }}
                        className="primary bg-yellow p-2 rounded d-flex align-items-center justify-content-center" style={{ border: "0px" }}
                      >
                        <i className="bi bi-cloud-upload f-white" style={{ fontSize: "20px", color: "black" }}></i>
                        <span className="fw-bold f-white ms-2" style={{ color: "black" }}>Import</span>
                      </button>

                      <button
                        onClick={() => {
                          dispatch(settingPeding(alluser.isPending == 0 ? 1 : 0))
                          setCurrentPage(1)
                          setCount(count + 1)
                        }}
                        className="ms-3 primary bg-yellow p-2 rounded d-flex align-items-center justify-content-center" style={{ border: "0px" }}
                      >
                        {
                          isPending == 1 ?
                          <i className="bi bi-person-check-fill" style={{ fontSize: "25px" }}></i>
                          :
                          <i className="bi bi-person-exclamation" style={{ fontSize: "25px" }}></i>
                        }
                        <span className="fw-bold f-white ms-2" style={{ color: "black" }}>
                          {alluser.isPending == 0 ? "View Pending Resident" : "View Registered Resident"}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="d-flex">
                    {
                      alluser.isPending == 0 && (
                        <button onClick={() => window.open('https://000040122.xyz/api/downloadUsers')} type="button"
                          className="btn btn-warning bg-yellow border-0 ms-3 d-flex align-items-center justify-content-center"
                          style={{ width: "200px" }}>

                          <i className="bi bi-file-earmark-excel-fill" style={{ fontSize: "28px", color: "green" }}></i>
                          <span style={{ fontWeight: "bold" }}>Download Residents</span>
                        </button>
                      )
                    }

                    {
                      alluser.isPending == 1 && (
                        <button onClick={() => window.open('https://000040122.xyz/api/downloadPendingResidents')} type="button"
                          className="btn btn-warning bg-yellow border-0 ms-3 d-flex align-items-center justify-content-center"
                          style={{ width: "200px" }}>

                          <i className="bi bi-file-earmark-excel-fill" style={{ fontSize: "28px", color: "green", textDecoration: "bold" }}></i>
                          <span style={{ fontWeight: "bold" }}>Download Pending Residents</span>
                        </button>
                      )
                    }

                    {
                      alluser.isPending == 0 &&
                      <button
                        onClick={() => {
                          setIsEdit(false)
                          setIsViewing(false)
                          setShowAddResident(true)
                        }}
                        className="primary bg-yellow p-2 rounded ms-3" style={{ border: "0px", color: "black" }}
                      >
                        <i className="bi bi-plus fw-bold" style={{ fontSize: "20px", color: "black" }}></i>
                        <span className="fw-bold" style={{ color: "black" }}>Add Resident</span>
                      </button>
                    }
                  </div>
                </div>

                {/* Resident Table */}
                <div className="border-bottom p-2 pb-4 mt-3 table-container" style={{ overflowY: "auto"}}>

                  {/* Table header */}
                  <div className="w-100 align-items-center justify-content-around border-bottom pb-4 table-mh">
                    <HeaderItem style={{ fontWeight: 'bold' }}>
                      Fullname
                    </HeaderItem>
                    <HeaderItem style={{ fontWeight: 'bold' }}>
                      Address
                    </HeaderItem>
                    <HeaderItem style={{ fontWeight: 'bold' }}>
                      Age
                    </HeaderItem>
                    <HeaderItem style={{ fontWeight: 'bold' }}>
                      Civil Status
                    </HeaderItem>
                    <HeaderItem style={{ fontWeight: 'bold' }}>
                      Gender
                    </HeaderItem>
                    <HeaderItem style={{ fontWeight: 'bold' }}>
                      Voter Status
                    </HeaderItem>
                    <HeaderItem style={{ fontWeight: 'bold' }}>
                      User Status
                    </HeaderItem>
                    <HeaderItem style={{ fontWeight: 'bold' }}>
                      Appointments
                    </HeaderItem>
                    <HeaderItem style={{ fontWeight: 'bold' }}>
                      Action
                    </HeaderItem>
                  </div>

                  {/* Table body */}

                  <div className="w-100 flex-column  col-lg-12 align-items-center justify-content-between table-mh" >

                    { }
                    {
                      alluser.list.length != 0 && alluser.list.data.map((i, k) => {

                        return (

                          // Put dynamic className
                          <div className='nav-container d-flex col-lg-12 justify-content-around row-item-container w-100'>
                            <RowItem>
                              <span className="f-white">
                                {i.first_name + " " + i.middle_name + " " + i.last_name}
                              </span>
                            </RowItem>
                            <RowItem>
                              <span className="f-white">
                                {`${i.block || ''} ${i.lot || ''} ${i.purok || ''} ${i.street || ''}`}
                              </span>
                            </RowItem>
                            <RowItem>
                              <span className="f-white">
                                {i.age}
                              </span>
                            </RowItem>
                            <RowItem>
                              <span className="f-white">
                                {i.civil_status_type}
                              </span>
                            </RowItem>
                            <RowItem>
                              <span className="f-white">
                                {i.male_female == 0 ? "Male" : "Female"}
                              </span>
                            </RowItem>
                            <RowItem>
                              <span className="f-white">
                                {i.voter_status == 0 ? "Voter" : "Non-Voter"}
                              </span>
                            </RowItem>
                            <RowItem>
                              <span className="f-white pointer" style={{ fontWeight: i.isPendingResident == 1 ? "bold" : "normal", color: i.isPendingResident == 1 ? "yellow" : "#fff" }}>
                                {i.isPendingResident == 1 ? "Pending" : "Registered"}
                              </span>
                            </RowItem>
                            <RowItem>
                              <span className="f-white">
                                {i.appointments_made}
                              </span>
                            </RowItem>
                            <RowItem>

                              <div id={k + i.full_name + "button"} className="d-flex ">

                                <button

                                  onClick={() => {

                                    setIsEdit(true)
                                    setIsViewing(true)
                                    setResident({
                                      ...i,
                                      email: i.Email
                                    })
                                    setShowAddResident(true)
                                  }}
                                  type="button" class="btn btn-primary"><i class="bi bi-eye"></i></button>

                                <button

                                  onClick={() => {

                                    setIsViewing(false)
                                    setIsEdit(true)
                                    setResident({
                                      ...i,
                                      email: i.Email
                                    })
                                    setShowAddResident(true)
                                  }}
                                  type="button" class="btn btn-primary ms-3"><i class="bi bi-pencil"></i></button>

                                <button
                                  data-bs-toggle="modal" data-bs-target="#deleteConfirmModal"

                                  onClick={() => {

                                    setSelectedItem(i)
                                    setResident(i)
                                  }}
                                  type="button" class="btn btn-danger ms-3"><i class="bi bi-trash"></i></button>

                              </div>
                            </RowItem>

                          </div>

                        )
                      })
                    }

                  </div>
                  
                </div>

              </div>
            }

            {/* MANAGE RESIDENT */}

            {/* Schedule */}

            {
              tab == 2 &&
              <div className="mt-3 d-flex flex-column  justify-content-center w-100 p-5 rounded bg-green" >

                <div className="border-bottom p-2 pb-4 mt-3">
                  <h2 className="f-white">Schedule</h2>
                </div>

                <div className="d-flex mt-4 justify-content-between pb-4 border-bottom">

                <div className="d-flex align-items-center">
                  <span className="fw-bold f-white">Search:</span>
                  <input
                    onChange={(v) => {
                      setSearchItemList(v.target.value);
                      handleKeyDown(v.target.value);
                    }}
                    value={searchItemList}
                    type="email" className="form-control rounded ms-2" 
                    id="exampleFormControlInput1"  placeholder="Search Name"
                    style={{ width: '250px' }}
                  />
                </div>

                {/* Date Pickers */}
                <div className="d-flex align-items-center ms-3">
                  {/* From Date */}
                    <div className="d-flex align-items-center">
                      <label className="me-2 f-white">From:</label>
                      <DatePicker
                        selected={fromDate}
                        onChange={(date) => setFromDate(date)}
                        dateFormat="yyyy-MM-dd"
                        className="form-control"
                        placeholderText="yyyy-mm-dd"
                      />
                    </div>

                    {/* To Date */}
                    <div className="d-flex align-items-center ms-3">
                      <label className="me-2 f-white">To:</label>
                      <DatePicker
                        selected={toDate}
                        onChange={(date) => setToDate(date)}
                        dateFormat="yyyy-MM-dd"
                        className="form-control"
                        placeholderText="yyyy-mm-dd"
                        minDate={fromDate}
                      />
                    </div>

                    {/* Download Button */}
                    <button onClick={handleDownloadSchedule} className="btn btn-warning bg-yellow ms-3">
                    <span style={{ fontWeight: "bold" }}>Download</span>
                    </button>

                    {/* Refresh Button */}
                    <button onClick={resetFilters} className="btn btn-secondary ms-2">
                      <span style={{ fontWeight: "bold" }}>Refresh</span>
                    </button>
                  </div>

                  {/* Error Message */}
                  {errorMessage && <div className="text-danger">{errorMessage}</div>}

                  {/* <div >
                    <button
                      onClick={() => {
                        setShowAddResident(true)
                      }}
                      className="primary bg-yellow p-2 rounded" style={{ border: "0px" }}
                    >
                      <i className="bi bi-plus fw-bold" style={{ fontSize: "20px" }}></i>
                      <span className="fw-bold">Add Resident</span>
                    </button>
                  </div> */}
                </div>


                {/*  */}
                <div className="border-bottom p-2 pb-4 mt-3 table-container" style={{ overflowY: "auto"}}>

                  {/* Table header */}
                  <div className="w-100 align-items-center justify-content-around border-bottom pb-4 table-mh" style={{}}>

                    <HeaderItem style={{ fontWeight: 'bold' }}>
                      Queing
                    </HeaderItem>
                    <HeaderItem style={{ fontWeight: 'bold' }}>
                      Date
                    </HeaderItem>
                    <HeaderItem style={{ fontWeight: 'bold' }}>
                      Name
                    </HeaderItem>
                    <HeaderItem style={{ fontWeight: 'bold' }}>
                      Service
                    </HeaderItem>
                    <HeaderItem style={{ fontWeight: 'bold' }}>
                      Purpose
                    </HeaderItem>
                    <HeaderItem style={{ fontWeight: 'bold' }}>
                      Status
                    </HeaderItem>
                    <HeaderItem style={{ fontWeight: 'bold' }}>
                      Action
                    </HeaderItem>
                  </div>



                  {/* Table body */}

                  <div className="d-flex flex-column  col-lg-12 align-items-center justify-content-between table-mh" >

                    {
                      alluser.list.length != 0 && alluser.list.data.map((i, k) => {
                        const paymentStatus = i.payment_status ? i.payment_status : 'Unpaid';
                        const combinedStatus = `${i.status}/${paymentStatus}`;
                        return (

                          // Put dynamic className
                          <div className='nav-container d-flex col-lg-12 justify-content-around row-item-container w-100'>
                            <RowItem>
                              <span className="f-white">
                                {i.appointment_id}
                              </span>
                            </RowItem>
                            <RowItem>
                              <span className="f-white">
                                {moment(i.schedule_date).format('MM/DD/YYYY')}
                              </span>
                            </RowItem>
                            <RowItem>
                              <span className="f-white">
                                {i.full_name}
                              </span>
                            </RowItem>
                            <RowItem>
                              <span className="f-white">
                                {i.document_type}
                              </span>
                            </RowItem>
                            <RowItem>
                              <span className="f-white">
                                {i.purpose}
                              </span>
                            </RowItem>
                            <RowItem>
                              <span className="f-white">
                                {combinedStatus}
                              </span>
                            </RowItem>
                            { }
                            {
                              i.status != "Rejected" ?
                                <RowItem>
                                  {
                                    i.status == "Pending" ?
                                      <div id={k + i.full_name + "button"} className="d-flex ">

                                        <button

                                          onClick={() => {

                                            setLoading()
                                            setSelectedSchedule(i)

                                            let merge = {
                                              token: token.token,
                                              id: i.appointment_id,
                                              status: 0
                                            }



                                            const fetchData = async () => {

                                              try {
                                                const result = await dispatch(approveOrRejectAppointmentApi(merge)).unwrap();


                                                if (result.success) {
                                                  setCount(count + 1)
                                                  setLoading(false)
                                                  setSuccess(true)
                                                  setShowSuccess(true)
                                                  SetMessage("Success in approving appointment.")
                                                }
                                                // setCount(count + 1)
                                                // Handle success, e.g., navigate to another page
                                              } catch (error) {

                                                // Handle error, e.g., show an error message
                                              }

                                              setLoading(false)
                                            };

                                            fetchData();

                                          }}
                                          type="button" class="btn btn-primary">Approve</button>

                                        <button 
                                          onClick={() => {
                                            setSelectedAppointment(i);
                                            setShowReasonModal(true)
                                          }}
                                          type="button"
                                          className="btn btn-danger ms-3"
                                        >
                                          Reject
                                        </button>

                                        {/* <button
                                          onClick={() => {

                                            setLoading()
                                            setSelectedSchedule(i)

                                            let merge = {
                                              token: token.token,
                                              id: i.appointment_id,
                                              status: 1
                                            }



                                            const fetchData = async () => {

                                              try {
                                                const result = await dispatch(approveOrRejectAppointmentApi(merge)).unwrap();


                                                if (result.success) {
                                                  setCount(count + 1)
                                                  setLoading(false)
                                                  setSuccess(true)
                                                  setShowSuccess(true)
                                                  SetMessage("Success in rejecting appointment.")
                                                }
                                                // setCount(count + 1)
                                                // Handle success, e.g., navigate to another page
                                              } catch (error) {

                                                // Handle error, e.g., show an error message
                                              }

                                              setLoading(false)
                                            };

                                            fetchData();

                                          }}
                                          type="button" class="btn btn-danger ms-3">Reject</button> */}

                                      </div>

                                      :

                                      <div id={k + i.full_name + "button"} className="d-flex">

                                        <button

                                          onClick={() => {
                                            window.open(`https://000040122.xyz/api/downloadAndReleaseDocument?appointment_id=${i.appointment_id}&download=0`)


                                          }}
                                          type="button" class="btn btn-primary">View</button>

                                        <button
                                          onClick={() => {
                                            if (i.payment_status !== "Paid") {  // Prevent clicking if already paid
                                              setLoading();  // Show a loading state if you have it
                                              dispatch(markAsPaidApi({ id: i.appointment_id, token: token.token }))
                                                .then((result) => {
                                                  if (result.meta.requestStatus === 'fulfilled') {
                                                    setCount(count + 1);  // Update count if needed
                                                    setLoading(false);    // Stop loading
                                                    setSuccess(true);     // Show success state
                                                    setShowSuccess(true); // If you have a success modal or notification
                                                    SetMessage("Success in marking document as Paid."); // Set success message
                                                  } else {
                                                    SetMessage("Failed to mark the document as Paid.");
                                                  }
                                                })
                                                .catch(error => {
                                                  setLoading(false);
                                                  console.error('Error marking appointment as paid:', error);
                                                  SetMessage("An error occurred while marking as Paid.");
                                                });
                                            }
                                          }}
                                          type="button"
                                          className="btn btn-warning ms-3"
                                          disabled={i.payment_status === "Paid"}  // Disable button if already paid
                                        >
                                          {i.payment_status === "Paid" ? "Paid" : "Paid"}
                                        </button>

                                      </div>
                                  }
                                </RowItem>

                                :
                                <RowItem>

                                </RowItem>
                            }

                          </div>

                        )
                      })
                    }

                  </div>

                  {/* Table body */}
                </div>

              </div>
            }

            {/* Schedule */}



            {/* Barangay services */}

            {
              tab == 3 &&
              <div className="mt-3 d-flex flex-column  justify-content-center w-100 p-5 rounded bg-green" >

                <div className="border-bottom p-2 pb-4 mt-3">
                  <h2 className="f-white">List of Document Type</h2>
                </div>

                <div className="d-flex mt-4 justify-content-between pb-4 border-bottom">

                  <div className="d-flex align-items-center">
                    <span className="fw-bold f-white">Search:</span>
                    <input
                      // onKeyDown={handleKeyDown}
                      onChange={(v) => {
                        setSearchItemList(v.target.value)
                        handleKeyDown(v.target.value)
                      }}
                      value={searchItemList}
                      type="email" className="form-control rounded ms-2" 
                        id="exampleFormControlInput1" placeholder=" Search Document Type"
                        style={{ width: '250px' }} 
                    />
                  </div>

                  <div className="d-flex align-items-center">
                    <span className="fw-bold f-white">Schedule Limit: </span>
                    {/* Dropdown for Slot Limit */}
                    <select
                      id="slotLimitDropdown"
                      className="form-select me-2 ms-2"
                      style={{ width: "150px" }}
                      value={slotLimit}
                      onChange={(e) => setSlotLimit(e.target.value)} // Update state
                    >
                      {[5, 10, 20, 50, 75, 100, 125, 150, 175, 200].map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>

                    {/* Change Button */}
                    <button className="btn btn-primary" onClick={handleSlotLimitChange}>
                      Change
                    </button>
                  </div>

                  <div >
                    <button
                      onClick={() => {

                        setSSS({
                          service: ''
                        })
                        setCost(0)
                        setIsCert(1)
                        setDocId('')
                        setServiceDesc('')
                        setIsEdit(false)
                      }}
                      data-bs-toggle="modal" data-bs-target="#addBarangayServices"
                      className="primary bg-yellow p-2 rounded border-0"
                    >
                      <i className="bi bi-plus fw-bold f-white" style={{ fontSize: "20px", color: "black" }}></i>
                      <span className="fw-bold f-white" style={{ color: "black" }}>Document Type</span>
                    </button>
                  </div>
                </div>


                {/*  */}
                <div className="border-bottom p-2 pb-4 mt-3 table-container" style={{ overflowY: "auto"}}>

                  {/* Table header */}
                  <div className="w-100 align-items-center justify-content-around border-bottom pb-4 table-mh" style={{}}>
                    <HeaderItem style={{ fontWeight: 'bold' }}>
                      No.
                    </HeaderItem>
                    <HeaderItem style={{ fontWeight: 'bold' }}>
                      Service
                    </HeaderItem>
                    <HeaderItem style={{ fontWeight: 'bold' }}>
                      Date
                    </HeaderItem>
                    <HeaderItem style={{ fontWeight: 'bold' }}>
                      Cost
                    </HeaderItem>
                    <HeaderItem style={{ fontWeight: 'bold' }}>
                      Action
                    </HeaderItem>
                  </div>



                  {/* Table body */}

                  <div className="d-flex flex-column  col-lg-12 align-items-center justify-content-between table-mh" >

                    {
                      documentList.list.length != 0 && documentList.list.data.map((i, k) => {
                        return (

                          // Put dynamic className
                          <div className='nav-container d-flex col-lg-12 justify-content-around row-item-container w-100'>
                            <RowItem>
                              <span className="f-white">
                                {i.id}
                              </span>
                            </RowItem>
                            <RowItem>
                              <span className="f-white">
                                {i.service}
                              </span>
                            </RowItem>
                            <RowItem>
                              <span className="f-white">
                                {i.created_at}
                              </span>
                            </RowItem>
                            <RowItem>
                              <span className="f-white">
                                {i.price}
                              </span>
                            </RowItem>
                            <RowItem>

                              <div id={k + i.service + "button"} className="d-flex">

                                <button
                                  data-bs-toggle="modal" data-bs-target="#addBarangayServices"
                                  onClick={() => {

                                    setDocId(i.id)
                                    setSSS({
                                      ...sss, ...{
                                        service: i.service,
                                      }
                                    })

                                    setCost(i.price)

                                    setServiceDesc(i.description)



                                    setIsEdit(true)
                                  }}
                                  type="button" class="btn btn-primary"><i class="bi bi-pencil"></i></button>

                                <button
                                  onClick={() => {

                                    viewCreatedTemplate(i)
                                    setSelectedItem(i)
                                  }}
                                  type="button" class="btn btn-warning ms-3"><i class="bi bi-eye"></i></button>

                                <button
                                  data-bs-toggle="modal" data-bs-target="#deleteConfirmModal"

                                  onClick={() => {
                                    setSelectedItem(i)
                                  }}
                                  type="button" class="btn btn-danger ms-3"><i class="bi bi-trash"></i></button>

                              </div>
                            </RowItem>
                          </div>

                        )
                      })
                    }

                  </div>

                  {/* Table body */}
                </div>




              </div>
            }

            {/* Blotter */}

            {
              tab == 4 &&
              <div className="mt-3 d-flex flex-column  justify-content-center w-100 p-5 rounded bg-green" >

                <div className="border-bottom p-2 pb-4 mt-3">
                  <h2 className="f-white">Blotter</h2>
                </div>

                <div className="d-flex mt-4 justify-content-between pb-4 border-bottom">
                  <div className="d-flex align-items-center flex-wrap">
                    <label className="me-2 fw-bold f-white">Search:</label>
                      <input
                        // onKeyDown={handleKeyDown}
                        value={searchItemList}
                        onChange={(v) => {
                          setSearchItemList(v.target.value)
                          handleKeyDown(v.target.value)
                        }}
                        type="email" className="form-control rounded ms-2" 
                          id="exampleFormControlInput1" placeholder=" Search Name"
                          style={{ width: '250px' }}/>
                  </div>

                  {/* Date Pickers */}
                  <div className="d-flex align-items-center ms-3">
                    {/* From Date */}
                    <div className="d-flex align-items-center ms-3">
                      <label className="me-2 f-white">From:</label>
                      <DatePicker
                        selected={fromDate}
                        onChange={(date) => setFromDate(date)}
                        dateFormat="yyyy-MM-dd"
                        className="form-control"
                        placeholderText="yyyy-mm-dd"
                        style={{ width: '150px' }}  // Adjust width for better visibility
                      />
                    </div>

                    {/* To Date */}
                    <div className="d-flex align-items-center ms-3">
                      <label className="me-2 f-white">To:</label>
                      <DatePicker
                        selected={toDate}
                        onChange={(date) => setToDate(date)}
                        dateFormat="yyyy-MM-dd"
                        className="form-control"
                        placeholderText="yyyy-mm-dd"
                        minDate={fromDate}
                        style={{ width: '150px' }}  // Adjust width for better visibility
                      />
                    </div>

                    {/* Category Dropdown */}
                    <div className="d-flex align-items-center ms-3">
                      <label className="me-2 f-white">Category:</label>
                      <select 
                        className="form-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{ width: '150px' }}  // Adjust width as needed
                      >
                        <option value="">Select Category</option>
                        <option value="Assault">Assault</option>
                        <option value="Verbal Abuse">Verbal Abuse</option>
                        <option value="Theft">Theft</option>
                        <option value="Domestic Violence">Domestic Violence</option>
                        <option value="Vandalism">Vandalism</option>
                        <option value="Trespassing">Trespassing</option>
                        <option value="Public Disturbance">Public Disturbance</option>
                        <option value="Disorderly Conduct">Disorderly Conduct</option>
                        <option value="Child Welfare Concern">Child Welfare Concern</option>
                        <option value="Harassment">Harassment</option>
                        <option value="Property Conflict">Property Conflict</option>
                        <option value="Neighbor Conflict">Neighbor Conflict</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>

                    {/* Download Button */}
                    <button onClick={handleDownloadClick} className="btn btn-warning bg-yellow ms-3">
                    <span style={{ fontWeight: "bold" }}>Download</span>
                    </button>

                    {/* Non-Disclosure Notice Modal */}
                    <NonDisclosureModal
                      show={showModal}
                      onClose={handleCloseModal}
                      onConfirm={handleConfirm}
                    />

                    {/* Refresh Button */}
                    <button onClick={resetFilters} className="btn btn-secondary ms-2">
                    <span style={{ fontWeight: "bold" }}>Refresh</span>
                    </button>
                  </div>

                  {/* Error Message */}
                  {errorMessage && <div className="text-danger">{errorMessage}</div>}


                  <div >
                    <button
                      onClick={() => {
                        setBlotter({
                          complainee_name: '',
                          complainant_name: '',
                          status_resolved: '',
                          complaint_remarks: '',
                          is_resident: null,
                          complainee_id: '',
                          complainant_id: '',
                          search: ''
                        })
                        setShowBlotter(true)

                      }}
                      className="primary bg-yellow p-2 rounded border-0"
                    >
                      <i className="bi bi-plus fw-bold" style={{ fontSize: "20px" }}></i>
                      <span className="fw-bold">Create Blotter</span>
                    </button>
                  </div>
                </div>


                {/*  */}
                <div className="border-bottom p-2 pb-4 mt-3 table-container" style={{ overflowY: "auto"}}>

                  {/* Table header */}
                  <div className="w-100 align-items-center justify-content-around border-bottom pb-4 table-mh" style={{}}>
                    <HeaderItem style={{ fontWeight: 'bold' }}>
                      Complainant
                    </HeaderItem>
                    <HeaderItem style={{ fontWeight: 'bold' }}>
                      Respondent
                    </HeaderItem>
                    <HeaderItem style={{ fontWeight: 'bold' }}>
                      Date
                    </HeaderItem>
                    <HeaderItem style={{ fontWeight: 'bold' }}>
                      Status
                    </HeaderItem>
                    <HeaderItem style={{ fontWeight: 'bold' }}>
                      Action
                    </HeaderItem>
                  </div>



                  {/* Table body */}

                  { }

                  <div className="d-flex flex-column  col-lg-12 align-items-center justify-content-between table-mh" >

                    {
                      alluser.blotterlist.length != 0 && alluser.blotterlist.data.map((i, k) => {
                        return (

                          // Put dynamic className
                          <div className='nav-container d-flex col-lg-12 justify-content-around row-item-container w-100'>
                            <RowItem>
                              <span className="f-white">
                                {i.complainant_name}
                              </span>
                            </RowItem>
                            <RowItem>
                              <span className="f-white">
                                {i.complainee_name}
                              </span>
                            </RowItem>
                            <RowItem>
                              <span className="f-white">
                                {moment(i.created_at).format('MM/DD/YYYY')}
                              </span>
                            </RowItem>
                            <RowItem>
                              <span className="f-white">
                                {i.status_resolved == 0 && "Ongoing"}
                                {i.status_resolved == 1 && "Settled"}
                                {i.status_resolved == 2 && "Unresolved"}
                                {i.status_resolved == 3 && "Dismissed"}
                              </span>
                            </RowItem>
                            <RowItem>
                              <div id={k + i.service + "button"} className="d-flex">

                                {/* <button
                                  data-bs-toggle="modal" data-bs-target="#addBarangayServices"
                                  onClick={() => {


                                  }}
                                  type="button" class="btn btn-primary">Edit</button> */}

                                <button
                                  onClick={() => {
                                    setIsViewing(true)
                                    setShowBlotter(true)
                                    setBlotter(i)
                                  }}
                                  type="button" class="btn btn-primary ms-3">View</button>

                                <button
                                  onClick={() => window.open(`https://000040122.xyz/api/downloadBlotterPDF?blotter_id=${i.id}&download=0`)}
                                  type="button" class="btn btn-warning ms-3">Download
                                </button>

                                {/* <button
                                  data-bs-toggle="modal" data-bs-target="#deleteConfirmModal"

                                  onClick={() => {

                                  }}
                                  type="button" class="btn btn-danger ms-3">Delete</button> */}

                              </div>
                            </RowItem>
                          </div>

                        )
                      })
                    }

                  </div>

                  {/* Table body */}
                </div>




              </div>
            }

            {/* Blotter */}

            {/* Barangay services */}

            {
              tab == 6 &&
              <div className="mt-3 d-flex flex-column  justify-content-center w-100 p-5 rounded bg-green" >

                <div className="border-bottom p-2 pb-4 mt-3">
                  <h2 className="f-white fw-bold">Admin logs</h2>
                </div>

                <div className="d-flex mt-4 justify-content-between pb-4 border-bottom">

                  <div className="d-flex align-items-center">
                    <span className="fw-bold f-white">Search:</span>
                    <input
                      // onKeyDown={handleKeyDown}
                      onChange={(v) => {
                        setSearchItemList(v.target.value)
                        handleKeyDown(v.target.value)
                      }}
                      value={searchItemList}
                      type="email" className="form-control rounded ms-2" 
                        id="exampleFormControlInput1" style={{ width: '250px' }} 
                    />
                  </div>

                </div>

                {/*  */}
                <div className="border-bottom p-2 pb-4 mt-3 table-container" style={{ overflowY: "auto"}}>
                  
                {/* Table header */}
                <div className="p-2 pb-4 mt-3">
                  <div className="w-100 align-items-center justify-content-around border-bottom pb-4 table-mh" style={{}}>
                    <HeaderItem style={{ fontWeight: 'bold', fontSize: '14px' }}>
                      No.
                    </HeaderItem>
                    <HeaderItem style={{ fontWeight: 'bold', fontSize: '14px' }}>
                      Action type
                    </HeaderItem>
                    <HeaderItem style={{ fontWeight: 'bold', fontSize: '14px' }}>
                      Description
                    </HeaderItem>
                    <HeaderItem style={{ fontWeight: 'bold', fontSize: '14px' }}>
                      Date
                    </HeaderItem>
                    <HeaderItem style={{ fontWeight: 'bold', fontSize: '14px' }}>
                      Action taker
                    </HeaderItem>
                  </div>
                </div>


                  {/* Table body */}
                  { }

                  <div className="d-flex flex-column  col-lg-12 align-items-center justify-content-between table-mh" >

                    { }
                    {
                      logs && logs.length != 0 && logs.data.map((i, k) => {
                        return (

                          // Put dynamic className
                          <div className='nav-container d-flex col-lg-12 justify-content-around row-item-container w-100'>
                            <RowItem>
                              <span className="f-white">
                                {i.action_target_id}
                              </span>
                            </RowItem>
                            <RowItem>
                              <span className="f-white">
                                {i.action_type}
                              </span>
                            </RowItem>
                            <RowItem>
                              <span className="f-white">
                                {i.log_details}
                              </span>
                            </RowItem>
                            <RowItem>
                              <span className="f-white">
                                {i.created_at}
                              </span>
                            </RowItem>

                            <RowItem>
                              <span className="f-white">
                                {i.admin_name}
                              </span>
                            </RowItem>
                          </div>

                        )
                      })
                    }

                  </div>

                  {/* Table body */}
                </div>

              </div>
            }
            

            {
              tab != 10 &&
              <div className="col-12 d-flex align-items-center justify-content-between mt-5 mb-5">
                <div>

                  Showing <span className="fw-bold">{currentPage}</span> of <span class="fw-bold">{totalPage}</span>
                </div>

                <div className="d-flex align-items-center justify-content-center">

                  <div
                    onClick={() => paginate(null, 0)}
                    className="bg-yellow rounded p-2 f-white d-flex align-items-center justify-content-center" style={{ width: "70px" }}>
                    Prev
                  </div>

                  <div className="d-flex align-items-center justify-content-center bg-green f-white ms-2 me-2" style={{ height: "50px", width: "50px", borderRadius: "25px" }}>
                    {currentPage}
                  </div>


                  <div
                    onClick={() => paginate(null, 1)}
                    className="bg-yellow rounded p-2 f-white d-flex align-items-center justify-content-center" style={{ width: "70px" }}>
                    Next
                  </div>

                </div>

              </div>
            }



          </div>

          {/* Modal */}
          <div class="modal fade" id="exampleModal" tabindex="-1" data-bs-backdrop="static" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">Edit</h1>
                </div>
                <div class="modal-body">
                  <div class="mb-3">
                    <label class="form-label fw-bold">{selectedItem != null && selectedItem.full_name}</label>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Chairmanship</label>
                    <input
                      value={selectedItem != null ? selectedItem.chairmanship : ''}
                      onChange={(val) => {
                        if (selectedItem != null) {
                          const updatedItem = { ...selectedItem, chairmanship: val.target.value };
                          setSelectedItem(updatedItem);
                        }
                      }}
                      class="form-control" />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Position</label>
                    <input
                      value={selectedItem != null ? selectedItem.position : ''}
                      onChange={(val) => {
                        if (selectedItem != null) {
                          const updatedItem = { ...selectedItem, position: val.target.value };
                          setSelectedItem(updatedItem);
                        }
                      }}
                      class="form-control" />
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button
                    onClick={() => updateOfficial()}
                    type="button"
                    class="btn btn-primary bg-green"
                    data-bs-dismiss="modal"
                    disabled={!selectedItem?.position} // Disable if required fields are empty
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Add official */}
          
          <div class="modal fade" id="addOfficialModal" tabindex="-1" aria-labelledby="addOfficialModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="addOfficialModalLabel">Add</h1>
                </div>
                <div class="modal-body">
                  <div class="mb-3">
                    <label class="form-label">Search name</label>
                    <input
                      id='selctednameadd'
                      value={searchItemList}
                      onChange={(val) => {
                        searchAddOfficial(val.target.value);
                      }}
                      class="form-control" />
                    {
                      searchVal !== "" &&
                      <div className="box position-absolute col-lg-12" style={{ maxHeight: "300px", overflow: "scroll" }}>
                        {
                          searchOfficial.map((i, k) => (
                            <div
                              key={k}
                              onClick={() => {
                                document.getElementById('selctednameadd').value = `${i.first_name} ${i.middle_name} ${i.last_name}`;
                                setSearchVal('');
                                setSelectedSearchItem(i);
                              }}
                              className="search-item pointer"
                            >
                              <span>{`${i.first_name} ${i.middle_name} ${i.last_name}`}</span>
                            </div>
                          ))
                        }
                      </div>
                    }
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Chairmanship</label>
                    <input
                      value={selectedSearchItem != null ? selectedSearchItem.chairmanship : ''}
                      onChange={(val) => {
                        if (selectedSearchItem != null) {
                          const updatedItem = { ...selectedSearchItem, chairmanship: val.target.value };
                          setSelectedSearchItem(updatedItem);
                        }
                      }}
                      class="form-control" />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Position</label>
                    <input
                      value={selectedSearchItem != null ? selectedSearchItem.position : ''}
                      onChange={(val) => {
                        if (selectedSearchItem != null) {
                          const updatedItem = { ...selectedSearchItem, position: val.target.value };
                          setSelectedSearchItem(updatedItem);
                        }
                      }}
                      class="form-control" />
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    onClick={() => addOfficial()}
                    class="btn btn-primary bg-green"
                    disabled={ !selectedSearchItem?.position} // Disable if required fields are empty
                  >
                    Save changes!!
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Add official */}


          {/* Add Resident */}

          { }

          {
            showAddResident &&

            <div class="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} id="addResidentModal" tabindex="-1" aria-labelledby="addResidentModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content" style={{ maxHeight: "720px", overflowY: "scroll" }}>
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="addOfficialModalLabel"> {isEdit ? (!isViewing ? "Edit Resident" : "View Resident") : "Add Resident"}</h1>
                  </div>
                  <div class="modal-body">

                    {
                      isViewing &&

                    <div class="mb-3">
                      <label class="form-label">Appointment made</label>
                      <input
                        disabled={isViewing}
                        value={resident.appointments_made}
                        onChange={(val) => {
                          setResident({
                            ...resident, ...{
                              first_name: val.target.value
                            }
                          })

                        }}
                        class="form-control" />

                    </div>
                  }

                    <div class="mb-3">
                      <label class="form-label">Block</label>
                      <input
                        id='blockinput'
                        disabled={isViewing}
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
                        class="form-control" />
                    </div>

                    <div class="mb-3">
                      <label class="form-label">Lot</label>
                      <input
                        id='lotinput'
                        disabled={isViewing}
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
                        class="form-control" />
                    </div>

                    <div class="mb-3">
                      <label class="form-label">Purok</label>
                      <input
                        id='purokinput'
                        disabled={isViewing}
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
                        class="form-control" />
                    </div>

                    <div class="mb-3">
                      <label class="form-label">Street</label>
                      <input
                        id='streetinput'
                        disabled={isViewing}
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
                        class="form-control" />
                    </div>  

                    <div class="mb-3">
                      <label class="form-label">Household No.</label>
                      <input
                        id='housenoinput'
                        disabled={isViewing}
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
                        class="form-control" />
                    </div>

                    <div class="mb-3">
                      <label class="form-label">First name</label>
                      <input
                        id='fnameinput'
                        disabled={isViewing}
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
                      <label
                        class="form-label">Middle name</label>
                      <input
                        disabled={isViewing}
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
                        disabled={isViewing}
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

                      {/* Check if we are in view mode */}
                      {isViewing ? (
                        // Display concatenated value directly when viewing
                        <input
                          disabled={true}
                          value={resident.house_and_lot_ownership || ''} // Display the value directly from the database
                          class="form-control"
                        />
                      ) : (
                        // Show dropdown and additional input for "Other" option when editing/adding a resident
                        <>
                          {/* Dropdown for Yes/No/Other */}
                          <select
                            value={
                              resident.house_and_lot_ownership && resident.house_and_lot_ownership.startsWith('Other')
                                ? 'Other'
                                : resident.house_and_lot_ownership || ''
                            }
                            onChange={(val) => {
                              const selectedValue = val.target.value;
                              if (selectedValue === 'Other') {
                                // If "Other" is selected, allow input of a reason
                                setResident({
                                  ...resident,
                                  house_and_lot_ownership: 'Other: ', // Placeholder for concatenation with the reason
                                });
                              } else {
                                // For Yes/No, no additional input field is required
                                setResident({
                                  ...resident,
                                  house_and_lot_ownership: selectedValue,
                                });
                                
                              }
                            }}
                            class="form-select"
                          >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                            <option value="Other">Other</option>
                          </select>

                          {/* Show input field if "Other" is selected */}
                          {resident.house_and_lot_ownership &&
                            resident.house_and_lot_ownership.startsWith('Other') && (
                              <div class="mb-3 mt-2">
                                <label class="form-label">Please specify</label>
                                <input
                                  type="text"
                                  placeholder="Specify reason"
                                  value={resident.house_and_lot_ownership.split(': ')[1] || ''} // Extract the reason part from the string
                                  onChange={(val) => {
                                    const newReason = val.target.value;
                                    setResident({
                                      ...resident,
                                      house_and_lot_ownership: `Other: ${newReason}`, // Store concatenated value
                                    });
                                  }}
                                  class="form-control"
                                />
                              </div>
                            )}
                        </>
                      )}
                    </div>

                    {/* Living with House and Lot Owner (Yes/No/Other: Please specify) */}
                    <div class="mb-3">
                      <label class="form-label">Living with House and Lot Owner (Yes/No/Other: Please specify)</label>

                      {isViewing ? (
                        <input
                          disabled={true}
                          value={resident.living_with_owner || ''} // Display the value directly from the database
                          class="form-control"
                        />
                      ) : (
                        <>
                          <select
                            value={
                              resident.living_with_owner && resident.living_with_owner.startsWith('Other')
                                ? 'Other'
                                : resident.living_with_owner || '' // Ensure value is always a string
                            }
                            onChange={(val) => {
                              const selectedValue = val.target.value;
                              if (selectedValue === 'Other') {
                                setResident({
                                  ...resident,
                                  living_with_owner: 'Other: ', // Placeholder for concatenation with the reason
                                });
                              } else {
                                setResident({
                                  ...resident,
                                  living_with_owner: selectedValue,
                                });
                              }
                            }}
                            class="form-select"
                          >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                            <option value="Other">Other</option>
                          </select>

                          {resident.living_with_owner && resident.living_with_owner.startsWith('Other') && (
                            <div class="mb-3 mt-2">
                              <label class="form-label">Please specify</label>
                              <input
                                type="text"
                                placeholder="Specify reason"
                                value={resident.living_with_owner.split(': ')[1] || ''} // Extract the reason part from the string
                                onChange={(val) => {
                                  const newReason = val.target.value;
                                  setResident({
                                    ...resident,
                                    living_with_owner: `Other: ${newReason}`, // Store concatenated value
                                  });
                                }}
                                class="form-control"
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Renting (Yes/No/Other: Please specify) */}
                    <div class="mb-3">
                      <label class="form-label">Renting (Yes/No/Other: Please specify)</label>

                      {isViewing ? (
                        <input
                          disabled={true}
                          value={resident.renting || ''} // Display the value directly from the database
                          class="form-control"
                        />
                      ) : (
                        <>
                          <select
                            value={
                              resident.renting && resident.renting.startsWith('Other')
                                ? 'Other'
                                : resident.renting || '' // Ensure value is always a string
                            }
                            onChange={(val) => {
                              const selectedValue = val.target.value;
                              if (selectedValue === 'Other') {
                                setResident({
                                  ...resident,
                                  renting: 'Other: ',
                                });
                              } else {
                                setResident({
                                  ...resident,
                                  renting: selectedValue,
                                });
                              }
                            }}
                            class="form-select"
                          >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                            <option value="Other">Other</option>
                          </select>

                          {resident.renting && resident.renting.startsWith('Other') && (
                            <div class="mb-3 mt-2">
                              <label class="form-label">Please specify</label>
                              <input
                                type="text"
                                placeholder="Specify reason"
                                value={resident.renting.split(': ')[1] || ''} // Extract the reason part from the string
                                onChange={(val) => {
                                  const newReason = val.target.value;
                                  setResident({
                                    ...resident,
                                    renting: `Other: ${newReason}`, // Store concatenated value
                                  });
                                }}
                                class="form-control"
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Relationship to House and Lot Owner */}
                    <div class="mb-3">
                      <label class="form-label">Relationship to House and Lot Owner</label>
                      <input
                        id='relationinput'
                        disabled={isViewing}
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

                    <div className="mb-3 d-flex flex-column">
                      <label className="form-label">Birthday</label>
                      <span className="fw-bold">{moment(resident.birthday).format('YYYY-MM-DD')}</span>

                      {!isViewing &&
                        <input
                          id="bdayinput"
                          type="date"
                          className="mt-3 form-control"
                          disabled={isViewing}
                          value={moment(resident.birthday).format("YYYY-MM-DD")}
                          onChange={(e) => {
                            // Update the resident's birthday
                            setResident({
                              ...resident, 
                              birthday: moment(e.target.value).format("YYYY-MM-DD")
                            });
                            setStartDate(moment(e.target.value).format("YYYY-MM-DD"));
                          }}
                        />
                      }
                    </div>


                    <div class="mb-3">
                      <label class="form-label">Civil Status</label>
                      <select
                        disabled={isViewing}
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

                    {/* Has Pets 
                    <div class="mb-3">
                      <label class="form-label">Has Pets (Specify Type and Number - if none N/A)</label>
                      <input
                        id='haspetsinput'
                        disabled={isViewing}
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
                    </div>*/}

                    {/* Pets Vaccinated (Yes - When / No) 
                    <div class="mb-3">
                      <label class="form-label">Pets Vaccinated (Yes - When / No)</label>*/}
                      
                      {/* Check if we are in view mode 
                      {isViewing ? (
                        // Display concatenated value directly when viewing
                        <input
                          disabled={true}
                          value={resident.pet_vaccination || ''} // Display the value directly from the database
                          class="form-control"
                        />
                      ) : (
                        // Show dropdown and date input for editing/adding a resident 
                        <>*/}
                          {/* Dropdown for Yes/No 
                          <select
                            value={
                              resident.pet_vaccination? (resident.pet_vaccination.startsWith('Yes') 
                                ? 'Yes' 
                                : 'No') : ''
                            }
                            onChange={(val) => {
                              const selectedValue = val.target.value;
                              if (selectedValue === 'No') {
                                // If "No" is selected, clear the vaccination date
                                setResident({
                                  ...resident,
                                  pet_vaccination: 'No',
                                  vaccination_date: null,
                                });
                              } else {
                                setResident({
                                  ...resident,
                                  pet_vaccination: 'Yes',
                                });
                              }
                            }}
                            class="form-select"
                          >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>*/}

                          {/* Show date input if "Yes" is selected 
                          {resident.pet_vaccination && resident.pet_vaccination.startsWith('Yes') && (
                            <div class="mb-3 mt-2">
                              <label class="form-label">Vaccination Date</label>
                              <input
                                type="text"
                                placeholder="YYYY/MM/DD"
                                value={
                                  resident.pet_vaccination.split(', ')[1] || '' // Extract the date part from the string
                                }
                                onChange={(val) => {
                                  const newDate = val.target.value;
                                  setResident({
                                    ...resident,
                                    pet_vaccination: `Yes, ${newDate}`, // Store concatenated value
                                  });
                                }}
                                class="form-control"
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>*/}

                    <div class="mb-3">
                      <label class="form-label">Email</label>
                      <input
                        id='emailinput'
                        disabled={isViewing}
                        value={resident.email == undefined ? resident.email : resident.email}
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

                    <div class="mb-3">
                      <label class="form-label">Phone number</label>
                      <small className="ms-3">Format: 09xxxxxxxxx</small>
                      <input
                        id='phoneinput'
                        disabled={isViewing}
                        value={resident.cell_number}
                        onChange={(val) => {

                          const numberPattern = /^\d+(\.\d+)?$/; // Matches integers and decimals
                          let validate = numberPattern.test(val.target.value);


                          if(validate){
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

                    <div id='voter_status_input' class="mb-3">
                      <label class="form-label">Voter Status</label>
                      <div class="form-check">
                        <input
                          disabled={isViewing}
                          checked={resident.voter_status === 0 ? true : false}
                          onChange={() => {


                            document.getElementById('voter_status_input').style.border = '0px solid #dee2e6'


                            setResident({
                              ...resident, ...{
                                voter_status: 0
                              }
                            })
                          }}
                          class="form-check-input" type="radio" name="voterStatus" id="voterRadioVoter" />
                        <label class="form-check-label" for="flexRadioDefault2">
                          Voter
                        </label>
                      </div>
                      { }
                      <div class="form-check">
                        <input
                          disabled={isViewing}
                          checked={resident.voter_status === 1 ? true : false}
                          onChange={() => {


                            document.getElementById('voter_status_input').style.border = '0px solid #dee2e6'

                            setResident({
                              ...resident, ...{
                                voter_status: 1
                              }
                            })
                          }}
                          class="form-check-input" type="radio" name="voterStatus" id="voterRadioNonVoter" />
                        <label class="form-check-label" for="flexRadioDefault2">
                          Non-Voter
                        </label>
                      </div>

                    </div>

                    <div id='genderinput' class="mb-3">
                      <label class="form-label">Gender</label>
                      <div class="form-check">
                        <input
                          disabled={isViewing}
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
                          disabled={isViewing}
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
                      <label class="form-label">ID Type</label>
                      <select
                        disabled={isViewing || isEdit}
                        value={resident.id_type}
                        id="idtypeinput"
                        onChange={(v) => {
                          document.getElementById('idtypeinput').style.border = '1px solid #dee2e6';
                          setResident({
                            ...resident,
                            id_type: v.target.value,
                          });
                        }}
                        class="form-select"
                        aria-label="Default select example"
                      >
                        <option value="" disabled>
                            Select an ID type
                        </option>
                        <option value="PhilSys National ID">PhilSys National ID</option>
                        <option value="Philippine Passport">Philippine Passport</option>
                        <option value="Driver's License">Driver's License</option>
                        <option value="Unified Multi-Purpose ID (UMID)">
                            Unified Multi-Purpose ID (UMID)
                        </option>
                        <option value="Social Security System (SSS) ID">
                            Social Security System (SSS) ID
                        </option>
                        <option value="Professional Regulation Commission (PRC) ID">
                            Professional Regulation Commission (PRC) ID
                        </option>
                        <option value="Government Service Insurance System (GSIS) ID">
                            Government Service Insurance System (GSIS) ID
                        </option>
                        <option value="Voter’s ID">Voter’s ID</option>
                        <option value="Postal ID">Postal ID</option>
                        <option value="TIN ID">TIN ID</option>
                        <option value="PhilHealth ID">PhilHealth ID</option>
                        <option value="Overseas Workers Welfare Administration (OWWA) ID">
                            Overseas Workers Welfare Administration (OWWA) ID
                        </option>
                        <option value="OFW ID">OFW ID</option>
                        <option value="Barangay ID">Barangay ID</option>
                        <option value="Student ID">Student ID</option>
                      </select>
                    </div>


                    {
                      isViewing && (
                        <div className="mb-3 d-flex flex-column">
                          <label className="form-label fw-bold">Supporting documents</label>
                          {resident.supporting_files_obj &&
                            resident.supporting_files_obj.length > 0 &&
                            resident.supporting_files_obj.map((i, k) => (
                              <div key={k} className="d-flex align-items-center mb-2">
                              <i className="bi bi-file-earmark-text me-2" style={{ fontSize: "1.2rem", color: "#007bff" }}></i>
                                <span
                                  key={k}
                                  onClick={() => {
                                    setSelectedFileForViewing({
                                      fileName: i.file_name,
                                      base64: i.base64_file,
                                    });
                                    setShowImage(true);
                                  }}
                                  className="pointer"
                                  style={{
                                    fontSize: "1.01rem"}}
                                >
                                  {i.file_name}
                                </span>
                              </div>
                            ))}
                        </div>
                      )
                    }

                  </div>
                  {
                    isViewing ?
                      <div class="modal-footer">
                        <button type="button" onClick={() => {
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
                            isPendingResident: 0,
                            supporting_files_obj : []
                          })
                          setShowAddResident(false)

                        }} class="btn btn-secondary">Close</button>

                        {
                          resident.isPendingResident == 1 &&
                          <>
                            <button type="button" onClick={() => {
                              // addResident()
                              approveResident()
                            }} class="btn btn-primary bg-green">Approve</button>
                            <button type="button" onClick={() => {
                              // addResident()
                              //rejectResident()
                              setIsViewing(false)
                              setIsEdit(false)
                              setShowAddResident(false)
                              setShowReasonDeniedModal(true)
                            }} class="btn btn-primary" style={{ backgroundColor: "red" }}>Reject</button>
                          </>
                        }
                      </div>
                      :
                      <div class="modal-footer">
                        <button type="button" onClick={() => {
                          setResident({
                            first_name: '',
                            middle_name: '',
                            last_name: '',
                            email: '',
                            pass: '',
                            birthday: '',
                            cell_number: '',
                            civil_status_id: '',
                            male_female: ''
                          })
                          setShowAddResident(false)

                        }} class="btn btn-secondary">Close</button>
                        <button type="button" onClick={() => {
                          addResident()
                        }} class="btn btn-primary bg-green">Save changes</button>
                      </div>
                  }
                </div>
              </div>
            </div>
          }

          {/* Add Resident */}


          {/* Add Barangay Services */}
          <div id="addBarangayServices" class="modal" tabindex="-1">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">{isEdit ? "Edit" : "Add"} Barangay Services</h5>
                </div>
                <div class="modal-body">
                  <div class="mb-3">
                    <label class="form-label">Document Title</label>
                    <input
                      id='serviceinput'
                      value={sss.service}
                      onChange={(val) => {
                        setSSS({
                          ...sss,
                          service: val.target.value
                        });
                      }}
                      class="form-control" />
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Cost</label>
                    <input
                      id='costinput'
                      value={cost}
                      onChange={(val) => {
                        setCost(val.target.value);
                      }}
                      class="form-control" />
                  </div>

                  <div className="mb-3">

                    <label class="form-label">Legend</label>
                    
                    <span className="ms-3" style={{ fontSize: "12px", color: "red" }}>Ex. ${'honorifics'}</span>
                    <span className="ms-3" style={{ fontSize: "12px", color: "red" }}>Ex. ${'full_name'}</span>
                    <span className="ms-3" style={{ fontSize: "12px", color: "red" }}> ${'first_name'}</span>
                    <span className="ms-3" style={{ fontSize: "12px", color: "red" }}> ${'middle_name'}</span>
                    <span className="ms-3" style={{ fontSize: "12px", color: "red" }}> ${'last_name'}</span>
                    <span className="ms-3" style={{ fontSize: "12px", color: "red" }}> ${'cell_number'}</span>
                    <span className="ms-3" style={{ fontSize: "12px", color: "red" }}> ${'email'}</span>
                    <span className="ms-3" style={{ fontSize: "12px", color: "red" }}> ${'civil_status'}</span>
                    <span className="ms-3" style={{ fontSize: "12px", color: "red" }}> ${'birthday'}</span>
                    <span className="ms-3" style={{ fontSize: "12px", color: "red" }}> ${'gender'}</span>
                    <span className="ms-3" style={{ fontSize: "12px", color: "red" }}> ${'gender_pronoun'}</span>
                    <span className="ms-3" style={{ fontSize: "12px", color: "red" }}> ${'address'}</span>
                    <span className="ms-3" style={{ fontSize: "12px", color: "red" }}> ${'household'}</span>
                    <span className="ms-3" style={{ fontSize: "12px", color: "red" }}> ${'house_and_lot_status'}</span>
                    <span className="ms-3" style={{ fontSize: "12px", color: "red" }}> ${'day'}</span>
                    <span className="ms-3" style={{ fontSize: "12px", color: "red" }}> ${'month'}</span>
                    <span className="ms-3" style={{ fontSize: "12px", color: "red" }}> ${'year'}</span>
                    <span className="ms-3" style={{ fontSize: "12px", color: "black" }}> as placeholder</span>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Description</label>
                    <ReactQuill
                      value={serviceDesc}
                      onChange={(val) => {
                        setServiceDesc(val);
                      }}
                      placeholder="Enter the message..........."
                    />
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button
                    data-bs-dismiss="modal"
                    onClick={() => addDocumentType()}
                    type="button"
                    class="btn btn-primary bg-green"
                    disabled={!sss.service || !cost || !serviceDesc} // Disable if any required field is empty
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Add barangay services */}


          {/* Confirm delete modal */}
          { }

          <div id="deleteConfirmModal" class="modal" tabindex="-1">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Delete</h5>
                  {/* <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> */}
                </div>
                <div class="modal-body">
                  Are you sure you want to delete <span className="fw-bold">{selectedItem != null && (selectedItem.full_name || selectedItem.service)}</span>?
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                  <button data-bs-dismiss="modal" onClick={() => {

                    tab == 1 && deleteResident()
                    tab == 0 && deleteOffials()
                    tab == 3 && deleteDocumentType()
                  }} type="button" class="btn btn-primary bg-green">Yes</button>
                </div>
              </div>
            </div>
          </div>



          {
            showSuccess &&
            <div id="statusModal " class="modal fade show d-block">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    {/* <h5 class="modal-title">Delete</h5> */}
                    {/* <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> */}
                  </div>
                  <div class="modal-body">
                    {success ? message : "Something went wrong."}
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onClick={() => setShowSuccess(false)}>Close</button>

                  </div>
                </div>
              </div>
            </div>
          }

          {
            loading &&
            <div id="statusModal " class="modal fade show d-block">
              <div class="d-flex align-items-center justify-content-center" style={{ height: "100vh", backgroundColor: "rgba(0,0,0,0.4)" }}>
                <div class="modal-content d-flex align-items-center" style={{ backgroundColor: "transparent " }}>
                  <div class="">
                    <h2 className="f-white">
                      Loading .....
                    </h2>
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

          {
            showImport &&
            <div id="statusModal " class="modal fade show d-flex align-items-center justify-content-center">
              <div className="col-6  d-flex flex-column align-items-center justify-content-center box mt-5">
                <div className="mt-5">
                  <h4>
                    Import xlsx file
                  </h4>
                </div>
                <div class="d-flex align-items-center flex-column justify-content-center w-100 p-5" >
                  <div style={{ width: "100%" }}>
                    <div {...getRootProps()} style={{ borderStyle: "dotted" }}>
                      <input {...getInputProps()} />
                      {
                        isDragActive ?
                          <p>Drop the files here ...</p> :
                          <p>Drag 'n' drop some files here, or click to select files</p>
                      }


                    </div>
                    {
                      files.length != 0 && files.map((i, k) => {
                        return (
                          <div
                            className="d-flex align-items-center justify-content-between mt-2"
                          >
                            <span
                              className="pointer"
                              onClick={() => {

                                // setSelectedFileForViewing(i)
                                // setShowImage(true)
                              }}
                            >{i.name}</span>

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
                  <div class="modal-footer">
                    <button type="button" class="btn btn-primary bg-green" onClick={async () => {

                      let merge = {
                        token: token.token,
                        files
                      }

                      setShowImport(false)

                      const fetchData = async () => {

                        try {
                          const result = await dispatch(importExcelResidentsApi(merge)).unwrap();

                          setShowSuccess(true)
                          setSuccess(true)
                          SetMessage('Success in importing resident information list.')

                          // Handle success, e.g., navigate to another page
                        } catch (error) {

                          setShowSuccess(true)
                          setSuccess(false)

                          // Handle error, e.g., show an error message
                        }
                        setFiles([])
                        setLoading(false)
                        setCount(count + 1)
                      };

                      fetchData();

                    }}>Submit</button>
                    <button type="button" class="btn btn-secondary" onClick={() => setShowImport(false)}>Close</button>

                  </div>
                </div>
              </div>
            </div>
          }


          {
            showBlotter &&
            <div id="statusModal " class="modal fade show d-flex align-items-center justify-content-center">
              <div className="col-6  d-flex flex-column align-items-center justify-content-center box mt-5">
                <div className="mt-5">
                  <h4>
                    File a blotter report
                  </h4>
                </div>
                <div class="d-flex align-items-center flex-column justify-content-center w-100 p-5" >


                  {
                    !isViewing &&

                    <div className="d-flex align-items-center w-100 mb-3">
                      <div class="form-check">
                        <input
                          onChange={() => {
                            setBlotter({
                              ...blotter, ...{
                                is_resident_complainant: true,
                                complainant_name: "",
                                complainant_id: '',
                                non_resident_address: blotter.is_resident_complainant ? blotter.non_resident_address : ''
                              }
                            })
                          }}
                          class="form-check-input" type="radio" name="complainantRadio" id="flexRadioDefault3" checked={blotter.is_resident_complainant === true} />
                        <label class="form-check-label" for="flexRadioDefault3">
                          Resident
                        </label>
                      </div>
                      <div class="form-check ms-3">
                        <input
                          onChange={() => {

                            setBlotter({
                              ...blotter, ...{
                                is_resident_complainant: false,
                                complainant_name: "",
                                complainant_id: '',
                                is_resident: true
                              }
                            })
                          }}
                          class="form-check-input" type="radio" name="complainantRadio" id="flexRadioDefault4" checked={blotter.is_resident_complainant === false} />
                        <label class="form-check-label" for="flexRadioDefault4">
                          Non-resident
                        </label>
                      </div>
                    </div>
                  }

                  <div class="mb-3 w-100" style={{ position: "relative" }}>
                    <label class="form-label">Complainant</label>
                    <input
                      disabled={isViewing ? true : (blotter.is_resident_complainant == null ? true : false)}
                      id='complainantinput'
                      // value={cost}
                      value={blotter.complainant_name}
                      onChange={(val) => {

                        setBlotter({
                          ...blotter, ...{
                            complainant_name: val.target.value,
                            complainant_id: '',
                            searchFirst: val.target.value
                          }
                        })

                        searchUser(val.target.value)

                      }}
                      class="form-control" />

                    {
                      blotter.searchFirst != "" && blotter.is_resident_complainant &&
                      <div className="box position-absolute w-100" style={{ maxHeight: "300px", overflow: "scroll", width: "500px", zIndex: 999999 }}>
                        {
                          searchUserList.map((i, k) => {
                            return (
                              <div
                                onClick={() => {

                                  setBlotter({
                                    ...blotter, ...{
                                      complainant_id: i.id,
                                      complainant_name: i.full_name,
                                      searchFirst: ''
                                    }
                                  })

                                }}
                                className="search-item pointer">
                                <span>
                                  {i.first_name + " " + i.middle_name + " " + i.last_name}
                                </span>
                              </div>
                            )
                          })
                        }
                      </div>
                    }

                  </div>

                  <div className="mb-3 w-100">
                    <label className="form-label">Complainant Phone Number</label>
                    <input
                      value={blotter.complainant_phone_number || ""}
                      onChange={(val) => {
                        setBlotter({
                          ...blotter,
                            complainant_phone_number: val.target.value
                        })
                      }}
                      className="form-control"
                    />
                  </div>

                  {
                    (blotter.is_complainant_resident === 0 || blotter.is_resident_complainant === false) &&
                    <div class="mb-3 w-100">
                      <label class="form-label">Non-resident Complainant Address</label>
                      <input
                        value={blotter.non_resident_address || ""}
                        onChange={(val) => {
                            setBlotter({
                              ...blotter,
                              non_resident_address: val.target.value
                            });
                        }}
                        class="form-control"
                      />
                    </div>
                  }

                  {
                    !isViewing &&

                    <div className="d-flex align-items-center w-100 mb-3">
                      <div class="form-check">
                        <input

                          onChange={() => {

                            setBlotter({
                              ...blotter, ...{
                                is_resident: true,
                                complainee_name: '',
                                complainee_id: '',
                                non_resident_address: blotter.is_resident ? blotter.non_resident_address : ''
                              }
                            })
                          }}
                          class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" checked={blotter.is_resident === true} />
                        <label class="form-check-label" for="flexRadioDefault1">
                          Resident
                        </label>
                      </div>
                      <div class="form-check ms-3">
                        <input
                          onChange={() => {

                            setBlotter({
                              ...blotter, ...{
                                is_resident: false,
                                complainee_name: '',
                                complainee_id: '',
                                is_resident_complainant: true
                              }
                            })
                          }}
                          class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked={blotter.is_resident === false} />
                        <label class="form-check-label" for="flexRadioDefault2">
                          Non-resident
                        </label>
                      </div>
                    </div>
                  }

                  <div class="mb-3 w-100" style={{ position: "relative" }}>
                    <label class="form-label">Respondent</label>
                    <input
                      id='complaineeinput'
                      // value={cost}
                      disabled={isViewing ? true : (blotter.is_resident == null ? true : false)}
                      value={blotter.complainee_name}
                      onChange={(val) => {
                        setBlotter({
                          ...blotter, ...{
                            complainee_name: val.target.value,
                            complainee_id: '',
                            search: val.target.value
                          }
                        })


                        searchUser(val.target.value)

                      }}
                      class="form-control" />
                    {
                      blotter.search != "" && blotter.is_resident &&
                      <div className="box position-absolute w-100" style={{ maxHeight: "300px", overflow: "scroll", width: "500px" }}>
                        {
                          searchUserList.map((i, k) => {
                            return (
                              <div
                                onClick={() => {

                                  setBlotter({
                                    ...blotter, ...{
                                      complainee_id: i.id,
                                      complainee_name: i.full_name,
                                      search: ''
                                    }
                                  })

                                }}
                                className="search-item pointer">
                                <span>
                                  {i.first_name + " " + i.middle_name + " " + i.last_name}
                                </span>
                              </div>
                            )
                          })
                        }
                      </div>
                    }
                  </div>

                  <div className="mb-3 w-100">
                    <label className="form-label">Respondent Phone Number</label>
                    <input
                      value={blotter.complainee_phone_number || ""}
                      onChange={(val) => {
                        setBlotter({
                          ...blotter,
                            complainee_phone_number: val.target.value
                        })
                      }}
                      className="form-control"
                    />
                  </div>

                  {
                    (blotter.is_complainee_resident === 0 || blotter.is_resident === false) &&
                    <div class="mb-3 w-100">
                      <label class="form-label">Non-resident Respondent Address</label>
                      <input
                        value={blotter.non_resident_address || ""}
                        onChange={(val) => {
                          setBlotter({
                            ...blotter,
                            non_resident_address: val.target.value
                          });
                        }}
                        class="form-control"
                      />
                    </div>
                  }

                  <div className="mb-3 w-100">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={blotter.category}
                      onChange={(e) => {
                        const selectedCategory = e.target.value;

                        setBlotter((prevBlotter) => {
                          return {
                            ...prevBlotter,
                            category: selectedCategory,
                            otherCategory: selectedCategory === "Others" ? prevBlotter.otherCategory || "" : prevBlotter.otherCategory,
                          };
                        });
                      }}
                    >
                      <option value="">Select a category</option>
                      {options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                      <option value="Others">Others</option>
                    </select>

                    {blotter.category === "Others" && (
                      <div className="mt-2">
                        <label className="form-label">Specify</label>
                        <input
                          type="text"
                          className="form-control"
                          value={blotter.otherCategory} 
                          onChange={(e) =>
                            setBlotter((prevBlotter) => ({
                              ...prevBlotter,
                              otherCategory: e.target.value,
                            }))
                          }
                          placeholder="Specify the category"
                        />
                      </div>
                    )}
                  </div>


                  <div class="mb-3 w-100">
                    <label class="form-label">Narration</label>
                    <textarea
                      id='narrationinput'
                      // value={cost}
                      value={blotter.complaint_remarks}
                      onChange={(val) => {
                        setBlotter({
                          ...blotter, ...{
                            complaint_remarks: val.target.value
                          }
                        })
                      }}
                      class="form-control" />

                  </div>

                  <div class="mb-3 w-100">
                    <label class="form-label">Officer on duty</label>
                    <input
                      id='inputofficer'
                      // value={cost}
                      value={blotter.officer_on_duty}
                      onChange={(val) => {
                        setBlotter({
                          ...blotter, ...{
                            officer_on_duty: val.target.value
                          }
                        })
                      }}
                      class="form-control" />

                  </div>


                  <div class="mb-3 w-100">
                    <label class="form-label">Status</label>
                    <select

                      value={blotter.status_resolved}
                      id='statusblotter'
                      onChange={(v) => {

                        setBlotter({
                          ...blotter, ...{
                            status_resolved: v.target.value
                          }
                        })
                      }}
                      class="form-select" aria-label="Default select example">
                      <option value="null">Case status</option>
                      <option value={0}>Ongoing</option>
                      <option value={1}>Settled</option>
                      <option value={2}>Unresolved</option>
                      <option value={3}>Dismissed</option>
                    </select>

                  </div>

                  {
                    isViewing &&

                    <div class="mb-3 w-100">
                      <label class="form-label">Remarks</label>
                      <textarea
                        id='remarks'
                        // value={cost}
                        value={blotter.remarks}
                        onChange={(val) => {
                          setBlotter({
                            ...blotter, ...{
                              remarks: val.target.value
                            }
                          })
                        }}
                        class="form-control" />
                    </div>
                  }

                  <div>
                    <button
                      disabled={
                        !(
                          blotter.complainee_name &&
                          blotter.complainant_name &&
                          blotter.status_resolved &&
                          blotter.complaint_remarks &&
                          blotter.category &&
                          blotter.officer_on_duty &&
                          blotter.complainant_phone_number &&
                          blotter.complainee_phone_number &&
                          (blotter.category !== "Others" || blotter.otherCategory) &&
                          (isViewing ? blotter.remarks : true) // Remarks required only if viewing
                        )
                      }
                      onClick={async () => {
                        setLoading(true);

                        const categoryToSend = blotter.category === "Others" ? blotter.otherCategory : blotter.category;

                        let merge = {
                          token: token.token,
                          ...blotter,
                          category: categoryToSend,
                        };

                        try {
                          let result;
                          result = !isViewing
                            ? await dispatch(fileBlotterReportApi(merge)).unwrap()
                            : await dispatch(editBlotterReportApi(merge)).unwrap();

                          setIsViewing(false);
                          setShowBlotter(false);
                          setSuccess(true);
                          setShowSuccess(true);
                          SetMessage(!isViewing ? 'Blotter successfully created' : "Blotter successfully updated");
                          setCount(count + 1);
                          setBlotter({
                            complainee_name: '',
                            complainant_name: '',
                            status_resolved: '',
                            complaint_remarks: '',
                            is_resident: null,
                            complainee_id: '',
                            complainant_id: '',
                            search: '',
                            category: '',
                            otherCategory: '',
                            complainant_phone_number: '',
                            complainee_phone_number: '',
                            non_resident_address: '',
                            remarks: ''
                          });

                          setLoading(false);
                        } catch (error) {
                          setLoading(false);
                          setSuccess(false);
                          setShowSuccess(true);
                          setShowBlotter(false);
                        }
                      }}
                      className="primary bg-yellow p-2 rounded border-0"
                    >
                      <i className="bi bi-plus fw-bold" style={{ fontSize: "20px" }}></i>
                      <span className="fw-bold">{isViewing ? "Update Blotter" : "Create Blotter"}</span>
                    </button>
                  </div>

                  <div >
                    <button
                      onClick={() => {
                        setShowBlotter(false)
                        setSuccess(false)
                        setShowSuccess(false)
                        SetMessage('')
                        setIsViewing(false)
                      }}
                      className="primary p-2 rounded border-0 mt-3"
                    >
                      <span className="fw-bold">Close</span>
                    </button>
                  </div>

                </div>
              </div>
            </div>
          }

          {
            showReasonModal && selectedAppointment && (
              <div
                id="rejectModal"
                className="modal fade show d-flex align-items-center justify-content-center"
              >
                <div className="col-6 d-flex flex-column align-items-center justify-content-center box mt-5">
                  {/* Header */}
                  <div className="mt-5">
                    <h4>Reject Request</h4>
                  </div>

                  {/* Modal Content */}
                  <div className="d-flex align-items-center flex-column justify-content-center w-100 p-5">
                    {/* Reason Input */}
                    <div className="mb-3 w-100">
                      <label htmlFor="reasonInput" className="form-label">
                        Reason for Rejection
                      </label>
                      <textarea
                        id="reasonInput"
                        className="form-control"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Provide the reason for rejection..."
                      />
                    </div>

                    {/* Action Button */}
                    <div>
                      <button
                        onClick={async () => {
                          setLoading(true); // Start loading

                          let merge = {
                            token: token.token,
                            id: selectedAppointment.appointment_id,  // Assuming `i` is the current appointment object
                            status: 1,  // Set the status to rejected
                            reason: reason, // Add the reason for rejection
                          };

                          const fetchData = async () => {
                            try {
                              const result = await dispatch(approveOrRejectAppointmentApi(merge)).unwrap(); // Using approveOrRejectAppointmentApi

                              if (result.success) {
                                setLoading(false);
                                setSuccess(true);
                                setShowSuccess(true);
                                SetMessage("Request successfully rejected.");
                                setShowReasonModal(false);
                                setReason(""); // Clear reason after success

                                window.location.reload();
                              }
                            } catch (error) {
                              // Handle error
                              setLoading(false);
                              setSuccess(false);
                              setShowSuccess(true);
                              SetMessage("Failed to reject the request.");
                            }
                          };

                          fetchData();
                        }}
                        type="button"
                        className="btn btn-danger ms-3"
                        disabled={!reason.trim()} // Disable button if no reason is provided
                      >
                        Reject
                      </button>
                    </div>

                    {/* Close Button */}
                    <div>
                      <button
                        onClick={() => {
                          setShowReasonModal(false);
                          setReason(""); // Clear reason when modal is closed
                        }}
                        className="primary p-2 rounded border-0 mt-3"
                      >
                        <span className="fw-bold">Close</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          }

          {
            showReasonDeniedModal && (
              <div
                id="rejectModal"
                className="modal fade show d-flex align-items-center justify-content-center"
              >
                <div className="col-6 d-flex flex-column align-items-center justify-content-center box mt-5">
                  {/* Header */}
                  <div className="mt-5">
                    <h4>Reject Resident</h4>
                  </div>

                  {/* Modal Content */}
                  <div className="d-flex align-items-center flex-column justify-content-center w-100 p-5">
                    {/* Reason Input */}
                    <div className="mb-3 w-100">
                      <label htmlFor="reasonInput" className="form-label">
                        Reason for Rejection
                      </label>
                      <textarea
                        id="reasonInput"
                        className="form-control"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Provide the reason for rejection..."
                      />
                    </div>

                    {/* Action Button */}
                    <div>
                    <button type="button" onClick={() => {
                      rejectResident()
                      setShowReasonDeniedModal(false)
                    }} class="btn btn-primary" style={{ backgroundColor: "red" }}>Reject</button>
                    </div>

                    {/* Close Button */}
                    <div>
                      <button
                        onClick={() => {
                          setShowReasonDeniedModal(false);
                          setReason(""); // Clear reason when modal is closed
                        }}
                        className="primary p-2 rounded border-0 mt-3"
                      >
                        <span className="fw-bold">Close</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          }

          {/* Modal */}
        </div>
      </Auth>
    </main>
  );
}