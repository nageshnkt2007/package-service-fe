import {Component, OnDestroy, OnInit} from '@angular/core';
import {Package} from "../shared/package.model";
import {Subscription} from "rxjs";
import {CartService} from "../shared/service/cart.service";
import {CurrencyService} from "../shared/service/currency.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit,OnDestroy {


  itemsInCart: Package[] = [];
  subscription: Subscription;
  totalPrice: number;
  totalSubscription: Subscription;
  currentCurrency: string;
  currencySubscription: Subscription;
  currencyFactor: number;
  private discountPercentage: number = 10;

  constructor(private cartService: CartService, private currencyService: CurrencyService) {
    this.currencyFactor = this.currencyService.currencyFactor;
    this.itemsInCart = this.cartService.packages;
    this.totalPrice = this.cartService.totalCartValue;
    this.currentCurrency = this.currencyService.currentCurrency;
  }

  public getDiscountedPrice() {
    if (this.itemsInCart.length > 1) {
      return this.totalPrice - this.totalPrice / this.discountPercentage;
    } else {
      return 0;
    }
  }

  ngOnInit() {
    this.subscription = this.cartService.ispackagemodified.subscribe(value => {
      this.itemsInCart = value;
    });

    this.currencySubscription = this.currencyService.isCurrencyModified.subscribe(value => {
      this.currentCurrency = value;
    });
    this.totalSubscription = this.cartService.isTotalValueChanged.subscribe(value => {
      this.totalPrice = value;
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.currencySubscription.unsubscribe();
    this.totalSubscription.unsubscribe();
  }
}
