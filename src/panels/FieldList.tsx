import type { IdentifyItem } from '@nextgis/ngw-kit';
import type { Point } from 'geojson';
import type { ArchitectureFields } from 'src/types';

export const FieldList = ({
  item,
}: {
  item: IdentifyItem<ArchitectureFields, Point>;
}) => {
  return (
    <div>
      <div>
        <b>Название:</b> {item.fields.name}
      </div>
      <div>
        <b>Год постройки:</b>
        {item.fields.start_date}
      </div>
      <div>
        <b>Архитекторы:</b>
        <br />
        {item.fields.architector1}
        <br />
        {item.fields.architector2}
      </div>
      <div>{item.fields.description_ru}</div>
    </div>
  );
};
