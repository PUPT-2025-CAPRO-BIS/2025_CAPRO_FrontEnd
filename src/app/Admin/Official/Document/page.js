'use client'

import Button from "@/components/Button";
import { DocumentTemplate } from "@/components/DocumentTemplate";
import Image from "next/image";
import { useState } from "react";


export default function ViewDocument() {

  const [docType, setDocType] = useState('')

  return (
    <main >
      <div className="w-100 d-flex bg-white">
        
        <DocumentTemplate>

        </DocumentTemplate>

        
      </div>
    </main>
  );
}