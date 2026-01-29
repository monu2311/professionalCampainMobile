/**
 * Localized Static Data
 * Uses translation keys instead of hardcoded strings
 */

import { translationUtils } from '../localization/index';

// Helper function to create translated items
const createTranslatedItem = (translationKey, value, fallback) => ({
  get item() {
    return translationUtils.getTranslation(`static:${translationKey}`, {}, fallback);
  },
  value,
  translationKey,
});

// Gender List with translations
export const getGenderList = () => [
  createTranslatedItem('gender.male', 'Male', 'Male'),
  createTranslatedItem('gender.female', 'Female', 'Female'),
];

// Country List with translations
export const getCountryList = () => [
  createTranslatedItem('countries.australia', '1', 'Australia'),
  createTranslatedItem('countries.china', '2', 'China'),
  createTranslatedItem('countries.germany', '3', 'Germany'),
  createTranslatedItem('countries.india', '4', 'India'),
  createTranslatedItem('countries.italy', '5', 'Italy'),
  createTranslatedItem('countries.mexico', '6', 'Mexico'),
  createTranslatedItem('countries.turkey', '7', 'Turkey'),
  createTranslatedItem('countries.unitedKingdom', '8', 'United Kingdom'),
  createTranslatedItem('countries.unitedStates', '9', 'United States of America'),
];

// Profile Types with translations
export const getProfileTypeList = () => [
  createTranslatedItem('profileTypes.trainedCompanions', '1', 'Trained Companions'),
  createTranslatedItem('profileTypes.memberSubscription', '2', 'Subscribe as a Member'),
];

export const getProfileList = () => [
  createTranslatedItem('profileTypes.companion', 'Companion', 'Companion'),
  createTranslatedItem('profileTypes.member', 'Member', 'Member'),
];

// Home Location with translations
export const getHomeLocation = () => [
  createTranslatedItem('cities.melbourne', '18', 'Melbourne'),
  createTranslatedItem('cities.sydney', '12', 'Sydney'),
  createTranslatedItem('cities.adelaide', '11', 'Adelaide'),
  createTranslatedItem('cities.perth', '10', 'Perth'),
  createTranslatedItem('cities.darwin', '9', 'Darwin'),
  createTranslatedItem('cities.goldCoast', '8', 'Gold Coast'),
  createTranslatedItem('cities.brisbane', '7', 'Brisbane'),
  createTranslatedItem('cities.hobart', '6', 'Hobart'),
];

