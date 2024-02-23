function collapseObject(obj: any): any {
  const result = {};
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
