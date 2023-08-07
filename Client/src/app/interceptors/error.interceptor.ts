import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NavigationExtras, Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router : Router, private toastr : ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error : HttpErrorResponse) => {
        if (error) {
          switch(error.status)
          {
            case 400 :
              if (error.error.errors) {
                const modelStateErrors = [];
                for (const key in error.error.errors) {
                  if (error.error.errors[key]) {
                    modelStateErrors.push(error.error.errors[key]);
                  }
                }
                for (let index = 0; index < modelStateErrors.length; index++) {
                  const element = modelStateErrors[index];
                  this.toastr.error(element)
                }
              } else if (Array.isArray(error.error)) {
                for (let index = 0; index < error.error.length; index++) {
                  const element = error.error[index];
                  this.toastr.error(element.description);
                }
              }
                else {
                this.toastr.error(error.error, error.status.toString());
              }
              break;
              case 401 :
                this.toastr.error(error.error, error.status.toString());
                break;
              case 404 :
                this.toastr.error(error.error, error.status.toString());
                this.router.navigateByUrl("/members");
                break;
              case 500 :
                const navigationExtras : NavigationExtras = {state : {error : error.error}};
                this.router.navigateByUrl("/server-error", navigationExtras);
                break;
              default :
                this.toastr.error("Something Unexpected went wrong");
                console.log(error);
                break;
          }
        }
        throw error;
      })
    );
  }
}