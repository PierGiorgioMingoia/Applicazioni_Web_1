import React from "react";
import PropTypes from "prop-types";

class DropdownMultiselect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            placeholder: this.props.placeholder,
            showDropdown: false,
            selected: this.props.selected,
            options: [],
        };
    }

    //Set selected one 
    setSelected() { }

    //Set the options of the dropdown
    setOptions() {
        if (this.props.options.length === 0) {
            return;
        }

        if (typeof this.props.options[0] === "object") {
            this.props.options.forEach((value, index) => {
                if (value.key === undefined || value.label === undefined) {
                    console.log(
                        "React Dropdown Multiselect Error: options is not well formatted. Please check documentation."
                    );
                    return;
                }
            });

            this.setState({
                options: this.props.options,
            });
        }

        if (typeof this.props.options[0] === "string") {
            let optionsArray = [];
            this.props.options.map((value, index) => {
                optionsArray.push({ key: value, label: value });
                return null;
            });

            this.setState({
                options: optionsArray,
            });
        }
    }

    //Handling the show of the dropdown
    componentDidMount() {
        this.setOptions();
        document.addEventListener("mousedown", this.handleClickOutside.bind(this));
    }

    handleClickOutside(ev) {
        if (
            this.state.showDropdown !== false &&
            this.node.contains(ev.target) === false
        ) {
            this.setState({
                showDropdown: false,
            });
        }
    }

    //Nothing selected or value sparated by commas
    getPlaceholderValue() {
        if (this.state.selected.length === 0) {
            return this.props.placeholder;
        }

        if (
            this.props.placeholderMultipleChecked !== null &&
            this.state.selected.length > 1
        ) {
            return this.props.placeholderMultipleChecked;
        } else {
            return this.state.selected.join(", ");
        }
    }

    //When removed from the DOM
    componentWillUnmount() {
        document.removeEventListener(
            "mousedown",
            this.handleClickOutside.bind(this)
        );
    }

    handleClick() {
        this.setState({
            showDropdown: !this.state.showDropdown,
        });
    }

    //Change handling and call props function
    handleChange(ev) {
        var currentSelected = [...this.state.selected];

        if (ev.currentTarget.checked) {
            currentSelected.push(ev.currentTarget.value);
        } else {
            var index = currentSelected.indexOf(ev.currentTarget.value);
            currentSelected.splice(index, 1);
        }
        // update the state with the new array of options
        this.setState({ selected: currentSelected });
        if (this.props.handleOnChange !== undefined) {
            this.props.handleOnChange(currentSelected)
        }
    }
    render() {
        const dropdownClass =
            this.state.showDropdown === true ? "dropdown-menu show" : "dropdown-menu";

        return (
            <div className="dropdown" ref={(node) => (this.node = node)}>
                <button
                    className={`btn dropdown-toggle ${this.props.buttonClass}`}
                    type="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                    onClick={() => this.handleClick()}
                    style={{
                        width: "100%",
                        overflow: "hidden",
                    }}
                >
                    <span
                        style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            width: "100%",
                            float: "left",
                            textAlign: "left",
                            paddingRight: "6px",
                            marginRight: "-6px",
                        }}
                    >
                        {this.getPlaceholderValue()}
                    </span>
                </button>
                <div className={dropdownClass} style={{ padding: 0, width: "100%" }}>
                    {this.state.options.map((option, index) => {
                        return (
                            <div key={index} className="dropdown-item">
                                <div className="form-check">
                                    <input
                                        value={option.key}
                                        id={`multiselect-${this.props.name}-${index}`}
                                        className="form-check-input"
                                        type="checkbox"
                                        name={`${this.props.name}[]`}
                                        onChange={(ev) => this.handleChange(ev)}
                                        checked={
                                            this.state.selected.indexOf(option.key.toString()) > -1
                                                ? "checked"
                                                : ""
                                        }
                                    />
                                    <label
                                        className="form-check-label"
                                        style={{ userSelect: "none", width: "100%" }}
                                        htmlFor={`multiselect-${this.props.name}-${index}`}
                                    >
                                        {option.label}
                                    </label>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

//ProtoTypes for define type 
DropdownMultiselect.propTypes = {
    buttonClass: PropTypes.string,
    selected: PropTypes.array,
    value: PropTypes.array,
    placeholder: PropTypes.string,
    placeholderMultipleChecked: PropTypes.string,
    options: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    showSelectToggle: PropTypes.bool,
};

DropdownMultiselect.defaultProps = {
    placeholder: "Nothing selected",
    buttonClass: "btn-light",
    placeholderMultipleChecked: null,
    selected: [],
    showSelectToggle: true,
};

export default DropdownMultiselect;