import { Splitter } from 'antd';
import { useMemo, useState } from 'react';

import styles from './app.module.css';

import type { BaseLayoutOptions } from './interfaces';

interface DesktopLayoutOptions extends BaseLayoutOptions {
  vw: number;
  splitPanel: boolean;
  leftbar: React.ReactNode;
  sidebarType: string;
}

export const DesktopLayout = ({
  content,
  sidebar,
  leftbar,
  vw,
  splitPanel,
  sidebarType,
  ...splitterOptions
}: DesktopLayoutOptions) => {
  const showInfoPanel = useMemo(() => sidebarType === 'info', [sidebarType]);
  const [infoPanelSize, setInfoPanelSize] = useState<number[]>([
    0.3 * vw,
    0.4 * vw,
    0.3 * vw,
  ]);

  return (
    <div className={styles.main}>
      <Splitter {...splitterOptions} onResize={setInfoPanelSize}>
        <Splitter.Panel
          size={showInfoPanel ? infoPanelSize[0] : 0}
          max={0.3 * vw}
          resizable={showInfoPanel}
        >
          {showInfoPanel && leftbar}
        </Splitter.Panel>

        <Splitter.Panel size={infoPanelSize[1]}>
          <div style={{ width: '100%', height: '100%' }}>{content}</div>
        </Splitter.Panel>
        <Splitter.Panel
          size={splitPanel ? infoPanelSize[2] : 0}
          max={0.4 * vw}
          resizable={splitPanel}
        >
          {splitPanel && sidebar}
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};
