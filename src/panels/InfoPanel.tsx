import { Collapse } from 'antd';

import { FieldList } from './FieldList';
import styles from './infoPanel.module.css';

import type { IdentifyItem } from '@nextgis/ngw-kit';
import type { CollapseProps } from 'antd';
import type { Point } from 'geojson';
import type { ArchitectureFields } from 'src/types';

interface InfoPanelOptions {
  selectedItems: IdentifyItem<ArchitectureFields, Point>[];
}

export const InfoPanel = ({ selectedItems }: InfoPanelOptions) => {
  const collapseItmes: CollapseProps['items'] = [];

  if (selectedItems) {
    selectedItems.map((item, i) => {
      collapseItmes.push({
        key: i,
        label: item.fields.label | item.fields.name,
        children: (
          <div>
            <FieldList item={item} />
          </div>
        ),
      });
    });
    console.log(collapseItmes);
    return (
      <div className={styles.infoContainer}>
        <Collapse items={collapseItmes} defaultActiveKey={['0']} />
      </div>
    );
  }
};
