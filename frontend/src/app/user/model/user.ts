export class User {
    id: number;
    username: string;
    email: string;

    constructor(data: any) {
        data = data || {};
        this.id = data.id;
        this.username = data.username;
        this.email = data.email;
    }
}
