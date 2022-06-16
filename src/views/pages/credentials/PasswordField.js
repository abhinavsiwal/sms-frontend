import React from "react";

class PasswordField extends React.Component {
  state = {
    type: "password",
  };

  handleClick = () =>
    this.setState(({ type }) => ({
      type: type === "text" ? "password" : "text",
    }));

  render() {
    const { value } = this.props;
    console.log(value);
    return (
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between"}} >
        <p>{this.state.type==="text"?`${value}`:"******"}</p>
        <span className="password__show" onClick={this.handleClick}>
          {this.state.type === "text" ? (
            <i className="fa fa-eye-slash" />
          ) : (
            <i className="fa fa-eye" />
          )}
        </span>
      </div>
    );
  }
}

export default PasswordField;
