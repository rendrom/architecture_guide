import NgwMap from '@nextgis/ngw-leaflet';

import { IdentifyPanel } from './panels/IdentifyPanel';
import { LegendPanel } from './panels/LegendPaned';

import type { IdentifyItem } from '@nextgis/ngw-kit';
import type { Feature, Point } from 'geojson';

import type { ArchitectureFields } from './interface';

const ARC_POINTS_ID = 4980;

NgwMap.create({
  baseUrl:
    process.env.NODE_ENV === 'development'
      ? ''
      : 'https://trolleway.nextgis.com',
  target: 'map',
  // qmsId: 448,
  osm: true,
  resources: [
    {
      resource: ARC_POINTS_ID,
      id: String(ARC_POINTS_ID),
      fit: true,
      adapterOptions: { selectable: true },
    },
    { resource: 4907 },
  ],
}).then((ngwMap) => {
  const legendPanel = new LegendPanel(ngwMap);
  const identifyPanel = new IdentifyPanel(ngwMap);

  const layer = ngwMap.getLayer(String(ARC_POINTS_ID));
  if (layer && layer.getLegend) {
    layer.getLegend().then((legend) => {
      legendPanel.setLegend(legend);
      legendPanel.displayLegend();
    });
  }

  ngwMap.setCursor('pointer');

  const exportResourceControl = ngwMap.createButtonControl({
    addClass: 'export-resource-control',
    title: 'Export resource',
    onClick: () => {
      ngwMap.connector
        .route('resource.export.page', { id: ARC_POINTS_ID })
        .url()
        .then((url) => {
          window.open(url, '_blank');
        });
    },
  });
  ngwMap.addControl(exportResourceControl, 'top-left');

  const locateControl = ngwMap.createToggleControl({
    html: 'GPS',
    addClass: 'locate-control',
    addClassOn: 'active',
    title: 'Fine your location',
    onClick: (status) => {
      if (status) {
        ngwMap.locate(
          { maxZoom: 16, setView: true },
          {
            locationfound: (e) => {
              const data: Feature<Point> = {
                type: 'Feature',
                geometry: { type: 'Point', coordinates: e.lngLat },
                properties: {},
              };
              ngwMap.addGeoJsonLayer({
                id: 'my_location',
                data,
                type: 'point',
                paint: {
                  // TODO: accuracy
                  radius: 10,
                },
              });
            },
          },
        );
      } else {
        ngwMap.removeLayer('my_location');
      }
    },
  });
  ngwMap.addControl(locateControl, 'top-left');

  /////////////////////////////////////////////////////////////////////////////
  // ------------------============ Identify ============------------------- //
  /////////////////////////////////////////////////////////////////////////////

  ngwMap.emitter.on('click', () => {
    ngwMap.cancelPromises('select', 'identify');
    ngwMap.removeLayer('geojson');
    identifyPanel.container.innerHTML = '...loading';
  });

  const identifyControl = ngwMap.createControl(
    {
      onAdd: () => identifyPanel.container,
      onRemove: () => {
        /** */
      },
    },
    { bar: true },
  );
  ngwMap.addControl(identifyControl, 'top-right');

  // Handle map click
  ngwMap.emitter.on('ngw:select', (e) => {
    if (e) {
      identifyPanel.fillIdentifyPanel(
        e.getIdentifyItems() as IdentifyItem<ArchitectureFields, Point>[],
      );
    }
  });

  /////////////////////////////////////////////////////////////////////////////
  // --------------------============ Legend ============------------------- //
  /////////////////////////////////////////////////////////////////////////////

  const legendControl = ngwMap.createControl(
    {
      onAdd: () => legendPanel.container,
      onRemove: () => {
        /** */
      },
    },
    { bar: true },
  );
  ngwMap.addControl(legendControl, 'bottom-left');
});
