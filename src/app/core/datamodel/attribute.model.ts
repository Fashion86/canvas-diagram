import{AttributeTypeModel}  from './attribute-type.model'
export class AttributeModel {
  id: number;
  name: string;
  value: string;
  attribute: AttributeTypeModel;
}
