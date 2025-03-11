import { courseType } from "./courseType";

export class UserType {
    constructor(
        public email: string,
        public password: string,
        public name?: string,
        public id?: number,
        public role?: 'student' | 'teacher' | 'admin',
        public Courses?: courseType[]

    ) { }
}




