import{MetaOperationModel}  from './meta-operation.model'
import{MetaConditionModel}  from './meta-condition.model'
export class AttributeTypeModel {
  id: number;
  name: string;
  operations: MetaOperationModel[];
  conditions: MetaConditionModel[];
}
