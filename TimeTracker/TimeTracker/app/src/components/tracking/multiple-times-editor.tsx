import * as React from "react";
import {RegisteredAction} from "../../models/projects/registered-action";
import {Project} from "../../models/projects/project";
import {SelectListItem} from "../../models/select-list-item";
import Select from "react-select";
import "react-select/dist/react-select.css";
import DatePicker from 'react-date-picker';
import * as moment from "moment";

export interface IMultipleTimesEditocComponentProps {
    registeredActions: RegisteredAction[],
    possibleUserActions: SelectListItem[],
    registeredActionsChanged(registeredActions: RegisteredAction[]): void;
    resetModifiedActions(): void;
    saveActions(): void;
}

export default class MultipleTimesEditorComponent extends React.Component<IMultipleTimesEditocComponentProps, any> {
    
    private DATE_CHANGED : number = 0;
    private DURATION_CHANGED : number = 1;
    private ACTION_CHANGED : number = 2;
    private DELETED: number = 3;
    
    
    private itemChanged(actionType: number, index: number, event: any) : any {
        console.log("index", index);
        console.log("actionType", actionType);
        console.log("event", event);
        const registeredActions : RegisteredAction[] = this.props.registeredActions;
        const editedAction: RegisteredAction = registeredActions[index];
        switch (actionType) {
            case this.DATE_CHANGED:  
                const previousDate: Date = moment(editedAction.startTime).toDate()
                const currentDate: Date = new Date(event);
                previousDate.setDate(currentDate.getDate());
                editedAction.startTime = previousDate.toDateString();
                break;
            case this.DURATION_CHANGED:
                editedAction.duration = event.target.value
                break;
            case this.ACTION_CHANGED:
                editedAction.projectMemberActionId = event.value;
                break;
            case this.DELETED:
                registeredActions.splice(index, 1);
                this.props.registeredActionsChanged(registeredActions);
                return;
        }
        registeredActions[index] = editedAction;
        this.props.registeredActionsChanged(registeredActions);
    }
    
    render() {
        return (
            <div className={"container-fluid"}>
                <div className={"row"}>
                    <label>Here you can edit entered times</label>
                    <table className={"table table-responsive table-bordered table-hover table-striped table-condensed"}>
                        <thead>
                            <tr>
                                <th>Start date</th>
                                <th>Duration</th>
                                <th>RegisteredAction</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.registeredActions.map((registeredAction: RegisteredAction, index: number) => {
                                return (
                                    <tr key={index}>
                                        <th>
                                            <DatePicker
                                                value={new Date(registeredAction.startTime)}
                                                onChange={this.itemChanged.bind(this, this.DATE_CHANGED, index)}
                                            />
                                        </th>
                                        <th>
                                            <input 
                                                type={"text"}
                                                className={"form-control"}
                                                onChange={this.itemChanged.bind(this, this.DURATION_CHANGED, index)}
                                                value={registeredAction.duration} />
                                        </th>
                                        <th>
                                            <Select
                                                name={"SingleProjectMemberAction"}
                                                onChange={this.itemChanged.bind(this, this.ACTION_CHANGED, index)}
                                                options={this.props.possibleUserActions}
                                                multi={false}
                                                value={registeredAction.projectMemberActionId}
                                            />
                                        </th>    
                                        <th>
                                            <button 
                                                className={"btn btn-danger"}
                                                onClick={this.itemChanged.bind(this,  this.DELETED, index)}>Delete</button>
                                        </th>    
                                    </tr>    
                                );
                            })}
                        </tbody>
                    </table>    
                </div>
                <div className={"btn-group"}>
                    <button
                        className={"btn btn-success"}
                        onClick={this.props.saveActions.bind(this)}>Save</button>
                    <button
                        className={"btn btn-info"}
                        onClick={this.props.resetModifiedActions.bind(this)}>Reset</button>
                </div>
            </div>
        );
    }
}