import { Component, OnInit } from "@angular/core";
import {HttpClient} from '@angular/common/http'
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
import { CalcService } from './calc.service';
import {ModalDismissReasons,NgbModal} from '@ng-bootstrap/ng-bootstrap'


@Component({
  selector: 'app-calc',
  templateUrl: './calc.component.html',
  styleUrls: ['./calc.component.scss']
})
export class CalcComponent implements OnInit {
  private gridApi!: GridApi;
  period:string;
  constructor(private calcService:CalcService, private periodService:PeriodService,private modalService:NgbModal) { }
  public rowData: any[]|null = null;
  closeResult:string;
  calcComplete:boolean = false;
  calcLog:any;

  public defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
    editable: true,
    filter: true,
    sortable:true,

  };

  public columnDefs: ColDef[] = [
    {
      field: 'entity_name',
      headerCheckboxSelection: true,
      checkboxSelection: true,
      showDisabledCheckboxes: true,
    },
    {
      field: 'pd_name',
      
    },
    {
      field: 'action',
      
    },
  ];

  ngOnInit(): void {

    this.calcComplete = false;

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
      this.pullEntities()
  }

  open(calc) {
		this.modalService.open(calc, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
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
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
  onCellValueChanged(event: CellValueChangedEvent) {
    console.log('Data after change is', event.data);
  }
  calculate(){
    let obj = {
      "scn_id":Number(sessionStorage.getItem("scnID")),
      "scn_version":Number(sessionStorage.getItem("scnVersion")),
      "entities": this.rowData
    };
    this.calcLog = this.calcService.calculate(obj).subscribe(data=>{
      this.calcLog = data
      this.calcComplete = true
    });
  }
  pullEntities(){
    this.calcService.getCalcScript(this.period).subscribe(data=>{
      data = data["calc_script"]
      console.log(data)
      this.gridApi.setRowData(data)
      this.rowData = data

    });
    // this.calcService.getRelationships().subscribe(data=>{
    //   data = data["relationships"]
      
    //   let children = new Set<string>(); 
    //   let parent = new Set<string>(); 
    //   for(let d of data){
    //     children.add(d["child_name"])
    //     parent.add(d["parent_name"])
    //   }
    //   let children_array = Array.from(children);
    //   let parent_array = Array.from(parent)

    //   let all_entities = children_array.concat(parent_array)

    //   let rowData = []

    //   for(let e of all_entities){
    //     rowData.push({
    //       "entity_name":e,
    //       "pd_name":this.period
    //     })
    //   }
      
    //   // this.gridApi.setRowData(rowData)
    //   // this.rowData = rowData
    //   console.log(rowData)
    // });
  }
}
