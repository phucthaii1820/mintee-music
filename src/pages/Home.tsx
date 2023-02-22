import React from 'react'
import { Box, Card, CardMedia, Grid, IconButton, keyframes, Slider, Typography, useMediaQuery } from '@mui/material'
import styled from '@emotion/styled'
import PauseRounded from '@mui/icons-material/PauseRounded'
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded'
import FastForwardRounded from '@mui/icons-material/FastForwardRounded'
import FastRewindRounded from '@mui/icons-material/FastRewindRounded'
import ReactAudioPlayer from 'react-audio-player'

import { dataMusic } from 'consts/music'

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
  const [duration, setDuration] = React.useState(10)
  const [position, setPosition] = React.useState(0)
  const [paused, setPaused] = React.useState(true)
  const [audioIndex, setAudioIndex] = React.useState(0)
  const refMusic = React.useRef(null) as any
  const isMobile = useMediaQuery('(max-width:900px)')
  const [isHover, setIsHover] = React.useState(false)

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
      <Box
        sx={{
          maxWidth: '1200px',
          width: '100%',
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'space-around',
        }}
      >
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                background: 'rgba(0,0,0,0.1)',
                padding: '50px',
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
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
                    sx={{
                      color: 'white',
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
                    sx={{
                      color: 'white',
                    }}
                  >
                    <FastForwardRounded fontSize="large" />
                  </IconButton>
                )}
              </Box>

              <Typography
                variant={isMobile ? 'h6' : 'h5'}
                fontWeight={700}
                mt={6}
                color="primary.main"
                sx={{
                  width: '100%',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {dataMusic[audioIndex].song}
              </Typography>
              <Typography fontWeight={isMobile ? 300 : 700}>{dataMusic[audioIndex].singer}</Typography>

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
                        boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
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
                        <PlayArrowRounded sx={{ fontSize: '3rem' }} />
                      ) : (
                        <PauseRounded sx={{ fontSize: '3rem' }} />
                      )}
                    </IconButton>
                    <IconButton
                      aria-label="next song"
                      onClick={() => {
                        nextSong()
                        refMusic.current.audioEl.current.play()
                      }}
                    >
                      <FastForwardRounded fontSize="large" />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                maxHeight: isMobile ? 'calc(100vh - 490px)' : '520px',
                overflowY: 'auto',
                paddingRight: '10px',
                borderRadius: '10px',
                '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                  width: '5px',
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
              {dataMusic.map((item, index) => (
                <Card
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  sx={{
                    height: '100px',
                    position: 'relative',
                    color: index === audioIndex ? 'white' : 'theme.palette.text.primary',
                    background: index === audioIndex ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.1)',
                    borderRadius: '10px',
                    '&:hover': {
                      background: 'rgba(0,0,0,0.35)',
                      cursor: 'pointer',
                      color: 'white !important',
                    },
                    mb: index + 1 === dataMusic?.length ? 0 : 2,
                  }}
                  onClick={() => {
                    setPosition(0)
                    setAudioIndex(index)
                    setPaused(false)
                    refMusic.current.audioEl.current.play()
                  }}
                >
                  <Box sx={{ display: 'flex', width: '100%' }}>
                    <CardMedia
                      component="img"
                      sx={{
                        width: '80px',
                        height: '80px',
                        p: '10px 15px',
                        borderRadius: index === audioIndex ? '50%' : '20px',
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
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        height: '100px',
                        flexDirection: 'column',
                        ml: 2,
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
                        }}
                      >
                        {item.song}
                      </Typography>
                      <Typography variant="subtitle2" component="div">
                        {item.singer}
                      </Typography>
                    </Box>
                    {/* <TinyText
                      variant="subtitle1"
                      sx={{
                        position: 'absolute',
                        right: '10px',
                        top: 'calc(50% - 0.7rem)',
                      }}
                    >
                      5:00
                    </TinyText> */}
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
              // onSeeked={() => {
              //   refMusic.current.audioEl.current.currentTime = position
              // }}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default Home
