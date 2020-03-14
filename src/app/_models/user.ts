export class User {
    id: number;
    userId: number;
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
    mobile:string;
    constructor(id: number, userId : number, userName: string, firstName: string, lastName: string, password: string,mobile:string) {
        this.id = id;
        this.userId = userId,
        this.userName = userName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password; 
        this.mobile = mobile;
    }
}