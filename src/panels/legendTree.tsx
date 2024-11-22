import { Tree } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { NgwWebmapItem } from '@nextgis/ngw-kit';
import type { TreeProps } from 'antd';

type TreeItem = {
  title: string;
  key: string;
  children?: TreeItem[];
  parentKey?: string;
  layer?: NgwWebmapItem;
};

export const LegendTree = ({ layer }: { layer: NgwWebmapItem }) => {
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const onCheck: TreeProps['onCheck'] = (checkedKeysValue) => {
    if (Array.isArray(checkedKeysValue)) {
      setCheckedKeys(checkedKeysValue);
    } else {
      setCheckedKeys(checkedKeysValue.checked);
    }
  };
  const onExpand: TreeProps['onExpand'] = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const treeItemsRef = useRef<TreeItem[]>([]);

  const counter = useRef(1);

  const getTree = useCallback((layer: NgwWebmapItem, parentItem: TreeItem) => {
    const key = layer.layer
      ? `layer-${counter.current++}-${layer.layer.id}`
      : `counter-${counter.current++}`;
    // tree item obj
    const treeItem: TreeItem = {
      title: layer.item?.display_name ?? `layer ${counter}`,
      key,
      layer,
      parentKey: parentItem.key,
    };
    // item children array
    const children: TreeItem[] = [];
    // if enabled by default add to checkedKeys
    if (layer.item.item_type === 'layer' && layer.item.layer_enabled) {
      setCheckedKeys((old) => [...old, treeItem.key, parentItem.key]);
    }
    if (['group', 'root'].includes(layer.item?.item_type)) {
      // get children
      layer.tree.getDescendants().map((descendant: NgwWebmapItem) => {
        // put children into obj array
        children.push(getTree(descendant, treeItem));
      });
      treeItem.children = children; // set children
    }
    treeItemsRef.current.push(treeItem);
    return treeItem;
  }, []);

  const nodeTree = useMemo(() => {
    if (layer.item && layer.tree) {
      const nodes: TreeItem[] = [];
      const rootItem: TreeItem = {
        title: layer.item?.display_name ?? 'root',
        key: '0',
        layer,
      };
      layer.tree.getDescendants().map((descendant: NgwWebmapItem) => {
        // put children into obj array
        nodes.push(getTree(descendant, rootItem));
      });
      return nodes;
    } else {
      console.log('layer properties undefined');
    }
  }, [getTree, layer]);

  useEffect(() => {
    for (const treeItem of treeItemsRef.current) {
      treeItem.layer?.properties.set(
        'visibility',
        checkedKeys.includes(treeItem.key),
      );
    }
  }, [checkedKeys]);

  return (
    <div>
      <Tree
        checkable
        checkStrictly
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
