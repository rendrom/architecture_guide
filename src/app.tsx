import { MapControl, ToggleControl } from '@nextgis/react-ngw-map';
import ReactNgwOl from '@nextgis/react-ngw-ol';
import React, { useRef, useState } from 'react';

import { LegendPanel } from './panels/legendPanel';

const defaultControls = {
  legendEnabled: true,
  infoPanelEnabled: true,
};

export const App = () => {
  const ngwMap = useRef();

  const [webMap, setWebMap] = useState(ngwMap.current);

  const [сontrolState, toggleMapContorls] = useState(defaultControls);

  const mapOptions = {
    id: 'map',
    baseUrl: '',
    resources: [{ resource: 4980, id: 'webmap', fit: true }],
    whenCreated: (n) => {
      ngwMap.current = n;
      setWebMap(n);
      console.log(n);
    },
  };

  return (
    <ReactNgwOl {...mapOptions}>
      <MapControl position="bottom-right" margin>
        {ngwMap.current ? (
          <LegendPanel ngwMap={ngwMap} />
        ) : (
          <div
            className="test"
            onClick={() => console.log(ngwMap.current)}
          ></div>
        )}
      </MapControl>
    </ReactNgwOl>
  );
};
