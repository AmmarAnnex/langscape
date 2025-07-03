import localFont from 'next/font/local'

export const rework = localFont({
  src: [
    {
      path: '../fonts/ReworkTextTRIAL-Thin.otf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../fonts/ReworkTextTRIAL-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../fonts/ReworkTextTRIAL-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/ReworkTextTRIAL-Semibold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../fonts/ReworkTextTRIAL-Bold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-rework'
})