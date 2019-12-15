import { Injectable } from '@angular/core';
import {Package} from "../package.model";
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  packageFromDB:Package[];
  currentPackage:Package;
  public isCurrentPackageModified:Subject<Package> = new Subject<Package>();
  public isPackageFromDBModified:Subject<Package[]>= new Subject<Package[]>();

  constructor(private http: HttpClient) {
    this.isPackageFromDBModified.subscribe(value => {
      this.packageFromDB = value;
    });
    this.isCurrentPackageModified.subscribe(value => {
      this.currentPackage = value;
    });
  }

  public getAllPackages(currency:string) {
    if(!currency){
      currency = 'USD';
    }
    console.log('fetching currency data from backend service');
    this.http.get("http://localhost:8888/package/all?currency="+currency).subscribe(data => {
      console.log(data);
      // @ts-ignore
      this.isPackageFromDBModified.next(data);
    });
  }

  public getPackage(id:number,currency:string) {
    console.log('fetching currency data from backend service');
    console.log('fetching package details from DB for currency = ',currency)
    if(!currency){
      currency = 'USD';
    }
    this.http.get("http://localhost:8888/package/"+id+'?currency='+currency).subscribe(data => {
      console.log(data);
      // @ts-ignore
      this.isCurrentPackageModified.next(data);
    });
  }
}
