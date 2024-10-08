import type { IdentifyItem } from '@nextgis/ngw-kit';
import type NgwMap from '@nextgis/ngw-leaflet';
import type { Point } from 'geojson';

import type { ArchitectureFields } from '../interface';

interface IdentifyPanelOptions {
  onClose?: () => void;
}

export class IdentifyPanel {
  container: HTMLElement;

  private onClose?: () => void;

  constructor(
    public webMap: NgwMap,
    { onClose }: IdentifyPanelOptions,
  ) {
    const identifyPanel = document.createElement('div');
    identifyPanel.className = 'identify-panel';
    identifyPanel.innerHTML = 'Click on the map for webmap identify';
    this.container = identifyPanel;
    this.onClose = onClose;
  }

  fillIdentifyPanel(items: IdentifyItem<ArchitectureFields, Point>[]) {
    this.container.innerHTML = '';

    const info = document.createElement('div');
    info.classList.add('info');

    const close_button = document.createElement('div');
    close_button.classList.add('close-button');

    const select = document.createElement('select');
    items.forEach((item, i) => {
      const option = document.createElement('option');
      option.innerHTML = item.label;
      option.setAttribute('value', String(i));
      select.appendChild(option);
    });
    select.addEventListener('change', () => {
      if (select.value) {
        const item = items[Number(select.value)];
        this.setSelected(item, info);
      }
    });
    this.container.appendChild(close_button);
    this.container.appendChild(select);
    this.container.appendChild(info);

    close_button.addEventListener('click', () => {
      console.log(this.webMap);
      if (this.onClose) {
        this.onClose();
      }
      // this.setSelected(items[0], info);
      // this.webMap.removeControl(this.container);
      // this.webMap.addControl(legendControl, 'bottom-left');
    });

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
          const val =
            feature.properties[field.keyname as keyof ArchitectureFields];
          const prop = '<div>' + field.display_name + ': ' + val + '</div>';
          info.innerHTML += prop;
        });
      });
    });
  }
}
