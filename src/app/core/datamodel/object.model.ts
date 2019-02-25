import {AttributeModel} from './attribute.model';

export class ObjectModel {
  id: number;
  name: string;
  value: string;
  attributes: AttributeModel[];
}
