import { Injectable } from '@angular/core';
import { v4 } from 'uuid'; // TODO wtf?
import { FileElement } from '../file-explorer/model/element';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable()
export class FileService {
    private map = new Map<string, FileElement>();

    constructor(private http: HttpClient) {}

    clearData() {
        this.map.clear();
    }

    load(fileElement: FileElement) {
        this.map.set(fileElement.id, this.clone(fileElement));
        return fileElement;
    }

    add(fileElement: FileElement) {
        fileElement.id = v4();
        this.map.set(fileElement.id, this.clone(fileElement));

        return fileElement;
    }

    createFolder(fileElement: FileElement) {        
        return this.http.post('http://localhost:8000/api/files', { 
            fileElement: fileElement
        });
    }

    deleteElement(fileElement: FileElement) {
        let options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: fileElement
        };                               
        this.map.delete(fileElement.id);
        
        return this.http.delete('http://localhost:8000/api/file', options);
    }

    update(id: string, update: Partial<FileElement>) {
        let element = this.map.get(id);
        let oldName = element.name;
        element = Object.assign(element, update);
        this.map.set(element.id, element);
        
        let options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: { file: element, oldName: oldName }
        };
        
        return this.http.patch('http://localhost:8000/api/file', options);
               
    }

    private querySubject: BehaviorSubject<FileElement[]>;
    queryInFolder(folderId: string) {
        const result: FileElement[] = [];
        this.map.forEach(element => {
            if (element.parent === folderId) {
                result.push(this.clone(element));
            }
        });
        
        if (!this.querySubject) {
            this.querySubject = new BehaviorSubject(result);
        } else {
            this.querySubject.next(result);
        }
        
        return this.querySubject.asObservable();
    }

    get(id: string) {
        return this.map.get(id);
    }

    clone(element: FileElement) {
        return JSON.parse(JSON.stringify(element));
    }
  
    getFiles() {
        return this.http.get('http://localhost:8000/api/files');
    }  
}
