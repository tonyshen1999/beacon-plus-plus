import { Component, OnInit } from '@angular/core';
import { AttributeConfigService } from './attribute-config.service';
import { NgForm } from '@angular/forms';
import {ModalDismissReasons,NgbModal} from '@ng-bootstrap/ng-bootstrap'


import {
  CellValueChangedEvent,
  ColDef,
  ValueGetterParams,
  ValueSetterParams,
  ICellEditorParams,
  SelectionChangedEvent,
  IRowNode,
  GridApi,
  CellEditorSelectorResult,
  GridReadyEvent, ITextFilterParams,INumberFilterParams,
  ModuleRegistry
} from 'ag-grid-community';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';


@Component({
  selector: 'app-attribute-config',
  templateUrl: './attribute-config.component.html',
  styleUrls: ['./attribute-config.component.scss']
})
export class AttributeConfigComponent implements OnInit {
  
  defaultAttributes:any
  selected: boolean = false;
  private gridApi!: GridApi;
  public rowData: any[]|null = null;
  closeResult:string;


  constructor(private attributeConfigurationService:AttributeConfigService,
    private modalService:NgbModal, ) { }
  
  ngOnInit(): void {
    this.getDefaultAttributes()
  }
  getDefaultAttributes(){

    this.attributeConfigurationService.getDefaultAttributes("Default").subscribe(data=>{

      console.log(data)
      this.defaultAttributes = data
      this.rowData = data
      this.gridApi.setRowData(data)
    });
  }


  public defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
    editable: true,
    filter: true,
    sortable:true,

  };

  public columnDefs: ColDef[] = [
    {
      field: 'attribute_name',

    },
    {
      field: 'attribute_value',
      // editable: true,
      // cellEditorSelector: this.cellEditorSelector,
      
    },
    {
      field: 'begin_date',
      
    },
    {
      field: 'end_date',
      
    },
    {
      field: 'entity_type',

      
    },

  ];
  // cellEditorSelector(
  //   params: ICellEditorParams
  // ): CellEditorSelectorResult | undefined {

  //   if (params.data.attribute_name === '163JCalc') {
  //     console.log("found 163j")
  //     return {
  //       component: 'agRichSelectCellEditor',
  //       params: {
  //         values: ['TRUE', 'FALSE'],
  //       },
  //       popup: true,
  //     };
  //   }

  //   return undefined;
  // }

  open(content) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
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

  pushAttributes(){
    let objData = [];

    for(let row of this.rowData){
      objData.push(row)
    }

    this.attributeConfigurationService.pushCustomAttributes(objData).subscribe(data=>{
      console.log(data)
    })
  }
  pushDefault(){
    this.attributeConfigurationService.pushDefaultAttributes().subscribe(data=>{
      console.log(data);
    })
    this.ngOnInit()
  }

  onSelectionChanged(event: SelectionChangedEvent) {
    const selectedData = this.gridApi.getSelectedRows();
    console.log(this.getSelectedRowData());
  }
  getSelectedRowData() {
    const selectedData = this.gridApi.getSelectedRows();

    console.log(selectedData)
    return selectedData;
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
  onCellValueChanged(event: CellValueChangedEvent) {
    console.log('Data after change is', event.data);
    console.log(this.rowData)

  }


}

