import 'module-alias/register';

import * as itemModel from '~models/item';

async function getDimensions() {  
  const items = await itemModel.getItemDimensions({
    category_id: 1, // office_storage_cabinet
    in_stock: true
  });

  console.log({ items });
}

getDimensions();