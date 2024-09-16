import type { Point } from 'geojson';
import type NgwMap from '@nextgis/ngw-leaflet';
import type { IdentifyItem } from '@nextgis/ngw-kit';
import type { ArchitectureFields } from '../interface';

export class IdentifyPanel {
  container: HTMLElement;

  constructor(public webMap: NgwMap) {
    const identifyPanel = document.createElement('div');
    identifyPanel.className = 'identify-panel';
    identifyPanel.innerHTML = 'Click on the map for webmap identify';
    this.container = identifyPanel;
  }

  fillIdentifyPanel(items: IdentifyItem<ArchitectureFields, Point>[]) {
    this.container.innerHTML = '';

    const info = document.createElement('div');

    const select = document.createElement('select');
    items.forEach((item, i) => {
      const option = document.createElement('option');
      option.innerHTML = item.label;
      option.setAttribute('value', String(i));
      select.appendChild(option);
    });
    select.addEventListener('change', () => {
      this.setSelected(items[select.value], info);
    });
    this.container.appendChild(select);
    this.container.appendChild(info);

    this.setSelected(items[0], info);
  }

  setSelected(
    item: IdentifyItem<ArchitectureFields, Point>,
    info: HTMLElement,
  ) {
    info.innerHTML = '...loading';
    this.webMap.removeLayer('geojson');

    item.geojson({}).then((feature) => {
      this.webMap.addGeoJsonLayer({ data: feature, id: 'geojson' });
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
  }
}
