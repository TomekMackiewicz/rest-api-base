import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FileElement } from '../file-explorer/model/element';
import { Observable } from 'rxjs';
import { FileService } from '../file-explorer/file.service';
import { LoaderService } from '../services/loader.service';
import { AlertService } from '../alert/alert.service';
import { UploadService } from './upload.service';

@Component({
    selector: 'file',
    templateUrl: './file.component.html',
    styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit {
    
    public fileElements: Observable<FileElement[]>;
    currentRoot: FileElement;
    currentPath: string;
    canNavigateUp = false;
    
    constructor(
        public fileService: FileService,
        private loaderService: LoaderService,
        private alertService: AlertService,
        private uploadService: UploadService,
        private ref: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.nullData();
        this.getFiles();
        //console.log(this.currentPath);
    }

    nullData() {
        this.fileService.clearData();         
    }

    getFiles() {
        this.loaderService.displayLoader(true);
        this.fileService.getFiles().subscribe(
            (data: any) => {
                for (let file of data) {
                    this.fileService.load(file);                   
                }
                this.updateFileElementQuery();
                this.loaderService.displayLoader(false);
                this.ref.detectChanges();
            },
            error => {
                this.alertService.error(error.error.message); // @fixme (translate)
                this.loaderService.displayLoader(false);
                this.ref.detectChanges();
                return Observable.throw(error);
            }
        );        
    }
    
    // TOTO get rid of this function? 
    addFolder(folder: { name: string }) {
        this.createFolder({ 
            isFolder: true, 
            name: folder.name, 
            parent: this.currentRoot ? this.currentRoot.id : 'root', 
            path: this.currentPath ? this.currentPath : ''
        });
    }
    
    // remove 
    addFile(file: { name: string }) {
        this.fileService.add({ isFolder: false, name: file.name, parent: this.currentRoot ? this.currentRoot.id : 'root', path: this.currentPath });
        this.updateFileElementQuery(); 
    }  

    createFolder(folder: FileElement) {         
        this.loaderService.displayLoader(true);
        this.fileService.createFolder(folder).subscribe(
            data => {
                this.fileService.add(folder);
                this.updateFileElementQuery();
                this.loaderService.displayLoader(false);
                this.ref.markForCheck();
            },
            errors => {
                this.alertService.error(errors.error, true);
                this.loaderService.displayLoader(false);
                this.ref.markForCheck();
                
                return Observable.throw(errors);
            }
        );
    }
    
    removeElement(element: FileElement) {
        this.loaderService.displayLoader(true);
        this.fileService.deleteElement(element).subscribe(
            data => {
                this.updateFileElementQuery();
                this.loaderService.displayLoader(false);
                this.ref.markForCheck();
            },
            errors => {
                this.alertService.error(errors.error, true);
                this.loaderService.displayLoader(false);
                this.ref.markForCheck();
                
                return Observable.throw(errors);
            }
        ); 
    }

    navigateToFolder(element: FileElement) {
        this.currentRoot = element;
        this.updateFileElementQuery();
        this.currentPath = this.pushToPath(this.currentPath, element.name);
        this.canNavigateUp = true;
        this.uploadService.changePath(this.currentPath);
    }

    navigateUp() {
        if (this.currentRoot && this.currentRoot.parent === 'root') {
            this.currentRoot = null;
            this.canNavigateUp = false;
            this.updateFileElementQuery();
        } else {
            this.currentRoot = this.fileService.get(this.currentRoot.parent);
            this.updateFileElementQuery();
        }
        this.currentPath = this.popFromPath(this.currentPath);
        this.uploadService.changePath(this.currentPath);
    }

    moveElement(event: { element: FileElement; moveTo: FileElement }) {
        this.fileService.update(event.element.id, { parent: event.moveTo.id }, event.moveTo).subscribe(
            data => {
                this.updateFileElementQuery();
                this.loaderService.displayLoader(false);
                this.ref.markForCheck();
            },
            errors => {
                this.alertService.error(errors.error, true);
                this.loaderService.displayLoader(false);
                this.ref.markForCheck();
                
                return Observable.throw(errors);
            }
        );
    }

    renameElement(element: FileElement) {
        this.fileService.update(element.id, { name: element.name }).subscribe(
            data => {
                this.updateFileElementQuery();
                this.loaderService.displayLoader(false);
                this.ref.markForCheck();
            },
            errors => {
                this.alertService.error(errors.error, true);
                this.loaderService.displayLoader(false);
                this.ref.markForCheck();
                
                return Observable.throw(errors);
            }
        );
        
    }

    updateFileElementQuery() {
        this.fileElements = this.fileService.queryInFolder(this.currentRoot ? this.currentRoot.id : 'root');
    }

    pushToPath(path: string, folderName: string) {
        let p = path ? path : '';
        p += `${folderName}/`;
        
        return p;
    }

    popFromPath(path: string) {
        let p = path ? path : '';
        let split = p.split('/');
        split.splice(split.length - 2, 1);
        p = split.join('/');
        return p;
    }
}

