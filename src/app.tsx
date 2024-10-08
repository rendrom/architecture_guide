// import ReactNgwMap from '@nextgis/react-ngw-ol';
import ReactNgwMap from '@nextgis/react-ngw-leaflet';
import { MapControl } from '@nextgis/react-ngw-map';
import { useState } from 'react';

import { LegendPanel } from './panels/legendPanel';

import type { NgwMap } from '@nextgis/ngw-map';
import type { MapContainerProps } from '@nextgis/react-ngw-map';

// const defaultControls = {
//   legendEnabled: true,
//   infoPanelEnabled: true,
// };

export const App = () => {
  const [ngwMap, setNgwMap] = useState<NgwMap>();

  // const [сontrolState, toggleMapContorls] = useState(defaultControls);

  const mapOptions: MapContainerProps = {
    id: 'map',
    baseUrl: '',
    resources: [{ resource: 1, id: 'webmap', fit: true }],
    whenCreated: (n) => {
      setNgwMap(n);
    },
  };

  return (
    <ReactNgwMap {...mapOptions}>
      <MapControl position="bottom-right" margin>
        {ngwMap ? (
          <LegendPanel ngwMap={ngwMap} />
        ) : (
          <div
            className="test"
            onClick={() => {
              console.log(ngwMap);
            }}
          ></div>
        )}
      </MapControl>
    </ReactNgwMap>
  );
};
