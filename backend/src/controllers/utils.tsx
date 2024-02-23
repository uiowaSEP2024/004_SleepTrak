function collapseObject(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const key in obj) {
    if (obj[key] !== null) {
      if (typeof obj[key] === 'object') {
        result[key] = collapseObject(obj[key]);
      } else {
        result[key] = obj[key];
      }
    }
  }
  return result;
}

module.exports = {
  collapseObject
};
