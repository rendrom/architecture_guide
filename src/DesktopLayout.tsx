import { Splitter } from 'antd';

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
  return (
    <div className={styles.main}>
      <Splitter {...splitterOptions}>
        {sidebarType === 'info' && (
          <Splitter.Panel defaultSize={0.3 * vw} max={0.3 * vw}>
            {leftbar}
          </Splitter.Panel>
        )}
        <Splitter.Panel defaultSize={0.4 * vw}>
          <div style={{ width: '100%', height: '100%' }}>{content}</div>
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
