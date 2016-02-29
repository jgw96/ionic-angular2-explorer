import {Page, Alert, Modal, ViewController, NavController} from 'ionic-framework/ionic';
import {Http, Headers} from 'angular2/http';
import 'rxjs/add/operator/map';



@Page({
    templateUrl: 'build/pages/page1/page1.html',
})
export class Page1 {
    http: any;
    nav: any;
    codes: Object[];
    public loading: boolean;
    public name: string;
    public homepage: string;
    public stars: number;

    constructor(http: Http, nav: NavController) {
        this.http = http;
        this.nav = nav;

        this.loading = true;

        this.http.get("https://api.github.com/repos/angular/angular")
            .map(res => res.json())
            .subscribe(data => {
                console.log(data);
                this.name = data.full_name;
                this.homepage = data.homepage;
                this.stars = data.stargazers_count;
            })

        let headers = new Headers();
        headers.append("Accept", "application/vnd.github.v3.text-match+json");

        this.http.get("https://api.github.com/search/code?q=component+in:file+language:ts+repo:angular/angular", { headers })
            .map(res => res.json())
            .subscribe(data => {
                this.loading = false;
                this.codes = data.items;
            })
    }

    search(term: string) {
        let prompt = Alert.create({
            title: 'Search',
            body: "Enter a search term please!",
            inputs: [
                {
                    name: 'term',
                    placeholder: 'Search Term'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Search',
                    handler: data => {

                        this.loading = true;

                        let headers = new Headers();
                        headers.append("Accept", "application/vnd.github.v3.text-match+json");

                        let term = data.term;
                        this.http.get(`https://api.github.com/search/code?q=${term}+in:file+language:ts+repo:angular/angular`, { headers })
                            .map(res => res.json())
                            .subscribe(data => {
                                console.log(data);
                                this.loading = false;
                                this.codes = data.items;
                            })
                    }
                }
            ]
        });
        this.nav.present(prompt);
    }

    seeCode(code) {
        console.log(code[0].fragment);
        let codeFragment = code[0].fragment;
        let modal = Modal.create(MyModal, codeFragment);
        this.nav.present(modal)
    }

    getContribs() {
        this.http.get("https://api.github.com/repos/angular/angular/stats/contributors")
            .map(res => res.json())
            .subscribe(data => {
                console.log(data);
                let modal = Modal.create(ContribsModal, data);
                this.nav.present(modal);
            })
    }

    showStars() {
        let modal = Modal.create(StarsModal);
        this.nav.present(modal);
    }

    share(url) {
        window.plugins.socialsharing.share(null, null, null, url)
    }

}

@Page({
    template: `
    <ion-navbar primary *navbar>
    <ion-title>Contributors</ion-title>
    <ion-buttons start>
    <button (click)="close()">
      <ion-icon name='close'></ion-icon>
    </button>
  </ion-buttons>
  </ion-navbar>
  <ion-content>
    <ion-list>
      <ion-item *ngFor="#contrib of contribs">
        <ion-avatar item-left>
            <img src={{contrib.author.avatar_url}}>
        </ion-avatar>
        <h2>{{contrib.author.login}}</h2>
        <a id="stars" href={{contrib.author.html_url}}>
          View on Github
        </a>
      </ion-item>
    </ion-list>
  </ion-content>`
})
class ContribsModal {
    public contribs: string;

    constructor(viewCtrl: ViewController) {
        this.viewCtrl = viewCtrl;
        console.log(this.viewCtrl.data);
        this.contribs = this.viewCtrl.data;
    }

    close() {
        this.viewCtrl.dismiss();
    }

}


@Page({
    template: `
    <ion-navbar primary *navbar>
    <ion-title>Code Snippet</ion-title>
    <ion-buttons start>
    <button (click)="close()">
      <ion-icon name='close'></ion-icon>
    </button>
  </ion-buttons>
  </ion-navbar>
  <ion-content padding>
    <code [textContent]="code"></code>
  </ion-content>`
})
class MyModal {
    public code: string;
    constructor(viewCtrl: ViewController) {
        this.viewCtrl = viewCtrl;
        this.code = this.viewCtrl.data;
    }

    close() {
        this.viewCtrl.dismiss();
    }
}


@Page({
    template: `
    <ion-navbar primary *navbar>
    <ion-title>Stars</ion-title>
    <ion-buttons start>
    <button (click)="close()">
      <ion-icon name='close'></ion-icon>
    </button>
  </ion-buttons>
  </ion-navbar>
  <ion-content>
    <ion-list>
      <ion-item *ngFor="#star of stars">
        <ion-avatar item-left>
                <img src={{star.avatar_url}}>
            </ion-avatar>
            <h2>{{star.login}}</h2>
            <h3>{{star.type}}</h3>
            <a id="userLink" href={{star.html_url}}>Visit on Github</a>
      </ion-item>
    </ion-list>
  </ion-content>`
})
class StarsModal {
    public stars: string;

    constructor(public viewCtrl: ViewController, public http: Http) {
        this.viewCtrl = viewCtrl;
        this.http.get("https://api.github.com/repos/angular/angular/stargazers")
            .map(res => res.json())
            .subscribe(data => {
                console.log(data);
                this.stars = data;
            })
    }

    close() {
        this.viewCtrl.dismiss(null);
    }

}