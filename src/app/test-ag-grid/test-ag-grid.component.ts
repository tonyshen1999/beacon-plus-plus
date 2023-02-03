import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';
// import { fetchData } from "./api";
import {
  CellValueChangedEvent,
  ColDef,
  ValueGetterParams,
  ValueSetterParams,
  GridApi,
  GridReadyEvent, ITextFilterParams,
} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { getData } from './data';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-test-ag-grid',
  templateUrl: './test-ag-grid.component.html',
  styleUrls: ['./test-ag-grid.component.scss']
})
export class TestAgGridComponent implements OnInit {
  private gridApi!: GridApi;
  
  constructor(private http: HttpClient) {}

  

  public columnDefs: ColDef[] = [
    {

      headerName: 'Name',
      valueGetter: (params: ValueGetterParams) => {
        return params.data.firstName + ' ' + params.data.lastName;
      },
      valueSetter: (params: ValueSetterParams) => {
        var fullName = params.newValue;
        var nameSplit = fullName.split(' ');
        var newFirstName = nameSplit[0];
        var newLastName = nameSplit[1];
        var data = params.data;
        if (data.firstName !== newFirstName || data.lastName !== newLastName) {
          data.firstName = newFirstName;
          data.lastName = newLastName;
          // return true to tell grid that the value has changed, so it knows
          // to update the cell
          return true;
        } else {
          // return false, the grid doesn't need to update
          return false;
        }
      },
      field: 'Name',
      filterParams: nameFilterParams,
    },
    {
      headerName: 'A',
      field: 'a',
    },
    {
      headerName: 'B',
      valueGetter: (params: ValueGetterParams) => {
        return params.data.b;
      },
      valueSetter: (params: ValueSetterParams) => {
        var newValInt = parseInt(params.newValue);
        var valueChanged = params.data.b !== newValInt;
        if (valueChanged) {
          params.data.b = newValInt;
        }
        return valueChanged;
      },
    },
    {
      headerName: 'C.X',
      valueGetter: (params: ValueGetterParams) => {
        if (params.data.c) {
          return params.data.c.x;
        } else {
          return undefined;
        }
      },
      valueSetter: (params: ValueSetterParams) => {
        var newValInt = parseInt(params.newValue);
        if (!params.data.c) {
          params.data.c = {};
        }
        var valueChanged = params.data.c.x !== newValInt;
        if (valueChanged) {
          params.data.c.x = newValInt;
        }
        return valueChanged;
      },
    },
    {
      headerName: 'C.Y',
      valueGetter: (params: ValueGetterParams) => {
        if (params.data.c) {
          return params.data.c.y;
        } else {
          return undefined;
        }
      },
      valueSetter: (params: ValueSetterParams) => {
        var newValInt = parseInt(params.newValue);
        if (!params.data.c) {
          params.data.c = {};
        }
        var valueChanged = params.data.c.y !== newValInt;
        if (valueChanged) {
          params.data.c.y = newValInt;
        }
        return valueChanged;
      },
    },
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }



  public defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
    editable: true,
    filter: true,
    sortable:true,

  };
  public rowData: any[] | null = getData();
  onBtnExport() {
    this.gridApi.exportDataAsCsv();
  }
  onCellValueChanged(event: CellValueChangedEvent) {
    console.log('Data after change is', event.data);
  }

  ngOnInit() {
    // fetchData().then((data) => (this.gridOptions.rowData = data));
  }
}
var nameFilterParams: ITextFilterParams = {
  filterOptions: ['contains', 'notContains'],
  textFormatter: (r) => {
    if (r == null) return null;
    return r
      .toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/æ/g, 'ae')
      .replace(/ç/g, 'c')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/ñ/g, 'n')
      .replace(/[òóôõö]/g, 'o')
      .replace(/œ/g, 'oe')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ýÿ]/g, 'y');
  },
  debounceMs: 200,
  suppressAndOrCondition: true,
};
