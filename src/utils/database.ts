export function createMultiInsertQuery(tableName: string, itemsToInsert: any[]): string {
  const keys = Object.keys(itemsToInsert[0]);

  const values = itemsToInsert.map(item => {
    const columnValues = [];

    keys.forEach((key) => {
      if (item[key] === null) {
        columnValues.push('null');
      } else if (Array.isArray(item[key])) {
        const sqlArray = item[key].map(arrElement => {
          const quote = typeof arrElement === 'string' ? "\"" : '';
  
          return `${quote}${arrElement}${quote}`;
        });
  
        columnValues.push(`'{${sqlArray.join(',')}}'`);
      } else if (typeof item[key] === 'string') {
        columnValues.push(`'${item[key]}'`);
      } else {
        columnValues.push(item[key]);
      }
    });


    return `(${columnValues.join(',')})`
  });

  return `INSERT INTO ${tableName} (${Object.keys(itemsToInsert[0]).join(',')}) VALUES ${values.join(',')}`;
};

export function buildClause(updateObj: Object, delim = ' , '): string {
  return Object.keys(updateObj).map(keyName => {
    if (Array.isArray(updateObj[keyName])) {
      const sqlArray = updateObj[keyName].map(arrElement => {
        const quote = typeof arrElement === 'string' ? "\"" : '';

        return `${quote}${arrElement}${quote}`;
      });

      return `${keyName}='{${sqlArray.join(',')}}'`;
    }

    const quote = typeof updateObj[keyName] === 'string' ? "'" : '';
    return `${keyName}=${quote}${updateObj[keyName]}${quote}`;
  }).join(delim);
}