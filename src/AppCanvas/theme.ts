type PaletteMode = 'dark' | 'light'

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // palette values for light mode
          background: {
            default: 'rgb(255, 255, 255)'
          },
          text: {
            primary: 'rgb(0, 0, 0)'
          }
        }
      : {
          // palette values for dark mode
          background: {
            default: '#838383'
          },
          text: {
            primary: '#fff'
          }
        })
  }
})
