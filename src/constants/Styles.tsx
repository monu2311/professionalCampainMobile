import { StyleSheet } from 'react-native';
import { COLORS, IOS, PADDING, TYPOGRAPHY } from './theme';


export const defaultStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
  },
  displayFlex:{
    alignItems:'center',
    justifyContent:'center',
    display:'flex',
    flexDirection:'column'
  },
  header: {
    fontSize: 24,
    fontWeight: IOS ? '700'  : undefined,
    fontFamily:'DMSerifDisplay-Regular',
    color:COLORS.specialTextColor,
    lineHeight:32
  },
  pillButton: {
    padding: 10,
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.mainColor,
  },
  textLink: {
    color: COLORS.textColor,
    fontSize: 18,
    fontWeight: '500',
  },
  descriptionText: {
    fontSize: 18,
    marginTop: 20,
    color: COLORS.labelColor,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  pillButtonSmall: {
    paddingHorizontal: 20,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.mainColor,
  },
  buttonTextSmall: {
    // color: '#fff',
    // lineHeight:30,
    fontFamily:'DMSerifDisplay-Regular',

    fontSize: 16,
    fontWeight: '500',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 20,
    marginBottom: 10,
  },
  block: {
    marginHorizontal: 20,
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 16,
    gap: 20,
  },

 // --------- Heading -------------
 displayextralarge:{
  fontSize:30,
  fontFamily:TYPOGRAPHY.QUICKREGULAR,

 },
 displaylarge:{
  fontSize:24,
  fontFamily:TYPOGRAPHY.QUICKREGULAR,
 },
 displaysemilarge:{
  fontSize:18,
  fontFamily:TYPOGRAPHY.QUICKREGULAR,
 },
 displaymedium:{
  fontSize:16,
  fontFamily:TYPOGRAPHY.QUICKREGULAR,
 },
 displaysmall:{
  fontSize:14,
  fontFamily:TYPOGRAPHY.QUICKREGULAR,
 },
 displaylight:{
fontSize:12,
fontFamily:TYPOGRAPHY.QUICKREGULAR,
 }
,
 placeholderStyle:{
  fontSize: 12,
  fontFamily:TYPOGRAPHY.QUICKREGULAR,
  color:COLORS.placeHolderColor
 }
,
errorText: {
  color: COLORS.red,
  fontSize: 12,
  marginTop: 4,
},

});
