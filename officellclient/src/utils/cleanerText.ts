export const cleanDomain = (url) => {
  if (!url) return '';
  try {
    return url
      .replace(/^https?:\/\//, '') 
      .replace(/^www\./, '') 
      .replace(/\/$/, ''); 
  } catch {
    return url; 
  }
};

export const cleanCountryName = (name) => {
  if (!name) return '';
  return name
    .replace(/^(?:the\s|The\s)/i, '') 
    .replace(/\s*\(the\)$/i, '') 
    .trim(); 
};