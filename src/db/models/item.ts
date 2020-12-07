import db from '../index';
import { buildClause } from '~utils/database';

const arrayCompMapping = {
  xMin: { col: 'x_in', operator: '<=' },
  xMax: { col: 'x_in', operator: '>=' },
  yMin: { col: 'y_in', operator: '<=' },
  yMax: { col: 'y_in', operator: '>=' },
  zMin: { col: 'z_in', operator: '<=' },
  zMax: { col: 'z_in', operator: '>=' },
};

const flatCompMapping = {
  priceUsdMin: { col: 'price_usd', operator: '<=' },
  priceUsdMax: { col: 'price_usd', operator: '>=' }
};

const comparisonCompMapping = {
  ...arrayCompMapping,
  ...flatCompMapping
};

function createComparisonClause(comparisons: Object): string {
  let queryArr = [];

  Object.keys(flatCompMapping).forEach(flatColKey => {
    if (comparisons[flatColKey]) {
      queryArr.push(`${comparisons[flatColKey]} ${flatCompMapping[flatColKey].operator} ${flatCompMapping[flatColKey].col}`);
      delete comparisons[flatColKey];
    }
  });

  Object.keys(comparisons).forEach(arrayColKey => {
    if (Object.keys(arrayCompMapping).includes(arrayColKey)) {
      // Always assume number for comparisons
      queryArr.push(`${comparisons[arrayColKey]} ${arrayCompMapping[arrayColKey].operator} ANY(${arrayCompMapping[arrayColKey].col})`);
    }
  });

  return queryArr.join(' AND ');
}


export async function getItems(whereObj, limit, limitOffset = 0) {
  // SELECT * FROM item WHERE 26.3 >= ANY(z_in) AND price_usd = 178.99
  let comparisions = {};

  Object.keys(whereObj).forEach(whereKey => {
    if (Object.keys(comparisonCompMapping).includes(whereKey)) {
      comparisions = {
        ...comparisions,
        [whereKey]: whereObj[whereKey]
      };

      delete whereObj[whereKey];
    }
  });

  const comparisonClause = createComparisonClause(comparisions);

  const sqlQuery = `
    SELECT
      id, title, manufacturer, link, price_usd, price_msrp_usd,
      star_count, reviewers_count, has_free_shipping, vendor_id,
      colors, materials, image_links, shipping_speed_days,
      z_in, x_in, y_in, in_stock
    FROM item
    WHERE ${buildClause(whereObj, ' AND ')}
    ${comparisonClause.length ? ` AND ${comparisonClause}` : ''}
    ORDER BY 
      (CASE WHEN in_stock = true THEN 3 WHEN in_stock IS NULL then 2 ELSE 1 END) DESC,
      (CASE WHEN reviewers_count IS NULL THEN 0 ELSE reviewers_count END) DESC,
      (CASE WHEN star_count IS NULL THEN 0 ELSE star_count END) DESC
    LIMIT ${limit}
    OFFSET ${limitOffset}
  `;
  const { rows } = await db.query(sqlQuery);
  return rows;
}