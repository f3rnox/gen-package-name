// Words too common to be useful as name seeds
const STOP_WORDS = new Set<string>([
  'a',
  'an',
  'the',
  'for',
  'and',
  'or',
  'but',
  'nor',
  'in',
  'on',
  'at',
  'to',
  'of',
  'with',
  'by',
  'from',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
  'have',
  'has',
  'had',
  'do',
  'does',
  'did',
  'that',
  'this',
  'it',
  'its',
  'as',
  'up',
  'out',
  'my',
  'your',
  'can',
  'will',
  'just',
  'so',
  'if',
  'then',
  'than',
  'when',
  'about',
  'into',
  'which',
  'who',
  'not',
  'no',
  'also',
  'any',
  'all',
  'very',
  'like',
  'get',
  'make',
  'use',
  'used',
  'using',
  'via',
  'over'
])

/**
 * Extracts up to eight keyword seeds from a free-form package description.
 * Splits on common punctuation and whitespace, lowercases, removes stop words,
 * enforces a simple alphanumeric shape, and deduplicates while preserving
 * insertion order.
 *
 * @param {string} description Raw description text supplied by the user.
 * @returns {string[]} Ordered, deduplicated list of up to eight keyword seeds.
 */
export const extractNameKeywords = (description: string): string[] =>
  [
    ...new Set<string>(
      description
        .toLowerCase()
        .split(/[\s,;.!?/\\|+&()[\]{}'"@#$%^*=<>:`~]+/)
        .filter(
          (word: string): boolean =>
            /^[a-z][a-z0-9]*$/.test(word) &&
            word.length >= 2 &&
            word.length <= 30 &&
            !STOP_WORDS.has(word)
        )
    )
  ].slice(0, 8)
