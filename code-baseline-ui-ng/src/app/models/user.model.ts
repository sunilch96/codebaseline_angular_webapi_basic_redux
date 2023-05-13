export class UserModel{
    constructor(
        public email:string,
        public accessToken:string,
        private id:string,
        public expiration:Date
    ){}

    get userAuthToken(){
        return this.accessToken;
    }
}