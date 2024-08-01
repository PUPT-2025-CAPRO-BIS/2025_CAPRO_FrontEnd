'use client'
import Button from "@/components/Button";
import { HeaderItem, RowItem } from "@/components/RowItem";
import { addOfficials, deleteOffialsApi, loadOfficials, updateOfficials } from "@/redux/reducer/officials";
import { addResidentApi, loadAllUsers } from "@/redux/reducer/resident";
import { LogOut } from "@/redux/reducer/user";
import Auth from "@/security/Auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export default function Official() {
  const dispatch = useDispatch();
  const router = useRouter()
  const officials = useSelector(state => state)
  const alluser = useSelector(state => state.alluser)
  const token = useSelector(state => state.user)
  const [sample, setSample] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9
  ])

  const [selectedItem, setSelectedItem] = useState(null)


  // 0 - BO   MR -1    SCHEDULES - 2 BR - 3
  const [tab, seTab] = useState(0)

  const [searchVal, setSearchVal] = useState('')
  const [searchOfficial, setSearchOfficial] = useState([])
  const [selectedSearchItem, setSelectedSearchItem] = useState('')
  const [count, setCount] = useState(0)



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
    male_female: ''
  })
  // male 0 female 1
  // Resident

  useEffect(() => {

    if (tab == 0) {
      const fetchData = async () => {

        try {
          const result = await dispatch(loadOfficials(token.token)).unwrap();

          // Handle success, e.g., navigate to another page
        } catch (error) {

          // Handle error, e.g., show an error message
        }
      };

      fetchData();
    }
    if (tab == 1 || tab == 0) {
      const fetchData = async () => {

        try {
          const result = await dispatch(loadAllUsers(token.token)).unwrap();

          // Handle success, e.g., navigate to another page
        } catch (error) {

          // Handle error, e.g., show an error message
        }
      };

      fetchData();
    }
  }, [tab, count]);


  const searchAddOfficial = (v) => {


    setSearchVal(v)
    //v search val
    // officials list
    let tmpArr = []
    alluser.list.map((i, k) => {

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

  const deleteOffials = () => {
    let merge = {
      selectedItem,
      token: token.token
    }



    dispatch(deleteOffialsApi(merge))
    setTimeout(() => {
      setCount(count + 1)
      setSelectedItem('')
    }, 3000)
  }


  const updateOfficial = async () => {


    let merge = {
      selectedItem,
      token: token.token
    }


    console.log('before: ', merge)
    dispatch(updateOfficials(merge))
    setTimeout(() => {
      setCount(count + 1)

      document.getElementById('selctednameadd').value = ''
      setSelectedItem({
        chairmanship: '',
        position: '',
        status: '',
      })
    }, 3000)


  }

  const addOfficial = async () => {


    let merge = {
      selectedSearchItem,
      token: token.token
    }

    dispatch(addOfficials(merge))
    setTimeout(() => {
      setCount(count + 1)

      document.getElementById('selctednameadd').value = ''
      setSelectedSearchItem({
        chairmanship: '',
        position: '',
        status: '',
      })
    }, 3000)


  }


  const addResident = async () => {

    console.log("check datasss:", resident.male_female === "", resident.male_female)



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
      document.getElementById('bdayinput').style.border = '1px solid red'
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




    let merge = {
      resident,
      birthday: startDate,
      token: token.token
    }

    console.log(merge, "--> CHECK MERGE")
    // dispatch(addResidentApi(merge))

  }

  useEffect(() => {

  }, [])



  const changeTab = (v) => {
    seTab(v)
  }



  return (
    <main className={`container-fluid`}>
      <Auth>
        <div className="row vh-100">

          <div className="col-lg-4 p-5 d-flex flex-column bg-green side-bg">

            <div className="d-flex flex-column align-items-center logo-bg col-lg-12" style={{ height: "100px" }}>

            </div>



            {/* Navigation */}

            <div className="flex-column mt-5">


              <div onClick={() => changeTab(0)} className={`p-4 w-100 rounded ${tab == 0 ? 'active-nav' : ''} pointer`}>
                <span className="f-white">
                  Barangay Officials
                </span>
              </div>


              <div onClick={() => changeTab(1)} className={`p-4 w-100 rounded ${tab == 1 ? 'active-nav' : ''} pointer`}>
                <span className="f-white">
                  Manage Residents
                </span>
              </div>


              <div onClick={() => changeTab(2)} className={`p-4 w-100 rounded ${tab == 2 ? 'active-nav' : ''} pointer`}>
                <span className="f-white">
                  Schedules
                </span>
              </div>


              <div onClick={() => changeTab(2)} className={`p-4 w-100 rounded ${tab == 2 ? 'active-nav' : ''} pointer`}>
                <span className="f-white">
                  Blotter
                </span>
              </div>

              <div onClick={() => changeTab(3)} className={`p-4 w-100 rounded ${tab == 3 ? 'active-nav' : ''} pointer`}>
                <span className="f-white">
                  Services
                </span>
              </div>



            </div>
            {/* Navigation */}

          </div>

          <div className="col-lg-8 d-flex flex-column align-items-center justify-content-center" style={{}}>
            <div>
              <button onClick={async () => {

                try {
                  const result = await dispatch(LogOut());
                  router.replace('/', { scroll: false })
                  // Handle success, e.g., navigate to another page
                } catch (error) {

                  // Handle error, e.g., show an error message
                }

              }}>
                LOGOUT
              </button>
            </div>

            <div className="d-flex flex-column align-items-center justify-content-center w-100 p-5 rounded bg-green">
              <h1 className="f-white">
                BARANGAY CENTRAL BICUTAN
              </h1>

              <span className="f-white">
                Sunflower Street, Taguig City, Metro Manila
              </span>
            </div>

            {/* BO */}
            {tab == 0 &&

              <div className="mt-3 d-flex flex-column  justify-content-center w-100 p-5 rounded bg-green" >

                <div className="border-bottom p-2 pb-4 mt-3">
                  <h2 className="f-white">Current Barangay Officials</h2>
                </div>

                <div className="d-flex mt-4 justify-content-between pb-4 border-bottom">

                  <div className="d-flex align-items-center">
                    <span className="f-white">Search:</span>
                    <input type="email" className="form-control rounded ms-2" id="exampleFormControlInput1" placeholder="Username" />
                  </div>

                  {
                    <div >
                      <button
                        className="primary bg-yellow p-2 rounded" style={{ border: "0px" }}
                        data-bs-toggle="modal" data-bs-target="#addOfficialModal"
                      >
                        <i className="bi bi-plus fw-bold" style={{ fontSize: "20px" }}></i>
                        <span className="fw-bold">Add official</span>
                      </button>
                    </div>
                  }
                </div>


                {/*  */}
                <div className="border-bottom p-2 pb-4 mt-3">

                  {/* Table header */}
                  <div className="d-flex col-lg-12 align-items-center justify-content-around border-bottom pb-4" style={{}}>
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

                  <div className="d-flex flex-column  col-lg-12 align-items-center justify-content-between table-mh" >

                    {
                      officials.officials.list.map((i, k) => {
                        return (

                          // Put dynamic className
                          <div className='d-flex col-lg-12 justify-content-around  row-item-container'>
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
                              <span id={k + i.full_name + "action"}
                                onClick={() => {
                                  document.getElementById(k + i.full_name + "button").classList.remove('d-none')
                                  document.getElementById(k + i.full_name + "action").classList.add('d-none')

                                }}
                                className="f-white bg-yellow p-2 rounded">
                                ACTION
                              </span>
                              <div id={k + i.full_name + "button"} className="d-flex d-none">

                                <button
                                  data-bs-toggle="modal" data-bs-target="#exampleModal"
                                  onClick={() => {
                                    setSelectedItem(i)
                                    document.getElementById(k + i.full_name + "button").classList.add('d-none')
                                    document.getElementById(k + i.full_name + "action").classList.remove('d-none')
                                  }}
                                  type="button" class="btn btn-primary">Edit</button>

                                <button
                                  data-bs-toggle="modal" data-bs-target="#deleteConfirmModal"

                                  onClick={() => {
                                    setSelectedItem(i)
                                    document.getElementById(k + i.full_name + "button").classList.add('d-none')
                                    document.getElementById(k + i.full_name + "action").classList.remove('d-none')
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

                <div className="border-bottom p-2 pb-4 mt-3">
                  <h2 className="f-white">Resident Records</h2>
                </div>

                <div className="d-flex mt-4 justify-content-between pb-4 border-bottom">

                  <div className="d-flex align-items-center">
                    <span className="f-white">Search:</span>
                    <input type="email" className="form-control rounded ms-2" id="exampleFormControlInput1" placeholder="Username" />
                  </div>

                  <div >
                    <button
                      data-bs-toggle="modal" data-bs-target="#addResidentModal"
                      className="primary bg-yellow p-2 rounded" style={{ border: "0px" }}
                    >
                      <i className="bi bi-plus fw-bold" style={{ fontSize: "20px" }}></i>
                      <span className="fw-bold">Add Resident</span>
                    </button>
                  </div>
                </div>


                {/*  */}
                <div className="border-bottom p-2 pb-4 mt-3">

                  {/* Table header */}
                  <div className="d-flex col-lg-12 align-items-center justify-content-around border-bottom pb-4" style={{}}>
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
                      Action
                    </HeaderItem>
                  </div>



                  {/* Table body */}

                  <div className="d-flex flex-column  col-lg-12 align-items-center justify-content-between table-mh" >

                    {
                      sample.map((i, k) => {
                        return (

                          // Put dynamic className
                          <div className='d-flex col-lg-12 justify-content-around row-item-container'>
                            <RowItem>
                              <span className="f-white">
                                John Doe
                              </span>
                            </RowItem>
                            <RowItem>
                              <span className="f-white">
                                John Doe
                              </span>
                            </RowItem>
                            <RowItem>
                              <span className="f-white">
                                John Doe
                              </span>
                            </RowItem>
                            <RowItem>
                              <span className="f-white">
                                John Doe
                              </span>
                            </RowItem>
                            <RowItem>
                              <span className="f-white">
                                John Doe
                              </span>
                            </RowItem>
                            <RowItem>
                              <span className="f-white">
                                John Doe
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

            {/* MANAGE RESIDENT */}



            {/* Barangay services */}

            {
              tab == 3 &&
              <div className="mt-3 d-flex flex-column  justify-content-center w-100 p-5 rounded bg-green" >

                <div className="border-bottom p-2 pb-4 mt-3">
                  <h2 className="f-white">Barangay Services</h2>
                </div>

                <div className="d-flex mt-4 justify-content-between pb-4 border-bottom">

                  <div className="d-flex align-items-center">
                    <span className="f-white">Search:</span>
                    <input type="email" className="form-control rounded ms-2" id="exampleFormControlInput1" />
                  </div>

                  <div >
                    <Button>
                      <i className="bi bi-plus fw-bold" style={{ fontSize: "20px" }}></i>
                      <span className="fw-bold">Services</span>
                    </Button>
                  </div>
                </div>


                {/*  */}
                <div className="border-bottom p-2 pb-4 mt-3">

                  {/* Table header */}
                  <div className="d-flex col-lg-12 align-items-center justify-content-around border-bottom pb-4" style={{}}>
                    <HeaderItem>
                      No.
                    </HeaderItem>
                    <HeaderItem>
                      Service
                    </HeaderItem>
                    <HeaderItem>
                      Description
                    </HeaderItem>
                    <HeaderItem>
                      Action
                    </HeaderItem>
                  </div>



                  {/* Table body */}

                  <div className="d-flex flex-column  col-lg-12 align-items-center justify-content-between table-mh" >

                    {
                      sample.map((i, k) => {
                        return (

                          // Put dynamic className
                          <div className='d-flex col-lg-12 justify-content-around row-item-container'>
                            <RowItem>
                              <span className="f-white">
                                John Doe
                              </span>
                            </RowItem>
                            <RowItem>
                              <span className="f-white">
                                John Doe
                              </span>
                            </RowItem>
                            <RowItem>
                              <span className="f-white">
                                John Doe
                              </span>
                            </RowItem>
                            <RowItem>
                              <span className="f-white">
                                John Doe
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

            {/* Barangay services */}

          </div>

          {/* Modal */

          }
          <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">Edit</h1>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <div class="mb-3">
                    <label class="form-label">Name</label>
                    <input
                      value={selectedItem != null && selectedItem.full_name}
                      onChange={(val) => {
                        if (selectedItem != null) {
                          setSelectedItem({
                            ...selectedItem,
                            full_name: val.target.value
                          })
                        }
                      }}
                      class="form-control" />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Chairmanship</label>
                    <input
                      value={selectedItem != null && selectedItem.chairmanship}
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
                      value={selectedItem != null && selectedItem.position}
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
                  <div class="mb-3">
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
                  </div>
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
                  <div class="mb-3">
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
                  </div>
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

          <div class="modal fade" id="addResidentModal" tabindex="-1" aria-labelledby="addResidentModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content" style={{ maxHeight: "720px", overflowY: "scroll" }}>
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="addOfficialModalLabel">Add Resident</h1>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
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
                      value={resident.email}
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
                    <DatePicker
                      id='bdayinput'
                      className="w-100 form-control"
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                      selected={startDate} onChange={(date) => {
                        if (val.target.value != "") {
                          document.getElementById('bdayinput').style.border = '1px solid #dee2e6'
                        }
                        else {
                          document.getElementById('bdayinput').style.border = '1px solid red'
                        }
                        setStartDate(date)
                      }
                      } />
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

                    <div class="form-check">
                      <input
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
                      id='civilinput'
                      onChange={(v) => {
                         document.getElementById('civilinput').style.border = '0px solid #dee2e6'
                        setResident({
                          ...resident, ...{
                            civil_status_id: v.target.value
                          }
                        })
                      }}
                      class="form-select" aria-label="Default select example">
                      <option selected>Civil status</option>
                      <option value="0">Single</option>
                      <option value="1">Married</option>
                      <option value="2">Widowed</option>
                      <option value="3">Legally Separated</option>
                    </select>

                  </div>



                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" onClick={() => addResident()} class="btn btn-primary bg-green">Save changes</button>
                </div>
              </div>
            </div>
          </div>

          {/* Add Resident */}


          {/* Confirm delete modal */}

          <div id="deleteConfirmModal" class="modal" tabindex="-1">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Delete</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <p>Are you sure you want to delete this user "<span className="fw-bold">{selectedItem != null && selectedItem.full_name}</span>"?</p>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                  <button data-bs-dismiss="modal" onClick={() => deleteOffials()} type="button" class="btn btn-primary bg-green">Yes</button>
                </div>
              </div>
            </div>
          </div>
          {/* Modal */}
        </div>
      </Auth>
    </main>
  );
}
