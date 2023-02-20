import { Component, OnInit } from "@angular/core";
import {HttpClient} from '@angular/common/http'
import { TablesService } from './tables.service';
import { PeriodService } from 'src/app/services/period.service';
import {ModalDismissReasons,NgbModal} from '@ng-bootstrap/ng-bootstrap'

import { TestAgGridComponent} from 'src/app/test-ag-grid/test-ag-grid.component'
import {
  CellValueChangedEvent,
  ColDef,
  ValueGetterParams,
  ValueSetterParams,
  SelectionChangedEvent,
  IRowNode,
  GridApi,
  GridReadyEvent, ITextFilterParams,INumberFilterParams
} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ImportService } from '../import/import.service';

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
  period_start:string = "";
  period_end:string = "";
  tableList:string[]=Array.from(this.tablesService.pathMap.keys());
  currentTableHeaders:string[] = [];
  disregardedCols = new Set<string>(["scenario","period","entity"])
  edited:boolean = false;
  disableSave:boolean = true;
  updatedRows:number = 0;
  saveComplete:boolean = false;
  disableDelete:boolean = false;

  constructor(
    private http:HttpClient, 
    private tablesService:TablesService, 
    private periodService:PeriodService, 
    private importService:ImportService,
    private modalService:NgbModal, 
    ) {}

  ngOnInit() {
    this.disableDelete = true;
    this.saveComplete = false;
    this.updatedRows = 0
    this.edited = false;
    this.pullTable("Thing Tables");
    this.currentTableName = "Thing Tables"
    this.disableSave = true;
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

          let period_string = period_list[0]["period"];
          this.period_start = period_list[0]["begin_date"]
          this.period_end = period_list[0]["end_date"]
          if (period_list.length>1){
            period_string = period_list[0]["period"] + " - " + period_list[period_list.length-1]["period"]
          }

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
        // keys.forEach(key => colDefs.push({field:key,filterParams:saleFilterParams}));

        for(let key of keys){
          if(!this.disregardedCols.has(key)){
            colDefs.push({field:key,filterParams:saleFilterParams})
          }
        }

        this.gridApi.setColumnDefs(colDefs)
        this.gridApi.setRowData(data)
        
      }
    );
  }

  private determineFilter(key){
    if (key == "amount" || key == "adj_amount"){
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
    this.disableSave = false;
    console.log(this.rowData)
    this.updatedRows++;
    this.saveComplete = false;
  }



  open(content) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
    );
    this.updatedRows = 0;
  }
  
	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
  }
  onRemoveSelected() {
    const selectedData = this.gridApi.getSelectedRows();
    const res = this.gridApi.applyTransaction({ remove: selectedData })!;
    this.disableSave = false;
    this.rowData = [];
    this.gridApi.forEachNode(node => this.rowData.push(node.data));
  
    
  }
  onSave(){
    
    let columnHash:Map <string,string> = new Map<string,string>([
      ["account_name","Account Name"],
      ["amount","Amount"],
      ["collection","Collection"],
      ["period_name","Period"],
      ["entity_name","Entity"],
      ["name","Thing"],
      ["entity_type","Type"],
      ["parent_name","Parent"],
      ["child_name","Child"],
      ["ownership_percentage","Ownership Percentage"],
      ["attribute_value","AttributeValue"],
      ["attribute_name","AttributeName"],
      ["begin_date","AttributeStartDate"],
      ["end_date","AttributeEndDate"],
      ["entity_name","Entity"],
    ])

    
    let modelName = this.currentTableName.replace(" Tables","");

    let jsonObject = {}
    let objData = [];

    for(let row of this.rowData){
      let obj = {}
      columnHash.forEach((value: string, key: string) => {
        
        obj[value] = row[key]
      });
      objData.push(obj)
    }

    jsonObject[modelName] =objData
      
    console.log(jsonObject)
    this.importService.importTable(jsonObject).subscribe(data=>{
      console.log(data)
      this.saveComplete = true
    })

    this.disableSave = true;

  }
  public columnDefs: ColDef[] = getColumnDefs();

  onSelectionChanged(event: SelectionChangedEvent) {
    const selectedData = this.gridApi.getSelectedRows();
    console.log(this.getSelectedRowData());
  }
  getSelectedRowData() {
    const selectedData = this.gridApi.getSelectedRows();
    // alert(`Selected Data:\n${JSON.stringify(selectedData)}`);
    if (selectedData.length>0){
      this.disableDelete = false;
    }
    else{
      this.disableDelete = true;
    }
    console.log(selectedData)
    return selectedData;
  }



  createNewRowData() {
    const newData = {};

    let colDefs = this.gridApi.getColumnDefs()

    for (let c of colDefs){
      newData[c["colId"]] = ""
    }
    
    
      const newItems = [
        colDefs
      ];
      const res = this.gridApi.applyTransaction({
        add: newItems,
        addIndex: 0,
      })!;

    
  }
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
const parseNode = (node: IRowNode, index?: number) => {

  console.log(
    index + ' -> data: ' + node.data.name
  );

};

