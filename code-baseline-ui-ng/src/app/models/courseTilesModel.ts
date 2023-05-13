 export class CourseTilesModel{
   public courseId:number;
   public subCourseId?:string;
   public name?:string; 
   public description?:string; 
   public sequenceNumber?:string; 
   public sortByDescending?:string; 
   public url?:string;
   public enabled?:boolean;
   public created?:Date;
   public updated?:Date;
   public menuId: number;
   public isContentAvailable?:boolean;
   public childSubCourses:CourseTilesModel[];
 }