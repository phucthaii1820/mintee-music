import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Home from 'pages/Home'
import UpdateMusicPage from 'pages/UpdateMusicPage'

export default function WebRoute() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/update" element={<UpdateMusicPage />} />
      </Routes>
    </BrowserRouter>
  )
}
