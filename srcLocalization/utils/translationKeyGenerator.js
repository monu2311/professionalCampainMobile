/**
 * Translation Key Generator Utility
 * Automatically detects missing translation keys and generates template files
 * for new languages to speed up production builds
 */

const fs = require('fs');
const path = require('path');

// Supported languages
const LANGUAGES = ['en', 'es', 'ar', 'de', 'hi', 'nl', 'zh'];
const TRANSLATION_BASE_PATH = path.join(__dirname, '../localization/translations');

/**
 * Get all keys from a translation file recursively
 */
function getAllKeys(obj, prefix = '') {
  let keys = [];

  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      // Nested object - recurse
      keys = keys.concat(getAllKeys(obj[key], prefix ? `${prefix}.${key}` : key));
    } else {
      // Leaf key
      keys.push(prefix ? `${prefix}.${key}` : key);
    }
  }

  return keys;
}

/**
 * Load translation file for a language
 */
function loadTranslations(language, filename) {
  try {
    const filePath = path.join(TRANSLATION_BASE_PATH, language, `${filename}.json`);
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.warn(`⚠️  Could not load ${filename}.json for ${language}:`, error.message);
    return {};
  }
}

/**
 * Save translation file
 */
function saveTranslations(language, filename, translations) {
  try {
    const dirPath = path.join(TRANSLATION_BASE_PATH, language);

    // Create directory if it doesn't exist
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const filePath = path.join(dirPath, `${filename}.json`);
    const content = JSON.stringify(translations, null, 2);
    fs.writeFileSync(filePath, content, 'utf8');

    console.log(`✅ Updated ${language}/${filename}.json`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to save ${language}/${filename}.json:`, error.message);
    return false;
  }
}

/**
 * Generate missing keys for a specific file across all languages
 */
function generateMissingKeys(filename = 'forms') {
  console.log(`🔍 Analyzing ${filename}.json across all languages...`);

  // Load all translation files
  const translations = {};
  const allKeys = new Set();

  for (const lang of LANGUAGES) {
    translations[lang] = loadTranslations(lang, filename);
    const keys = getAllKeys(translations[lang]);
    keys.forEach(key => allKeys.add(key));
  }

  console.log(`📊 Found ${allKeys.size} unique translation keys`);

  // Find missing keys for each language
  const missingKeys = {};
  let totalMissingCount = 0;

  for (const lang of LANGUAGES) {
    const langKeys = new Set(getAllKeys(translations[lang]));
    missingKeys[lang] = Array.from(allKeys).filter(key => !langKeys.has(key));

    if (missingKeys[lang].length > 0) {
      console.log(`🔴 ${lang}: ${missingKeys[lang].length} missing keys`);
      totalMissingCount += missingKeys[lang].length;
    } else {
      console.log(`🟢 ${lang}: All keys present`);
    }
  }

  return {
    translations,
    allKeys: Array.from(allKeys),
    missingKeys,
    totalMissingCount
  };
}

/**
 * Auto-fill missing keys with placeholder translations
 */
function autoFillMissingKeys(filename = 'forms', dryRun = false) {
  const analysis = generateMissingKeys(filename);

  if (analysis.totalMissingCount === 0) {
    console.log('🎉 No missing keys found! All languages are up to date.');
    return;
  }

  console.log(`\n🚀 Auto-filling ${analysis.totalMissingCount} missing keys...`);

  // Language-specific placeholder generators
  const placeholderGenerators = {
    es: (key, englishValue) => `[ES] ${englishValue}`,
    ar: (key, englishValue) => `[AR] ${englishValue}`,
    de: (key, englishValue) => `[DE] ${englishValue}`,
    hi: (key, englishValue) => `[HI] ${englishValue}`,
    nl: (key, englishValue) => `[NL] ${englishValue}`,
    zh: (key, englishValue) => `[ZH] ${englishValue}`,
  };

  // Get English translations as reference
  const englishTranslations = analysis.translations.en || {};

  for (const lang of LANGUAGES) {
    if (lang === 'en') continue; // Skip English (reference language)

    const missing = analysis.missingKeys[lang];
    if (missing.length === 0) continue;

    const updatedTranslations = { ...analysis.translations[lang] };

    for (const keyPath of missing) {
      // Get English value for reference
      const englishValue = getValueByPath(englishTranslations, keyPath);

      // Generate placeholder translation
      const generator = placeholderGenerators[lang];
      const placeholderValue = generator ?
        generator(keyPath, englishValue || keyPath) :
        `[${lang.toUpperCase()}] ${englishValue || keyPath}`;

      // Set the value in the translation object
      setValueByPath(updatedTranslations, keyPath, placeholderValue);
    }

    // Save updated translations
    if (!dryRun) {
      saveTranslations(lang, filename, updatedTranslations);
    } else {
      console.log(`📝 Would update ${lang} with ${missing.length} new keys`);
    }
  }

  if (dryRun) {
    console.log('\n🧪 Dry run completed. Use autoFillMissingKeys(filename, false) to apply changes.');
  } else {
    console.log('\n✨ Auto-fill completed! All languages now have consistent keys.');
  }
}

/**
 * Get value from nested object by dot-notation path
 */
function getValueByPath(obj, path) {
  return path.split('.').reduce((current, key) => current && current[key], obj);
}

/**
 * Set value in nested object by dot-notation path
 */
function setValueByPath(obj, path, value) {
  const keys = path.split('.');
  const lastKey = keys.pop();

  let current = obj;
  for (const key of keys) {
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }

  current[lastKey] = value;
}

/**
 * Generate translation template for a new language
 */
function generateLanguageTemplate(newLanguage, filename = 'forms') {
  console.log(`🌍 Generating ${filename}.json template for ${newLanguage}...`);

  const englishTranslations = loadTranslations('en', filename);

  if (Object.keys(englishTranslations).length === 0) {
    console.error('❌ Could not load English translations as template');
    return false;
  }

  // Create template with placeholder values
  const template = JSON.parse(JSON.stringify(englishTranslations));
  replaceValuesWithPlaceholders(template, newLanguage.toUpperCase());

  // Save template
  const success = saveTranslations(newLanguage, filename, template);

  if (success) {
    console.log(`🎉 Template created for ${newLanguage}! Please replace [${newLanguage.toUpperCase()}] placeholders with actual translations.`);
  }

  return success;
}

/**
 * Replace all values in object with placeholders
 */
function replaceValuesWithPlaceholders(obj, langCode) {
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      replaceValuesWithPlaceholders(obj[key], langCode);
    } else {
      obj[key] = `[${langCode}] ${obj[key]}`;
    }
  }
}

/**
 * CLI Interface
 */
function runCLI() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'analyze':
      generateMissingKeys(args[1] || 'forms');
      break;

    case 'fill':
      autoFillMissingKeys(args[1] || 'forms', false);
      break;

    case 'dry-run':
      autoFillMissingKeys(args[1] || 'forms', true);
      break;

    case 'template':
      if (!args[1]) {
        console.error('❌ Please specify language code (e.g., node translationKeyGenerator.js template fr)');
        return;
      }
      generateLanguageTemplate(args[1], args[2] || 'forms');
      break;

    default:
      console.log(`
📚 Translation Key Generator

Usage:
  node translationKeyGenerator.js analyze [filename]     - Analyze missing keys
  node translationKeyGenerator.js dry-run [filename]     - Preview auto-fill
  node translationKeyGenerator.js fill [filename]        - Auto-fill missing keys
  node translationKeyGenerator.js template <lang> [file] - Generate new language template

Examples:
  node translationKeyGenerator.js analyze forms
  node translationKeyGenerator.js fill forms
  node translationKeyGenerator.js template fr forms
      `);
  }
}

// Export functions for programmatic use
module.exports = {
  generateMissingKeys,
  autoFillMissingKeys,
  generateLanguageTemplate,
  getAllKeys,
  loadTranslations,
  saveTranslations
};

// Run CLI if called directly
if (require.main === module) {
  runCLI();
}