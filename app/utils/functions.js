// All units are rem, not px
export const calculateClampValues = (minFont, maxFont, minVp, maxVp) => {
  // y = mx + q
  let m = (maxFont - minFont) / (maxVp - minVp);
  let q = -minVp * m + minFont;

  m = parseFloat((m * 100).toFixed(3));
  q = parseFloat(q.toFixed(3));
  minFont = parseFloat(minFont.toFixed(3));
  maxFont = parseFloat(maxFont.toFixed(3));
  minVp = parseFloat(minVp.toFixed(3));
  maxVp = parseFloat(maxVp.toFixed(3));

  return `clamp(${minFont}rem, ${q}rem + ${m}vw, ${maxFont}rem)`;
};
