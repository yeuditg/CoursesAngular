import { lessonType } from "./lessonType";

export class courseType{
    constructor(
        public id:number,
        public title:string,
        public description:string,
        public teacherId:number,
        public lessons:lessonType[],
    ){}
}

