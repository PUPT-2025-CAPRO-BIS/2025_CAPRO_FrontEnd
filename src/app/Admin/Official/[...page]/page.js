'use client'
import Button from "@/components/Button";
import { HeaderItem, RowItem } from "@/components/RowItem";
import { addOfficials, dashboardViewApi, deleteOffialsApi, loadOfficials, updateOfficials } from "@/redux/reducer/officials";
import { addResidentApi, approveNewResidentApi, approveOrRejectAppointmentApi, deleteResidentInformationApi, editBlotterReportApi, editResidentApi, fileBlotterReportApi, importExcelResidentsApi, loadAllUsers, logOutResident, settingPeding, viewAllBlottersApi, viewAppointmentListApi } from "@/redux/reducer/resident";
import { LogOut, viewAdminLogsApi } from "@/redux/reducer/user";
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

  const [showAddResident, setShowAddResident] = useState(false)


  const [isPending, setIsPending] = useState(0)



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
  const [tab, seTab] = useState(10)

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
    male_female: '',
    isPendingResident: 0
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
    isPendingResident: 0
  })
  // male 0 female 1
  // Resident

  const [disabledBlotterButton, setDisabledBlotterButton] = useState(true)

  const [blotter, setBlotter] = useState({
    complainee_name: '',
    complainant_name: '',
    status_resolved: '',
    complaint_remarks: '',
    is_resident: null,
    is_resident_complainant: null,
    complainee_id: '',
    complainant_id: '',
    search: '',
    searchFirst: '',
    officer_on_duty: ''
  })

  useEffect(() => {
    // This effect runs whenever any specified property in the `blotter` object changes


    if (blotter.is_resident) {

      if (blotter.complainee_id == "") {
        setDisabledBlotterButton(true)
      }
    }
    else {
      if (blotter.complainant_name == "") {
        setDisabledBlotterButton(true)
      }
    }

    if (blotter.is_resident_complainant) {

      if (blotter.complainant_id == "") {
        setDisabledBlotterButton(true)
      }
    }
    else {
      if (blotter.complainee_name == "") {
        setDisabledBlotterButton(true)
      }
    }






    if (blotter.is_resident && blotter.is_resident_complainant) {

      if (blotter.complainant_id != "" && blotter.complainee_id != "" && blotter.complaint_remarks != "" && blotter.officer_on_duty != "" && blotter.status_resolved != "") {
        setDisabledBlotterButton(false)
      }
      else {
        setDisabledBlotterButton(true)
      }

    }
    else if (!blotter.is_resident && blotter.is_resident_complainant) {
      if (blotter.complainee_name != "" && blotter.complainant_id != "" && blotter.complaint_remarks != "" && blotter.officer_on_duty != "" && blotter.status_resolved != "") {
        setDisabledBlotterButton(false)
      }
      else {
        setDisabledBlotterButton(true)
      }
    }

    else if (blotter.is_resident && !blotter.is_resident_complainant) {

      if (blotter.complainee_id != "" && blotter.complainant_name != "" && blotter.complaint_remarks != "" && blotter.officer_on_duty != "" && blotter.status_resolved != "") {
        setDisabledBlotterButton(false)
      }
      else {
        setDisabledBlotterButton(true)
      }
    }

    else if (!blotter.is_resident && !blotter.is_resident_complainant) {
      if (blotter.complainant_name != "" && blotter.complainee_name != "" && blotter.complaint_remarks != "" && blotter.officer_on_duty != "" && blotter.status_resolved != "") {
        setDisabledBlotterButton(false)
      }
      else {
        setDisabledBlotterButton(true)
      }
    }


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
    blotter.officer_on_duty
  ]);

  //0 ongoing 1 solve


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
      per_page: 10
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

      loadAll()
      const fetchData = async () => {

        try {
          const result = await dispatch(viewAllBlottersApi(data)).unwrap();

          setTotalPage(result.total_pages)

          if (currentPage > result.total_pages) {
            // alert("Invalid url")
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

        setTotalPage(result.total_pages)


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

        setSelectedSearchItem(null)

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

    if (resident.male_female === "") {
      document.getElementById('genderinput').style.border = '1px solid red'
    }

    if (resident.civil_status_id == "") {
      document.getElementById('civilinput').style.border = '1px solid red'
    }

    if (resident.first_name != "" && resident.last_name != "" && resident.birthday != "" && resident.cell_number != ""
      && resident.male_female !== "" && resident.civil_status_id != ""

    ) {

      let merge = {
        resident,
        birthday: startDate,
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
              male_female: ''
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


    window.open(`http://18.141.22.83/api/generatePdf?doc_id=${val.id}&download=0`)
    // http://18.141.22.83/api/generatePdf?doc_id=14&download=0

  }





  const changeTab = (v) => {





    if (v == 0) {
      router.push('/Admin/Official/Staff/1')
    }
    if (v == 1) {
      router.push('/Admin/Official/Resident/1')
    }
    if (v == 2) {
      router.push('/Admin/Official/Schedule/1')
    }
    if (v == 3) {
      router.push('/Admin/Official/Services/1')
    }
    if (v == 4) {
      router.push('/Admin/Official/Blotter/1')
    }
    if (v == 10) {
      router.push('/Admin/Official/Dashboard')
    }
    if (v == 6) {
      router.push('/Admin/Official/Logs/1')
    }

    // seTab(v)
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
      status: 1
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

  return (
    <main className={``}>
      <Auth>
        <div className="vh-100 w-100" style={{ backgroundColor: "white", display: "flex" }}>

          <div id='sidebar'
            className="overflow-auto sidebar">
         
            <div id='menu' className="w-100" style={{overflow:"scroll"}}>
              { /* asan */}

            
              <div className="col-lg-12 p-5 d-flex flex-column bg-green side-bg">
              <div
                  onClick={() => {

                
                    

                    if(document.getElementById("menu").classList.contains("openSidebar")){

                      document.getElementById("menu").classList.remove("openSidebar");
                      document.getElementById("sidebar").classList.remove("openSidebar-full");

                      document.getElementById("sidebar").classList.add("sidebar");
                      // document.getElementById("sidebar").style.width = "auto"
                      setOpenSide(false)
                    }
                    else{
                      document.getElementById("menu").classList.add("openSidebar");
                      document.getElementById("sidebar").classList.add("openSidebar-full");

                      document.getElementById("sidebar").classList.remove("sidebar");

                      setOpenSide(true)
                    }


                  }}
                  className="pointer">
                  <i class="bi bi-list" style={{ fontSize: "32px" }}></i>
                </div>
                <div className="d-flex flex-column align-items-center logo-bg col-lg-12 mt-5" style={{ height: "100px" }}>

                </div>



                {/* Navigation */}

                <div className="flex-column mt-5 mb-5">



                  <div onClick={() => changeTab(10)} className={`p-4 w-100 rounded nav-container ${tab == 10 ? 'active-nav' : ''} pointer`}>
                    <i class="bi bi-person f-white icon"></i>

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


                  <div onClick={() => changeTab(1)} className={`p-4 w-100 rounded nav-container ${tab == 1 ? 'active-nav' : ''} pointer`}>

                    <i class="bi bi-people-fill f-white icon"></i>

                    {
                        openSide  &&
                      <span className="f-white ms-2 nav-item">
                      Manage Residents
                    </span>
                    }
                  
                  </div>


                  <div onClick={() => changeTab(2)} className={`p-4 w-100 rounded nav-container ${tab == 2 ? 'active-nav' : ''} pointer`}>

                    <i class="bi bi-calendar-date f-white icon"></i>

                    {
                        openSide  &&
                      <span className="f-white ms-2 nav-item">
                      Schedules
                    </span>
                    }
                   
                  </div>


                  <div onClick={() => changeTab(4)} className={`p-4 w-100 rounded nav-container ${tab == 4 ? 'active-nav' : ''} pointer`}>

                    <i class="bi bi-person-fill-slash f-white icon"></i>

                    {
                        openSide  &&
                      <span className="f-white ms-2 nav-item">
                      Blotter
                    </span>
                    }

                 
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
                    {/* <i class="bi bi-activity f-white icon"></i> */}
                    <span className="f-white nav-item ms-2 fw-bold">
                      Log out
                    </span>
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

                    
                    
                    

                    if(document.getElementById("menu").classList.contains("openSidebar")){
                      document.getElementById("menu").classList.remove("openSidebar");
                      document.getElementById("sidebar").classList.remove("openSidebar-full");

                      setOpenSide(false)
                    }
                    else{
                      
                      document.getElementById("menu").classList.add("openSidebar");
                      document.getElementById("sidebar").classList.add("openSidebar-full");

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
                    tab == 1 && "Barangay Officials"
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



                  <span className="f-white ms-3">
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




            {
              tab != 10 ?
                <div className="d-flex flex-column align-items-center justify-content-center w-100 p-5 rounded bg-green mt-3 logo-bg-officials" >
                  <h1 className="f-white">
                    BARANGAY CENTRAL BICUTAN
                  </h1>

                  <span className="f-white">
                    Sunflower Street, Taguig City, Metro Manila
                  </span>
                </div>

                :

                <div className="col-12 d-flex mt-5">

                  <div className="col-6" >
                    <img
                      style={{
                        height: "300px",
                        width: "100%",
                        objectFit: "cover"
                      }}
                      // src={require('../assets/')}
                      src='/images/TaguigSky.jpg'
                    />
                  </div>

                  <div className="col-6 bg-green p-5" >
                    <h4 className="f-white">
                      DID YOU KNOW?
                    </h4>

                    <p className="f-white">
                      Bonifacio Global City (BGC) in Taguig is a modern business and lifestyle district in Metro Manila, known for its upscale shopping centers, trendy restaurants, and vibrant nightlife. Originally a military camp named Fort Bonifacio, it has transformed into a major financial and commercial hub, attracting both local and international businesses.
                    </p>

                  </div>

                </div>
            }

            {/* Dashboard */}
            {
              tab == 10 &&

              <>
                <div className="col-12 mt-5 ">
                  <h4>Resident Information</h4>
                  <div className="col-12 d-flex">

                    <div className="d-flex bg-green p-3 align-items-center rounded">
                      <i class="bi bi-house-door f-white" style={{ fontSize: "50px" }}></i>
                      <div className="flex-column d-flex ms-3 align-items-center">
                        <span className="f-white">
                          Count of Residents
                        </span>

                        <span className="f-yellow mt-3" style={{ fontSize: "26px", fontWeight: "bold" }}>
                          {dashboard.count_of_residents}
                        </span>
                      </div>
                    </div>


                    <div className="d-flex bg-green p-3 align-items-center rounded ms-3">
                      <i class="bi bi-gender-male f-white" style={{ fontSize: "50px" }}></i>
                      <div className="flex-column d-flex ms-3 align-items-center">
                        <span className="f-white">
                          Count of Male
                        </span>

                        <span className="f-yellow mt-3" style={{ fontSize: "26px", fontWeight: "bold" }}>
                          {dashboard.males}
                        </span>
                      </div>
                    </div>


                    <div className="d-flex bg-green p-3 align-items-center rounded ms-3">
                      <i class="bi bi-gender-female f-white" style={{ fontSize: "50px" }}></i>
                      <div className="flex-column d-flex ms-3 align-items-center">
                        <span className="f-white">
                          Count of Female
                        </span>

                        <span className="f-yellow mt-3" style={{ fontSize: "26px", fontWeight: "bold" }}>
                          {dashboard.females}
                        </span>
                      </div>
                    </div>


                    <div className="d-flex bg-green p-3 align-items-center rounded ms-3">
                      <i class="bi bi-person-wheelchair f-white" style={{ fontSize: "50px" }}></i>
                      <div className="flex-column d-flex ms-3 align-items-center">
                        <span className="f-white">
                          Count of Seniors
                        </span>

                        <span className="f-yellow mt-3" style={{ fontSize: "26px", fontWeight: "bold" }}>
                          {dashboard.count_of_seniors}
                        </span>
                      </div>
                    </div>



                  </div>
                </div>

                <div className="col-12 d-flex justify-content-start mb-5">
                  <div className="mt-5 col-5">
                    <h4>Apointment Schedules</h4>
                    <div className="col-12 d-flex">

                      <div className="d-flex bg-green p-3 align-items-center rounded">
                        <i class="bi bi-calendar-date f-white" style={{ fontSize: "50px" }}></i>
                        <div className="flex-column d-flex ms-3 align-items-center">
                          <span className="f-white">
                            Count of total schedules
                          </span>

                          <span className="f-yellow mt-3" style={{ fontSize: "26px", fontWeight: "bold" }}>
                            {dashboard.schedules}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>


                  <div className="mt-5">
                    <h4>Complaints</h4>

                    <div className="d-flex">
                      <div className=" d-flex">

                        <div className="d-flex bg-green p-3 align-items-center justify-content-center rounded" style={{ width: "200px" }}>
                          <i class="bi bi-hand-thumbs-down f-white" style={{ fontSize: "50px" }}></i>
                          <div className="flex-column d-flex ms-3 align-items-center">
                            <span className="f-white">
                              Unresolve
                            </span>

                            <span className="f-yellow mt-3" style={{ fontSize: "26px", fontWeight: "bold" }}>
                              {dashboard.unresolved}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className=" d-flex ms-3">

                        <div className="d-flex bg-green p-3 align-items-center justify-content-center rounded" style={{ width: "200px" }}>
                          <i class="bi bi-lightning f-white" style={{ fontSize: "50px" }}></i>
                          <div className="flex-column d-flex ms-3 align-items-center">
                            <span className="f-white">
                              Ongoing
                            </span>

                            <span className="f-yellow mt-3" style={{ fontSize: "26px", fontWeight: "bold" }}>
                              {dashboard.ongoing}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>


                    <div className="d-flex mt-3">
                      <div className=" d-flex">

                        <div className="d-flex bg-green p-3 align-items-center justify-content-center rounded" style={{ width: "200px" }}>
                          <i class="bi bi-hand-thumbs-up f-white" style={{ fontSize: "50px" }}></i>
                          <div className="flex-column d-flex ms-3 align-items-center">
                            <span className="f-white">
                              Settled
                            </span>

                            <span className="f-yellow mt-3" style={{ fontSize: "26px", fontWeight: "bold" }}>
                              {dashboard.settled}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className=" d-flex ms-3">

                        <div className="d-flex bg-green p-3 align-items-center justify-content-center rounded" style={{ width: "200px" }}>
                          <i class="bi bi-x-octagon-fill f-white" style={{ fontSize: "50px" }}></i>
                          <div className="flex-column d-flex ms-3 align-items-center">
                            <span className="f-white">
                              Dismissed
                            </span>

                            <span className="f-yellow mt-3" style={{ fontSize: "26px", fontWeight: "bold" }}>
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

              <div className="mt-3 min-w-table flex-column  justify-content-center w-100 p-5 rounded bg-green" >

                <div className="border-bottom p-2 pb-4 mt-3" style={{ overflow: "scroll" }}>
                  <h2 className="f-white">Current Barangay Officials</h2>
                </div>

                <div className="d-flex mt-4 justify-content-between pb-4 border-bottom">

                  <div className="d-flex align-items-center">
                    <span className="f-white">Search:</span>
                    <input
                      // onKeyDown={handleKeyDown}
                      value={searchItemList}
                      onChange={(v) => {
                        setSearchItemList(v.target.value)
                        handleKeyDown(v.target.value)
                      }}
                      type="email" className="form-control rounded ms-2" id="exampleFormControlInput1" placeholder="Official name" />
                  </div>

                  {
                    <div >
                      <button
                        className="primary bg-yellow p-2 rounded" style={{ border: "0px" }}
                        data-bs-toggle="modal" data-bs-target="#addOfficialModal"
                      >
                        <i className="bi bi-plus fw-bold f-white" style={{ fontSize: "20px" }}></i>
                        <span className="fw-bold f-white">Add official</span>
                      </button>
                    </div>
                  }
                </div>


                {/*  */}
                <div className="border-bottom p-2 pb-4 mt-3" style={{ overflow: "scroll" }}>

                  {/* Table header */}
                  <div className="w-100 align-items-center justify-content-around border-bottom pb-4 table-mh" style={{}}>
                    <HeaderItem>
                      NAME
                    </HeaderItem>
                    <HeaderItem>
                      CHAIRMANSHIP
                    </HeaderItem>
                    <HeaderItem>
                      POSITION
                    </HeaderItem>
                    <HeaderItem>
                      STATUS
                    </HeaderItem>
                    <HeaderItem>
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
              <div className="mt-3 d-flex flex-column  justify-content-center w-100 p-5 rounded bg-green" >

                <div className="border-bottom p-2 pb-4 mt-3" style={{ overflow: "scroll" }}>
                  <h2 className="f-white">Resident Records</h2>
                </div>

                <div className="d-flex mt-4 justify-content-between pb-4 border-bottom">

                  <div className="d-flex align-items-center col-6">
                    <span className="f-white">Search:</span>
                    <input
                      // onKeyDown={handleKeyDown}
                      value={searchItemList}
                      onChange={(v) => {
                        setSearchItemList(v.target.value)
                        handleKeyDown(v.target.value)
                      }}
                      type="email" className="form-control rounded ms-2" placeholder="Search name" />



                    <div className="col-6 ms-3 d-flex">
                      <button
                        onClick={() => {
                          setShowImport(true)
                        }}
                        className="primary bg-yellow p-2 rounded d-flex align-items-center justify-content-center" style={{ border: "0px" }}
                      >
                        {/* <i className="bi bi-plus fw-bold" style={{ fontSize: "20px" }}></i> */}
                        <i class="bi bi-cloud-upload f-white" style={{ fontSize: "20px" }}></i>
                        <span className="fw-bold f-white ms-2">Import</span>
                      </button>

                      <button
                        onClick={() => {



                          dispatch(settingPeding(alluser.isPending == 0 ? 1 : 0))
                          setCurrentPage(1)
                          setCount(count + 1)
                        }}
                        className="ms-3 primary bg-yellow p-2 rounded d-flex align-items-center justify-content-center" style={{ border: "0px" }}
                      >
                        {/* <i className="bi bi-plus fw-bold" style={{ fontSize: "20px" }}></i> */}
                        {/* <i class="bi bi-cloud-upload f-white" style={{ fontSize: "20px" }}></i> */}

                        {
                          isPending == 1 ?
                            <i class="bi bi-person-check-fill" style={{ fontSize: "25px" }}></i>
                            :
                            <i class="bi bi-person-exclamation" style={{ fontSize: "25px" }}></i>
                        }


                        <span className="fw-bold f-white ms-2"
                          style={{
                            // color: isPending == 1 ? "#057350" : "white"
                          }}
                        >{alluser.isPending == 0 ? "View Pending Resident" : "View Registered Resident"}</span>
                      </button>


                    </div>

                  </div>

                  <div className="d-flex">

                    <button onClick={() => window.open('https://18.141.22.83/api/downloadUsers')} type="button"
                      class="btn btn-primary bg-yellow border-0 ms-3 d-flex align-items-center justify-content-center"
                      style={{ width: "200px" }}>

                      <i class="bi bi-file-earmark-excel-fill" style={{ fontSize: "28px", color: "green" }}></i>
                      Download</button>

                    {

                      alluser.isPending == 0 &&
                      <button
                        onClick={() => {
                          setShowAddResident(true)
                          setIsEdit(false)
                        }}
                        className="primary bg-yellow p-2 rounded ms-3" style={{ border: "0px" }}
                      >
                        <i className="bi bi-plus fw-bold f-white" style={{ fontSize: "20px" }}></i>
                        <span className="fw-bold f-white">Add Resident</span>
                      </button>
                    }
                  </div>
                </div>


                {/*  */}
                <div className="border-bottom p-2 pb-4 mt-3" style={{ overflow: "scroll" }}>

                  {/* Table header */}
                  <div className="w-100 align-items-center justify-content-around border-bottom pb-4 table-mh" style={{}}>
                    <HeaderItem>
                      Fullname
                    </HeaderItem>
                    <HeaderItem>
                      Age
                    </HeaderItem>
                    <HeaderItem>
                      Civil Status
                    </HeaderItem>
                    <HeaderItem>
                      Gender
                    </HeaderItem>
                    <HeaderItem>
                      Voter Status
                    </HeaderItem>
                    <HeaderItem>
                      User Status
                    </HeaderItem>

                    <HeaderItem>
                      Appointments
                    </HeaderItem>
                    <HeaderItem>
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
                            <RowItem

                            >
                              <span className="f-white">
                                {i.first_name + " " + i.middle_name + " " + i.last_name}
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

                            <RowItem

                            >
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
                                    setResident(i)
                                    setShowAddResident(true)
                                  }}
                                  type="button" class="btn btn-primary"><i class="bi bi-eye"></i></button>

                               

                                <button

                                  onClick={() => {

                                    setIsViewing(false)
                                    setIsEdit(true)
                                    setResident(i)
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

                  {/* Table body */}
                </div>

              </div>
            }

            {/* MANAGE RESIDENT */}

            {/* Schedule */}

            {
              tab == 2 &&
              <div className="mt-3 d-flex flex-column  justify-content-center w-100 p-5 rounded bg-green" >

                <div className="border-bottom p-2 pb-4 mt-3" style={{ overflow: "scroll" }}>
                  <h2 className="f-white">Schedule</h2>
                </div>

                <div className="d-flex mt-4 justify-content-between pb-4 border-bottom">

                  <div className="d-flex align-items-center">
                    <span className="f-white">Search:</span>
                    <input
                      // onKeyDown={handleKeyDown}
                      onChange={(v) => {
                        setSearchItemList(v.target.value)
                        handleKeyDown(v.target.value)
                      }}
                      value={searchItemList}
                      className="form-control rounded ms-2" placeholder="Search name" />

                    <button onClick={() => window.open('http://18.141.22.83/api/downloadAppointments')} type="button"
                      class="btn btn-primary bg-yellow border-0 ms-3 d-flex align-items-center justify-content-center"
                      style={{ width: "300px" }}>

                      <i class="bi bi-file-earmark-excel-fill" style={{ fontSize: "28px", color: "green" }}></i>
                      Download</button>

                  </div>

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
                <div className="border-bottom p-2 pb-4 mt-3" style={{ overflow: "scroll" }}>

                  {/* Table header */}
                  <div className="w-100 align-items-center justify-content-around border-bottom pb-4 table-mh" style={{}}>

                    <HeaderItem>
                      Queing
                    </HeaderItem>
                    <HeaderItem>
                      Date
                    </HeaderItem>
                    <HeaderItem>
                      Name
                    </HeaderItem>
                    <HeaderItem>
                      Service
                    </HeaderItem>
                    <HeaderItem>
                      Purpose
                    </HeaderItem>
                    <HeaderItem>
                      Status
                    </HeaderItem>
                    <HeaderItem>
                      Action
                    </HeaderItem>
                  </div>



                  {/* Table body */}

                  <div className="d-flex flex-column  col-lg-12 align-items-center justify-content-between table-mh" >

                    {
                      alluser.list.length != 0 && alluser.list.data.map((i, k) => {
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
                                {i.status}
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
                                          type="button" class="btn btn-danger ms-3">Reject</button>

                                      </div>

                                      :

                                      <div id={k + i.full_name + "button"} className="d-flex">

                                        <button

                                          onClick={() => {
                                            window.open(`http://18.141.22.83/api/downloadAndReleaseDocument?appointment_id=${i.appointment_id}&download=0`)


                                          }}
                                          type="button" class="btn btn-primary">View</button>

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

                <div className="border-bottom p-2 pb-4 mt-3" style={{ overflow: "scroll" }}>
                  <h2 className="f-white">List of Document Type</h2>
                </div>

                <div className="d-flex mt-4 justify-content-between pb-4 border-bottom">

                  <div className="d-flex align-items-center">
                    <span className="f-white">Search:</span>
                    <input
                      // onKeyDown={handleKeyDown}
                      onChange={(v) => {
                        setSearchItemList(v.target.value)
                        handleKeyDown(v.target.value)
                      }}
                      value={searchItemList}
                      type="email" className="form-control rounded ms-2" id="exampleFormControlInput1" />
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
                      <i className="bi bi-plus fw-bold f-white" style={{ fontSize: "20px" }}></i>
                      <span className="fw-bold f-white">Document Type</span>
                    </button>
                  </div>
                </div>


                {/*  */}
                <div className="border-bottom p-2 pb-4 mt-3" style={{ overflow: "scroll" }}>

                  {/* Table header */}
                  <div className="w-100 align-items-center justify-content-around border-bottom pb-4 table-mh" style={{}}>
                    <HeaderItem>
                      No.
                    </HeaderItem>
                    <HeaderItem>
                      Service
                    </HeaderItem>
                    <HeaderItem>
                      Date
                    </HeaderItem>
                    <HeaderItem>
                      Cost
                    </HeaderItem>
                    <HeaderItem>
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

                <div className="border-bottom p-2 pb-4 mt-3" style={{ overflow: "scroll" }}>
                  <h2 className="f-white">Blotter</h2>
                </div>

                <div className="d-flex mt-4 justify-content-between pb-4 border-bottom">

                  <div className="d-flex align-items-center">
                    <span className="f-white">Search:</span>
                    <input
                      // onKeyDown={handleKeyDown}
                      value={searchItemList}
                      onChange={(v) => {
                        setSearchItemList(v.target.value)
                        handleKeyDown(v.target.value)
                      }}
                      type="email" className="form-control rounded ms-2" id="exampleFormControlInput1" />


                    <button onClick={() => window.open('https://18.141.22.83/api/downloadBlotters')} type="button"
                      class="btn btn-primary bg-yellow border-0 ms-3 d-flex align-items-center justify-content-center"
                      style={{ width: "300px" }}>

                      <i class="bi bi-file-earmark-excel-fill" style={{ fontSize: "28px", color: "green" }}></i>
                      Download</button>

                  </div>

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
                <div className="border-bottom p-2 pb-4 mt-3" style={{ overflow: "scroll" }}>

                  {/* Table header */}
                  <div className="w-100 align-items-center justify-content-around border-bottom pb-4 table-mh" style={{}}>
                    <HeaderItem>
                      Complainant
                    </HeaderItem>
                    <HeaderItem>
                      Complainee
                    </HeaderItem>
                    <HeaderItem>
                      Date
                    </HeaderItem>
                    <HeaderItem>
                      Status
                    </HeaderItem>
                    <HeaderItem>
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
                                  type="button" class="btn btn-warning ms-3">View</button>

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

                <div className="border-bottom p-2 pb-4 mt-3" style={{ overflow: "scroll" }}>
                  <h2 className="f-white fw-bold">Admin logs</h2>
                </div>

                <div className="d-flex mt-4 justify-content-between pb-4 border-bottom">

                  <div className="d-flex align-items-center">
                    <span className="f-white">Search:</span>
                    <input
                      // onKeyDown={handleKeyDown}
                      onChange={(v) => {
                        setSearchItemList(v.target.value)
                        handleKeyDown(v.target.value)
                      }}
                      value={searchItemList}
                      type="email" className="form-control rounded ms-2" id="exampleFormControlInput1" />
                  </div>


                </div>


                {/*  */}
                <div className="border-bottom p-2 pb-4 mt-3" style={{ overflow: "scroll" }}>

                  {/* Table header */}
                  <div className="w-100 align-items-center justify-content-around border-bottom pb-4 table-mh" style={{}}>
                    <HeaderItem>
                      No.
                    </HeaderItem>
                    <HeaderItem>
                      Action type
                    </HeaderItem>
                    <HeaderItem>
                      Description
                    </HeaderItem>
                    <HeaderItem>
                      Date
                    </HeaderItem>
                    <HeaderItem>
                      Action taker
                    </HeaderItem>
                  </div>



                  {/* Table body */}
                  { }

                  <div className="d-flex flex-column  col-lg-12 align-items-center justify-content-between table-mh" >

                    { }
                    {
                      logs.length != 0 && logs.data.map((i, k) => {
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

          {/* Modal */

          }
          <div class="modal fade" id="exampleModal" tabindex="-1" data-bs-backdrop="static" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">Edit</h1>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <div class="mb-3">
                    <label class="form-label fw-bold">{selectedItem != null && selectedItem.full_name}</label>
                    {/* <input
                      value={selectedItem != null && selectedItem.full_name}
                      onChange={(val) => {
                        if (selectedItem != null) {
                          setSelectedItem({
                            ...selectedItem,
                            full_name: val.target.value
                          })
                        }
                      }}
                      class="form-control" /> */}
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Chairmanship</label>
                    <input
                      value={selectedItem != null ? selectedItem.chairmanship : ''}
                      onChange={(val) => {
                        if (selectedItem != null) {
                          setSelectedItem({
                            ...selectedItem,
                            chairmanship: val.target.value
                          })
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
                          setSelectedItem({
                            ...selectedItem,
                            position: val.target.value
                          })
                        }
                      }}
                      class="form-control" />
                  </div>
                  {/* <div class="mb-3">
                    <label class="form-label">Status</label>
                    <input
                      value={selectedItem != null && selectedItem.status}
                      onChange={(val) => {
                        if (selectedItem != null) {
                          setSelectedItem({
                            ...selectedItem,
                            status: val.target.value
                          })
                        }
                      }}
                      class="form-control" />
                  </div> */}
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button onClick={() => updateOfficial()} type="button" class="btn btn-primary bg-green" data-bs-dismiss="modal">Save changes</button>
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
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <div class="mb-3">
                    <label class="form-label">Search name</label>
                    <input
                      id='selctednameadd'
                      // value={selectedItem != null && selectedItem.full_name}
                      value={searchItemList}
                      onChange={(val) => {

                        searchAddOfficial(val.target.value)
                      }}
                      class="form-control" />
                    {
                      searchVal != "" &&
                      <div className="box position-absolute col-lg-12" style={{ maxHeight: "300px", overflow: "scroll" }}>
                        {
                          searchOfficial.map((i, k) => {
                            return (
                              <div
                                onClick={() => {
                                  document.getElementById('selctednameadd').value = i.first_name + " " + i.middle_name + " " + i.last_name
                                  setSearchVal('')
                                  setSelectedSearchItem(i)
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
                  <div class="mb-3">
                    <label class="form-label">Chairmanship</label>
                    <input
                      value={selectedSearchItem != null && selectedSearchItem.chairmanship}
                      onChange={(val) => {
                        if (selectedSearchItem != null) {
                          setSelectedSearchItem({
                            ...selectedSearchItem,
                            chairmanship: val.target.value
                          })
                        }
                      }}
                      class="form-control" />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Position</label>
                    <input
                      value={selectedSearchItem != null && selectedSearchItem.position}
                      onChange={(val) => {
                        if (selectedSearchItem != null) {
                          setSelectedSearchItem({
                            ...selectedSearchItem,
                            position: val.target.value
                          })
                        }
                      }}
                      class="form-control" />
                  </div>
                  {/* <div class="mb-3">
                    <label class="form-label">Status</label>
                    <input
                      value={selectedSearchItem != null && selectedSearchItem.status}
                      onChange={(val) => {
                        if (selectedSearchItem != null) {
                          setSelectedSearchItem({
                            ...selectedSearchItem,
                            status: val.target.value
                          })
                        }
                      }}
                      class="form-control" />
                  </div> */}
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" data-bs-dismiss="modal" onClick={() => addOfficial()} class="btn btn-primary bg-green">Save changes</button>
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
                          id='fnameinput'
                          disabled={isViewing}
                          value={resident.appointments_made}
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
                    }

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

                    <div class="mb-3">
                      <label class="form-label">Email</label>
                      <input
                        id='emailinput'
                        disabled={isViewing}
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
                      <span className="fw-bold">{resident.birthday}</span>

                      {!isViewing &&
                        <Calendar
                          id='bdayinput'
                          className="mt-3"
                          disabled={isViewing}
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
                      }

                    </div>

                    <div class="mb-3">
                      <label class="form-label">Phone number</label>
                      <input
                        id='phoneinput'
                        disabled={isViewing}
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

                    {
                      isViewing &&

                      <div class="mb-3 d-flex flex-column">
                        <label class="form-label">Supporting documents</label>

                        {/* resident.supporting_files_obj */}
                        { }
                        {resident.supporting_files_obj.lenght != 0 &&
                          resident.supporting_files_obj.map((i, k) => {

                            return (
                              <span
                                onClick={() => {
                                  setSelectedFileForViewing({
                                    fileName: i.file_name,
                                    base64: i.base64_file

                                  })
                                  setShowImage(true)
                                }}
                                className="pointer">{i.file_name}</span>
                            )
                          })
                        }

                      </div>
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
                            isPendingResident: 0
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
                              rejectResident()
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


          {/* Add barangay services */}

          <div id="addBarangayServices" class="modal" tabindex="-1">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">{isEdit ? "Edit" : "Add"} Barangay Services</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => { setIsEdit(false) }}></button>
                </div>
                <div class="modal-body">

                  <div id='certificateinput' class="mb-3">
                    <label class="form-label">Is this a certificate?</label>
                    <div class="form-check">
                      <input
                        checked={isCert == 1 ? true : false}
                        onChange={() => {


                          // document.getElementById('genderinput').style.border = '0px solid #dee2e6'


                          setIsCert(1)
                        }}
                        class="form-check-input" type="radio" name="isCertificate" id="isCertificate" />
                      <label class="form-check-label" for="flexRadioDefault2">
                        Yes
                      </label>
                    </div>

                    <div class="form-check">
                      <input
                        checked={isCert == 0 ? true : false}
                        onChange={() => {



                          // document.getElementById('genderinput').style.border = '0px solid #dee2e6'

                          setIsCert(0)

                        }}
                        class="form-check-input" type="radio" name="isCertificate" id="isCertificate" />
                      <label class="form-check-label" for="flexRadioDefault2">
                        No
                      </label>
                    </div>

                  </div>

                  <div class="mb-3">
                    <label class="form-label">Document Title</label>
                    <input
                      id='serviceinput'
                      value={sss.service}
                      onChange={(val) => {
                        setSSS({
                          ...sss, ...{
                            service: val.target.value
                          }
                        })

                      }}
                      class="form-control" />

                  </div>

                  <div class="mb-3">
                    <label class="form-label">Cost</label>
                    <input
                      id='serviceinput'
                      value={cost}
                      onChange={(val) => {
                        setCost(val.target.value)

                      }}
                      class="form-control" />

                  </div>

                  <div className="mb-3">

                    <label class="form-label">Legend</label>

                    <span className="ms-3" style={{ fontSize: "12px", color: "red" }}>Ex. {'{first_name}'} as placeholder</span>

                    <span className="ms-3" style={{ fontSize: "12px", color: "red" }}>Ex. {'{middle_name}'} as placeholder</span>
                    <span className="ms-3" style={{ fontSize: "12px", color: "red" }}>Ex. {'{last_name}'} as placeholder</span>
                    <span className="ms-3" style={{ fontSize: "12px", color: "red" }}>Ex. {'{cell_number}'} as placeholder</span>
                    <span className="ms-3" style={{ fontSize: "12px", color: "red" }}>Ex. {'{civil_status}'} as placeholder</span>
                    <span className="ms-3" style={{ fontSize: "12px", color: "red" }}>Ex. {'{birthday}'} as placeholder</span>
                    <span className="ms-3" style={{ fontSize: "12px", color: "red" }}>Ex. {'{gender}'} as placeholder</span>
                    <span className="ms-3" style={{ fontSize: "12px", color: "red" }}>Ex. {'{current_address}'} as placeholder</span>

                  </div>

                  {/* <div className="mb-3">
                    <label class="form-label">For Barangay ID</label>

                    <span className="ms-3">Ex. {'{first_name}'}  {'{middle_name}'} {'{last_name'} {'{address}'}as placeholder</span>
                  </div> */}

                  <div class="mb-3">
                    <label class="form-label">Description</label>

                    <ReactQuill
                      //  value={formik.values.message}
                      value={serviceDesc}
                      onChange={(val) => {
                        setServiceDesc(val)
                      }}
                      placeholder="Enter the message..........."
                    />


                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                  <button data-bs-dismiss="modal" onClick={() => addDocumentType()} type="button" class="btn btn-primary bg-green">Save</button>
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
                                complainant_id: ''
                              }
                            })
                          }}
                          class="form-check-input" type="radio" name="complainantRadio" id="flexRadioDefault3" />
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
                                complainant_id: ''
                              }
                            })
                          }}
                          class="form-check-input" type="radio" name="complainantRadio" id="flexRadioDefault4" />
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
                                complainee_id: ''
                              }
                            })
                          }}
                          class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
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
                                complainee_id: ''
                              }
                            })
                          }}
                          class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                        <label class="form-check-label" for="flexRadioDefault2">
                          Non-resident
                        </label>
                      </div>
                    </div>
                  }

                  <div class="mb-3 w-100" style={{ position: "relative" }}>
                    <label class="form-label">Complainee</label>
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

                  <div >
                    <button

                      // disabled={false}
                      disabled={disabledBlotterButton}
                      onClick={async () => {
                        // setShowBlotter(true)
                        setLoading(true)

                        let merge = {
                          token: token.token,
                          ...blotter
                        }


                        try {
                          let result;

                          result = !isViewing ? await dispatch(fileBlotterReportApi(merge)).unwrap() : await dispatch(editBlotterReportApi(merge)).unwrap();

                          setIsViewing(false)
                          setShowBlotter(false)
                          setSuccess(true)
                          setShowSuccess(true)
                          SetMessage(!isViewing ? 'Blotter successfully created' : "Blotter successfully updated")
                          setCount(count + 1)
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

                          setLoading(false)
                          // Handle success, e.g., navigate to another page
                        } catch (error) {
                          setLoading(false)
                          setSuccess(false)
                          setShowSuccess(true)
                          setShowBlotter(false)
                          // Handle error, e.g., show an error message
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

          {/* Modal */}
        </div>
      </Auth>
    </main>
  );
}
