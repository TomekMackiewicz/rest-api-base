import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { PostService } from './post.service';
import { LoaderService } from '../services/loader.service';
import { AlertService } from '../alert/alert.service';

@Component({
    selector: 'post-list',
    templateUrl: './post-list.component.html'  
})

export class PostListComponent implements OnInit {
    
    private confirmDelete: string;
    private posts: Array<Object>;
    private query: FormControl = new FormControl();
    
    constructor(
        private postService: PostService,
        private loaderService: LoaderService,
        private alertService: AlertService,
        private ref: ChangeDetectorRef,
        private translate: TranslateService
    ) {
        translate.stream('crud.delete_confirm').subscribe(
            (text: string) => { this.confirmDelete = text }
        );               
    }

    ngOnInit() {
        this.getPosts();
        this.query.valueChanges.debounceTime(200).distinctUntilChanged().subscribe(
            query => this.postService.searchPosts(query).subscribe(
                (data: Object[]) => {
                    this.posts = data;
                    this.ref.markForCheck();
                }
            )
        );     
    }

    getPosts() {
        this.loaderService.displayLoader(true);
        this.postService.getPosts().subscribe(
            (data: Object[]) => {
                this.posts = data;
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

    deletePost(post: any) {  
        if (confirm(this.confirmDelete + ' ' + post.title + "?")) {    
            this.loaderService.displayLoader(true);
            this.postService.deletePost(post).subscribe(
                (data: string) => {
                    this.getPosts();
                    this.loaderService.displayLoader(false);
                    this.ref.markForCheck();
                    this.alertService.success(data, true);
                },
                error => {
                    this.loaderService.displayLoader(false);
                    this.ref.markForCheck();                    
                    this.alertService.error(error.error.message); // @fixme (translate)
                    return Observable.throw(error);
                }
            );
        }
    }
}
