import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { HttpInterceptor, HttpHandler, HttpEvent, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DateTimeFormatter, ZonedDateTime, TemporalAccessor, TemporalQuery } from '@js-joda/core'; 
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@Injectable()
export class ZonedDateTimeInterceptor implements HttpInterceptor {


  static readonly UTC_ZONE_ID = ZonedDateTime.now().offset().id();

  static readonly DATE_TIME_FORMAT = DateTimeFormatter.ISO_ZONED_DATE_TIME;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const reqWithZonedDateTime = this.serialize(req);
    return next.handle(reqWithZonedDateTime).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const body = this.deserialize(event.body);
          return event.clone({ body });
        } else {
          return event;
        }
      })
    );
  }


  private serialize(req: HttpRequest<any>): HttpRequest<any> {
    if (req.body && req.body.date instanceof ZonedDateTime) {
      const body = { ...req.body, date: req.body.date.format(ZonedDateTimeInterceptor.DATE_TIME_FORMAT) };
      return req.clone({ body });
    } else {
      return req;
    }
  }
  private deserialize(body: any): any {
    if (body && body.date) {
      const zonedDateTime = ZonedDateTime.parse(body.date, ZonedDateTimeInterceptor.DATE_TIME_FORMAT);
      const date = zonedDateTime.toLocalDate();
      return { ...body, date };
    } else {
      return body;
    }
  }
  
}

export const ZonedDateTimeInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: ZonedDateTimeInterceptor, multi: true }
];