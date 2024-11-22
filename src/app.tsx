// import ReactNgwMap from '@nextgis/react-ngw-ol';
import ReactNgwMap from '@nextgis/react-ngw-leaflet';
import { type MapContainerProps, MapControl } from '@nextgis/react-ngw-map';
import { Button, ConfigProvider } from 'antd';
import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { useViewport } from 'react-viewport-hooks';

import { InfoPanel } from './panels/InfoPanel';
import { LegendPanel } from './panels/legendPanel';
import { DesktopLayout } from './DesktopLayout';
import { MobileLayout } from './MobileLayout';

import type { IdentifyItem } from '@nextgis/ngw-kit';
import type { NgwIdentifyEvent, NgwMap } from '@nextgis/ngw-map';
import type { Point } from 'geojson';
import type { Map } from 'leaflet';

import type { ArchitectureFields } from './types';

export const App = () => {
  const { vw, vh } = useViewport();

  const [splitPanel, toggleSplitPanel] = useReducer((state) => !state, true);
  const [sidebarType, setSidebarType] = useState('legend');

  const [ngwMap, setNgwMap] = useState<NgwMap<Map>>();
  const [selectedItems, setSelectedItems] = useState<
    IdentifyItem<ArchitectureFields, Point>[]
  >([]);

  const onMapClick = useCallback((e: NgwIdentifyEvent | null) => {
    if (e) {
      const items = e.getIdentifyItems() as IdentifyItem<
        ArchitectureFields,
        Point
      >[];
      setSidebarType('info');
      setSelectedItems(items);
    } else {
      setSelectedItems([]);
    }
  }, []);

  useEffect(() => {
    if (ngwMap) {
      ngwMap.emitter.on('ngw:select', onMapClick);
    }
    return () => {
      if (ngwMap) {
        ngwMap.emitter.off('ngw:select', onMapClick);
      }
    };
  }, [ngwMap, onMapClick]);

  const mapOptions: MapContainerProps = useMemo(
    () => ({
      id: 'map',
      resources: [
        {
          resource: 1,
          id: 'webmap',
          fit: true,
          adapterOptions: { selectable: true },
        },
      ],
      whenCreated: (n) => {
        setNgwMap(n);
      },
    }),
    [],
  );

  const Legend = () => {
    return (
      <div>
        {ngwMap ? (
          <LegendPanel ngwMap={ngwMap} />
        ) : (
          <div className="test">
            <h1>LOADING...</h1>
          </div>
        )}
      </div>
    );
  };

  const onResize = useCallback(() => {
    if (ngwMap) {
      ngwMap.mapAdapter.map?.invalidateSize();
    }
  }, [ngwMap]);

  useEffect(() => {
    onResize();
  }, [onResize]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Splitter: {
            splitTriggerSize: 40,
          },
        },
      }}
    >
      {vw > vh ? (
        <DesktopLayout
          vw={vw}
          splitPanel={splitPanel}
          sidebarType={sidebarType}
          content={
            <ReactNgwMap {...mapOptions}>
              <MapControl position="top-right" margin>
                <Button
                  type="primary"
                  shape="circle"
                  onClick={toggleSplitPanel}
                />
              </MapControl>
            </ReactNgwMap>
          }
          sidebar={<Legend />}
          leftbar={
            ngwMap && (
              <InfoPanel selectedItems={selectedItems} ngwMap={ngwMap} />
            )
          }
          onResize={onResize}
        ></DesktopLayout>
      ) : (
        <MobileLayout
          vh={vh}
          splitPanel={splitPanel}
          content={
            <ReactNgwMap {...mapOptions}>
              <MapControl position="top-right" margin>
                <Button
                  type="primary"
                  shape="circle"
                  onClick={toggleSplitPanel}
                />
              </MapControl>
              <MapControl position="bottom-right" margin>
                <Button
                  type="primary"
                  shape="circle"
                  onClick={() => setSidebarType('legend')}
                />
              </MapControl>
            </ReactNgwMap>
          }
          sidebar={
            sidebarType === 'legend' ? (
              <Legend />
            ) : (
              ngwMap && (
                <InfoPanel selectedItems={selectedItems} ngwMap={ngwMap} />
              )
            )
          }
          onResize={onResize}
        ></MobileLayout>
      )}
    </ConfigProvider>
  );
};
