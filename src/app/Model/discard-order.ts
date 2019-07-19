import { DiscardList } from "./discard-list";

 
export class DiscardOrder {
  public DiscardSn: string;
  public DepotSn?: string;
  public DepotName: string;
  public DiscardType?: number;
  public DiscardDate?: Date;
  public Remark?: string;
  public CreateUser?: string;
  public CreateDate?: Date;
  public UpdateUser?: string;
  public UpdateDate?: Date;
  public DiscardList?: DiscardList[];
}
