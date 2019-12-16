import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Package} from "../../shared/package.model";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {CartService} from "../../shared/service/cart.service";
import {Subscription} from "rxjs";
import {CurrencyService} from "../../shared/service/currency.service";
import {PackageService} from "../../shared/service/package.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-package-list',
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.css']
})
export class PackageListComponent implements OnInit,OnDestroy {
  dataSource: MatTableDataSource<Package> = new MatTableDataSource<Package>();
  displayedColumns: string[] = ['name', 'totalPrice', 'action'];
  currentCurrency: string;
  currencySubscription: Subscription;
  packageServiceSubscription: Subscription;
  packagesFromDB: Package[];
  isBackEndServiceDown: boolean = false;
  currencyFactor: number = 1;
  factorSubscription: Subscription;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private cartService: CartService, private currencyService: CurrencyService,
              private packageService: PackageService, private route: Router) {
    this.currentCurrency = this.currencyService.currentCurrency;
    this.currencyFactor = this.currencyService.currencyFactor;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    //fetching all packages from DB
    this.packageService.getAllPackages(this.currentCurrency);
    this.currencySubscription = this.currencyService.isCurrencyModified.subscribe(value => {
      this.currentCurrency = value;
      this.packageService.getAllPackages(this.currentCurrency);
    });
    this.packagesFromDB = this.packageService.packageFromDB;
    this.packageServiceSubscription = this.packageService.isPackageFromDBModified.subscribe(value => {
      this.packagesFromDB = value;
      if (this.packagesFromDB && this.packagesFromDB.length > 0) {
        this.dataSource = new MatTableDataSource(this.packagesFromDB);
      } else {
        this.isBackEndServiceDown = true;
      }
      this.dataSource.sort = this.sort;
    });
  }

  addToCart(value: Package) {
    let myClonedObject: Package = value;
    this.cartService.addPackage(myClonedObject);
    this.cartService.openSnackBar(value.name + ' added to your cart', 'Checkout');
  }

  deleteItemFunction(item) {
    this.dataSource.data.splice(this.dataSource.data.indexOf(item.id), 1);
  }

  public updatePackageListValue(packageList: Package[]) {
    let myPackageList: Package[] = [];
    for (let pckg of packageList) {
      var total = pckg.totalPrice * this.currencyFactor;
      pckg.totalPrice = total;
      myPackageList.push(pckg);
    }
    return myPackageList;
  }

  goToDetails(pckg: Package) {
    this.route.navigate(["package/" + pckg.id]);
  }
  ngOnDestroy(): void {
    this.currencySubscription.unsubscribe();
    this.packageServiceSubscription.unsubscribe();
  }
}
