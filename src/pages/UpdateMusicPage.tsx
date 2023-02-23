/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-array-index-key */
/* eslint-disable dot-notation */
/* eslint-disable no-unused-vars */
import React from 'react'
import { Box, Button, CardMedia, Grid, keyframes, TextField, Typography, useMediaQuery } from '@mui/material'
import ReactImageUploading from 'react-images-uploading'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import ReactAudioPlayer from 'react-audio-player'
import { toast } from 'react-toastify'

import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { collection, addDoc } from 'firebase/firestore'
import { storage, db } from 'firebaseConfig'

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

const UpdateMusicPage = () => {
  const isMobile = useMediaQuery('(max-width:900px)')
  const [images, setImages] = React.useState([]) as any
  const [video, setVideo] = React.useState([]) as any
  const [song, setSong] = React.useState('')
  const [singer, setSinger] = React.useState('')

  const handleUpload = async () => {
    if (song === '') {
      toast.error('Vui lòng nhập tên bài hát')
      return
    }
    if (singer === '') {
      toast.error('Vui lòng nhập tên ca sĩ')
      return
    }

    if (images.length === 0) {
      toast.error('Vui lòng chọn ảnh')
      return
    }

    if (video.length === 0) {
      toast.error('Vui lòng chọn nhạc')
      return
    }
    let url1 = ''
    let url2 = ''
    let storageRef = ref(storage, `avata/${images[0]?.file.name}`)
    await uploadBytes(storageRef, images[0]?.file).then(async (snapshot) => {
      await getDownloadURL(snapshot.ref).then((url) => {
        url1 = url
      })
    })

    storageRef = ref(storage, `song/${video[0]?.file.name}`)
    await uploadBytes(storageRef, video[0]?.file).then(async (snapshot) => {
      await getDownloadURL(snapshot.ref).then((url) => {
        url2 = url
      })
    })

    try {
      await addDoc(collection(db, 'music'), {
        song,
        singer,
        avatar: url1,
        mp3: url2,
      })
      toast.success('Thêm bài hát thành công')
      setImages([])
      setVideo([])
      setSong('')
      setSinger('')
    } catch (e) {
      toast.error('Thêm bài hát thất bại')
    }
  }

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
          display: 'flex',
          background: 'rgba(0,0,0,0.1)',
          borderRadius: '10px',
          padding: '20px',
          boxShadow: '0 0 10px rgba(0,0,0,0.2)',
          width: isMobile ? '80%' : '800px',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h5" fontWeight={700} color="primary">
          Update Music Page
        </Typography>

        <Grid container spacing={2} sx={{ marginTop: '20px', width: '100%' }}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Typography variant="body1" fontWeight={700} color="primary">
                  Tên bài hát
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  fullWidth
                  value={song}
                  onChange={(e) => {
                    setSong(e.target.value)
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Typography variant="body1" fontWeight={700} color="primary">
                  Tác giả
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  fullWidth
                  value={singer}
                  onChange={(e) => {
                    setSinger(e.target.value)
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Typography variant="body1" fontWeight={700} color="primary">
                  Ảnh avata
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <ReactImageUploading
                  value={images}
                  onChange={(imageList, addUpdateIndex) => {
                    // setImageChange(imageList)
                    setImages(imageList)
                  }}
                  dataURLKey="data_url"
                >
                  {({
                    imageList,
                    onImageUpload,
                    onImageRemoveAll,
                    onImageUpdate,
                    onImageRemove,
                    isDragging,
                    dragProps,
                  }) => (
                    <div className="upload__image-wrapper">
                      {imageList?.length > 0 ? null : (
                        <Button onClick={onImageUpload} {...dragProps}>
                          Chọn ảnh
                        </Button>
                      )}

                      {imageList.map((image, index) => (
                        <Box
                          key={index}
                          sx={{
                            position: 'relative',
                          }}
                        >
                          <CardMedia
                            component="img"
                            image={image['data_url']}
                            alt=""
                            sx={{
                              height: '300px',
                              width: '100%',
                              borderRadius: '10px',
                            }}
                          />
                          <Button
                            onClick={() => onImageRemove(index)}
                            sx={{
                              position: 'absolute',
                              right: 0,
                              top: 10,
                              padding: 0,
                              margin: 0,
                            }}
                          >
                            <HighlightOffIcon
                              sx={{
                                background: 'rgba(0,0,0,0.5)',
                                borderRadius: '100%',
                                color: 'white',
                              }}
                            />
                          </Button>
                        </Box>
                      ))}
                    </div>
                  )}
                </ReactImageUploading>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid
              container
              spacing={2}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Grid item xs={3}>
                <Typography variant="body1" fontWeight={700} color="primary">
                  Nhạc
                </Typography>
              </Grid>
              <Grid item xs={9}>
                {video.length > 0 ? (
                  <ReactAudioPlayer src={video[0]?.data_url} controls />
                ) : (
                  <Button component="label">
                    Upload File
                    <input
                      type="file"
                      hidden
                      onChange={(e: any) => {
                        const file = e.target.files[0]
                        const url = URL.createObjectURL(file)
                        setVideo([{ data_url: url, file }])
                      }}
                    />
                  </Button>
                )}
              </Grid>
            </Grid>
          </Grid>

          <Grid
            item
            xs={12}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button
              sx={{
                background: 'rgba(0,0,0,0.1)',
                padding: '10px 20px',
                borderRadius: '10px',
              }}
              onClick={handleUpload}
            >
              Thêm bài hát
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default UpdateMusicPage
