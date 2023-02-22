import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App'

const clientId = '699395752427-0q0ou1b0i55ogrvqluosnk4hsuuuejga.apps.googleusercontent.com'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <GoogleOAuthProvider clientId={clientId}>
    <App />
  </GoogleOAuthProvider>,
)
