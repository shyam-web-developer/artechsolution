import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthService, CommonServices, LookupService } from '../../../_services';
import { ClassService } from './class.service';
import { successMessage } from '../../../shared/messages/messages';
import { lookupAttribute } from '../../../shared/lookup-attribute/lookup.attribute';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: []
})

export class ClassComponent {
  classForm: FormGroup;
  lookup: any;
  loading = false;
  submitted = false;
  public rowData: any;
  public rowSelection: any;
  public gridApi: any;
  sectionOptions: any;
  selectedItems : any;
  dropdownSettings = {};
  public isReadonly = false;
  @ViewChild("class", {static: true}) firstField: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private classService: ClassService, private authService: AuthService, private commonServices: CommonServices, private lookupService: LookupService) {
    this.rowSelection = "single";
    this.isReadonly = this.authService.isReadonlyUser();
  }

  columnDefs = [
    { headerName: 'ClassName', field: 'className', width: 300 },
    { headerName: 'Class Code', field: 'classCode', width: 200 },
    { headerName: 'IsSection', field: 'isSection', width: 200 },
    { headerName: 'Section', field: 'sectionName', width: 200 },
    {
      headerName: 'Created Date', field: 'createdDate', width: 200, cellRenderer: (data: any) => {
        return this.commonServices.setDateFormat(data);
      }
    },
    { headerName: 'Active', field: 'isActive', width: 80 }
  ];

  ngOnInit() {
    this.classForm = this.formBuilder.group({
      classId: [0, Validators.required],
      className: [{ value: '', disabled: this.isReadonly }, [Validators.required, Validators.maxLength(50)]],
      classCode: [{ value: '', disabled: this.isReadonly }, [Validators.required, Validators.maxLength(20)]],
      isSection: [{ value: false, disabled: this.isReadonly }, [Validators.required, Validators.maxLength(50)]],
      sectionIds: [{ value: '', disabled: this.isReadonly }],
      isActive: [{ value: true, disabled: this.isReadonly }, [Validators.required, Validators.maxLength(50)]],
      createdBy: this.authService.loggedUserName()
    });
    this.firstField.nativeElement.focus();
    this.getSectionLookup();
    this.getClasses();
  }

  get f() { return this.classForm.controls; }

  getClasses() {
    this.classService.getClasses().subscribe(
      data => {
        this.rowData = data;
      },
      error => {
        this.alertService.showError(error);
      }
    );
  }

  getSectionLookup() {
    this.lookup = { lookupName: lookupAttribute.Section.lookupName };
    this.lookupService.getLookup(this.lookup).subscribe(
      data => {
        this.sectionOptions = data;
        this.dropdownSettings = {
          singleSelection: false,
          idField: 'itemKey',
          textField: 'itemValue',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          itemsShowLimit: 3,
          allowSearchFilter: false,
          disabled : this.isReadonly
        };
      }
    );
  };  

  onSubmit() {
    this.submitted = true;
    if (this.classForm.invalid || this.isReadonly) {
      return;
    }

    this.loading = true;
    var sectionId = '';
    var saveData = this.classForm.value ;
    for (var i = 0; i < saveData.sectionIds.length; i++) {
      if (!sectionId) {
        sectionId = saveData.sectionIds[i].itemKey;
      }
      else {
        sectionId = sectionId +','+ saveData.sectionIds[i].itemKey;
      }
    }
    saveData.sectionIds = sectionId;
    this.classService.saveClass(saveData)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.showSuccess(successMessage.Saved);
          this.getClasses();
          this.clearItem();
        },
        error => {
          this.alertService.showError(error);
          this.loading = false;
        });
  }

  clearItem() {
    this.loading = false;
    this.submitted = false;
    this.firstField.nativeElement.focus();
    this.classForm.patchValue({ classId: 0, className: '', classCode: '', isSection: false, sectionIds: '', isActive: true })
  }

  onSelectionChanged(event : any) {
    var selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows && selectedRows.length > 0) {
      let selectedRow = selectedRows[0];
      let ids = selectedRow.sectionIds.split(',');
      let selectedSectionIds = [];
      for (let i = 0; i < this.sectionOptions.length; i++) {
        for (let j = 0; j < ids.length ; j++) {
          if (this.sectionOptions[i].itemKey == ids[j]) {
            selectedSectionIds.push(this.sectionOptions[i]);
            break;
          }
        }
      }
      this.classForm.patchValue({ classId: selectedRow.classId, className: selectedRow.className, classCode: selectedRow.classCode, isSection: selectedRow.isSection, sectionIds: selectedSectionIds, isActive: selectedRow.isActive })
    }
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }
}
