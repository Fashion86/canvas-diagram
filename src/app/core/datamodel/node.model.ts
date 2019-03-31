// export class Position {
//   xpos: number;
//   ypos: number;
// }
export class NodeModel {

  nodeId: number;
  parentNodeId: number;
  treeId: number;
  name: string;
  node:any;
  type: string;
  conversation: string;
  attributes:any[];
  children: any[]=[];

}
