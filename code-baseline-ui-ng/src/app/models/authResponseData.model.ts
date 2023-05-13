export interface AuthResponseDataModel{
    id:string;
    email:string;
    userName:string;
    roles:string[];
    refreshToken:string;
    accessToken:string;
    expiration:string;
}