// Body Details with translations
export const getBodyDetails = () => ({
  'Bust (optional- for search page)': {
    array: [
      createTranslatedItem('bodyDetails.bustSizes.aCup', '1', 'A cup'),
      createTranslatedItem('bodyDetails.bustSizes.bCup', '2', 'B cup'),
      createTranslatedItem('bodyDetails.bustSizes.cCup', '3', 'C cup'),
      createTranslatedItem('bodyDetails.bustSizes.dCup', '4', 'D cup'),
      createTranslatedItem('bodyDetails.bustSizes.ddCup', '5', 'DD cup'),
      createTranslatedItem('bodyDetails.bustSizes.eCup', '6', 'E cup'),
      createTranslatedItem('bodyDetails.bustSizes.fCup', '7', 'F cup'),
      createTranslatedItem('bodyDetails.bustSizes.gCup', '8', 'G cup'),
      createTranslatedItem('bodyDetails.bustSizes.ggCup', '9', 'GG cup'),
      createTranslatedItem('bodyDetails.bustSizes.hCup', '10', 'H cup'),
      createTranslatedItem('bodyDetails.bustSizes.hhCup', '11', 'HH cup'),
      createTranslatedItem('bodyDetails.bustSizes.jCup', '12', 'J cup'),
      createTranslatedItem('bodyDetails.bustSizes.jjCup', '13', 'JJ cup'),
    ],
  },
  'Dress Size': {
    array: [
      createTranslatedItem('bodyDetails.dressSizes.size4', '1', 'Size 4'),
      createTranslatedItem('bodyDetails.dressSizes.size5', '2', 'Size 5'),
      createTranslatedItem('bodyDetails.dressSizes.size6', '3', 'Size 6'),
      createTranslatedItem('bodyDetails.dressSizes.size7', '4', 'Size 7'),
      createTranslatedItem('bodyDetails.dressSizes.size8', '5', 'Size 8'),
      createTranslatedItem('bodyDetails.dressSizes.size9', '6', 'Size 9'),
      createTranslatedItem('bodyDetails.dressSizes.size10', '7', 'Size 10'),
      createTranslatedItem('bodyDetails.dressSizes.size11', '8', 'Size 11'),
      createTranslatedItem('bodyDetails.dressSizes.size12', '9', 'Size 12'),
      createTranslatedItem('bodyDetails.dressSizes.size13', '10', 'Size 13'),
      createTranslatedItem('bodyDetails.dressSizes.size14', '11', 'Size 14'),
      createTranslatedItem('bodyDetails.dressSizes.size15', '12', 'Size 15'),
      createTranslatedItem('bodyDetails.dressSizes.size16', '13', 'Size 16'),
      createTranslatedItem('bodyDetails.dressSizes.size17', '14', 'Size 17'),
      createTranslatedItem('bodyDetails.dressSizes.size18', '15', 'Size 18'),
      createTranslatedItem('bodyDetails.dressSizes.size19', '16', 'Size 19'),
      createTranslatedItem('bodyDetails.dressSizes.size20', '17', 'Size 20'),
      createTranslatedItem('bodyDetails.dressSizes.size21', '18', 'Size 21'),
      createTranslatedItem('bodyDetails.dressSizes.size22', '19', 'Size 22'),
      createTranslatedItem('bodyDetails.dressSizes.size23', '20', 'Size 23'),
      createTranslatedItem('bodyDetails.dressSizes.size24', '21', 'Size 24'),
    ],
  },
  'Body Type': {
    array: [
      createTranslatedItem('bodyDetails.bodyTypes.athletic', '1', 'Athletic'),
      createTranslatedItem('bodyDetails.bodyTypes.average', '2', 'Average'),
      createTranslatedItem('bodyDetails.bodyTypes.bbw', '3', 'BBW'),
      createTranslatedItem('bodyDetails.bodyTypes.cuddly', '4', 'Cuddly'),
      createTranslatedItem('bodyDetails.bodyTypes.curvaceous', '5', 'Curvaceous'),
      createTranslatedItem('bodyDetails.bodyTypes.curvey', '6', 'Curvey'),
      createTranslatedItem('bodyDetails.bodyTypes.fullFigured', '7', 'Full Figured'),
      createTranslatedItem('bodyDetails.bodyTypes.hourGlass', '8', 'Hour Glass'),
      createTranslatedItem('bodyDetails.bodyTypes.muscular', '9', 'Muscular/Cut'),
      createTranslatedItem('bodyDetails.bodyTypes.petite', '10', 'Petite'),
      createTranslatedItem('bodyDetails.bodyTypes.petiteSlim', '11', 'Petite/Slim'),
      createTranslatedItem('bodyDetails.bodyTypes.slim', '12', 'Slim'),
      createTranslatedItem('bodyDetails.bodyTypes.toned', '13', 'Toned'),
      createTranslatedItem('bodyDetails.bodyTypes.voluptuous', '14', 'Voluptuous'),
    ],
  },
  'Height (cm)': {
    array: [
      createTranslatedItem('bodyDetails.height.160cm', '160 CM', '160 CM'),
      createTranslatedItem('bodyDetails.height.161cm', '161 CM', '161 CM'),
      createTranslatedItem('bodyDetails.height.162cm', '162 CM', '162 CM'),
      createTranslatedItem('bodyDetails.height.163cm', '163 CM', '163 CM'),
      createTranslatedItem('bodyDetails.height.164cm', '164 CM', '164 CM'),
    ],
  },
  'Eyes': {
    array: [
      createTranslatedItem('bodyDetails.eyeColors.amber', '7', 'Amber'),
      createTranslatedItem('bodyDetails.eyeColors.black', '9', 'Black'),
      createTranslatedItem('bodyDetails.eyeColors.blue', '1', 'Blue'),
      createTranslatedItem('bodyDetails.eyeColors.blue', '2', 'Blue'),
      createTranslatedItem('bodyDetails.eyeColors.brown', '3', 'Brown'),
      createTranslatedItem('bodyDetails.eyeColors.green', '4', 'Green'),
      createTranslatedItem('bodyDetails.eyeColors.grey', '6', 'Grey'),
      createTranslatedItem('bodyDetails.eyeColors.hazel', '5', 'Hazel'),
      createTranslatedItem('bodyDetails.eyeColors.red', '8', 'Red'),
    ],
  },
  'Hair Color': {
    array: [
      createTranslatedItem('bodyDetails.hairColors.auburn', '2', 'Auburn'),
      createTranslatedItem('bodyDetails.hairColors.black', '1', 'Black'),
      createTranslatedItem('bodyDetails.hairColors.blonde', '3', 'Blonde'),
      createTranslatedItem('bodyDetails.hairColors.brown', '4', 'Brown'),
      createTranslatedItem('bodyDetails.hairColors.brunette', '5', 'Brunette'),
      createTranslatedItem('bodyDetails.hairColors.burgundy', '6', 'Burgundy'),
      createTranslatedItem('bodyDetails.hairColors.dark', '7', 'Dark'),
      createTranslatedItem('bodyDetails.hairColors.ginger', '8', 'Ginger'),
      createTranslatedItem('bodyDetails.hairColors.other', '10', 'Other'),
      createTranslatedItem('bodyDetails.hairColors.red', '9', 'Red'),
    ],
  },
  'Hair Style': {
    array: [
      createTranslatedItem('bodyDetails.hairStyles.curly', '5', 'Curly'),
      createTranslatedItem('bodyDetails.hairStyles.long', '1', 'Long'),
      createTranslatedItem('bodyDetails.hairStyles.shaved', '3', 'Shaved'),
      createTranslatedItem('bodyDetails.hairStyles.short', '2', 'Short'),
      createTranslatedItem('bodyDetails.hairStyles.straight', '4', 'Straight'),
    ],
  },
  'Gender': {
    array: [
      createTranslatedItem('gender.straightMale', 'Straight Male', 'Straight Male'),
      createTranslatedItem('gender.gayMale', 'Gay Male', 'Gay Male'),
      createTranslatedItem('gender.biMale', 'Bi Male', 'Bi Male'),
      createTranslatedItem('gender.straightFemale', 'Straight Female', 'Straight Female'),
      createTranslatedItem('gender.gayFemale', 'Gay Female', 'Gay Female'),
      createTranslatedItem('gender.biFemale', 'Bi Female', 'Bi Female'),
    ],
  },
  'Ethnicity': {
    array: [
      createTranslatedItem('ethnicity.caucasian', 'Caucasian', 'Caucasian'),
      createTranslatedItem('ethnicity.africanAmerican', 'Africa American', 'African American'),
      createTranslatedItem('ethnicity.hispanic', 'Hispanic', 'Hispanic'),
      createTranslatedItem('ethnicity.asian', 'Asian', 'Asian'),
      createTranslatedItem('ethnicity.nativeAmerican', 'Native American', 'Native American'),
      createTranslatedItem('ethnicity.multiracial', 'Multiracial', 'Multiracial'),
    ],
  },
  'Education': {
    array: [
      createTranslatedItem('education.highSchool', 'High School', 'High School'),
      createTranslatedItem('education.university', 'University', 'University'),
      createTranslatedItem('education.postGraduate', 'Post Graduate', 'Post Graduate'),
      createTranslatedItem('education.doctorate', 'Doctorate', 'Doctorate'),
    ],
  },
  'Interested in booking with': {
    array: [
      createTranslatedItem('interestedBooking.menOnly', 'Men Only', 'Men Only'),
      createTranslatedItem('interestedBooking.womenOnly', 'Women Only', 'Women Only'),
      createTranslatedItem('interestedBooking.menAndWomen', 'Men & Women', 'Men & Women'),
      createTranslatedItem('interestedBooking.allGenders', 'All Genders', 'All Genders'),
    ],
  },
  'Services': {
    array: [
      createTranslatedItem('services.activityParticipation', 'Activity Participation', 'Activity Participation'),
      createTranslatedItem('services.travelCompanionship', 'Travel Companionship', 'Travel Companionship'),
      createTranslatedItem('services.companionshipOutings', 'Companionship for Outings', 'Companionship for Outings'),
      createTranslatedItem('services.diningCompanions', 'Dining Companions', 'Dining Companions'),
    ],
  },
});

