import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService } from '../../../_services';
import { SectionService } from '../section/section.service';
import { successMessage } from '../../../shared/messages/messages';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: []
})

export class SectionComponent {  
  secForm: FormGroup;
  loading = false;
  submitted = false;  
  @ViewChild("section", {static: true}) firstField: ElementRef;

  constructor(
    private formBuilder: FormBuilder,     
    private alertService: AlertService,
    private sectionService: SectionService) { }

  ngOnInit() {   
    this.secForm = this.formBuilder.group({           
      sectionId: [0, Validators.required],  
      section: ['', Validators.required],
      sectionCode: ['', Validators.required],      
      isActive : [true], 
    });   
    this.firstField.nativeElement.focus(); 
  }  

  get f() { return this.secForm.controls; }  

  onSubmit() {
    this.submitted = true;   
    if (this.secForm.invalid) {
      return;
    }

    this.loading = true;
    this.sectionService.saveSection(this.secForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.showSuccess(successMessage.Saved);
          this.loading = false;
          this.secForm.reset();
        },
        error => {
          this.alertService.showError(error);
          this.loading = false;
        });
  }
  
  clearItem() {
    this.secForm.reset();
    this.firstField.nativeElement.focus();
  } 
}
