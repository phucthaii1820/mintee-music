/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
import React, { useEffect } from 'react'
import { keyframes } from '@emotion/react'
import { Box, Button } from '@mui/material'
import { useAuthState } from 'react-firebase-hooks/auth'

import { auth, signInWithGoogle } from 'firebaseConfig'
import { useNavigate } from 'react-router-dom'

const gradient = keyframes`
0% {
  background-position: 0% 50%;
}
50% {
  background-position: 100% 50%;
}
100% {
  background-position: 0% 50%;
}`

const Login = () => {
  const [user, loading] = useAuthState(auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (loading) return
    if (user) navigate('/')
  }, [user, loading])

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100vh',
        alignItems: 'center',
        flexDirection: 'column',
        background: 'linear-gradient(-45deg, #e58c8a, #e7c4c9, #c1d7fc, #9beab0)',
        animation: `${gradient} 10s ease infinite`,
        WebkitTapHighlightColor: 'transparent',
        backgroundSize: `350% 350%`,
      }}
    >
      <Button className="login__btn login__google" onClick={signInWithGoogle}>
        Login with Google
      </Button>
    </Box>
  )
}

export default Login
