import * as R from 'ramda';

import fromFragments from '../attributedString/fromFragments';

/**
 * Default word hyphenation engine used when no one provided.
 * Does not perform word hyphenation at all
 *
 * @param  {String} word
 * @return {Array} same word
 */
const defaultHyphenationEngine = word => [word];

/**
 * Wrap words of attribute string
 *
 * @param  {Object} layout engines
 * @param  {Object}  layout options
 * @param  {Object}  attributed string
 * @return {Object} attributed string including syllables
 */
const wrapWords = (engines = {}, options = {}, attributedString) => {
  const syllables = [];
  const fragments = [];
  const hyphenateWord =
    options.hyphenationCallback ||
    (engines.wordHyphenation && engines.wordHyphenation(options)) ||
    defaultHyphenationEngine;

  for (const run of attributedString.runs) {
    let string = '';
    const words = attributedString.string
      .slice(run.start, run.end)
      .split(/([ ]+)/g)
      .filter(Boolean);

    for (const word of words) {
      const parts = hyphenateWord(word);
      syllables.push(...parts);
      string += parts.join('');
    }

    fragments.push({ string, attributes: run.attributes });
  }

  return { ...fromFragments(fragments), syllables };
};

export default R.curryN(3, wrapWords);
