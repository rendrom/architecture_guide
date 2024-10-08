import { Checkbox } from 'antd';
import React from 'react';

export const LegendPanel = ({ ngwMap }) => {
  const webMap = ngwMap.current.getLayer('webmap');

  return (
    <div className="check" onClick={() => console.log(webMap.layer.tree._children)}>
      {/* {webMap.layer.tree._children.forEach((node) => {
        if (node.item.item_type === 'layer') {
          <Checkbox>
            {node.item.display_name}
          </Checkbox>
        }
      })} */}
    </div>
  );
};
