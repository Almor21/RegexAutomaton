import { getUniqueID } from '../utils/idUtils';
import RConnection from './RConnection';

// AFN State
class RState {
    ID: string;
    connections: RConnection[];

    constructor() {
        this.ID = getUniqueID();
        this.connections = [];
    }

    addConnection = (connection: RConnection) => {
        this.connections.push(connection);
    };
}

export default RState;
