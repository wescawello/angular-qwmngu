import { StorageList } from "./storage-list";

 
export class StorageOrder {
  constructor() {
    //this.StorageList =[];
  }
  /*[Key]
          [StringLength(50)]*/
  public StorageSn: string;
  /*[Required]
          [StringLength(50)]*/
  public DepotSn: string;
  /*[Required]
          [StringLength(50)]*/
  public DepotName: string;
  public BuyDate?: Date;
  public Total?: number;
  public StorageType?: number;
  /*[StringLength(50)]*/
  public Remark?: string;
  /*[Required]
          [StringLength(50)]*/
  public CreateUser?: string;
  public CreateDate?: Date;
  /*[Required]
          [StringLength(50)]*/
  public UpdateUser?: string;
  public UpdateDate?: Date;
  /*[InverseProperty("StorageSnNavigation")]*/
  public StorageList?: StorageList[];
}
