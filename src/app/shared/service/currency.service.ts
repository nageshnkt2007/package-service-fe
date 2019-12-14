import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Subject, Subscription} from "rxjs";

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
      console.log('currency loaded in map is ', value);
      this.currencyRateMap = value;
    });
    this.isCurrencyFactorChanged.subscribe(value => {
      this.currencyFactor = value;
    })
  }

  public getAllCurrencyData() {
    console.log('fetching currency data from backend service');
    this.http.get("http://localhost:8888/currency/rates").subscribe(data => {
      console.log(data['rates']);
      this.isCurrencyMapChanged.next(data['rates']);
      console.log(data);
      console.log(this.currencyRateMap);
    });
  }

  public setCurrentCurrency(value: string) {
    console.log('change current currency ', value);
    this.isCurrencyModified.next(value);
  }

  public setCurrencyFactor(value: number) {
    this.isCurrencyFactorChanged.next(value);
  }

  public getFactorForCurrency(currency: string) {
    console.log('comparing both currencies');
    let newFactor = this.currencyRateMap[currency];
    let oldFactor = this.currencyRateMap[this.currentCurrency];
    console.log('old factor is ='+oldFactor+'new factor is '+newFactor);
    return newFactor/oldFactor;
  }
}
