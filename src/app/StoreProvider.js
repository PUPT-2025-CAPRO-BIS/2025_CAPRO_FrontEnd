"use client";
import { persistor, store } from "@/redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import {NextUIProvider} from '@nextui-org/react'

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
      <NextUIProvider>

       {children}
       </NextUIProvider>
      </PersistGate>
      
    </Provider>
  );
}