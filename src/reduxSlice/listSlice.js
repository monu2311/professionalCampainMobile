import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  'Bust (optional- for search page)': {
    array: [
      {item: 'A cup', value: '1'},
      {item: 'B cup', value: '2'},
      {item: 'C cup', value: '3'},
      {item: 'D cup', value: '4'},
      {item: 'DD cup', value: '5'},
      {item: 'E cup', value: '6'},
      {item: 'F cup', value: '7'},
      {item: 'G cup', value: '8'},
      {item: 'GG cup', value: '9'},
      {item: 'H cup', value: '10'},
      {item: 'HH cup', value: '11'},
      {item: 'J cup', value: '12'},
      {item: 'JJ cup', value: '13'},
    ],
  },
  'Dress Size': {
    array: [],
  },
  'Body Type': {
    array: [],
  },
  'Height (cm)': {
    array: [ {item: '160 CM', value: '160 CM'},
      {item: '161 CM', value: '161 CM'},
      {item: '162 CM', value: '162 CM'},
      {item: '163 CM', value: '163 CM'},
      {item: '164 CM', value: '164 CM'},
      {item: '165 CM', value: '165 CM'},
      {item: '166 CM', value: '166 CM'},
      {item: '167 CM', value: '167 CM'},
      {item: '168 CM', value: '168 CM'},
      {item: '169 CM', value: '169 CM'},
      {item: '170 CM', value: '170 CM'},
      {item: '171 CM', value: '171 CM'},
      {item: '172 CM', value: '172 CM'},
      {item: '173 CM', value: '173 CM'},
      {item: '174 CM', value: '174 CM'},
      {item: '175 CM', value: '175 CM'},
      {item: '176 CM', value: '176 CM'},
    ],
  },
  Eyes: {
    array: [],
  },
  'Hair Color': {
    array: [],
  },
  'Hair Style': {
    array: [],
  },

  'Profile Categories': {
    array: [],
  },
  'Interested in booking with': {
    array: [
      {item: 'Men Only', value: 'Men Only'},
      {item: 'Women Only', value: 'Women Only'},
      {item: 'Men & Women', value: 'Men & Women'},
      {item: 'All Genders', value: 'All Genders'},
    ],
  },
  'What Cities would you like to be listed under?': {
    array: [
      {item: 'Sydney', value: 'Sydney'},
      {item: 'Melbourne', value: 'Melbourne'},
      {item: 'Brisbane', value: 'Brisbane'},
      {item: 'Gold Coast', value: 'Gold Coast'},
    ],
  },
  Services: {
    array: [],
  },
  Gender: {
    array: [
      {item: 'Straight Male', value: 'Straight Male'},
      {item: 'Gay Male', value: 'Gay Male'},
      {item: 'Bi Male', value: 'Bi Male'},
      {item: 'Straight Female', value: 'Straight Female'},
      {item: 'Gay Female', value: 'Gay Female'},
      {item: 'Bi Female', value: 'Bi Female'},
    ],
  },
  Ethnicity: {
    array: [
      {item: 'Caucasian', value: 'Caucasian'},
      {item: 'Africa American', value: 'Africa American'},
      {item: 'Hispanic', value: 'Hispanic'},
      {item: 'Asian', value: 'Asian'},
      {item: 'Native American', value: 'Native American'},
      {item: 'Multiracial', value: 'Multiracial'},
    ],
  },
  Education: {
    array: [
      {item: 'High School', value: 'High School'},
      {item: 'University', value: 'University'},
      {item: 'Post Graduate', value: 'Post Graduate'},
      {item: 'Doctorate', value: 'Doctorate'},
    ],
  },
  Countries: {
    array: [],
  },
};

const listSlice = createSlice({
  name: 'dropdown',
  initialState,
  reducers: {
    // Optional: Manually update profile from form
    setDropdown: (state, action) => {
      const data = action.payload.data;
      for (const key in data) {
        if (state[key]) {
          state[key].array = data[key].array;
        }
      }
    }
    
  },
});

export const {setDropdown} = listSlice.actions;
export default listSlice.reducer;
