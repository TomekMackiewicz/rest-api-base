export class Item {
    id: number;
    signature: string;
    status: number;
    lastAction: Date

    constructor(data: any) {
        data = data || {};
        this.id = data.id;
        this.signature = data.signature;
        this.status = data.status;
        this.lastAction = data.lastAction;
    }
}
