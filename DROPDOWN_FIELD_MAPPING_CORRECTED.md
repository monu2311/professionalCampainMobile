# Dropdown Field Mapping Documentation (Corrected)

## Overview
This document maps all form fields to their corresponding dropdown data sources. The dropdown data is populated dynamically via API calls in `fetchAllAPIs` function from `apiConfig/Services.js`.

## ✅ CORRECTION: Dynamic Data Population

The listSlice arrays are **NOT empty** - they are populated dynamically via API calls when the app loads.

### API Endpoints and Mapping
The `fetchAllAPIs` function calls these endpoints:

| API Endpoint | listSlice Key | Form Field | Status |
|---|---|---|---|
| `/services` | `Services` | Service selection | ✅ Dynamic |
| `/profile-categories` | `Profile Categories` | `profile_categories` | ✅ Dynamic |
| `/hair-styles` | `Hair Style` | `hair_style` | ✅ Dynamic |
| `/eyes` | `Eyes` | `eyes` | ✅ Dynamic |
| `/hair-colors` | `Hair Color` | `hair_color` | ✅ Dynamic |
| `/body-types` | `Body Type` | `body_type` | ✅ Dynamic |
| `/dress-sizes` | `Dress Size` | `dress_size` | ✅ Dynamic |
| `/busts` | `Bust (optional- for search page)` | `bust_size` | ✅ Dynamic |
| `/countries` | `Countries` | `country` | ✅ Dynamic |

## Component Usage Analysis

### 1. Details.js (`src/screens/ProfileFlow/Details.js`)
**Uses API-populated dropdown data**
```javascript
const dropDownData = useSelector(state => state?.dropDown || {});

// Dynamic data from API calls
<Select data={dropDownData?.[item?.label]?.array} />
<MultiDropDown data={dropDownData?.[item?.label]?.array} />
```

### 2. Service.js (`src/screens/ServiceFlow/Service.js`)
**Uses Services API data**
```javascript
const dropDownData = useSelector(state => state.dropDown);
const services = dropDownData?.Services?.array || [];

useEffect(() => {
  fetchAllAPIs(dispatch); // Loads services from API
}, [isFocused, dispatch]);
```

## API Data Transformation

The `fetchAllAPIs` function transforms API responses into the required format:

```javascript
// Standard transformation
array: res.data.map(item => ({
  item: item?.name || item?.label || item?.title || item?.body_type,
  value: item?.id?.toString() || item?.value || item?.name
}))

// Special handling for Services
if (key == 'Services') {
  acc['Services'] = {
    array: res.data.map(item => ({
      item: item?.name,
      value: item?.id?.toString(),
      eventName: item?.name,
      eventImg: item?.image,
      eventDiscription: item?.description
    }))
  };
}

// Special handling for Countries
if (key == 'Countries') {
  acc[key] = {
    array: res?.data?.data.map(item => ({
      item: item?.name,
      value: item?.id?.toString()
    }))
  };
}
```

## Data Loading Flow

### 1. App Initialization
- Components call `fetchAllAPIs(dispatch)` on focus/mount
- Multiple API endpoints are hit simultaneously via `Promise.all`
- Data is transformed and dispatched via `setDropdown({data: allData})`

### 2. Component Access
- Components use `useSelector(state => state.dropDown)` to access data
- Dropdown components receive populated arrays from API

### 3. Form Field Mapping

#### Details.js Form Fields ✅ All API-Populated:
```javascript
// These all get data from API endpoints:
height: dropDownData['Height (cm)']?.array           // Static data (hardcoded)
dress_size: dropDownData['Dress Size']?.array        // From /dress-sizes API
body_type: dropDownData['Body Type']?.array          // From /body-types API
eyes: dropDownData['Eyes']?.array                    // From /eyes API
hair_color: dropDownData['Hair Color']?.array        // From /hair-colors API
hair_style: dropDownData['Hair Style']?.array        // From /hair-styles API
gender_value: dropDownData['Gender']?.array          // Static data (hardcoded)
ethnicity: dropDownData['Ethnicity']?.array          // Static data (hardcoded)
education: dropDownData['Education']?.array          // Static data (hardcoded)
profile_categories: dropDownData['Profile Categories']?.array // From /profile-categories API
country: dropDownData['Countries']?.array            // From /countries API
```

## Static vs Dynamic Data

### 🌐 **Dynamic (API-populated)**
- Services
- Profile Categories
- Hair Styles
- Eyes
- Hair Colors
- Body Types
- Dress Sizes
- Busts
- Countries

### 📝 **Static (Hardcoded in listSlice)**
- Height (cm) - 16 predefined values
- Gender - 6 predefined values
- Ethnicity - 6 predefined values
- Education - 4 predefined values
- Interested in booking with - 4 predefined values
- Cities - 4 Australian cities

## Key Functions

### fetchAllAPIs()
- **Purpose**: Load all dropdown data on app start
- **Called by**: Details.js, Service.js on component focus
- **Dispatch**: `setDropdown({data: allData})`

### fetchService()
- **Purpose**: Load only services data (alternative function)
- **Called by**: Service components specifically
- **Dispatch**: `setDropdown({data: allData})`

## Error Handling

```javascript
// Individual error handling for each API call
const responses = await Promise.all(
  endpoints.map(endpoint =>
    axios.get(`${baseURL}${endpoint}`).catch(err => err)
  )
);

// Check for errors and fallback
const hasError = responses.some(
  res => res instanceof Error || res.status < 200 || res.status >= 300
);

if (hasError) {
  return { error: { status: 'FETCH_ERROR', message: 'One or more API calls failed.' } };
}
```

## Usage Examples

### Loading Data in Components
```javascript
// In Details.js and Service.js
useEffect(() => {
  if (!isFocused) return;
  fetchAllAPIs(dispatch);
}, [isFocused, dispatch]);
```

### Accessing Data in Forms
```javascript
// Dropdown gets populated array from API
<Select
  data={dropDownData?.[item?.label]?.array}
  name={item?.name}
  placeholder={item?.placeholder}
/>
```

## Data Structure After API Call

```javascript
// Example of populated dropDownData state:
{
  'Services': {
    array: [
      { item: 'Dinner Date', value: '1', eventName: 'Dinner Date', eventImg: '...', eventDiscription: '...' },
      { item: 'Social Events', value: '2', eventName: 'Social Events', eventImg: '...', eventDiscription: '...' }
    ]
  },
  'Profile Categories': {
    array: [
      { item: 'Escort', value: '1' },
      { item: 'Companion', value: '2' }
    ]
  },
  'Hair Style': {
    array: [
      { item: 'Straight', value: '1' },
      { item: 'Curly', value: '2' }
    ]
  }
  // ... etc for all API endpoints
}
```

## Summary

- ✅ **All dropdown data is dynamic** (except some predefined static lists)
- ✅ **API calls populate listSlice** via `fetchAllAPIs`
- ✅ **Components receive populated arrays** from Redux state
- ✅ **Form fields work correctly** with API data
- ✅ **Error handling included** for API failures

## Last Updated
- **Date**: February 20, 2026
- **Status**: All major dropdowns are API-populated
- **Critical**: All form fields functional with dynamic data
- **Priority**: System working as designed