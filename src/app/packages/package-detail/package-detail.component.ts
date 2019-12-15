import {Component, OnInit} from '@angular/core';
import {PackageService} from "../../shared/service/package.service";
import {Package} from "../../shared/package.model";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {CurrencyService} from "../../shared/service/currency.service";
import {CartService} from "../../shared/service/cart.service";

@Component({
  selector: 'app-package-detail',
  templateUrl: './package-detail.component.html',
  styleUrls: ['./package-detail.component.css']
})
export class PackageDetailComponent implements OnInit {
  myPackage: Package;
  subscription: Subscription;
  private packageId: number;
  currentCurrency: string;
  currencySubscription: Subscription;
  currencyFactor: number = 1;

  constructor(private packageService: PackageService, private route: ActivatedRoute,
              private currencyService: CurrencyService, private cartService: CartService) {
    this.myPackage = this.packageService.currentPackage;
    this.currentCurrency = this.currencyService.currentCurrency;
  }

  ngOnInit() {
    this.subscription = this.packageService.isCurrentPackageModified.subscribe(value => {
      this.myPackage = value;
      this.modifyPackageValues(this.myPackage);
    });
    this.currencySubscription = this.currencyService.isCurrencyModified.subscribe(value => {
      this.currentCurrency = value;
      console.log('current currency is :', value);
      let oldFactor = this.currencyFactor;
      this.currencyFactor = this.currencyService.getFactorOfCurrency(this.currentCurrency);
      this.currencyFactor = this.currencyFactor / oldFactor;
      console.log('currency factor is : ', this.currencyFactor);
      this.modifyPackageValues(this.myPackage);
    });
    this.packageId = this.route.snapshot.params['id'];
    this.packageService.getPackage(this.packageId);
  }

  addToCart() {
    let myClonedObject: Package = this.myPackage;
    this.cartService.addPackage(myClonedObject);
    this.cartService.openSnackBar(this.myPackage.name + ' added to your cart', 'Checkout');
  }

  modifyPackageValues(pckg: Package) {
    pckg.totalPrice = pckg.totalPrice * this.currencyFactor;
    for(let product of pckg.products){
      product.basePrice = product.basePrice*this.currencyFactor;
    }
    //this.myPackage = pckg;
  }
}
