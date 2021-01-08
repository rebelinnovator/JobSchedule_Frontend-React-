
export class WorkerItem
{
  id:string;
  thumbnail:any;
  name:string;
  assignBy:string;
  assignerName:string;
  status: number; // 1 onroute, 2 onlocation, 3 sercured, 4 leaving
  isActive: boolean;
  avatar?: string;
}
