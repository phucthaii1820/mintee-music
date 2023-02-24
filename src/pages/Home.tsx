/* eslint-disable no-unused-vars */
import React from 'react'
import { Box, Card, CardMedia, Grid, IconButton, keyframes, Slider, Typography, useMediaQuery } from '@mui/material'
import styled from '@emotion/styled'
import PauseRounded from '@mui/icons-material/PauseRounded'
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded'
import FastForwardRounded from '@mui/icons-material/FastForwardRounded'
import FastRewindRounded from '@mui/icons-material/FastRewindRounded'
import ReactAudioPlayer from 'react-audio-player'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import LogoutIcon from '@mui/icons-material/Logout'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

import { auth, db, logout } from 'firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'
import 'styles/eq-bar.css'
import { cyan } from '@mui/material/colors'
import 'styles/music.css'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

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

const rotatePlay = keyframes` 
0% {
  transform: rotate(0deg);
}
100% {
  transform: rotate(360deg);
}`

const rotatePause = keyframes` 
0% {
  transform: rotate(360deg);
}

100% {
  transform: rotate(0deg);
}`

const TinyText = styled(Typography)({
  fontSize: '1rem',
  opacity: 0.38,
  fontWeight: 700,
  letterSpacing: 0.2,
})

function formatDuration(value: number) {
  const minute = Math.floor(Math.floor(value) / 60)
  const secondLeft = Math.floor(value) - minute * 60
  return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`
}

const Home = () => {
  // eslint-disable-next-line no-unused-vars
  const [user] = useAuthState(auth)
  const [duration, setDuration] = React.useState(10)
  const [position, setPosition] = React.useState(0)
  const [paused, setPaused] = React.useState(false)
  const [audioIndex, setAudioIndex] = React.useState(0)
  const refMusic = React.useRef(null) as any
  const isMobile = useMediaQuery('(max-width:900px)')
  const [isHover, setIsHover] = React.useState(false)
  const [dataMusic, setDataMusic] = React.useState<any>([])
  const navigate = useNavigate()

  const onLoadedMetadata = () => {
    if (refMusic.current) {
      setDuration(refMusic?.current?.audioEl?.current?.duration)
    }
  }

  const nextSong = () => {
    if (audioIndex < dataMusic.length - 1) {
      setPosition(0)
      setAudioIndex(audioIndex + 1)
    } else {
      setPosition(0)
      setAudioIndex(0)
    }
  }

  const prevSong = () => {
    if (audioIndex > 0) {
      setPosition(0)
      setAudioIndex(audioIndex - 1)
    } else {
      setPosition(0)
      setAudioIndex(dataMusic.length - 1)
    }
  }

  React.useEffect(() => {
    if (Math.floor(position) + 1 >= Math.floor(duration)) {
      if (audioIndex < dataMusic.length - 1) nextSong()
      else setAudioIndex(0)
    }
  }, [position])

  const getMusic = async () => {
    const musicCollection = collection(db, `${user?.uid}`)

    await getDocs(musicCollection).then((data) => {
      if (data?.empty) {
        toast.info('Bạn chưa có bài hát nào trong thư viện, hãy thêm bài hát')
        navigate('/upload')
      } else {
        setDataMusic(
          data.docs.map((doc) => {
            return { ...doc.data(), id: doc.id }
          }),
        )
      }
    })
  }

  React.useEffect(() => {
    if (user) getMusic()
  }, [])

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
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <IconButton onClick={logout}>
          <LogoutIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            navigate('/upload')
          }}
        >
          <CloudUploadIcon />
        </IconButton>
      </Box>
      {dataMusic.length > 0 && (
        <Box
          sx={{
            maxWidth: '1400px',
            width: '100%',
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'space-around',
          }}
        >
          <Grid container spacing={6}>
            <Grid item xs={12} md={5.3}>
              <Box
                sx={{
                  background: 'white',
                  // background: 'rgba(0,0,0,0.1)',
                  boxShadow: '0 0 5px rgba(0,0,0,0.2)',
                  padding: '50px',
                  borderRadius: '40px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  mx: 2,
                }}
                className="music-card"
              >
                <Box
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    width: '100%',
                  }}
                >
                  {isMobile && (
                    <IconButton
                      aria-label="previous song"
                      onClick={() => {
                        prevSong()
                        refMusic.current.audioEl.current.play()
                      }}
                    >
                      <FastRewindRounded fontSize="large" />
                    </IconButton>
                  )}

                  <CardMedia
                    component="img"
                    height={isMobile ? '130px' : '200px'}
                    image={dataMusic[audioIndex].avatar}
                    alt="random"
                    sx={{
                      width: isMobile ? '130px' : '200px',
                      borderRadius: '50%',
                      animation: paused
                        ? `1s ease 0s 1 normal forwards running ${rotatePause}`
                        : `10s linear 0s infinite normal none running ${rotatePlay} `,
                      cursor: 'pointer',
                      filter: isHover ? 'brightness(0.8)' : 'brightness(1)',
                    }}
                    onClick={() => {
                      setPaused(!paused)
                      if (paused) refMusic.current.audioEl.current.play()
                      else refMusic.current.audioEl.current.pause()
                    }}
                    onMouseEnter={() => {
                      setIsHover(true)
                    }}
                    onMouseLeave={() => {
                      setIsHover(false)
                    }}
                  />
                  {isHover && (
                    <IconButton
                      aria-label={paused ? 'play' : 'pause'}
                      sx={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%,-50%)',
                        color: 'white',
                      }}
                      onClick={() => {
                        setPaused(!paused)
                        if (paused) refMusic.current.audioEl.current.play()
                        else refMusic.current.audioEl.current.pause()
                      }}
                      onMouseEnter={() => {
                        setIsHover(true)
                      }}
                    >
                      {paused ? (
                        <PlayArrowRounded sx={{ fontSize: '3rem' }} />
                      ) : (
                        <PauseRounded sx={{ fontSize: '3rem' }} />
                      )}
                    </IconButton>
                  )}

                  {isMobile && (
                    <IconButton
                      aria-label="next song"
                      onClick={() => {
                        nextSong()
                        refMusic.current.audioEl.current.play()
                      }}
                    >
                      <FastForwardRounded fontSize="large" />
                    </IconButton>
                  )}
                </Box>

                <Typography
                  variant={isMobile ? 'h6' : 'h5'}
                  fontWeight={900}
                  mt={6}
                  color="primary.main"
                  sx={{
                    width: '100%',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    textAlign: 'center',
                  }}
                >
                  {dataMusic[audioIndex].song}
                </Typography>
                <TinyText fontWeight={isMobile ? 300 : 700}>{dataMusic[audioIndex].singer}</TinyText>

                <Box
                  mt={2}
                  sx={{
                    width: '100%',
                  }}
                >
                  <Slider
                    aria-label="time-indicator"
                    size="small"
                    value={position}
                    min={0}
                    step={1}
                    max={duration}
                    onChange={(_, value) => {
                      setPosition(value as number)
                    }}
                    onChangeCommitted={(_, value) => {
                      refMusic.current.audioEl.current.currentTime = value
                    }}
                    sx={{
                      height: 4,
                      '& .MuiSlider-thumb': {
                        width: 8,
                        height: 8,
                        transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                        '&:before': {
                          // boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                        },
                        '&.Mui-active': {
                          width: 20,
                          height: 20,
                        },
                      },
                      '& .MuiSlider-rail': {
                        opacity: 0.28,
                      },
                    }}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mt: -2,
                    }}
                  >
                    <TinyText>{formatDuration(position)}</TinyText>
                    <TinyText>{formatDuration(duration)}</TinyText>
                  </Box>

                  {!isMobile && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mt: -1,
                      }}
                    >
                      <IconButton
                        aria-label="previous song"
                        onClick={() => {
                          prevSong()
                          refMusic.current.audioEl.current.play()
                        }}
                        sx={{
                          '&:hover': {
                            color: 'primary.main',
                          },
                        }}
                      >
                        <FastRewindRounded fontSize="large" />
                      </IconButton>
                      <IconButton
                        aria-label={paused ? 'play' : 'pause'}
                        onClick={() => {
                          setPaused(!paused)
                          if (paused) refMusic.current.audioEl.current.play()
                          else refMusic.current.audioEl.current.pause()
                        }}
                      >
                        {paused ? (
                          <PlayArrowRounded
                            sx={{
                              fontSize: '3rem',
                              '&:hover': {
                                color: 'primary.main',
                              },
                            }}
                          />
                        ) : (
                          <PauseRounded
                            sx={{
                              fontSize: '3rem',
                              '&:hover': {
                                color: 'primary.main',
                              },
                            }}
                          />
                        )}
                      </IconButton>
                      <IconButton
                        aria-label="next song"
                        onClick={() => {
                          nextSong()
                          refMusic.current.audioEl.current.play()
                        }}
                      >
                        <FastForwardRounded
                          fontSize="large"
                          sx={{
                            '&:hover': {
                              color: 'primary.main',
                            },
                          }}
                        />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6.7}>
              <Box
                sx={{
                  maxHeight: isMobile ? 'calc(100vh - 490px)' : '520px',
                  overflowY: 'auto',
                  paddingRight: '10px',
                  borderRadius: '10px',
                  '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                    width: '5px',
                    hidden: 'true',
                  },
                  '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
                    background: 'rgba(0,0,0,0.1)',
                    borderRadius: '40px',
                  },
                  '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
                    backgroundColor: 'transparent',
                  },
                }}
              >
                {dataMusic.map((item: any, index: number) => (
                  <Card
                    // className="music-card-list"
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    sx={{
                      height: '90px',
                      position: 'relative',
                      color: index === audioIndex ? 'primary.main' : 'none',
                      background: index === audioIndex ? 'white' : 'white',
                      filter: index === audioIndex ? 'brightness(1)' : 'brightness(1)',
                      boxShadow: index === audioIndex ? '0 0 5px rgba(0,0,0,0.2)' : 'none',
                      borderLeft: index === audioIndex ? `5px solid ${cyan[500]}` : 'none',
                      borderRadius: '25px',
                      transition:
                        'transform 250ms ease-in-out, background 250ms ease-in-out, filter 250ms ease-in-out, color 250ms ease-in-out, box-shadow 250ms ease-in-out, border-left 250ms ease-in-out',
                      '&:hover': {
                        cursor: 'pointer',
                        background: 'white',
                        filter: 'brightness(0.9)',
                        color: 'primary.main',
                        transform: 'translate(-10px)',
                      },
                      mx: 2,
                      mb: index + 1 === dataMusic?.length ? 0 : 2,
                      p: '8px 15px',
                    }}
                    onClick={() => {
                      setPosition(0)
                      setAudioIndex(index)
                      setPaused(false)
                      refMusic.current.audioEl.current.play()
                    }}
                  >
                    <Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
                      {index === audioIndex && !paused ? (
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            px: 1,
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            style={{
                              fill: cyan[500],
                            }}
                          >
                            <rect className="eq-bar eq-bar--1" x="4" y="4" width="3.7" height="8" />
                            <rect className="eq-bar eq-bar--2" x="10.2" y="4" width="3.7" height="16" />
                            <rect className="eq-bar eq-bar--3" x="16.3" y="4" width="3.7" height="11" />
                          </svg>
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            px: 1,
                          }}
                        >
                          <Typography
                            fontWeight={700}
                            sx={{
                              color: index === audioIndex ? 'primary.main' : 'none',
                              opacity: index === audioIndex ? 1 : 0.38,
                            }}
                          >
                            {index < 9 ? `0${index + 1}` : index + 1}
                          </Typography>
                        </Box>
                      )}

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <CardMedia
                          component="img"
                          sx={{
                            width: '80px',
                            height: '80px',
                            px: '10px',
                            borderRadius: '50%',
                            animation:
                              // eslint-disable-next-line no-nested-ternary
                              index === audioIndex
                                ? paused
                                  ? `1s ease 0s 1 normal forwards running ${rotatePause}`
                                  : `10s linear 0s infinite normal none running ${rotatePlay} `
                                : 'none',
                          }}
                          src={item.avatar}
                          alt="image song"
                        />
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <ArrowRightIcon
                          sx={{
                            opacity: index === audioIndex ? 1 : 0.38,
                            fontSize: '2rem',
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          height: '100%',
                          flexDirection: 'column',
                          ml: 2,
                          maxWidth: '60%',
                        }}
                      >
                        <Typography
                          component="div"
                          variant="h6"
                          sx={{
                            width: '100%',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            opacity: index === audioIndex ? 1 : 0.38,
                          }}
                        >
                          {item.song}
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          component="div"
                          sx={{
                            opacity: index === audioIndex ? 0.6 : 0.38,
                          }}
                        >
                          {item.singer}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                ))}
              </Box>
              <ReactAudioPlayer
                src={dataMusic[audioIndex].mp3}
                ref={refMusic}
                listenInterval={100}
                onListen={() => setPosition(refMusic.current.audioEl.current.currentTime)}
                onLoadedMetadata={onLoadedMetadata}
                autoPlay
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  )
}

export default Home
