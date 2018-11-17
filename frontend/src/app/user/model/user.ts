export class User {
    id: number;
    username: string;
    email: string;
    currentPassword: string;
    enabled: boolean;
    lastLogin: Date;
    roles: Array<string>;

    constructor(data: any) {
        data = data || {};
        this.id = data.id;
        this.username = data.username;
        this.email = data.email;
        this.currentPassword = data.currentPassword;
        this.enabled = data.enabled;
        this.lastLogin = data.lastLogin;
        this.roles = data.roles;
    }
}
