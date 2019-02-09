import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FileElement } from '../file-explorer/model/element';
import { Observable } from 'rxjs/Observable';
import { FileService } from '../file-explorer/file.service';
import { LoaderService } from '../services/loader.service';
import { AlertService } from '../alert/alert.service';

@Component({
    selector: 'file',
    templateUrl: './file.component.html',
    styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit {
    public fileElements: Observable<FileElement[]>;

    constructor(
        public fileService: FileService,
        private loaderService: LoaderService,
        private alertService: AlertService,
        private ref: ChangeDetectorRef
    ) {}

    currentRoot: FileElement;
    currentPath: string;
    canNavigateUp = false;

    ngOnInit() {
        this.nullData();
        this.getFiles();
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

    addFolder(folder: { name: string }) {
        this.fileService.add({ isFolder: true, name: folder.name, parent: this.currentRoot ? this.currentRoot.id : 'root' });
        this.updateFileElementQuery();
    }
  
    addFile(file: { name: string }) {
        this.fileService.add({ isFolder: false, name: file.name, parent: this.currentRoot ? this.currentRoot.id : 'root' });
        this.updateFileElementQuery();
    }  

    removeElement(element: FileElement) {
        this.fileService.delete(element.id);
        this.updateFileElementQuery();
    }

    navigateToFolder(element: FileElement) {
        this.currentRoot = element;
        this.updateFileElementQuery();
        this.currentPath = this.pushToPath(this.currentPath, element.name);
        this.canNavigateUp = true;
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
    }

    moveElement(event: { element: FileElement; moveTo: FileElement }) {
        this.fileService.update(event.element.id, { parent: event.moveTo.id });
        this.updateFileElementQuery();
    }

    renameElement(element: FileElement) {
        this.fileService.update(element.id, { name: element.name });
        this.updateFileElementQuery();
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

