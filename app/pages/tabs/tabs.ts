import {Page} from 'ionic-framework/ionic';
import {Page1} from '../page1/page1';
import {Page3} from '../page3/page3';

// https://angular.io/docs/ts/latest/api/core/Type-interface.html
import {Type} from 'angular2/core';


@Page({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: Type = Page1;
  tab3Root: Type = Page3;

  constructor() {

  }
}
