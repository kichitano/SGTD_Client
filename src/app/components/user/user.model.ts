import { PersonModel } from "../people/people.model";
import { PositionModel } from "../position/position.model";

export interface UserModel {
    guid: string;
    personId: number;
    email: string;
    password: string;
    status: boolean;
    person?: PersonModel;
    position?: PositionModel;
    storageSize: number;
}