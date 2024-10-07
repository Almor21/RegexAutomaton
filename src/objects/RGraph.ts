import RState from './RState';

// AFN Representation
class RGraph {
    initState: RState;
    finalState: RState;
    states: RState[];

    constructor(init: RState, end: RState, states: RState[] = []) {
        this.initState = init;
        this.finalState = end;

        if (states.length === 0) {
            this.states = [init, end];
        } else {
            this.states = [...states];
        }
    }

    addState = (state: RState) => {
        if (this.states.some((s) => s.ID === state.ID)) {
            console.log(`State ${state.ID} is already part of the AFN.`);
            return;
        }

        this.states.push(state);
    };

    getState = (id: string) => {
        return this.states.find((s) => s.ID === id);
    };

    setLabels = () => {
        this.states.forEach((st, index) => st.setLabel(index.toString()));
    };
}

export default RGraph;
