/**
 * Advanced Translation Loader
 * Optimized for performance with caching and preloading
 */

import { SUPPORTED_LANGUAGES, FALLBACK_LANGUAGE } from '../config/languages';
import { NAMESPACES } from '../config/namespaces';
import { getTranslation } from '../translations';

// Translation cache with LRU eviction
class TranslationCache {
  constructor(maxSize = 50) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key) {
    if (this.cache.has(key)) {
      // Move to end (most recently used)
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return null;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove least recently used
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  has(key) {
    return this.cache.has(key);
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

// Global translation cache instance
const translationCache = new TranslationCache();

// Performance metrics
const metrics = {
  loadTime: new Map(),
  cacheHits: 0,
  cacheMisses: 0,
  errors: 0,
};

// Dynamic translation loader
export const loadTranslation = async (language, namespace) => {
  const startTime = Date.now();
  const cacheKey = `${language}:${namespace}`;

  // Check cache first
  if (translationCache.has(cacheKey)) {
    metrics.cacheHits++;
    return translationCache.get(cacheKey);
  }

  metrics.cacheMisses++;

  try {
    // Load translation using static registry
    let translationData;

    try {
      // Try to load the requested language
      translationData = getTranslation(language, namespace);
    } catch (languageError) {
      console.warn(`Translation not found: ${language}/${namespace}, falling back to ${FALLBACK_LANGUAGE}`);

      // Fallback to English
      if (language !== FALLBACK_LANGUAGE) {
        translationData = getTranslation(FALLBACK_LANGUAGE, namespace);
      } else {
        throw languageError;
      }
    }

    // If translation is still null, try fallback
    if (!translationData && language !== FALLBACK_LANGUAGE) {
      translationData = getTranslation(FALLBACK_LANGUAGE, namespace);
    }

    // If still no translation, return empty object
    if (!translationData) {
      console.warn(`No translation found for ${language}/${namespace} or fallback`);
      return {};
    }

    // Cache the result
    translationCache.set(cacheKey, translationData);

    // Record performance metrics
    const loadTime = Date.now() - startTime;
    metrics.loadTime.set(cacheKey, loadTime);

    if (__DEV__) {
      console.log(`Loaded translation ${cacheKey} in ${loadTime}ms`);
    }

    return translationData;

  } catch (error) {
    metrics.errors++;
    console.error(`Failed to load translation: ${language}/${namespace}`, error);

    // Return empty object as fallback
    return {};
  }
};

// Preload translations for better performance
export const preloadTranslations = async (language, namespaces = []) => {
  const promises = namespaces.map(namespace =>
    loadTranslation(language, namespace)
  );

  try {
    await Promise.all(promises);
    if (__DEV__) {
      console.log(`Preloaded ${namespaces.length} namespaces for ${language}`);
    }
  } catch (error) {
    console.warn('Failed to preload some translations:', error);
  }
};

// Batch load multiple translations
export const batchLoadTranslations = async (requests) => {
  const results = {};

  const promises = requests.map(async ({ language, namespace }) => {
    try {
      const translation = await loadTranslation(language, namespace);
      const key = `${language}:${namespace}`;
      results[key] = translation;
    } catch (error) {
      console.warn(`Batch load failed for ${language}:${namespace}`, error);
    }
  });

  await Promise.all(promises);
  return results;
};

// Clear cache (useful for memory management)
export const clearTranslationCache = () => {
  translationCache.clear();
  metrics.cacheHits = 0;
  metrics.cacheMisses = 0;
  metrics.errors = 0;
  metrics.loadTime.clear();

  if (__DEV__) {
    console.log('Translation cache cleared');
  }
};

// Get cache statistics
export const getCacheStats = () => {
  const totalRequests = metrics.cacheHits + metrics.cacheMisses;
  const hitRate = totalRequests > 0 ? (metrics.cacheHits / totalRequests) * 100 : 0;

  return {
    size: translationCache.size(),
    maxSize: translationCache.maxSize,
    hitRate: Math.round(hitRate * 100) / 100,
    hits: metrics.cacheHits,
    misses: metrics.cacheMisses,
    errors: metrics.errors,
    averageLoadTime: Array.from(metrics.loadTime.values()).reduce((a, b) => a + b, 0) / metrics.loadTime.size || 0,
  };
};

// Validate translation completeness
export const validateTranslations = async (language) => {
  const results = {
    language,
    missing: [],
    empty: [],
    total: 0,
    complete: 0,
  };

  try {
    for (const namespace of Object.values(NAMESPACES)) {
      const translation = await loadTranslation(language, namespace);
      const englishTranslation = language !== 'en' ? await loadTranslation('en', namespace) : translation;

      // Check for missing keys
      const checkKeys = (obj, enObj, path = '') => {
        for (const key in enObj) {
          const currentPath = path ? `${path}.${key}` : key;
          results.total++;

          if (typeof enObj[key] === 'object' && !Array.isArray(enObj[key])) {
            if (!obj[key] || typeof obj[key] !== 'object') {
              results.missing.push(`${namespace}:${currentPath}`);
            } else {
              checkKeys(obj[key], enObj[key], currentPath);
            }
          } else {
            if (!obj.hasOwnProperty(key)) {
              results.missing.push(`${namespace}:${currentPath}`);
            } else if (!obj[key] || obj[key].trim() === '') {
              results.empty.push(`${namespace}:${currentPath}`);
            } else {
              results.complete++;
            }
          }
        }
      };

      checkKeys(translation, englishTranslation);
    }
  } catch (error) {
    console.error('Translation validation failed:', error);
  }

  return results;
};

// Export for development use
export const devUtils = __DEV__ ? {
  getCacheStats,
  clearTranslationCache,
  validateTranslations,
  cache: translationCache,
  metrics,
} : {};