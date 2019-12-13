import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatSnackBar } from "@angular/material";
import {Router} from "@angular/router";
import {CartService} from "../shared/service/cart.service";

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent {
  totalItemsInCart:number=this.cartService.totalItemsInCart;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private router:Router,private cartService:CartService) {}

  openSnackBar(message: string, action: string) {
    this.cartService.openSnackBar(message,action);
  }
}
