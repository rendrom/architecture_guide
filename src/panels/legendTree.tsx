import { Tree } from 'antd';
import { useMemo, useState } from 'react';

import type { NgwWebmapItem } from '@nextgis/ngw-kit';
import type { TreeProps } from 'antd';

type TreeItem = {
  title: string;
  key: string;
  children?: TreeItem[];
};

export const LegendTree = (layer: NgwWebmapItem) => {
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const onCheck: TreeProps['onCheck'] = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue as React.Key[]);
  };
  const onExpand: TreeProps['onExpand'] = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  console.log('legendTree', layer.item);
  const getTree = (layer: NgwWebmapItem, i: number) => {
    // tree item obj
    const TreeItem: TreeItem = {
      title: layer.item?.display_name ?? `layer ${i}`,
      key: layer.item?.display_name ?? `layer ${i}`,
    };
    // item children array
    const children: TreeItem[] = [];
    // if enabled by default add to checkedKeys
    if (layer.item.item_type === 'layer' && layer.item.layer_enabled) {
      setCheckedKeys(checkedKeys.concat(TreeItem.key));
    }
    if (['group', 'root'].includes(layer.item?.item_type)) {
      // get children
      layer.tree
        .getDescendants()
        .map((descendant: NgwWebmapItem, j: number) => {
          // put children into obj array
          children.push(getTree(descendant, j));
        });
      TreeItem.children = children;
    }
    return TreeItem;
  };

  const nodeTree = useMemo(() => {
    if (layer.item && layer.tree) {
      return [getTree(layer, 1)];
    } else {
      console.log('layer properties undefined');
    }
  }, [layer.item, layer.tree]);

  // console.log(getTree(layer, 1));

  return (
    <div>
      <Tree
        checkable
        checkedKeys={checkedKeys}
        onCheck={onCheck}
        expandedKeys={expandedKeys}
        onExpand={onExpand}
        autoExpandParent={autoExpandParent}
        treeData={nodeTree}
      />
    </div>
  );
};
