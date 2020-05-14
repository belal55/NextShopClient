import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpClient } from '@angular/common/http';
import { Observable, throwError, Subject, BehaviorSubject, Subscription } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class ErrorInterceptor implements HttpInterceptor {

    private static accessTokenError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private httpClient: HttpClient) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {

            if (err.status === 401 && localStorage.getItem('rtoken') && !request.url.includes("/refresh")) {

                if (!ErrorInterceptor.accessTokenError$.getValue()) {

                    ErrorInterceptor.accessTokenError$.next(true);

                    const body = {
                        refresh: localStorage.getItem('rtoken')
                    };

                    const url = environment.apiURL + '/token/refresh/';

                    // Call API and get a New Access Token
                    return this.httpClient.post(url, body).pipe(
                        switchMap((event: any) => {
                            // Save new Tokens
                            localStorage.setItem('token', event.access);
                            localStorage.setItem('rtoken', event.refresh);

                            ErrorInterceptor.accessTokenError$.next(false);
                            // Clone the request with new Access Token
                            const newRequest = request.clone({
                                setHeaders: {
                                    Authorization: `Bearer ${localStorage.getItem('token')}`
                                }
                            });
                            return next.handle(newRequest);
                        }),
                        catchError(er => {
                            localStorage.clear();
                            location.reload(true);
                            return throwError(er);
                        })
                    );
                } else {

                    // If it's not the firt error, it has to wait until get the access/refresh token
                    return this.waitNewTokens().pipe(
                        switchMap((event: any) => {
                            // Clone the request with new Access Token
                            const newRequest = request.clone({
                                setHeaders: {
                                    Authorization: `Bearer ${localStorage.getItem('token')}`
                                }
                            });
                            return next.handle(newRequest);
                        })
                    );
                }
            } else{
                // Logout if 403 response - Refresh Token invalid
				localStorage.clear();
				return throwError(err);
            }

            // You can return the Object "err" if you want to.
            const error = err;

            return throwError(error);
        }));
    }

    // Wait until get the new access/refresh token
    private waitNewTokens(): Observable<any> {
        const subject = new Subject<any>();
        const waitToken$: Subscription = ErrorInterceptor.accessTokenError$.subscribe((error: boolean) => {
            if(!error) {
                subject.next();
                waitToken$.unsubscribe();
            }
        });
        return subject.asObservable();
    }

}