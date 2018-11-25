export class Post {
    id: number;
    title: string;
    body: string;
    created: Date;
    updated: Date;

    constructor(title: string, body: string) {
        this.title = title;
        this.body = body;
    }
}
