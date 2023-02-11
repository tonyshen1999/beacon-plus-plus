import { Component, OnInit } from "@angular/core";
import {HttpClient} from '@angular/common/http'
import { TablesService } from './tables.service';
import { PeriodService } from 'src/app/services/period.service';
import { TestAgGridComponent} from 'src/app/test-ag-grid/test-ag-grid.component'
import {
  CellValueChangedEvent,
  ColDef,
  ValueGetterParams,
  ValueSetterParams,
  GridApi,
  GridReadyEvent, ITextFilterParams,INumberFilterParams
} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: "app-tables",
  templateUrl: "tables.component.html"
})
export class TablesComponent implements OnInit {

  
  private gridApi!: GridApi;
  currentTable:any;
  currentTableName:string;
  period:string;
  tableRows:string[] = []
  obj:any;
  public rowData: any[]|null = null;
  closeResult:string;

  tableList:string[]=Array.from(this.tablesService.pathMap.keys());
  currentTableHeaders:string[] = [];
  

  constructor(private http:HttpClient, private tablesService:TablesService, private periodService:PeriodService) {}

  ngOnInit() {

    this.pullTable("Thing Tables");
    this.currentTableName = "Thing Tables"
    this.periodService.pullPeriod().subscribe(
      data =>{
        let period_list = [];
          // console.log(data)
          let periods = Array.from(Object.keys(data));

          // UPDATE THIS TO DISPLAY DATE RANGE AND MOVE TO SERVICE
          for (let p of periods){
            
            for(let name in data[p]){
              // console.log(data[p][name])
              period_list.push(data[p][name])
            }
            break;
          }
          // console.log("hi hi ")
          let period_string = period_list[0]["period"];
          if (period_list.length>1){
            period_string = period_list[0]["period"] + " - " + period_list[period_list.length-1]["period"]
          }

          // console.log(period_string)
          this.period= period_string
      });
  }



  pullTable(table){
    this.currentTableName = table
    this.tablesService.getTable(table).subscribe(
      data => {
        // console.log(table);
        let tableKey = this.tablesService.tableKeyMap.get(table);
        // console.log(tableKey);
       
        const colDefs = this.gridApi.getColumnDefs();
        colDefs.length = 0;
        
        data = data[tableKey];
        this.rowData = data;
        console.log(data)
        const keys = Object.keys(data[0]);
        keys.forEach(key => colDefs.push({field:key,filterParams:saleFilterParams}));

        this.gridApi.setColumnDefs(colDefs)
        this.gridApi.setRowData(data)
        
      }
    );
  }

  private determineFilter(key){
    if (key == "amount" || key == "adj_amount"){
      console.log("sldfkjaslkdfjalksdfjaslkdfj")
      return saleFilterParams;
    }
    else{
      return {} as ITextFilterParams
    }
  }
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


  onBtnExport() {
    this.gridApi.exportDataAsCsv();
  }

  onCellValueChanged(event: CellValueChangedEvent) {
    console.log('Data after change is', event.data);
  }

  public columnDefs: ColDef[] = getColumnDefs();



}
function getColumnDefs() {
  return [
    { field: 'athlete' },
    { field: 'age' },
    { field: 'country' },
    { field: 'sport' },
    { field: 'year' },
    { field: 'date' },
    { field: 'gold' },
    { field: 'silver' },
    { field: 'bronze' },
    { field: 'total' },
  ];
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
let saleFilterParams: INumberFilterParams = {
  allowedCharPattern: '\\d\\-\\,\\$',
  numberParser: (text: string | null) => {
    return text == null
      ? null
      : parseFloat(text.replace(',', '.').replace('$', ''));
  },
};