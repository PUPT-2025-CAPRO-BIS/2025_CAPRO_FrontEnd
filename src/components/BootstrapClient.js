"use client"

import { useEffect } from 'react';

function BootstrapClient() {
  useEffect(() => {
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
    require('bootstrap-icons/font/bootstrap-icons.css')
  }, []);

  return null;
}

export default BootstrapClient;