import { Checkbox } from 'antd';
import { useMemo } from 'react';

import type { NgwWebmapItem, NgwWebmapLayerAdapter } from '@nextgis/ngw-kit';
import type { NgwMap } from '@nextgis/ngw-map';

export function LegendPanel({ ngwMap }: { ngwMap: NgwMap }) {
  const webmapAdapter = useMemo<NgwWebmapLayerAdapter>(() => {
    return ngwMap.getLayer('webmap') as NgwWebmapLayerAdapter;
  }, [ngwMap]);

  const layers = useMemo(() => {
    if (webmapAdapter.layer?.tree) {
      return webmapAdapter.layer.tree.getDescendants() as NgwWebmapItem[];
    } else {
      throw new Error('Resource is not `webmap` cls');
    }
  }, [webmapAdapter]);

  if (!webmapAdapter) {
    return null;
  }

  return (
    <div className="check">
      {layers.map(({ id, item, properties }) => {
        return (
          <Checkbox
            key={id}
            onChange={() => {
              properties.set('visibility', !properties.get('visibility'));
            }}
          >
            {item.display_name} {properties.get('visibility') ? '1' : '0'}
          </Checkbox>
        );
      })}
    </div>
  );
}
