import { Tree } from 'antd';
import { useCallback, useMemo, useRef, useState } from 'react';

import type { NgwWebmapItem } from '@nextgis/ngw-kit';
import type { TreeProps } from 'antd';

type TreeItem = {
  title: string;
  key: string;
  children?: TreeItem[];
};

export const LegendTree = ({ layer }: { layer: NgwWebmapItem }) => {
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

  const counter = useRef(1);

  const getTree = useCallback((layer: NgwWebmapItem) => {
    const key = `layer ${counter.current++}`;

    // tree item obj
    const treeItem: TreeItem = {
      title: layer.item?.display_name ?? `layer ${counter}`,
      key,
    };
    // item children array
    const children: TreeItem[] = [];
    // if enabled by default add to checkedKeys
    if (layer.item.item_type === 'layer' && layer.item.layer_enabled) {
      setCheckedKeys((old) => [...old, treeItem.key]);
    }
    if (['group', 'root'].includes(layer.item?.item_type)) {
      // get children
      layer.tree.getDescendants().map((descendant: NgwWebmapItem) => {
        // put children into obj array
        children.push(getTree(descendant));
      });
      treeItem.children = children;
    }
    return treeItem;
  }, []);

  const nodeTree = useMemo(() => {
    if (layer.item && layer.tree) {
      return [getTree(layer)];
    } else {
      console.log('layer properties undefined');
    }
  }, [getTree, layer]);

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
