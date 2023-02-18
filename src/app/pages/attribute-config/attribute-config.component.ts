import { Component, OnInit } from '@angular/core';
import { AttributeConfigService } from './attribute-config.service';

@Component({
  selector: 'app-attribute-config',
  templateUrl: './attribute-config.component.html',
  styleUrls: ['./attribute-config.component.scss']
})
export class AttributeConfigComponent implements OnInit {
  
  defaultAttributes:any
  selected: boolean = false;

  constructor(private attributeConfigurationService:AttributeConfigService) { }
  
  ngOnInit(): void {
    this.getDefaultAttributes()
  }
  getDefaultAttributes(){

    this.attributeConfigurationService.getDefaultAttributes("Default").subscribe(data=>{

      console.log(data)
      this.defaultAttributes = data
    });
  }


}
