import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { 
    MatToolbarModule, 
    MatInputModule, 
    MatMenuModule, 
    MatIconModule, 
    MatGridListModule, 
    MatCardModule, 
    MatButtonModule, 
    MatDialogModule, 
    MatListModule, 
    MatProgressBarModule 
} from '@angular/material';
import { NewFolderDialogComponent } from './modals/newFolderDialog/newFolderDialog.component';
import { NewFileDialogComponent } from './modals/newFileDialog/newFileDialog.component';
import { FormsModule } from '@angular/forms';
import { RenameDialogComponent } from './modals/renameDialog/renameDialog.component';
import { FileExplorerComponent } from './file-explorer.component';
import { UploadComponent } from '../file/upload.component';
import { DialogComponent } from '../file/dialog.component';
import { UploadService } from '../file/upload.service';

@NgModule({
    imports: [
        CommonModule,
        MatToolbarModule,
        FlexLayoutModule,
        MatIconModule,
        MatGridListModule,
        MatMenuModule,
        BrowserAnimationsModule,
        MatDialogModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatCardModule, 
        MatListModule, 
        MatProgressBarModule       
    ],
    declarations: [
        FileExplorerComponent, 
        NewFolderDialogComponent, 
        NewFileDialogComponent, 
        RenameDialogComponent,
        UploadComponent,
        DialogComponent
    ],
    exports: [FileExplorerComponent],
    providers: [UploadService],
    entryComponents: [
        NewFolderDialogComponent, 
        NewFileDialogComponent, 
        RenameDialogComponent,
        DialogComponent
    ]
})
export class FileExplorerModule {}
