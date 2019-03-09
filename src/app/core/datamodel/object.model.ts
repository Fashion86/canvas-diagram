import {AttributeModel} from './attribute.model';

export class ObjectModel {
  id: number;
  typeName: string;
  value: string;
  attributes: AttributeModel[];
}
