import type { LayerLegend } from '@nextgis/ngw-connector';
import type NgwMap from '@nextgis/ngw-leaflet';

export class LegendPanel {
  container: HTMLElement;

  public legend: LayerLegend[] = [];

  //element values

  public closeButton: HTMLElement = document.createElement('div');
  public legendButton: HTMLElement = document.createElement('div');
  public layerSection: HTMLElement = document.createElement('div');

  private _handleClick?: () => void;

  constructor(public webMap: NgwMap) {
    const legendContainer = document.createElement('div');
    legendContainer.className = 'legend-container';
    this.container = legendContainer;
  }

  // Minimize legend panel method

  // handleOpenClickMethod() {
  //   console.log(this.container);
  //   this.container.innerHTML = '';
  //   this.initFullLeg();
  // }

  initMinLeg() {
    this.legendButton.classList.add('legend-button');
    const handleOpenClick = () => {
      if (this._handleClick) {
        this.closeButton.removeEventListener('click', this._handleClick);
      }
      this.container.innerHTML = '';
      this.initFullLeg();
      // console.log(this.container);
    };
    this.legendButton.addEventListener('click', handleOpenClick);
    this.container.appendChild(this.legendButton);
  }

  // Open legend panel method

  initFullLeg() {
    this.closeButton.classList.add('close-button');
    this._handleClick = () => {
      console.log(this.container);
      this.container.innerHTML = '';
      this.initMinLeg();
    };
    this.closeButton.addEventListener('click', this._handleClick);
    this.container.appendChild(this.closeButton);
    this.container.appendChild(this.layerSection);
  }

  setLegend(legend: LayerLegend[]) {
    this.legend = legend;
  }

  displayLegend() {
    this.container.innerHTML = '';

    this.legend.forEach((layerLegend) => {
      this.layerSection.classList.add('layer-section');
      this.layerSection.innerHTML = ''; // destroys layersection children

      // Add a title for the layer
      const layerTitle = document.createElement('h3');
      console.log(this.webMap.getLayer(layerLegend.layerId));
      layerTitle.textContent =
        this.webMap.getLayer(layerLegend.layerId)!.options.name ||
        `Layer ID: ${layerLegend.layerId}`;
      this.layerSection.appendChild(layerTitle);

      // Iterate through each LegendItem in the current LayerLegend
      layerLegend.legend.forEach((item) => {
        if (item.icon.format === 'png') {
          // Create an image element for the PNG symbol
          const img = document.createElement('img');
          img.src = `data:image/png;base64,${item.icon.data}`;
          img.alt = item.display_name;
          if (!item.render) {
            img.className = 'disabled';
          }

          // Create a label for the legend item
          const label = document.createElement('span');
          label.textContent = item.display_name;

          // Append the image and label to the layer section
          const itemContainer = document.createElement('div');
          itemContainer.classList.add('legend-item');
          itemContainer.appendChild(img);
          itemContainer.appendChild(label);

          img.addEventListener('click', () => {
            if (layerLegend.setSymbolRender) {
              layerLegend.setSymbolRender(item.index, !item.render);
            }
            //setSymbolRender doesn't type correctly
            this.displayLegend();
          });

          this.layerSection.appendChild(itemContainer);
        }
      });
    });
    this.initFullLeg();
  }
}
