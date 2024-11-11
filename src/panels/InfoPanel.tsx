import { Select } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import { FieldList } from './FieldList';
import styles from './infoPanel.module.css';

import type { IdentifyItem } from '@nextgis/ngw-kit';
import type { Point } from 'geojson';
import type { ArchitectureFields } from 'src/types';

interface InfoPanelOptions {
  selectedItems: IdentifyItem<ArchitectureFields, Point>[];
}

interface SelectOption {
  label: string | number;
  value: number;
}

export const InfoPanel = ({ selectedItems }: InfoPanelOptions) => {
  const optionsArray: SelectOption[] = [];
  const [chosenItem, setChosenItem] =
    useState<IdentifyItem<ArchitectureFields, Point>>();

  const handleChange = useCallback(
    (value: number) => {
      setChosenItem(selectedItems[value]);
    },
    [selectedItems],
  );

  useEffect(() => {
    setChosenItem(selectedItems[0]);
  }, [selectedItems]);

  if (selectedItems) {
    selectedItems.map((item, i) => {
      optionsArray.push({
        label: item.label,
        value: i,
      });
    });

    return (
      <div className={styles.infoContainer}>
        <Select
          defaultValue={0}
          style={{ width: 120 }}
          options={optionsArray}
          onChange={handleChange}
        />

        {chosenItem && <FieldList item={chosenItem} />}
      </div>
    );
  }
};
