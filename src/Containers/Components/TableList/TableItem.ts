import { ControlType } from '../../../Utils/ControlType';

export class TableItem
{
  title:string;
  fieldName:string;
  className:string;
  defaultWidth:number;
  hidden:boolean;
  editType: ControlType;

  constructor()
  {
    this.hidden = false;
  }
}
