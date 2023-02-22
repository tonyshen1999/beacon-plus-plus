import { Component, OnInit } from '@angular/core';
import { AttributeConfigService } from './attribute-config.service';

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

  constructor(private attributeConfigurationService:AttributeConfigService) { }
  
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

