import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Rx';
import { PostService } from './post.service';
import { AlertService } from '../alert/alert.service';
import { LoaderService } from '../services/loader.service';
import { ErrorService } from '../services/error.service';
import { Post } from './model/post';

@Component({
    selector: 'post-edit',
    templateUrl: './post-edit.component.html'    
})

export class PostEditComponent implements OnInit {

    private post: Post;

    validation: any = {
        title: <string> '',
        body: <string> '',
        titleMsg: <string> '',
        bodyMsg: <string> ''
    };

    constructor(
        private postService: PostService,
        private route: ActivatedRoute,
        private location: Location,
        private alertService: AlertService,
        private loaderService: LoaderService,
        private errorService: ErrorService,
        private ref: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.loaderService.displayLoader(true);
        this.route.params
            .switchMap((params: Params) => this.postService.getPost(+params['id']))
            .subscribe(
                (data: Post) => { 
                    this.loaderService.displayLoader(false);
                    this.post = data; 
                    this.ref.detectChanges();
                },
                error => { 
                    this.loaderService.displayLoader(false);
                    this.alertService.error(error.error.message);
                    this.ref.detectChanges();
                    return Observable.throw(error);
                }                
            );
    }

    goBack(): void {
        this.location.back();
    }

    updatePost() {
        this.loaderService.displayLoader(true);
        this.errorService.nullErrors(this.validation);
        this.postService.updatePost(this.post).subscribe(
            (data: string) => {
                this.errorService.nullErrors(this.validation);
                this.loaderService.displayLoader(false);
                this.alertService.success(data, true);
                this.ref.markForCheck();
            },
            errors => {
                this.errorService.handleErrors(this.validation, errors.error);
                this.loaderService.displayLoader(false);
                this.ref.markForCheck();
                
                return Observable.throw(errors);
            }
        );
    }

}
