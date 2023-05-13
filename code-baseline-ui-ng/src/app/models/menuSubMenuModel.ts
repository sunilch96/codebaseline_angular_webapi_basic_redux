import { CategoryModel } from "./categoryModel";
import { CourseTilesModel } from "./courseTilesModel";

 export class MenuSubMenuModel{
    public menuId:number;
    public subMenuId?:string;
    public name?:string; 
    public description?:string; 
    public sequenceNumber?:string; 
    public sortByDescending?:string; 
    public url?:string;
    public enabled?:boolean;
    public created?:Date;
    public updated?:Date;
    public categoriesId?:number;
    public category?:CategoryModel;
    public childSubMenuModels:MenuSubMenuModel[];
    public courseTiles:CourseTilesModel[];
    public courseTile:CourseTilesModel;
 }