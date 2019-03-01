/**
 * @file 用户文章标签管理组件
 * @module app/user/back/article/tags/component
 */

import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";

import { formControlStateClass } from '@app/share/component.utils';
import { Tag } from '@app/core/models/tag.model';
import { TagService } from '@app/core/services/tag.service';
import { HttpRequestOption } from '@app/interfaces/http.interface';
import { LogService } from '@app/core/services/log.service';

@Component({
    templateUrl: "./tags.component.html",
    styleUrls: ["./tags.component.scss"]
})
export class TagsComponent implements OnInit {
    controlStateClass = formControlStateClass;

    public edit_form: FormGroup;        //编辑表单
    public search_form: FormGroup;      //搜索表单

    public active_tag: Tag = null;      //选中的tag
    public selected_tags: string[] = [];//选中的tag的id
    public select_all: boolean = false; //是否全选
    public fetching: boolean = false;   //正在获取数据
    public tags: Tag[] = [];            //标签列表
    public total: number = 0;           //标签总数
    public option: HttpRequestOption;   //获取标签请求选项

    @ViewChild("deleteModal") delete_modal: TemplateRef<any>;
    public modal_ref: BsModalRef;

    constructor(
        private fb: FormBuilder,
        private modalService: BsModalService,
        private tagService: TagService,
        private logService: LogService
    ) {
        this.edit_form = this.fb.group({
            name: ["",  Validators.compose([Validators.required])],
            description: [""]
        });
        this.search_form = this.fb.group({
            keyword: ["", Validators.compose([Validators.required])]
        });
    }

    ngOnInit() {
        this.option = {
            keyword: "",
            page: 1,
            page_size: 10
        };
        this.getTags(this.option);
    }

    //多选
    public batchSelectChange(is_select: boolean): void {
        this.tags.forEach((tag: Tag) => tag["selected"] = is_select);
        this.selected_tags = is_select? this.tags.map((tag: Tag) => tag._id): [];
        this.select_all = this.selected_tags.length === this.tags.length;
    }

    //单选
    public itemSelectChange(): void {
        this.selected_tags = this.tags.filter((tag: Tag) => tag["selected"]).map((tag: Tag) => tag._id);
        this.select_all = this.selected_tags.length === this.tags.length;
    }

    //选择要修改的tag，并映射到表单
    public putTag(tag: Tag): void {
        this.active_tag = tag;
        this.edit_form.reset(tag);
    }

    //处理提交的表单
    public handleSubmitTag(tag: Tag): void {
        if(this.edit_form.valid) {
            this.active_tag? this.updateTag(tag): this.createTag(tag);
        }
    }

    //重置编辑表单
    public resetEditForm(): void {
        this.edit_form.reset();
        this.active_tag = null;
    }

    //重置搜索表单
    public resetSearchForm(): void {
        this.option.keyword = "";
        this.search_form.reset();
    }

    //分页跳转
    public pageChanged(event): void {
        this.option.page = event.page;
        this.refreshTags();
    }

    //获取标签
    public getTags(option?: HttpRequestOption): void {
        this.fetching = true;

        this.tagService.get(option).subscribe(
            (tags: Tag[]) => {
                this.tags = tags;
                this.total = this.tagService.total;
                this.fetching = false;
                this.selected_tags = [];
                this.select_all = false;
            }
        );
    }

    //刷新标签
    public refreshTags(): void {
        this.getTags(this.option);
    }

    //搜索标签
    public searchTags(): void {
        if(this.search_form.valid) {
            this.option.keyword = this.search_form.value["keyword"];
            this.getTags(this.option);
        }
    }

    //创建标签
    public createTag(tag: Tag): void {
        this.tagService.create(tag).subscribe(
            (tag: Tag) => {
                if(tag) {
                    this.resetEditForm();
                    this.resetSearchForm();
                    this.refreshTags();
                }
                else {
                    this.logService.notify("创建标签失败");
                }
            }
        );
    }

    //修改标签
    public updateTag(tag: Tag): void {
        tag = Object.assign({}, this.active_tag, tag);  //覆盖修改

        this.tagService.update(tag).subscribe(
            (tag: Tag) => {
                if(tag) {
                    this.resetEditForm();
                    this.active_tag = null;
                    this.refreshTags();
                }
                else {
                    this.logService.notify("修改标签失败");
                }
            }
        );
    }

    //删除标签
    public deleteTag(): void {
        this.tagService.delete(this.active_tag._id).subscribe(
            (result: boolean) => {
                if(result) {
                    this.cancelModal();
                    this.active_tag = null;
                    this.refreshTags();
                }
                else {  //删除失败
                    this.cancelModal();
                    this.logService.notify("删除标签失败");
                }
            }
        );
    }

    //批量删除标签
    public deleteTags(): void {
        this.tagService.deleteMany(this.selected_tags).subscribe(
            (results: boolean) => {
                if(results) {
                    this.cancelModal();
                    this.refreshTags();
                }
                else {  //删除失败
                    this.cancelModal();
                    this.logService.notify("删除标签失败");
                }
            }
        );
    }

    //打开确认删除modal
    public deleteTagModal(tag: Tag): void {
        this.active_tag = tag;
        this.modal_ref = this.modalService.show(this.delete_modal);
    }

    //打开确认批量删除modal
    public deleteTagsModal(): void {
        this.active_tag = null;
        this.modal_ref = this.modalService.show(this.delete_modal);
    }

    //关闭modal
    public cancelModal(): void {
        this.modal_ref.hide();
        this.modal_ref = null;
        this.active_tag = null;
    }
}