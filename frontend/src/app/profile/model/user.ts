export class User {
    id: number;
    username: string;
    role: number;

    constructor(data: any) {
        data = data || {};
        this.id = data.id;
        this.username = data.username;
        this.role = data.role;
    }
}
