import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpRequest,
  HttpEventType,
  HttpResponse
} from "@angular/common/http";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from 'rxjs';

const url = "http://localhost:8000/api/files";

@Injectable()
export class UploadService {
    constructor(private http: HttpClient) {}

    private pathSource = new BehaviorSubject('root');
    currentPath = this.pathSource.asObservable();
    uploadDestination: string;

    changePath(path: string) {
        this.pathSource.next(path);
    }

    public upload(
        files: Set<File>
    ): { [key: string]: { progress: Observable<number> } } {
        this.pathSource.subscribe(currentPath => this.uploadDestination = currentPath);
        const status: { [key: string]: { progress: Observable<number> } } = {};

        files.forEach(file => {
            const formData: FormData = new FormData();
            formData.append("file", file, file.name);
            formData.append('data', this.uploadDestination);

            const req = new HttpRequest(
                "POST", url, formData, {
                    reportProgress: true,
                    responseType: 'blob'
                }
            );

            // create a new progress-subject for every file
            const progress = new Subject<number>();

            // send the http-request and subscribe for progress-updates

            let startTime = new Date().getTime();
            this.http.request(req).subscribe(event => {
                if (event.type === HttpEventType.UploadProgress) {
                    // calculate the progress percentage
                    const percentDone = Math.round((100 * event.loaded) / event.total);
                    // pass the percentage into the progress-stream
                    progress.next(percentDone);
                } else if (event instanceof HttpResponse) {
                    // Close the progress-stream if we get an answer form the API
                    // The upload is complete
                    progress.complete();
                }
            });

            // Save every progress-observable in a map of all observables
            status[file.name] = {
                progress: progress.asObservable()
            };
        });

        // return the map of progress.observables
        return status;
    }
}
