import { useState } from 'react';

import type { IdentifyItem } from '@nextgis/ngw-kit';
import type {
  FeatureLayerFieldRead,
  FeatureLayerRead,
} from '@nextgisweb/feature-layer/type/api';
import type { GeoJsonProperties, Point } from 'geojson';
import type { ArchitectureFields } from 'src/types';

export const FieldList = ({
  item,
}: {
  item: IdentifyItem<ArchitectureFields, Point>;
}) => {
  const [fieldArray, setFieldArray] = useState<FeatureLayerFieldRead[]>();
  const [propertyArray, setPropertyArray] = useState<GeoJsonProperties>();
  console.log('fieldsrender', item);
  if (item) {
    item.resource()?.then((resource: FeatureLayerRead) => {
      setFieldArray(resource.fields);
    });

    item.geojson({})?.then((feature) => {
      console.log(feature.properties);
      setPropertyArray(feature.properties);
    });

    return (
      <div>
        {fieldArray?.map((field, i) => {
          return (
            <div key={i}>
              {field.display_name}
              {propertyArray?.[field.keyname]}
            </div>
          );
        })}
      </div>
    );
  }
};
