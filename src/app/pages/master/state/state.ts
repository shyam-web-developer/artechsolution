export class State {
    stateId: number;
    stateName: string;
    countryId: number;
    constructor(stateId: number, stateName: string, countryId: number) {
        this.stateId = stateId;
        this.stateName = stateName;
        this.countryId = countryId;
    }
}

export class City {
    cityId: number;
    stateId: number;
    stateName: string;
    cityCode: string;
    cityName: string;
    countryId: number;
    constructor(cityId : number,stateId: number, cityCode: string,stateName: string, cityName : string,countryId: number) {
        this.cityId = cityId;
        this.stateId = stateId;
        this.cityCode = cityCode;
        this.stateName = stateName;
        this.cityName = cityName;
        this.countryId = countryId;
    }
}
