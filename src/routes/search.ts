import { Request, Response, Application } from 'express';
import * as itemModel from '~models/item';

async function searchItems(req: Request, res: Response) {
  try {
    const {
      category_id,
      xmin: xMin,
      xmax: xMax,
      ymin: yMin,
      ymax: yMax,
      zmin: zMin,
      zmax: zMax,
      price_usd_min: priceUsdMin,
      price_usd_max: priceUsdMax,
      page
    } = req.query;
    
    const numParams = { xMin, xMax, yMin, yMax, zMin, zMax, priceUsdMin, priceUsdMax, category_id };
  
    const validatedParams = Object.keys(numParams).reduce((allNums, numParamKey) => {
      const numParam = Number(Number(numParams[numParamKey]).toFixed(2));
  
      if (!isNaN(numParam as any)) {
        allNums[numParamKey] = numParam;
      }

      return allNums;
    }, {});

    if (!validatedParams.hasOwnProperty('category_id')) {
      throw new Error('Need to have a categoryId')
    }

    const limit = 48;
    let resultsPage = 0; // Actual offset calculated based on the db. 0 indexed
    let limitOffset = 0;

    if (!isNaN(page as any) && Number(page) > 0) {
      resultsPage = Number(page) - 1;
    }

    limitOffset = resultsPage * limit;

    const results = await itemModel.getItems(validatedParams, limit, limitOffset);

    return res.json({
      page: resultsPage + 1,
      results
    });

  } catch(e) {
    console.log({ e })
    return res.status(422).send(`Wrong value passed bro`);
  }
}

export default {
  registerHandler: (app: Application) => {
    app.get('/search', searchItems);
  }
}