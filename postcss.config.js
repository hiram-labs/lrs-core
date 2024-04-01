// const postcssUrl = require('postcss-url');
const postcssCustomProperties = require('postcss-custom-properties');
const postcssCustomMedia = require('postcss-custom-media');
const postcssMediaMinmax = require('postcss-media-minmax');
const postcssCustomSelectors = require('postcss-custom-selectors');
const postcssCalc = require('postcss-calc');
const postcssNesting = require('postcss-nesting');
const postcssNested = require('postcss-nested');
const postcssColorFunction = require('postcss-color-function');
const pixrem = require('pixrem');
const postcssSelectorMatches = require('postcss-selector-matches');
const postcssSelectorNot = require('postcss-selector-not');
const postcssFlexbugsFixes = require('postcss-flexbugs-fixes');
// const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    // Allow you to fix url() according to postcss to and/or from options
    // https://github.com/postcss/postcss-url
    // postcssUrl,

    // W3C variables, e.g. :root { --color: red; } div { background: var(--color); }
    // https://github.com/postcss/postcss-custom-properties
    postcssCustomProperties,
    // W3C CSS Custom Media Queries, e.g. @custom-media --small-viewport (max-width: 30em);
    // https://github.com/postcss/postcss-custom-media
    postcssCustomMedia,
    // CSS4 Media Queries, e.g. @media screen and (width >= 500px) and (width <= 1200px) { }
    // https://github.com/postcss/postcss-media-minmax
    postcssMediaMinmax,
    // W3C CSS Custom Selectors, e.g. @custom-selector :--heading h1, h2, h3, h4, h5, h6;
    // https://github.com/postcss/postcss-custom-selectors
    postcssCustomSelectors,
    // W3C calc() function, e.g. div { height: calc(100px - 2em); }
    // https://github.com/postcss/postcss-calc
    postcssCalc,
    // Allows you to nest one style rule inside another
    // https://github.com/jonathantneal/postcss-nesting
    postcssNesting,
    // Unwraps nested rules like how Sass does it
    // https://github.com/postcss/postcss-nested
    postcssNested,
    // W3C color() function, e.g. div { background: color(red alpha(90%)); }
    // https://github.com/postcss/postcss-color-function
    postcssColorFunction,
    // Generate pixel fallback for "rem" units, e.g. div { margin: 2.5rem 2px 3em 100%; }
    // https://github.com/robwierzbowski/node-pixrem
    pixrem,
    // W3C CSS Level4 :matches() pseudo class, e.g. p:matches(:first-child, .special) { }
    // https://github.com/postcss/postcss-selector-matches
    postcssSelectorMatches,
    // Transforms :not() W3C CSS Level 4 pseudo class to :not() CSS Level 3 selectors
    // https://github.com/postcss/postcss-selector-not
    postcssSelectorNot,
    // Postcss flexbox bug fixer
    // https://github.com/luisrudge/postcss-flexbugs-fixes
    postcssFlexbugsFixes
    // Add vendor prefixes to CSS rules using values from caniuse.com
    // https://github.com/postcss/autoprefixer
    // autoprefixer({
    //   browsers: [
    //     '>1%',
    //     'last 4 versions',
    //     'Firefox ESR',
    //     'not ie < 9' // React doesn't support IE8 anyway
    //   ]
    // })
  ]
};
