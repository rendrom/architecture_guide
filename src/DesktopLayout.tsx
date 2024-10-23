import ReactNgwMap from '@nextgis/react-ngw-leaflet';
import { Splitter } from 'antd';
import { useMemo, useReducer, useState } from 'react';

import styles from './app.module.css';

import type { NgwMap } from '@nextgis/ngw-map';
import type { MapContainerProps } from '@nextgis/react-ngw-map';
import type { ReactNode } from 'react';
import { BaseLayoutOptions } from './interfaces';

interface DesktopLayoutOptions extends BaseLayoutOptions {
  vw: number;
  splitPanel: boolean;
}

export const DesktopLayout = ({
  content,
  sidebar,
  vw,
  splitPanel,
  ...splitterOptions
}: DesktopLayoutOptions) => {

  return (
    <div className={styles.main}>
      <Splitter {...splitterOptions}>
        <Splitter.Panel defaultSize={0.7 * vw}>
          <div style={{width: '100%', height: '100%' }}>
            {content}
          </div>
        </Splitter.Panel>
        {splitPanel && (
          <Splitter.Panel defaultSize={0.3 * vw} max={0.4 * vw}>
            {sidebar}
          </Splitter.Panel>
        )}
      </Splitter>
    </div>
  );
};
