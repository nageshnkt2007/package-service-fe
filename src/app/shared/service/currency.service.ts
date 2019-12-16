import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  currentCurrency: string = 'USD';
  isCurrencyModified: Subject<string> = new Subject<string>();
  currencyRateMap: {};
  isCurrencyMapChanged: Subject<{}> = new Subject<{}>();
  currencyFactor: number = 1;
  isCurrencyFactorChanged: Subject<number> = new Subject<number>();

  constructor(private http: HttpClient) {
    this.isCurrencyModified.subscribe(value => {
      this.currentCurrency = value;
    });
    this.isCurrencyMapChanged.subscribe(value => {
      this.currencyRateMap = value;
    });
    this.isCurrencyFactorChanged.subscribe(value => {
      this.currencyFactor = value;
    })
  }

  public getAllCurrencyData() {
    this.http.get("http://localhost:8888/currency/rates").subscribe(data => {
      this.isCurrencyMapChanged.next(data['rates']);
    });
  }

  public setCurrentCurrency(value: string) {
    this.isCurrencyModified.next(value);
  }

  public getFactorForCurrency(currency: string) {
    let newFactor = this.currencyRateMap[currency];
    let oldFactor = this.currencyRateMap[this.currentCurrency];
    return newFactor / oldFactor;
  }

  public getFactorOfCurrency(currency: string) {
    return this.currencyRateMap[currency];
  }
}
