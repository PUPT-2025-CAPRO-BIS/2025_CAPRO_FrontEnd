'use client'
import Button from "@/components/Button";
import Image from "next/image";
import { useRouter } from 'next/navigation'


export default function ResidentAppointment() {
    const router = useRouter()
  return (
    <main >
      <div className=" d-flex bg-white bg-3 align-items-center justify-content-center flex-column">

        <div className="logo-bg col-lg-7" style={{height: "150px"}}></div>
        <div className="d-flex flex-column justify-content-center align-items-center mt-5">
            
            <button 
            onClick={() => {
                router.push('/Appointment/Resident/Create', { scroll: false })
            }}
            type="button" className="btn fw-bold f-white w-100 bg-yellow d-flex d-flex align-items-center justify-content-center"> 
            <i class="bi bi-calendar-month me-3" style={{fontSize: "36px"}}></i>
              SCHEDULE AN APPOINTMENT
              </button>
          </div>

        
      </div>
    </main>
  );
}
