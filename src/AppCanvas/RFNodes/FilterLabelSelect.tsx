// import React, { useCallback, useEffect, useMemo, useState } from 'react'
// import shallow from 'zustand/shallow'
// import { Module, PropObject, ModelRes } from '../types'

// import Box from '@mui/material/Box'
// import FormLabel from '@mui/material/FormLabel'
// import FormControl from '@mui/material/FormControl'
// import FormGroup from '@mui/material/FormGroup'
// import FormControlLabel from '@mui/material/FormControlLabel'
// import FormHelperText from '@mui/material/FormHelperText'
// import Checkbox from '@mui/material/Checkbox'

// export interface FilterLabelSelectProps {
//   labels: string[]
//   onSelectChange: (labels: string[]) => void
// }

// export const FilterLabelSelect = ({
//   labels,
//   onSelectChange
// }: FilterLabelSelectProps): JSX.Element => {
//   if (labels.length === 0) {
//     return <Box>当前选择的模型没有可用label</Box>
//   }
//   return (
//     <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
//       <FormLabel component="legend">选择具体label</FormLabel>
//       <FormGroup>
//         <FormControlLabel
//           control={
//             <Checkbox checked={gilad} onChange={handleChange} name="gilad" />
//           }
//           label="Gilad Gray"
//         />
//         <FormControlLabel
//           control={
//             <Checkbox checked={jason} onChange={handleChange} name="jason" />
//           }
//           label="Jason Killian"
//         />
//         <FormControlLabel
//           control={
//             <Checkbox
//               checked={antoine}
//               onChange={handleChange}
//               name="antoine"
//             />
//           }
//           label="Antoine Llorca"
//         />
//       </FormGroup>
//     </FormControl>
//   )
// }
