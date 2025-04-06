export const parseDDMMYYYY = (dateString: string) => {
    const [day, month, year] = dateString.split('-');
    return new Date(`${year}-${month}-${day}`);
  };