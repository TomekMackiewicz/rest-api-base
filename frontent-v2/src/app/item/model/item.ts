export class Item {
    id: number;
    signature: string;
    status: number;
    lastAction: Date

    constructor(signature: string, status: any) {
        this.signature = signature;
        this.status = status;
    }
}
