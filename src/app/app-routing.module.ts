import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PackageListComponent} from "./packages/package-list/package-list.component";
import {PackageDetailComponent} from "./packages/package-detail/package-detail.component";
import {ErrorComponent} from "./error/error.component";
import {CartComponent} from "./cart/cart.component";


const routes: Routes = [
  {
    path: '', component: PackageListComponent
  },
  {
    path: 'package', component: PackageListComponent
  },
  {
    path: 'package/:id', component: PackageDetailComponent
  },
  {
    path: 'cart', component: CartComponent
  },
  {
    path: '404', component: ErrorComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
