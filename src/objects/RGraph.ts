import RState from './RState';

// AFN Representation
class RGraph {
    initState: RState;
    finalState: RState;

    constructor(init: RState, end: RState) {
        this.initState = init;
        this.finalState = end;
    }
}

export default RGraph;
