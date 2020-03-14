import { Component } from "@angular/core";
import {ICellRendererAngularComp} from "ag-grid-angular";

@Component({
    selector: 'edit-button',
    template: `<div *ngIf="false"><button (click)="invokeEditMethod()" class="btn btn-primary btn-xs"><span class="glyphicon glyphicon-edit"></span>Edit</button>
               <button (click)="invokeDeleteMethod()" class="btn btn-danger btn-xs invokeDelete"><span class="glyphicon glyphicon-remove"></span>Delete</button></div>`,
    styles: ['.invokeDelete { margin-left: 20px}']
})

export class EditDeleteButtonComponent implements ICellRendererAngularComp {
    public params: any;
    refresh(params: any): boolean {
        throw new Error("Method not implemented.");
    }   

    agInit(params: any): void {
        this.params = params;
    }
    public invokeDeleteMethod() {
        var selectedData = this.params.api.getSelectedRows();
        this.params.api.updateRowsData({ remove: selectedData });
        alert("hi");
    }
    public invokeEditMethod() {
        this.params.api.setFocusedCell(this.params.node.rowIndex, 'courtname');
        this.params.api.startEditingCell({
            rowIndex: this.params.node.rowIndex,
            colKey: 'courtname',
        });
    }
}