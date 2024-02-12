function toCamelCase(str: string): string {
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace("-", "").replace("_", ""),
  );
}

function convertObjectToCamelCase(obj: any): any {
  const newObj: any = {};
  for (const key in obj) {
    newObj[toCamelCase(key)] = obj[key];
  }
  return newObj;
}

function convertNestedObjectsToCamelCase(obj: any, properties: string[]) {
  const newObj = convertObjectToCamelCase(obj);

  for (const property of properties) {
    if (Array.isArray(newObj[property])) {
      newObj[property] = newObj[property].map(convertObjectToCamelCase);
    }
  }

  return newObj;
}

export {
  toCamelCase,
  convertObjectToCamelCase,
  convertNestedObjectsToCamelCase,
};
