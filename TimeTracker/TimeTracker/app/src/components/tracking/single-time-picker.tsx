import * as React from "react";
import { SelectListItem } from "../../models/select-list-item";
import Select from "react-select";
import "react-select/dist/react-select.css";

export interface ISingleTimePickerProps {
    selectedProjectMemberActionChanged(currentAction: any): any;
    enteredDurationChanged(duration: any): any;
    actionRegistered(): any;
    projectMemberActions: SelectListItem[];
    selectedAction: string,
    enteredDuration: string
}

export default class SingleTimePicker extends React.Component<ISingleTimePickerProps, any> {
    
    private selectedProjectMemberActionChanged(val: any) {
        this.props.selectedProjectMemberActionChanged(val.value);
    }
    
    private enteredDurationChanged(val: any) {
        this.props.enteredDurationChanged(val.target.value);
    }
    
    private actionRegistered() {
        this.props.actionRegistered();        
    }
    
    render() {
        console.log("singleTimePicker");
        console.log("projectMemberActions", this.props.projectMemberActions);
        let duration = this.props.enteredDuration;
        if (duration == null) {
            duration = "";
        }
        return (
            <div className={"container-fluid"}>
                <div className="row">
                    <div className={"col-lg-4 col-md-4 col-sm-4"}>
                        <label>Pasirinktite veiksmo tipą</label>
                        <Select
                            name={"ProjectMemberAction"}
                            options={this.props.projectMemberActions}
                            multi={false}
                            value={this.props.selectedAction}
                            onChange={this.selectedProjectMemberActionChanged.bind(this)}
                        />
                    </div>    
                    <div className={"col-lg-2 col-md-2 col-sm-2"}>
                        <label>Įveskite trukmę</label>
                        <input 
                            className={"form-control"}
                            value={duration}
                            onChange={this.enteredDurationChanged.bind(this)}/>
                    </div>    
                </div>
                <br/>
                <button
                    className={"btn btn-default"}
                    type={"number"}
                    onClick={this.actionRegistered.bind(this)}>Saugoti
                </button>
            </div>    
        );
    }
}