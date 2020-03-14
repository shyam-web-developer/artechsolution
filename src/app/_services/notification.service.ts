import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }

  showSuccess(message, title) {
    this.toastr.success(message, title)
  }

  showSuccessWithTimeout(message, title, timespan) {
    this.toastr.success(message, title, {
      timeOut: timespan
    })
  }

  showHTMLMessage(message, title) {
    this.toastr.success(message, title, {
      enableHtml: true
    })
  }

  showError(message, title) {
    this.toastr.error(message, title)
  }

  showErrorMsg(message) {
    this.toastr.error(this.getErrorMsg(message), 'Error')
  }

  showErrorWithTimeout(message, title, timespan) {
    this.toastr.error(message, title, {
      timeOut: timespan
    })
  }

  showHTMLErrorMessage(message, title) {
    this.toastr.error(message, title, {
      enableHtml: true
    })
  }

  getErrorMsg(message: any) {
    if (message) {
      if (message && message.error && message.error.errorMessage) {
        return message.error.errorMessage || '';
      }
      else {
        return message.error || '';
      }
    }
    else {
      return '';
    }
  }
}
