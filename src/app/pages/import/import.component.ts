import { Component, OnInit } from '@angular/core';
import { read, readFile, writeFileXLSX } from "xlsx";
import { HttpClient } from '@angular/common/http'
import { ImportService } from './import.service';
import {ModalDismissReasons,NgbModal} from '@ng-bootstrap/ng-bootstrap'


@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {
  sheetHash: Map<string, []> = new Map<string, []>();
  // sheetNames:string[] = ["None"];
  sheetCount: Map<string, number> = new Map<string, number>();
  sheetInfo: Map<string, SheetInfo> = new Map<string, SheetInfo>();
  disableButton: boolean = true;
  showTable: boolean = false;
  validColumns: boolean = true;
  logData: any;
  showLog: boolean = false;
  showSuccess:boolean = false;
  showMessage:boolean = false;
  showErrors:boolean = false;
  showImport:boolean = true;
  importComplete:boolean = false;
  closeResult:string;

  // NEED TO FIX ISSUE WITH NONE REQUIRED COLUMNS WITHIN EACH SHEET

  sheetHeaders: Map<string, string[]> = new Map([
    ['relationships', ['parent', 'child', 'ownershippercentage']],
    ['things', ['thing', 'type', 'country', 'isocurrencycode', 'period']],
    ['accounts', ['accountname', 'amount', 'isocurrencycode', 'period', 'collection', 'entity']],
    ['adjustments', ['accountname', 'adjustmenttype', 'adjustmentclass', 'adjustmentamount', 'isocurrencycode', 'adjustmentperiod', 'adjustmentpercentage', 'entity']],
    ['attributes', ['attributename', 'attributevalue', 'attributestartdate', 'entity', 'period']],
  ]);





  constructor(private importService: ImportService, private modalService:NgbModal,) { }

  DataFromEventEmitter(event) {

    this.sheetHash = event;
    this.validColumns = true;
    this.verifySheetInfo();

    if (Array.from(this.sheetHash.keys()).length > 0) {
      this.disableButton = !this.validColumns
      this.showTable = true;
    }

  }
  ngOnInit(): void {
    this.showSuccess = false;
    this.showErrors = false;
    this.showMessage = false;
    this.showLog = false;
    this.showImport = true;
    this.importComplete = false;
  }


  private verifySheetInfo() {

    let sheetNames: string[] = Array.from(this.sheetHash.keys());


    // for each sheet...
    for (let i = 0; i < sheetNames.length; i++) {
      let sInfo = new SheetInfo();

      if (this.sheetHash.get(sheetNames[i]) != null) {
        sInfo.rowCount = this.sheetHash.get(sheetNames[i]).length;
      }

      let sheet_json = this.sheetHash.get(sheetNames[i]);

      // check headers
      for (var key in sheet_json) { // this line only runs once lol
        let headers: string[] = Object.keys(sheet_json[key]);


        if (Array.from(this.sheetHeaders.keys()).includes(sheetNames[i].toLowerCase().replace(/\s/g, ""))) {
          let testheaders = JSON.parse(JSON.stringify(this.sheetHeaders.get(sheetNames[i].toLowerCase().replace(/\s/g, ""))));
          if (Array.from(testheaders.includes(sheetNames[i]))) {
            sInfo.included = true;
          }
          for (let header in headers) {

            let headerIndex = testheaders.indexOf(headers[header].toLowerCase().replace(/\s/g, ""));
            if (headerIndex >= 0) {
              testheaders.splice(headerIndex, 1);

            }
          }
          if (testheaders.length > 0) {
            this.validColumns = false;

          }

          sInfo.missingColumns = testheaders;
        }
        else {
          this.validColumns = false;

        }

        break;
      }

      this.sheetInfo.set(sheetNames[i], sInfo);
    }
  }
  open(loading) {
		this.modalService.open(loading, { ariaLabelledBy: 'modal-basic-title' }).result.then(
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


  submitClicked() {
    // console.log(this.sheetHash)
    this.logData = this.importService.postTables(this.sheetHash).subscribe(data => {

      this.logData = data
    });
    this.importComplete = true
    this.showTable = false
    this.disableButton = true
    this.showLog = true
    this.showImport = false
  }


}


export class SheetInfo {
  rowCount: number = 0;
  included: boolean = false;
  missingColumns: string[] = [];
  constructor() { }
}