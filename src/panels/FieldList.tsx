import { Spin } from 'antd';
import { useEffect, useState } from 'react';

import type { IdentifyItem } from '@nextgis/ngw-kit';
import type { FeatureLayerFieldRead } from '@nextgisweb/feature-layer/type/api';
import type { Point } from 'geojson';
import type { ArchitectureFields } from 'src/types';

export const FieldList = ({
  item,
}: {
  item: IdentifyItem<ArchitectureFields, Point>;
}) => {
  const [loading, setLoading] = useState(true);
  const [fieldArray, setFieldArray] = useState<FeatureLayerFieldRead[]>();

  useEffect(() => {
    setLoading(true);

    const load = async () => {
      Promise.all([
        item.resource(),
        new Promise((resolve) => {
          setTimeout(resolve, 500);
        }),
      ])
        .then(([resource]) => {
          setFieldArray(resource.fields);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    load();
  }, [item]);

  if (loading) {
    return <Spin />;
  }

  return (
    <div>
      {fieldArray?.map((field) => {
        return (
          <div key={field.keyname}>
            {field.display_name}
            {item.fields?.[field.keyname]}
          </div>
        );
      })}
    </div>
  );
};