// Days with translations
export const getDateArray = () => [
  {
    isChecked: true,
    day: translationUtils.getTranslation('static:days.monday', {}, 'Monday'),
    from: '10:00 AM',
    until: '10:00 PM',
  },
  {
    isChecked: true,
    day: translationUtils.getTranslation('static:days.tuesday', {}, 'Tuesday'),
    from: '10:00 AM',
    until: '10:00 PM',
  },
  {
    isChecked: true,
    day: translationUtils.getTranslation('static:days.wednesday', {}, 'Wednesday'),
    from: '10:00 AM',
    until: '10:00 PM',
  },
  {
    isChecked: true,
    day: translationUtils.getTranslation('static:days.thursday', {}, 'Thursday'),
    from: '10:00 AM',
    until: '10:00 PM',
  },
  {
    isChecked: true,
    day: translationUtils.getTranslation('static:days.friday', {}, 'Friday'),
    from: '10:00 AM',
    until: '10:00 PM',
  },
  {
    isChecked: true,
    day: translationUtils.getTranslation('static:days.saturday', {}, 'Saturday'),
    from: '10:00 AM',
    until: '10:00 PM',
  },
  {
    isChecked: true,
    day: translationUtils.getTranslation('static:days.sunday', {}, 'Sunday'),
    from: '10:00 AM',
    until: '10:00 PM',
  },
];

