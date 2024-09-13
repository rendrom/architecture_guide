import NgwMap from '@nextgis/ngw-leaflet';
import type { Feature, Point } from 'geojson';
import { IdentifyItem } from '@nextgis/ngw-kit';

const ARC_POINTS_ID = 4980;

interface ArchitectureFields {
  name: string;
  name_int: string;
  description_ru: string;
  description_int: string;
  cool: string;
  start_date: string;
  wikidata: string;
  architector1: string;
  architector2: string;
  demolished: number; // INTEGER -> number
  label: string;
  label_int: string;
}

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
  const layer = ngwMap.getLayer(String(ARC_POINTS_ID));
  if (layer && layer.getLegend) {
    layer.getLegend().then((legend) => {
      displayLegend(legend, legendContainer, ngwMap);
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

  ////////////////////////////
  // Identify panel control //
  ////////////////////////////

  ngwMap.emitter.on('click', (e) => {
    ngwMap.cancelPromises('select', 'identify');
    ngwMap.removeLayer('geojson');
    identifyPanel.innerHTML = '...loading';
  });

  const identifyPanel = document.createElement('div');
  identifyPanel.className = 'identify-panel';
  identifyPanel.innerHTML = 'Click on the map for webmap identify';

  const fillIdentifyPanel = (
    items: IdentifyItem<ArchitectureFields, Point>[],
  ) => {
    identifyPanel.innerHTML = '';

    const info = document.createElement('div');

    const select = document.createElement('select');
    items.forEach((item, i) => {
      const option = document.createElement('option');
      option.innerHTML = item.label;
      option.setAttribute('value', String(i));
      select.appendChild(option);
    });
    select.addEventListener('change', () => {
      setSelected(items[select.value], info);
    });
    identifyPanel.appendChild(select);
    identifyPanel.appendChild(info);

    setSelected(items[0], info);
  };
  const setSelected = (
    item: IdentifyItem<ArchitectureFields, Point>,
    info: HTMLElement,
  ) => {
    info.innerHTML = '...loading';
    ngwMap.removeLayer('geojson');

    item.geojson({}).then((feature) => {
      ngwMap.addGeoJsonLayer({ data: feature, id: 'geojson' });
      item.resource().then((resource) => {
        info.innerHTML = '';
        resource.fields.forEach((field) => {
          const prop =
            '<div>' +
            field.display_name +
            ': ' +
            feature.properties[field.keyname] +
            '</div>';
          info.innerHTML += prop;
        });
      });
    });
  };
  const identifyControl = ngwMap.createControl(
    {
      onAdd: () => identifyPanel,
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
      fillIdentifyPanel(
        e.getIdentifyItems() as IdentifyItem<ArchitectureFields, Point>[],
      );
    }
  });

  /////////////
  // Legend //
  ////////////

  const legendContainer = document.createElement('div');
  legendContainer.className = 'legend-container';

  const legendPanel = ngwMap.createControl(
    {
      onAdd: () => legendContainer,
      onRemove: () => {
        /** */
      },
    },
    { bar: true },
  );
  ngwMap.addControl(legendPanel, 'bottom-left');

  function displayLegend(legend, legendContainer, webMap: NgwMap) {
    legendContainer.innerHTML = '';

    legend.forEach((layerLegend) => {
      const layerSection = document.createElement('div');
      layerSection.classList.add('layer-section');

      // Add a title for the layer
      const layerTitle = document.createElement('h3');
      console.log(webMap.getLayer(layerLegend.layerId));
      layerTitle.textContent =
        webMap.getLayer(layerLegend.layerId)!.options.name ||
        `Layer ID: ${layerLegend.layerId}`;
      layerSection.appendChild(layerTitle);

      // Iterate through each LegendItem in the current LayerLegend
      layerLegend.legend.forEach((item) => {
        if (item.symbol.format === 'png') {
          // Create an image element for the PNG symbol
          const img = document.createElement('img');
          img.src = `data:image/png;base64,${item.symbol.data}`;
          img.alt = item.name;

          // Create a label for the legend item
          const label = document.createElement('span');
          label.textContent = item.name;

          // Append the image and label to the layer section
          const itemContainer = document.createElement('div');
          itemContainer.classList.add('legend-item');
          itemContainer.appendChild(img);
          itemContainer.appendChild(label);

          layerSection.appendChild(itemContainer);
        }
      });

      legendContainer.appendChild(layerSection);
    });
  }
});
