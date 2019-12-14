import { Component, OnInit } from '@angular/core';
import {Package} from "../shared/package.model";
import {Subscription} from "rxjs";
import {CartService} from "../shared/service/cart.service";
import {CurrencyService} from "../shared/service/currency.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  itemsInCart:Package=[];
  subscription:Subscription;
  totalPrice:number;
  totalSubscription:Subscription;
  currentCurrency:string;
  currencySubscription:Subscription;
  currencyFactor:number;
  discountedPrice:number;
  private discountPercentage: number=10;

  constructor(private cartService:CartService,private currencyService:CurrencyService) {
    this.currencyFactor = this.currencyService.currencyFactor;
    this.itemsInCart = this.cartService.packages;
    this.totalPrice = this.cartService.totalCartValue;
    this.currentCurrency = this.currencyService.currentCurrency;
    console.log('currency is = ',this.currentCurrency);
  }

  public getDiscountedPrice(){
    if(this.itemsInCart.length>1){
      return this.totalPrice-this.totalPrice/this.discountPercentage;
    }
  }

  ngOnInit() {
    this.subscription = this.cartService.ispackagemodified.subscribe(value => {
      console.log('cart items are ',value);
      this.itemsInCart = value;
      console.log('cart packages are ',this.itemsInCart);
    });

    this.currencySubscription = this.currencyService.isCurrencyModified.subscribe(value => {
      console.log(value,this.currentCurrency);
      this.currentCurrency = value;
      console.log('currency is = ',this.currentCurrency);
    });
    this.totalSubscription = this.cartService.isTotalValueChanged.subscribe(value => {
      this.totalPrice = value;
    });
  }
}
