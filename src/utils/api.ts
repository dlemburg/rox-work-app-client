import { Injectable, ErrorHandler } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import * as GLOBAL from './global';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class Api {
    constructor(private http: Http) {

    }
    token;
    headers;
    options;
    auth;


    public call(route: string, verb: string, body: any = {}): Promise<any> {
        //this.auth =  this.authentication.getCurrentUser();
        //this.token = this.authentication.getToken();
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        //headers.append('Authorization', `Bearer ${this.token}`);
        headers.append('Access-Control-Allow-Origin', `*`);
        let options = new RequestOptions({ headers: headers });


        let isOnline = window.navigator.onLine;
        let url = GLOBAL.SERVER_URL_NODE + route;
        const httpVerb = verb.toLowerCase();

        if (httpVerb === "post") {
            return this.http[httpVerb](url, body, options)
                    .toPromise()
                    .then(response => response.json())
                    .catch(this.handleError);

        } else if (httpVerb === "get") {
            return this.http[httpVerb](url, options)
                    .toPromise()
                    .then(response => response.json())
                    .catch(this.handleError);
        }
    }


    // handles APP-WIDE errors
    private handleError(err: any) {
        console.log(" %c err (logger): "  + err, "color: red;");

        if (!GLOBAL.ENV.development) {
           // this.logError({type: "Javascript runtime error!", err})
        }
    }

    // app-wide and API errors get sent here

    /*
    public logError(args?): any {   
        let err = args.err;

        if ((args.err.status === 0 && args.type === "API") || args.type !== "API") {
            err = "ERR_CONNECTION_REFUSED";
    
            if (this.logErrorAttempts === 1 && args.type === "API") {
                this.logErrorAttempts = 0;
                return;
            }
            else this.logErrorAttempts++;

            const toData: ILogError = {
                err: err || null,
                url: args.url || null,
                httpVerb: args.httpVerb || null,
                date: DateUtils.toLocalIsoString(new Date().toString()),
                timezoneOffset: new Date().getTimezoneOffset() / 60,
                app: "Client-Admin",
                type: args.type || null,
                companyOid: this.authentication.isLoggedIn() ? this.auth.companyOid : null,
                userOid: this.authentication.isLoggedIn() ? this.auth.userOid : null
            }      

            console.log("logging error to node server");
            this.stack(ROUTES.logClientError, "POST", toData).subscribe((response) => {
                console.log("response: ", response);
                if (args.type === "API") return;
            }, (err) => {
                console.log("error sending client err to server");
            });
        }
    }
    */
}

/////*****************************  ROUTES  ******************************///////

// all API routes
// api/node/* goes to node SERVER_URL
// api/cs/* goes to c# server

// api | cs?node | {controller} | {action}      .............some routes have  :params OR ?queries on server-side
export const ROUTES = {
    saveSingleDayData: '/api/roxWorkApp/saveSingleDayData',
    getSingleDayData: '/api/roxWorkApp/getSingleDayData',
    getMonthData: '/api/roxWorkApp/getMonthData',
    getFilteredData: '/api/roxWorkApp/getFilteredData'
}