import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs';
import { PostService } from './post.service';
import { AlertService } from '../alert/alert.service';
import { LoaderService } from '../services/loader.service';
import { ErrorService } from '../services/error.service';
import { Post } from './model/post';

@Component({
    selector: 'post-create',
    templateUrl: './post-create.component.html'    
})

export class PostCreateComponent implements OnInit {

    private post: Post;
    private title: string = null;
    private body: string = null;
    private returnUrl: string;

    validation: any = {
        title: <string> '',
        body: <string> '',
        titleMsg: <string> '',
        bodyMsg: <string> ''
    };

    constructor(
        private postService: PostService,
        private alertService: AlertService,
        private loaderService: LoaderService,
        private errorService: ErrorService,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private ref: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.post = new Post(this.title, this.body);
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/posts';        
    }

    goBack(): void {
        this.location.back();
    }

    createPost(title: string, body: string) {         
        this.loaderService.displayLoader(true);
        this.errorService.nullErrors(this.validation);
        this.postService.createPost(title, body).subscribe(
            data => {
                this.errorService.nullErrors(this.validation);
                this.loaderService.displayLoader(false);
                this.alertService.success(data, true);
                this.router.navigate([this.returnUrl]);
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

