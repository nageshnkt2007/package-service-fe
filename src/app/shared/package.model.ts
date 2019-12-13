import {Product} from "./product.model";

export class Package {
  public id: number;
  public name: string;
  public description: string;
  public totalPrice: number;
  public products: Product[];

  constructor(id: number, name: string, description: string, totalPrice: number, products: Product[]) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.totalPrice = totalPrice;
    this.products = products;
  }
}
