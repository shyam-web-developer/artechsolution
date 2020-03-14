export class Lookup {
    id: number;
    itemId: number;
    lookupName: string;
    constructor(id: number, itemId: number, lookupName: string) {
        this.id = id;
        this.itemId = itemId;
        this.lookupName = lookupName;
    }
}

export class LookupItem {
    itemKey: string;
    itemValue: string;  
    constructor(itemKey: string, itemValue: string) {
        this.itemKey = itemKey;
        this.itemValue = itemValue;       
    }
}