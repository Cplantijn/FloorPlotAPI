import 'module-alias/register';

import * as math from 'mathjs';
import * as itemModel from '~models/item';

async function getDimensions() {  
  const items = await itemModel.getItemDimensions({
    category_id: 1, // office_storage_cabinet
    in_stock: true
  });

  const validItems = items.filter(item => item.length_in.length && item.height_in.length && item.depth_in.length);
  const flatItems = validItems.map(item => ({
    height_in: item.height_in[0],
    depth_in: item.depth_in[0],
    length_in: item.length_in[0]
  }));

  const allHeights = flatItems.map(item => item.height_in);

  const allDepths = flatItems.map(item => item.depth_in);
  const allLenghts = flatItems.map(item => item.length_in);

  const result = {
    height: {
      mean: allHeights.reduce((sum, height) => sum + height, 0) / allHeights.length, 
      standardDev: math.std(allHeights)
    },
    length: {
      mean: allLenghts.reduce((sum, len) => sum + len, 0) / allLenghts.length, 
      standardDev: math.std(allLenghts)
    },
    depth: {
      mean: allDepths.reduce((sum, depth) => sum + depth, 0) / allDepths.length, 
      standardDev: math.std(allDepths)
    }
  };

  console.log({ result });
}

getDimensions();