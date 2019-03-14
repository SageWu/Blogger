import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';

import { ArticleService } from '@app/core/services/article.service';
import { Article } from '@app/core/models/article.model';

@Component({
    templateUrl: "./article.component.html",
    styleUrls: ["./article.component.scss"]
})
export class ArticleComponent implements OnInit {
    private id: string;
    public article: Article;

    constructor(
        private route: ActivatedRoute,
        private articleService: ArticleService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params["id"];
        this.articleService.getOne(this.id).subscribe(
            (article: Article) => {
                this.article = article;
                console.log(this.article)
            }
        );
    }
}