import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-newFileDialog',
    templateUrl: './newFileDialog.component.html',
    styleUrls: ['./newFileDialog.component.css']
})
export class NewFileDialogComponent implements OnInit {
    constructor(public dialogRef: MatDialogRef<NewFileDialogComponent>) {}

    fileName: string;

    ngOnInit() {}
}
