import { useMemo } from 'react';

import styles from './legendPanel.module.css';
import { LegendTree } from './legendTree';

import type { NgwWebmapItem, NgwWebmapLayerAdapter } from '@nextgis/ngw-kit';
import type { NgwMap } from '@nextgis/ngw-map';

export const LegendPanel = ({ ngwMap }: { ngwMap: NgwMap }) => {
  const webmapAdapter = useMemo<NgwWebmapLayerAdapter>(() => {
    return ngwMap.getLayer('webmap') as NgwWebmapLayerAdapter;
  }, [ngwMap]);

  const layer = useMemo(() => {
    if (webmapAdapter.layer) {
      return webmapAdapter.layer as NgwWebmapItem;
    } else {
      throw new Error('Resource is not `webmap` cls');
    }
  }, [webmapAdapter]);

  console.log('legendPanel', layer.item);

  if (!webmapAdapter) {
    return null;
  }

  return (
    <div className={styles.legendContainer}>
      {/* <div className={styles.closeButton}></div> */}
      <div className={styles.layerOverflow}>
        {layer && <LegendTree layer={layer} />}
      </div>
    </div>
  );
};
