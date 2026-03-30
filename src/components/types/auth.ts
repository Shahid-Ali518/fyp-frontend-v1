export interface UserRegister {
    name: string;
    email: string;
    password: string
}

export interface UserLogin {
    email: string;
    password: string
}

export interface AuthResponse {
    access_token: string;
    username: string;
    email: string;
    role: string;
    
}

