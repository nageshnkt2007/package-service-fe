import {Component, OnInit} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable, Subscription} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {CartService} from "../shared/service/cart.service";
import {HttpClient} from "@angular/common/http";
import {CurrencyService} from "../shared/service/currency.service";
import {Package} from "../shared/package.model";

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {

  subscription: Subscription;
  totalItemsInCart: number = this.cartService.totalItemsInCart;
  totalValueOfCart: number;
  packages: Package[];
  packagesSubscription: Subscription;
  currentCurrency: string;
  currencySubscription: Subscription;
  currencyList: {};
  currencyRateMapSub: Subscription;
  selectedOption: string = 'USD';

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );


  constructor(private breakpointObserver: BreakpointObserver, private cartService: CartService
    , http: HttpClient, private currencyService: CurrencyService) {
    this.currentCurrency = this.cartService.currentCurrency;
    this.totalValueOfCart = this.cartService.getTotalCartValue();
    this.totalItemsInCart = this.cartService.totalItemsInCart;
    this.currentCurrency = this.cartService.currentCurrency;
    this.currencyList = this.currencyService.currencyRateMap;
    this.packages = this.cartService.packages;
  }

  openSnackBar(message: string, action: string) {
    this.cartService.openSnackBar(message, action);
  }

  ngOnInit(): void {
    this.currencyService.getAllCurrencyData();
    this.subscription = this.cartService.isTotalNumberChanged.subscribe(value => {
      this.totalItemsInCart = value;
    });
    this.currencySubscription = this.currencyService.isCurrencyModified.subscribe(value => {
      this.currentCurrency = value;
    });
    this.currencyRateMapSub = this.currencyService.isCurrencyMapChanged.subscribe(value => {
      this.currencyList = value;
    });
    this.packagesSubscription = this.cartService.ispackagemodified.subscribe(value => {
      this.packages = value;
      this.totalValueOfCart = this.cartService.getTotalValue(this.packages);
    });

  }

  changeCurrentCurrency(value: any) {
    const factor = this.currencyService.getFactorForCurrency(value);
    console.log('my Factor is = ', factor);
    this.currencyService.setCurrentCurrency(value);
    if (this.packages.length > 0) {
      this.cartService.setCurrencyFactor(factor);
      let myList: Package[] = this.cartService.updatePackageListValue(this.packages);
      this.cartService.ispackagemodified.next(myList);
    }
  }
}
