import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { store } from './app/store'
import { router } from './app/router'
import { ToastProvider } from '@/shared/context/ToastContext'
import { initializeData } from '@/shared/lib/initData'
import './shared/styles/variables.css'
import './index.css'

initializeData().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <Provider store={store}>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </Provider>
    </React.StrictMode>,
  )
})