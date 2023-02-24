import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Home from 'pages/Home'
import UpdateMusicPage from 'pages/UpdateMusicPage'
import Login from 'pages/Login'
import { useAuthState } from 'react-firebase-hooks/auth'

import { auth } from 'firebaseConfig'

export default function WebRoute() {
  const [user] = useAuthState(auth)
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Login />} />
        <Route path="/upload" element={user ? <UpdateMusicPage /> : <Login />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}
