/**
 * @file 用户文章目录管理组件
 * @module app/user/back/article/categories/component
 */

import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import { formControlStateClass, buildLevelCategories } from "@app/share/component.utils";
import { Category } from '@app/core/models/category.model';
import { CategoryService } from '@app/core/services/category.service';
import { LogService } from '@app/core/services/log.service';
import { HttpRequestOption } from '@app/interfaces/http.interface';

@Component({
    templateUrl: "./categories.component.html",
    styleUrls: ["./categories.component.scss"]
})
export class CategoriesComponent implements OnInit {
    public controlStateClass = formControlStateClass;
    public buildLevelCategories = buildLevelCategories;

    public edit_form: FormGroup;                //编辑表单

    public fetching: boolean = false;           //是否在获取数据
    public option: HttpRequestOption;           //查询选项
    public total: number;                       //总记录数
    public categories: Category[] = [];         //目录列表

    public category: Category;                  //单个选中目录
    public selected_categories: string[] = [];  //勾选的目录
    public select_all: boolean;                 //是否选择全部

    @ViewChild("deleteModal") delete_modal: TemplateRef<any>;
    public modal_ref: BsModalRef;

    constructor(
        private fb: FormBuilder,
        private categoryService: CategoryService,
        private logService: LogService,
        private modalService: BsModalService
    ) {
        this.edit_form = this.fb.group({
            name: ["", Validators.compose([Validators.required])],
            parent_id: [null],
            description: [""]
        });
    }

    ngOnInit() {
        this.option = {
            page: 1,
            page_size: 10
        };
        this.getCategories(this.option);
    }

    //多选
    public batchSelectChange(is_select: boolean): void {
        this.categories.forEach((category: Category) => category["selected"] = is_select);
        this.selected_categories = is_select? this.categories.map((category: Category) => category._id): [];
        this.select_all = this.selected_categories.length === this.categories.length;
    }

    //单选
    public itemSelectChange(): void {
        this.selected_categories = this.categories.filter(
            (category: Category) => category["selected"]
        ).map(
            (category: Category) => category._id
        );
        this.select_all = this.selected_categories.length === this.categories.length;
    }

    //选择目录
    public putCategory(category: Category): void {
        this.category = category;
        this.edit_form.reset(this.category);
    }

    //提交表单
    public submitEditForm(): void {
        if(this.edit_form.valid) {
            let category: Category = this.edit_form.value;
            this.category? this.updateCategory(category): this.createCategory(category);
        }
    }

    //重置表单
    public resetEditForm(): void {
        this.edit_form.reset();
        this.category = null;
    }

    //打开确认删除modal
    public deleteCategoryModal(category: Category): void {
        this.category = category;
        this.modal_ref = this.modalService.show(this.delete_modal);
    }

    //打开确认批量删除modal
    public deleteCategoriesModal(): void {
        this.category = null;
        this.modal_ref = this.modalService.show(this.delete_modal);
    }

    //关闭modal
    public cancelModal(): void {
        this.modal_ref.hide();
        this.modal_ref = null;
        this.category = null;
    }

    //是否禁止父目录项选择
    public isDisableCateSelect(category: Category): boolean {
        if(this.category) {
            return this.category._id === category._id || this.category._id === category.parent_id;
        }
        else {
            return false;
        }
    }

    //获取分类
    public getCategories(option?: HttpRequestOption): void {
        this.fetching = true;

        this.categoryService.get(option).subscribe(
            (categories: Category[]) => {
                this.categories = this.buildLevelCategories(categories);
                this.total = this.categoryService.total;

                this.fetching = false;
                this.selected_categories = [];
                this.select_all = false;
            }
        );
    }

    //刷新
    public refreshCategories(): void {
        this.getCategories(this.option);
    }

    //创建分类
    public createCategory(category: Category): void {
        this.categoryService.create(category).subscribe(
            (category: Category) => {
                if(category) {
                    this.resetEditForm();
                    this.refreshCategories();
                }
                else {
                    this.logService.notify("创建分类目录失败");
                }
            }
        )
    }

    //更新分类
    public updateCategory(category: Category): void {
        category = Object.assign({}, this.category, category);  //覆盖修改

        this.categoryService.update(category).subscribe(
            (category: Category) => {
                if(category) {
                    this.resetEditForm();
                    this.category = null;
                    this.refreshCategories();
                }
                else {
                    this.logService.notify("修改分类目录失败");
                }
            }
        );
    }

    //删除标签
    public deleteCategory(): void {
        this.categoryService.delete(this.category._id).subscribe(
            (result: boolean) => {
                if(result) {
                    this.cancelModal();
                    this.category = null;
                    this.refreshCategories();
                }
                else {  //删除失败
                    this.cancelModal();
                    this.logService.notify("删除文章分类失败");
                }
            }
        );
    }

    //批量删除标签
    public deleteCategories(): void {
        this.categoryService.deleteMany(this.selected_categories).subscribe(
            (results: boolean) => {
                if(results) {
                    this.cancelModal();
                    this.refreshCategories();
                }
                else {  //删除失败
                    this.cancelModal();
                    this.logService.notify("删除文章分类失败");
                }
            }
        );
    }
}