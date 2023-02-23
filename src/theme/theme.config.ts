import { cyan } from '@mui/material/colors'
import { createTheme } from '@mui/material/styles'
import { ThemeOptions as ThemeOptionsOld } from '@mui/material/styles/createTheme'

// Custom theme: Colors
const themeColors = {
  color: {
    primary: cyan[700],
    secondary: '#003140',
    error: '#FF4D4F',
    lightSilver: '#BFBFBF',
  },
} as const

// Override style Mui
const themeOptions: ThemeOptionsOld = {
  ...themeColors,
  palette: {
    primary: {
      light: cyan[500],
      main: themeColors.color.primary,
      contrastText: '#000000',
    },
    secondary: {
      main: themeColors.color.secondary,
      contrastText: '#ffffff',
    },
    error: {
      main: themeColors.color.error,
    },
    grey: {
      200: themeColors.color.lightSilver,
    },
  },
  typography: {
    fontFamily: ['Lexend', 'sans-serif'].join(','),
    fontSize: 14,
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.MuiOutlinedInput-root': {
            borderRadius: '2px',
            '& .MuiOutlinedInput-input': {
              padding: '7px 12px',
              borderRadius: '2px',
              fontSize: 14,
              fontWeight: 500,
              lineHeight: 1.6,
              color: themeColors.color.secondary,
              fontFamily: 'Lexend',
              '&::placeholder': {
                color: themeColors.color.lightSilver,
                opacity: 1,
              },
              '&::-ms-input-placeholder': {
                color: themeColors.color.lightSilver,
                opacity: 1,
              },
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'Lexend',
          padding: '4px 8px',
          borderRadius: '2px',
          textTransform: 'inherit',
          fontSize: '14px',
          '&.MuiButton-containedPrimary': {
            color: '#ffffff',
            backgroundColor: themeColors.color.primary,
            '&:hover': {
              backgroundColor: cyan[900],
            },
          },
        },
      },
    },
  },
}

// Create theme
export const theme = createTheme({ ...themeColors, ...themeOptions })
