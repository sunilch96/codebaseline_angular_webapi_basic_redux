import { UserModel } from "src/app/models/user.model"

export interface AuthState{
    user: UserModel | null
}

export const initialState:AuthState={
    user:null
}