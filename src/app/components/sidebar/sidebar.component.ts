import { Component, OnInit } from "@angular/core";

declare interface RouteInfo {
  path: string;
  title: string;
  rtlTitle: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  {
    path: "/dashboard/:id",
    title: "Scenario Dashboard",
    rtlTitle: "لوحة القيادة",
    icon: "icon-chart-pie-36",
    class: ""
  },
  {
    path: "/tables",
    title: "Tables View",
    rtlTitle: "الرموز",
    icon: "icon-single-copy-04",
    class: ""
  },
  {
    path: "/calc",
    title: "Calculate",
    rtlTitle: "ملف تعريفي للمستخدم",
    icon: "icon-triangle-right-17",
    class: ""
  },
  {
    path: "/org-chart",
    title: "Org Chart View",
    rtlTitle: "خرائط",
    icon: "icon-vector",
    class: "" },
  {
    path: "/import",
    title: "File Import",
    rtlTitle: "إخطارات",
    icon: "icon-upload",
    class: ""
  },
  {
    path: "/atr-congif",
    title: "Attribute Configuration",
    rtlTitle: "إخطارات",
    icon: "icon-settings",
    class: ""
  },
  {
    path: "/user",
    title: "Reports",
    rtlTitle: "ملف تعريفي للمستخدم",
    icon: "icon-chart-bar-32",
    class: ""
  },

  

];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() {}

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  }
}
