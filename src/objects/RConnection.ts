import RState from "./RState";

// Connection between states
class RConnection {
    value: string;
    next: RState;

    constructor(value: string, next: RState) {
        this.value = value;
        this.next = next;
    }
}

export default RConnection;