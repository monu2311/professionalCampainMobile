import React from 'react'
import { Text } from 'react-native'
import { COLORS, TYPOGRAPHY } from '../constants/theme'

const Nodatafound = () => {
  return (
    <Text style={{color:COLORS.black,fontFamily:TYPOGRAPHY.DMSERIF,fontSize:18,textAlign:'center'}}>No Data Found</Text>
  )
}

export default Nodatafound