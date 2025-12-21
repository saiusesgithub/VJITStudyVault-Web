// Helper functions to convert between URL params and database format

export const formatYearForDB = (year: string): string => {
  return `${year}${year === '1' ? 'st' : year === '2' ? 'nd' : year === '3' ? 'rd' : 'th'} Year`;
};

export const formatSemesterForDB = (semester: string): string => {
  return `Sem ${semester}`;
};

export const toURLSlug = (text: string): string => {
  return text.toLowerCase().replace(/\s+/g, '-');
};

export const toUpperCase = (text: string): string => {
  return text.toUpperCase();
};
