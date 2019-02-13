import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { UploadService } from './upload.service';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
    @ViewChild('file') file;

    public files: Set<File> = new Set();
    progress;
    canBeClosed = true;
    primaryButtonText = 'Upload';
    showCancelButton = true;
    uploading = false;
    uploadSuccessful = false;
    currentPath: string;

    constructor(
        public dialogRef: MatDialogRef<DialogComponent>, 
        public uploadService: UploadService
        ) {}

    ngOnInit() {
        this.uploadService.currentPath.subscribe(currentPath => this.currentPath = currentPath);     
    }

    onFilesAdded() {
        const files: { [key: string]: File } = this.file.nativeElement.files;
        for (let key in files) {
            if (!isNaN(parseInt(key))) {
                this.files.add(files[key]);
            }
        }
    }

    addFiles() {
        this.file.nativeElement.click();
    }

    closeDialog() {
        if (this.uploadSuccessful) {
            return this.dialogRef.close();
        }

        this.uploading = true;
        this.progress = this.uploadService.upload(this.files);

        for (const key in this.progress) {
            this.progress[key].progress.subscribe(val => console.log('val')); // ?
        }

        let allProgressObservables = [];
        for (let key in this.progress) {
            allProgressObservables.push(this.progress[key].progress);
        }

        this.primaryButtonText = 'Finish';
        this.canBeClosed = false;
        this.dialogRef.disableClose = true;
        this.showCancelButton = false;

        forkJoin(allProgressObservables).subscribe(end => {
            this.canBeClosed = true;
            this.dialogRef.disableClose = false;
            this.uploadSuccessful = true;
            this.uploading = false;
        });
    }
}
