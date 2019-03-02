/**
 * @file 用户发布文章组件
 * @module app/user/back/article/post/component
 */

import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { formControlStateClass } from '@app/share/component.utils';
import { Tag } from '@app/core/models/tag.model';
import { TagService } from '@app/core/services/tag.service';

import * as SimpleMDE from 'simplemde';

import * as md from 'markdown-it';
import * as mdSub from 'markdown-it-sub';
import * as mdSup from 'markdown-it-sup';
import * as mdHl from 'markdown-it-highlightjs';

@Component({
    templateUrl: "./post.component.html",
    styleUrls: ["./post.component.scss"]
})
export class PostComponent implements OnInit {
    public controlStateClass = formControlStateClass;

    public edit_form: FormGroup;
    public fetching = {
        tag: false
    };
    public tags: Tag[] = [];

    @ViewChild('simplemde') textarea: ElementRef;
    private sme;
    private renderer = md();

    constructor(
        private fb: FormBuilder,
        private tagService: TagService
    ) {
        this.edit_form = this.fb.group({
            title: ["", Validators.compose([Validators.required])],
            content: ["", Validators.compose([Validators.required])]
        });
    }

    ngOnInit() {
        this.getTags();

        this.renderer
            .use(mdSub)
            .use(mdSup)
            .use(mdHl);

        let config = {
            element: this.textarea.nativeElement,
            showIcons: ["code", "table", "horizontal-rule", "strikethrough", "heading-smaller"
                , "heading-bigger", "heading-1", "heading-2", "heading-3"],
            spellChecker: false,
            previewRender: () => {
                return this.renderer.render(this.sme.value());
            },
            autoDownloadFontAwesome:false //不自动下载font-awesome样式，在index中已经加入了
        };
        config = Object.assign({}, config);
        this.sme = new SimpleMDE(config);
    }

    public getTags(): void {
        this.fetching.tag = true;

        this.tagService.getAll().subscribe(
            (tags: Tag[]) => {
                this.tags = tags;

                this.fetching.tag = false;
            }
        );
    }
}