// Form field configurations with translations
export const getHomeBase = () => [
  {
    label: translationUtils.getTranslation('forms:labels.country', {}, 'Select Country*'),
    placeholder: translationUtils.getTranslation('forms:placeholders.country', {}, 'Select country'),
    name: 'location',
    selectFiled: true,
  },
  {
    label: translationUtils.getTranslation('forms:labels.city', {}, 'Select City'),
    placeholder: translationUtils.getTranslation('forms:placeholders.suburbs', {}, 'Suburbs'),
    name: '"suburbs"',
    selectFiled: true,
  },
  {
    label: translationUtils.getTranslation('forms:labels.postalCode', {}, 'Postal Code'),
    placeholder: translationUtils.getTranslation('forms:placeholders.postalCode', {}, 'Postal Code'),
    name: 'postalcode',
    selectFiled: false,
  },
];

// Social Media with translations
export const getSocialMedia = () => [
  {
    label: translationUtils.getTranslation('static:socialMedia.facebook', {}, 'Facebook'),
    placeholder: translationUtils.getTranslation('forms:placeholders.facebook', {}, 'Facebook profile URL'),
    name: 'social_fb',
  },
  {
    label: translationUtils.getTranslation('static:socialMedia.twitter', {}, 'Twitter'),
    placeholder: translationUtils.getTranslation('forms:placeholders.twitter', {}, 'Twitter profile URL'),
    name: 'social_x',
  },
  {
    label: translationUtils.getTranslation('static:socialMedia.instagram', {}, 'Instagram'),
    placeholder: translationUtils.getTranslation('forms:placeholders.instagram', {}, 'Instagram profile URL'),
    name: 'social_insta',
  },
  {
    label: translationUtils.getTranslation('static:socialMedia.pinterest', {}, 'Pinterest'),
    placeholder: translationUtils.getTranslation('forms:placeholders.pinterest', {}, 'Pinterest profile URL'),
    name: 'social_pinterest',
  },
  {
    label: translationUtils.getTranslation('static:socialMedia.tumbler', {}, 'Tumbler'),
    placeholder: translationUtils.getTranslation('forms:placeholders.tumbler', {}, 'Tumbler profile URL'),
    name: 'social_tumblr',
  },
  {
    label: translationUtils.getTranslation('static:socialMedia.tiktok', {}, 'TikTok'),
    placeholder: translationUtils.getTranslation('forms:placeholders.tiktok', {}, 'TikTok profile URL'),
    name: 'social_tiktok',
  },
];

// Backward compatibility exports - these maintain the original structure
// but now use translated content
export const genderList = getGenderList();
export const COUNTRYLIST = getCountryList();
export const PROFILETYPELIST = getProfileTypeList();
export const profileList = getProfileList();
export const HOMELOCATION = getHomeLocation();
export const detailsData = getBodyDetails();
export const dateArray = getDateArray();
export const homeBase = getHomeBase();
export const SocialMedia = getSocialMedia();