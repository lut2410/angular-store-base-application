import { Task } from '../models/task';
import * as TASK from '../actions/task.actions';
import { Message, MessageType } from '../models/message';

export interface State {
    entities: Task[];
    loading: boolean;
    numberIncompletedTasks: number;
    message: Message
};

const initialState: State = {
    entities: [],
    loading: false,
    numberIncompletedTasks: 0,
    message: null
};

export function reducer(state = initialState, action: TASK.Actions): State {
    switch (action.type) {
        case TASK.LOAD: {
            return Object.assign({}, state, {
                loading: true,
                numberIncompletedTasks: countIncompletedTasks(state.entities)
            });
        }
        case TASK.LOAD_COMPLETED: {
            const tasks = action.payload;
            return {
                ...state,
                entities: tasks,
                loading: false,
                numberIncompletedTasks: countIncompletedTasks(tasks),
                message: {
                    type: MessageType.Success,
                    content: 'Load successed'
                }
            }
        }
        case TASK.DELETE:
        case TASK.UPDATE:
        case TASK.ADD: {
            return {
                ...state,
                loading: true
            }
        }

        case TASK.ADD_COMPLETED: {
            const task = action.payload;
            return {
                ...state,
                loading: false,
                entities: [...state.entities, task],
                numberIncompletedTasks: state.numberIncompletedTasks + 1,
                message: {
                    type: MessageType.Success,
                    content: 'Add successed'
                }
            }
        }

        case TASK.DELETE_COMPLETED: {
            const task = action.payload;
            return {
                ...state,
                loading: false,
                entities: state.entities.filter(item => item.id !== task.id),
                numberIncompletedTasks: state.numberIncompletedTasks - 1,
                message: {
                    type: MessageType.Success,
                    content: 'Delete successed'
                }
            }
        }
        case TASK.UPDATE_COMPLETED:
            {
                const task = action.payload;
                return {
                    ...state,
                    entities: state.entities.map(item => {
                        if (item.id === task.id) {
                            return Object.assign({}, task);
                        }
                        return item;
                    }),
                    loading: false,
                    numberIncompletedTasks: countIncompletedTasks(state.entities),
                    message: {
                        type: MessageType.Success,
                        content: 'Update successed'
                    }
                }
            }

        case TASK.ADD_FAIL:
            {
                return {
                    ...state,
                    loading: false,
                    message: {
                        type: MessageType.Error,
                        content: 'Error adding'
                    }
                }
            }
        case TASK.DELETE_FAIL:
            {
                return {
                    ...state,
                    loading: false,
                    message: {
                        type: MessageType.Error,
                        content: 'Error deleting'
                    }
                }
            }
        case TASK.UPDATE_FAIL:
            {
                return {
                    ...state,
                    loading: false,
                    message: {
                        type: MessageType.Error,
                        content: 'Error updating'
                    }
                }
            }
        case TASK.LOAD_FAIL:
            {
                return {
                    ...state,
                    loading: false,
                    message: {
                        type: MessageType.Error,
                        content: 'Error loading'
                    }
                }
            }

        default: {
            return state;
        }
    }

    function countIncompletedTasks(tasks: Task[]): number {
        let total = 0;
        tasks.map((item: Task) => {
            if (item.isCompleted === false)
                ++total;
        })
        return total;
    }
}


export const getLoading = (state: State) => state.loading;
export const getTasks = (state: State) => state.entities;