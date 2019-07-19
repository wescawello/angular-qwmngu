import { StorageOrder } from "./storage-order";

export class StorageList {
  /*[StringLength(50)]*/
  public StorageSn: string;
  /*[StringLength(50)]*/
  public AssetSn: string;
  /*[StringLength(50)]*/
  public AssetName: string;
  /*[StringLength(50)]*/
  public VenderName: string;
  public Amount: number;
  public Price: number;
  /*[StringLength(50)]*/
  public Remark: string;
  public ManageType: number;
  /*[Required]
          [StringLength(50)]*/
  public CreateUser: string;
  public CreateDate: Date;
  /*[Required]
          [StringLength(50)]*/
  public UpdateUser: string;
  public UpdateDate: Date;
  /*[ForeignKey("StorageSn")]
          [InverseProperty("StorageList")]*/
  public StorageSnNavigation: StorageOrder;
}
