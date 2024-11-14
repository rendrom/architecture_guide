import { useEffect, useMemo } from 'react';
import type { NgwWebmapItem } from '@nextgis/ngw-kit';
import {Item} from '@nextgis/ngw-kit'
import { Checkbox } from 'antd';

export const LegendItem = (layer: NgwWebmapItem | Item<ItemOptions>) => {
  const itemIsRootOrGroup = ['group', 'root'].includes(layer.item.item_type);

  const children = useMemo(() => {
    if (itemIsRootOrGroup) {
      return layer.tree.getChildren() as Item<ItemOptions>;
    } else {
      throw new Error('unable to get children');
    }
  }, [layer]);

  // useEffect(() => {

  // })

  return (
    <div>
      <div>{layer.item.display_name}</div>
      <Checkbox
        onChange={() =>
          layer.properties
            .property('visibility')
            .set(!layer.properties.get('visibility'))
        }
      />
      if (children.length){' '}
      {children.map((child) => {
        LegendItem(child);
      })}
    </div>
  );
};
