import type { LayerLegend } from '@nextgis/ngw-connector';
import type NgwMap from '@nextgis/ngw-leaflet';

export class LegendPanel {
  container: HTMLElement;

  public legend: LayerLegend[] = [];

  constructor(public webMap: NgwMap) {
    const legendContainer = document.createElement('div');
    legendContainer.className = 'legend-container';
    this.container = legendContainer;
  }

  setLegend(legend: LayerLegend[]) {
    this.legend = legend;
  }

  displayLegend() {
    this.container.innerHTML = '';

    this.legend.forEach((layerLegend) => {
      const layerSection = document.createElement('div');
      layerSection.classList.add('layer-section');

      // Add a title for the layer
      const layerTitle = document.createElement('h3');
      console.log(this.webMap.getLayer(layerLegend.layerId));
      layerTitle.textContent =
        this.webMap.getLayer(layerLegend.layerId)!.options.name ||
        `Layer ID: ${layerLegend.layerId}`;
      layerSection.appendChild(layerTitle);

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
            console.log('1');
            layerLegend.setSymbolRender(item.index, !item.render);
            //setSymbolRender doesn't type correctly
            this.displayLegend()
          })

          layerSection.appendChild(itemContainer);
        }
      });

      const close_button = document.createElement('div');
      close_button.classList.add('closeButton');
      close_button.addEventListener('click', () => {
        console.log('close')
        this.container.removeChild(layerSection)
        this.container.removeChild(close_button)
        this.container.appendChild(legendButton)
        console.log(this.container)
      })


      //create a minimized panel

      const legendButton = document.createElement('div')
      legendButton.classList.add('legendButton')
      legendButton.addEventListener('click', () => {
        console.log('open')
        this.container.appendChild(close_button);
        this.container.appendChild(layerSection);
        this.container.removeChild(legendButton)
      })

      //append legend children

      this.container.appendChild(close_button);
      this.container.appendChild(layerSection);

    });


  }
}
