# Dropdown Field Mapping Documentation

## Overview
This document maps all form fields to their corresponding dropdown data sources from `listSlice.js` across the Professional Companionship app.

## Component Analysis Summary

### 1. UploadImage.js (`src/screens/ProfileFlow/UploadImage.js`)
- **listSlice Usage**: ❌ None
- **Purpose**: Handles image uploads only
- **Dropdown Fields**: None

### 2. Contact.js (`src/screens/ProfileFlow/Contact.js`)
- **listSlice Usage**: ❌ None
- **Purpose**: Contact information and availability
- **Dropdown Fields**: Uses static data from `Static.js` constants

### 3. Details.js (`src/screens/ProfileFlow/Details.js`)
- **listSlice Usage**: ✅ **Primary consumer**
- **Redux Selector**: `const dropDownData = useSelector(state => state?.dropDown || {});`
- **Data Access Pattern**: `dropDownData?.[item?.label]?.array`

### 4. Service.js (`src/screens/ServiceFlow/Service.js`)
- **listSlice Usage**: ✅ **Services only**
- **Redux Selector**: `const dropDownData = useSelector(state => state.dropDown);`
- **Specific Usage**: `dropDownData?.Services?.array`

---

## Field to listSlice Key Mapping

### A. Profile Details Fields (Details.js)

#### **Personal Information Fields**
| Form Field Name | listSlice Key | Component Used | Status |
|---|---|---|---|
| `height` | `Height (cm)` | Select | ✅ Has Data |
| `dress_size` | `Dress Size` | Select | ⚠️ Empty Array |
| `body_type` | `Body Type` | Select | ⚠️ Empty Array |
| `eyes` | `Eyes` | Select | ⚠️ Empty Array |
| `hair_color` | `Hair Color` | Select | ⚠️ Empty Array |
| `hair_style` | `Hair Style` | Select | ⚠️ Empty Array |
| `gender_value` | `Gender` | Select | ✅ Has Data |
| `ethnicity` | `Ethnicity` | Select | ✅ Has Data |
| `education` | `Education` | Select | ✅ Has Data |

#### **Profile Categories**
| Form Field Name | listSlice Key | Component Used | Status |
|---|---|---|---|
| `profile_categories` | `Profile Categories` | MultiDropDown | ⚠️ Empty Array |

#### **Bust Size (Search Page)**
| Form Field Name | listSlice Key | Component Used | Status |
|---|---|---|---|
| `bust_size` | `Bust (optional- for search page)` | Select | ✅ Has Data |

#### **Booking Preferences**
| Form Field Name | listSlice Key | Component Used | Status |
|---|---|---|---|
| `interested_in` | `Interested in booking with` | Select | ✅ Has Data |

#### **Location**
| Form Field Name | listSlice Key | Component Used | Status |
|---|---|---|---|
| `cities` | `What Cities would you like to be listed under?` | MultiDropDown | ✅ Has Data (4 cities) |

#### **Country**
| Form Field Name | listSlice Key | Component Used | Status |
|---|---|---|---|
| `country` | `Countries` | Select | ⚠️ Empty Array |

### B. Service Selection (Service.js)

| Form Field Name | listSlice Key | Component Used | Status |
|---|---|---|---|
| Services Search/Filter | `Services` | FlatList | ⚠️ Empty Array |

---

## Critical Issues Found

### 🚨 **Empty Arrays (Non-functional dropdowns)**
The following listSlice keys have empty arrays and will not work:

1. **`Dress Size`** - Used in Details.js
2. **`Body Type`** - Used in Details.js
3. **`Eyes`** - Used in Details.js
4. **`Hair Color`** - Used in Details.js
5. **`Hair Style`** - Used in Details.js
6. **`Profile Categories`** - Used in Details.js (CRITICAL for profile setup)
7. **`Services`** - Used in Service.js (CRITICAL for service selection)
8. **`Countries`** - Used in Details.js

### 🔧 **Working Dropdowns**
The following have data and work correctly:

1. **`Bust (optional- for search page)`** - 13 cup sizes (A to JJ)
2. **`Height (cm)`** - 16 height options (160-176 CM)
3. **`Interested in booking with`** - 4 booking preferences
4. **`What Cities would you like to be listed under?`** - 4 Australian cities
5. **`Gender`** - 6 gender/orientation options
6. **`Ethnicity`** - 6 ethnicity options
7. **`Education`** - 4 education levels

---

## Data Source Analysis

### listSlice vs Static.js vs API Data

| Data Type | Source | Usage | Notes |
|---|---|---|---|
| **Form Dropdowns** | listSlice | Details.js, Service.js | Some arrays empty |
| **Static Lists** | Static.js | Contact.js, fallbacks | Hardcoded values |
| **Dynamic Data** | API | Main.js filters | `profileData?.data?.cityData` |

### Disconnected Systems
- **Main.js Filters** use `profileData?.data?.cityData` and `profileData?.data?.homeCategory`
- **Profile Forms** use `dropDownData` from listSlice
- **No connection** between the two data sources

---

## Recommendations

### 1. **Immediate Fixes**
```javascript
// Populate empty arrays in listSlice.js
'Profile Categories': {
  array: [
    {item: 'Escort', value: 'escort'},
    {item: 'Companion', value: 'companion'},
    {item: 'Massage', value: 'massage'}
  ]
},
'Services': {
  array: [
    {item: 'Dinner Date', value: 'dinner_date'},
    {item: 'Social Events', value: 'social_events'},
    {item: 'Travel Companion', value: 'travel'}
  ]
}
```

### 2. **Long-term Solutions**
- Create async thunks to fetch dropdown data from API
- Unify data sources between Main.js filters and profile forms
- Add loading and error states for dropdowns
- Consider splitting form dropdowns from filter dropdowns

### 3. **Data Flow Fix**
```javascript
// In Main.js, use listSlice data instead of profileData
const dropdownData = useSelector(state => state.dropdown);
const cityData = dropdownData['What Cities would you like to be listed under?'].array;
```

---

## Usage Examples

### How Details.js Uses Dropdowns
```javascript
// Gets dropdown data from Redux
const dropDownData = useSelector(state => state?.dropDown || {});

// Maps through form fields and uses dropdown data
<Select
  data={dropDownData?.[item?.label]?.array}
  name={item?.name}
  placeholder={item?.placeholder}
/>
```

### How Service.js Uses Services
```javascript
// Gets services from dropdown data
const dropDownData = useSelector(state => state.dropDown);
const services = dropDownData?.Services?.array || [];

// Filters services for search
const filtered = services.filter(service =>
  service.item.toLowerCase().includes(searchQuery.toLowerCase())
);
```

---

## Last Updated
- **Date**: February 20, 2026
- **Status**: 7/15 dropdown arrays populated
- **Critical Missing**: Profile Categories, Services
- **Priority**: High - Core functionality affected