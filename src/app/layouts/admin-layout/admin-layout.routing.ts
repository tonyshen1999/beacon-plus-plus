import { Routes } from "@angular/router";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { IconsComponent } from "../../pages/icons/icons.component";
import { MapComponent } from "../../pages/map/map.component";
import { NotificationsComponent } from "../../pages/notifications/notifications.component";
import { UserComponent } from "../../pages/user/user.component";
import { TablesComponent } from "../../pages/tables/tables.component";
import { TypographyComponent } from "../../pages/typography/typography.component";
import { ImportComponent } from 'src/app/pages/import/import.component';
import { MissingColumnsComponent } from 'src/app/pages/import/missing-columns/missing-columns.component';
import {TestAgGridComponent} from 'src/app/test-ag-grid/test-ag-grid.component'
import {PanZoomChartComponent} from 'src/app/pan-zoom-chart/pan-zoom-chart.component'
import { CalcComponent } from 'src/app/pages/calc/calc.component';
import { AttributeConfigComponent } from "../../pages/attribute-config/attribute-config.component";

// import { RtlComponent } from "../../pages/rtl/rtl.component";

export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "icons", component: IconsComponent },
  { path: "maps", component: MapComponent },
  { path: "notifications", component: NotificationsComponent },
  { path: "user", component: UserComponent },
  { path: "tables", component: TablesComponent },
  { path: "typography", component: TypographyComponent },
  { path: "import", component: ImportComponent },
  { path: "import", component: MissingColumnsComponent },
  { path: "ag", component: TestAgGridComponent },
  { path: "org-chart", component: PanZoomChartComponent },
  { path: "calc", component: CalcComponent },
  { path: "atr-congif", component: AttributeConfigComponent },

  // { path: "rtl", component: RtlComponent }
];
