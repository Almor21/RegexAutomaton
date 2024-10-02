import { getUniqueID } from '../utils/idUtils';
import RConnection from './RConnection';

// AFN State
class RState {
    ID: string;
    private label: string;
    connections: RConnection[];

    constructor(label: string = '') {
        this.ID = getUniqueID();
        this.label = label;
        this.connections = [];
    }

    addConnection = (connection: RConnection) => {
        this.connections.push(connection);
    };

    setLabel = (label: string) => {
        this.label = label;
    }

    getLabel = () => {
        return this.label || this.ID;
    }
}

export default RState;
