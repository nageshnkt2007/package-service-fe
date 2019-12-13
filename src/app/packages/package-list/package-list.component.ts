import {Component, OnInit, ViewChild} from '@angular/core';
import {Package} from "../../shared/package.model";
import {Product} from "../../shared/product.model";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-package-list',
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.css']
})
export class PackageListComponent implements OnInit {
  const ELEMENT_DATA:Package = [
    new Package(1,"Premium","This is a dummy package for testing",1200,[new Product(5,"product1","ahdvsa412X#",499)]),
  new Package(5,"Eco Package","Another for testing",3399,[new Product(5,"product1","ahdvsa412X#",499)]),
  new Package(6,"Generak Package","Another for testing",999,[new Product(5,"product1","ahdvsa412X#",499)]),
  new Package(7,"Incedible Package","Another for testing",899,[new Product(5,"product1","ahdvsa412X#",499)])
];

  constructor() { }

  dataSource: Package[] = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['name', 'totalPrice'];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  applyFilter(filterValue: string) {
    console.log(filterValue);
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

}
