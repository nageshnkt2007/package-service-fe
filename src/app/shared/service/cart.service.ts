import {Injectable, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {BreakpointObserver} from "@angular/cdk/layout";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Package} from "../package.model";
import {Subject, Subscription} from "rxjs";
import {CurrencyService} from "./currency.service";


@Injectable({
  providedIn: 'root'
})
export class CartService {

  packages: Package[] = [];
  ispackagemodified: Subject<Package[]> = new Subject<Package[]>();
  totalItemsInCart: number = 0;
  isTotalNumberChanged: Subject<number> = new Subject<number>();
  totalCartValue: number = 0;
  currentCurrency: string = 'USD';
  isCurrencyModified: Subject<string> = new Subject<string>();
  isTotalValueChanged: Subject<number> = new Subject<number>();
  currencyFactor: number = 1;

  constructor(private router: Router, public snackBar: MatSnackBar,
              private currencyService: CurrencyService) {
    this.isTotalNumberChanged.subscribe((value => {
      this.totalItemsInCart = value;
    }));
    this.ispackagemodified.subscribe(value => {
      this.packages = value;
    });
    this.isTotalValueChanged.subscribe(value => {
      this.totalCartValue = value;
    });
    this.isCurrencyModified.subscribe(value => {
      this.currentCurrency = value;
      this.currencyFactor = this.currencyService.getFactorForCurrency(value);
    });
    this.currencyFactor = this.currencyService.currencyFactor;
  }

  public addPackage(shopPackage: Package) {
    this.packages.push(shopPackage);
    this.increaseItemCount();
    //let myList:Package[]= this.updatePackageListValue(this.packages);
    this.ispackagemodified.next(this.packages);
  }

  public getTotalValue(packageList: Package[]) {
    const prop = 'totalPrice';
    const basePrice = 'totalBasePrice';
    var total = 0;
    for (let mypackage of packageList) {
      total = total + mypackage.totalPrice;
    }
    this.isTotalValueChanged.next(total);
    return total
  }

  public updatePackageListValue(packageList: Package[]) {
    let myPackageList: Package[] = [];
    for (let pckg of packageList) {
      var total = pckg.totalPrice * this.currencyFactor;
      pckg.totalPrice = total;
      myPackageList.push(pckg);
    }
    console.log('updated package list is ', myPackageList)
    return myPackageList;
  }


  // To be used for Removal of packages from Cart.
  /*public removePackage(shopPackage:Package){
    this.packages.pop(shopPackage);
    this.ispackagemodified.next(this.packages);
    this.decreaseItemCount();
  }*/

  public goToCart() {
    this.router.navigate(["cart"]);
  }

  getTotalCartValue() {
    return this.totalCartValue;
  }

  getCurrentCurrency() {
    return this.currentCurrency;
  }

  increaseItemCount() {
    this.isTotalNumberChanged.next(++this.totalItemsInCart);
  }

  decreaseItemCount() {
    this.isTotalNumberChanged.next(--this.totalItemsInCart);
  }

  public openSnackBar(message: string, action: string) {
    if (this.totalItemsInCart == 2) {
      message = "Congratulations! we have added a 10% discount for You";
    }
    let snackBarRef = this.snackBar.open(message, action, {
      duration: 4000,
    });
    snackBarRef.onAction().subscribe(() => this.goToCart());
  }

  public setCurrencyFactor(factor: number) {
    this.currencyFactor = factor;
  }
}
