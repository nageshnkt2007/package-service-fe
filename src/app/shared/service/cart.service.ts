import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {BreakpointObserver} from "@angular/cdk/layout";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Package} from "../package.model";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  packages:Package=[];
  totalItemsInCart:number=0;
  constructor(private router:Router, public snackBar: MatSnackBar) { }

  public addPackage(shopPackage:Package){
    this.packages.push(shopPackage);
    totalItemsInCart++;
    console.log('package added to cart');
  }

  public removePackage(shopPackage:Package){
    this.packages.pop(shopPackage);
    totalItemsInCart--;
    console.log('package removed');
  }
  public goToCart(){
    this.router.navigate(["cart"]);
    console.log('Go To Cart');
  }

  public openSnackBar(message: string, action: string) {
    if (this.totalItemsInCart>1){
      message = "Congratulations! we have added a 10% discount for You";
    }
    let snackBarRef = this.snackBar.open(message, action, {
      duration: 4000,
    });
    snackBarRef.onAction().subscribe(()=> this.goToCart());
  }
}
