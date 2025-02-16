import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { ToastrModule } from 'ngx-toastr';
import { OrgchartModule } from '@dabeng/ng-orgchart';

import { AppComponent } from "./app.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

import { NgbModule, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";

import { AppRoutingModule } from "./app-routing.module";
import { ComponentsModule } from "./components/components.module";
import { ScenarioListComponent } from './layouts/scenario-list/scenario-list.component';
import { ImportComponent } from './pages/import/import.component';
import { ReadexcelDirective } from './directives/readexcel.directive';
import { MissingColumnsComponent } from './pages/import/missing-columns/missing-columns.component';
import { TestAgGridComponent } from './test-ag-grid/test-ag-grid.component';
import { AgGridModule } from 'ag-grid-angular';
import { PanZoomChartComponent } from './pan-zoom-chart/pan-zoom-chart.component';
import { CalcComponent } from './pages/calc/calc.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
    AgGridModule,
    OrgchartModule,
    ToastrModule.forRoot()
  ],
  declarations: [AppComponent, AdminLayoutComponent, AuthLayoutComponent, ScenarioListComponent, ImportComponent, ReadexcelDirective, MissingColumnsComponent, TestAgGridComponent, PanZoomChartComponent, CalcComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
