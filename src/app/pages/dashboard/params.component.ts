import {Component} from "@angular/core";

import {ICellRendererAngularComp} from "ag-grid-angular";

@Component({   
    template: `<a routerLink="/users/user-profile/{{params.value}}"> <i class="fa fa-pencil-square-o" ></i> </a>`
})
export class ParamsComponent implements ICellRendererAngularComp {
    public params: any;

    agInit(params: any): void {
        this.params = params;
    }

    refresh(): boolean {
        return false;
    }
}