/**
 * This file contains the color palette for the app.
 */

export const colors = {
  deepBlue: '#025977',
  skyBlue: '#4FC3CA',
  softBlue: '#C0CDE9',
  silverGrey: '#9B9A9A',
  crimsonRed: '#D75447',
  peachyOrange: '#F89D6C',
  lightTan: '#fff4e3',
  tan: '#F5D6A8',
  softLavender: '#D5C1D6',
  palePink: '#F5E0ED',
  lightPurple: '#f7f3f9',
  veryLightPurple: '#f7f3fa',
  veryLightTan: 'fff4e3',
  textGray: '#545454',
  paleOrange: '#F89D6C'
};

export const hexToRGBA = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
