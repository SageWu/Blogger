/**
 * @file 用户文章标签管理组件
 * @module app/user/back/article/tags/component
 */

import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { formControlStateClass } from '@app/share/component.utils';
import { Tag } from '@app/core/models/tag.model';
import { TagService } from '@app/core/services/tag.service';

@Component({
    templateUrl: "./tags.component.html",
    styleUrls: ["./tags.component.scss"]
})
export class TagsComponent {
    controlStateClass = formControlStateClass;

    public edit_form: FormGroup;    //编辑表单
    public active_tag: Tag; //选中的tag
    public search_form: FormGroup;  //搜索表单

    constructor(
        private fb: FormBuilder,
        private tagService: TagService
    ) {
        this.edit_form = this.fb.group({
            name: ["",  Validators.compose([Validators.required])],
            description: [""]
        });

        this.search_form = this.fb.group({
            keyword: ["", Validators.compose([Validators.required])]
        });
    }

    //处理提交的表单
    public handleSubmitTag(tag: Tag): void {
        if(this.edit_form.valid) {
            this.active_tag? this.modifyTag(tag): this.createTag(tag);
        }
    }

    //重置编辑表单
    public resetEditForm(): void {
        this.edit_form.reset();
        this.active_tag = null;
    }

    //重置搜索表单
    public resetSearchForm(): void {
        this.search_form.reset();
    }

    //获取标签
    public getTags(): void {

    }

    //刷新标签
    public refreshTags(): void {

    }

    //修改标签
    public modifyTag(tag: Tag): void {
        tag = Object.assign({}, this.active_tag, tag);  //覆盖修改

        this.tagService.modify(tag).subscribe(
            (tag: Tag) => {
                this.refreshTags();
                this.resetEditForm();
                this.active_tag = null;
            }
        );
    }

    //创建标签
    public createTag(tag: Tag): void {
        this.tagService.create(tag).subscribe(
            (tag: Tag) => {
                if(tag) {
                    this.getTags();
                    this.resetEditForm();
                    this.resetSearchForm();
                }
            }
        );
    }
}