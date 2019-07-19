
export class TransList {
  /*[StringLength(50)]*/
 
  public FromDepot: string;
  public ToDepot: string;
  public AssetName: string;
  public Amount?: number;

  public CreateUser: string;
  public CreateDate?: Date;
 
  public UpdateUser: string;
  public UpdateDate?: Date;
 
}
