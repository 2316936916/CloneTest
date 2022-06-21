export const validation = (data, validate) => {
  if (!data) {
    return [null, null, ''];
  }
  const keys = Object.keys(data);
  for (let i = 0; i < keys.length; i++) {
    const dataKey = keys[i];
    const value = data[dataKey];
    const match = validate[dataKey];
    if (match) {
      try {
        const ret = match(value);
        if (!ret) {
          return [dataKey, value, ''];
        }
      } catch (error) {
        return [dataKey, value, error.message];
      }
    }
  }
  return null;
};
