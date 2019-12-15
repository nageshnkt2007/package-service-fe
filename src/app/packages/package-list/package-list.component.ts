import {Component, OnInit, ViewChild} from '@angular/core';
import {Package} from "../../shared/package.model";
import {Product} from "../../shared/product.model";
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
export class PackageListComponent implements OnInit {
  ELEMENT_DATA:Package[] = [
    new Package(1,"Premium","This is a dummy package for testing",1200,[new Product(5,"product1","ahdvsa412X#",499)]),
  new Package(5,"Eco Package","Another for testing",3399,[new Product(5,"product1","ahdvsa412X#",499)]),
  new Package(6,"Generak Package","Another for testing",999,[new Product(5,"product1","ahdvsa412X#",499)]),
  new Package(7,"Incedible Package","Another for testing",899,[new Product(5,"product1","ahdvsa412X#",499)])
];
  dataSource: MatTableDataSource<Package>= new MatTableDataSource<Package>();
  displayedColumns: string[] = ['name', 'totalPrice','action'];
  currentCurrency:string;
  currencySubscription:Subscription;
  packageServiceSubscription:Subscription;
  packagesFromDB:Package[];
  isBackEndServiceDown:boolean=false;
  currencyFactor:number=1;
  factorSubscription:Subscription;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private cartService:CartService,private currencyService:CurrencyService,
              private packageService:PackageService,private route:Router) {
    this.currentCurrency = this.currencyService.currentCurrency;
    this.currencyFactor = this.currencyService.currencyFactor;
    console.log('constructer factor is : ',this.currencyFactor);
    //this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
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
      console.log('currency subscription factor is : ',this.currencyFactor);
    });
    this.packagesFromDB = this.packageService.packageFromDB;
    this.packageServiceSubscription = this.packageService.isPackageFromDBModified.subscribe(value => {
      this.packagesFromDB = value;
      if(this.packagesFromDB && this.packagesFromDB.length>0){
        this.dataSource = new MatTableDataSource(this.packagesFromDB);
      }else{
        //this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.isBackEndServiceDown = true;
      }
      this.dataSource.sort = this.sort;
    });
  }

  addToCart(value: Package) {
    let myClonedObject:Package  = value;
    this.cartService.addPackage(myClonedObject);
    this.cartService.openSnackBar(value.name+' added to your cart','Checkout');
  }
  deleteItemFunction(item){
    this.dataSource.data.splice(this.dataSource.data.indexOf(item.id), 1);
    //this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  }
  public updatePackageListValue(packageList:Package[]){
    let myPackageList:Package[]=[];
    for(let pckg of packageList){
      var total = pckg.totalPrice*this.currencyFactor;
      pckg.totalPrice = total;
      myPackageList.push(pckg);
    }
    return myPackageList;
  }

  goToDetails(pckg: Package) {
      this.route.navigate(["package/"+pckg.id]);
    console.log(pckg);
  }
}
