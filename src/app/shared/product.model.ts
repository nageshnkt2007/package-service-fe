export class Product {
  public id:number;
  public name:string;
  public productId:string;
  public basePrice:number;

  constructor(id:number,name:string,productId:string,basePrice:number) {
    this.id = id;
    this.name = name;
    this.productId = productId;
    this.basePrice = basePrice;
  }
}
