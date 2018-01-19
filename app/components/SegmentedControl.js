import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {FormGroup, Col, ControlLabel, HelpBlock, Glyphicon, OverlayTrigger, Tooltip, ButtonGroup, Button} from 'react-bootstrap';

export default class SegmentedControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
        value: this.props.value,
    }
  }

  static propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    items: PropTypes.array,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    hidden: PropTypes.bool,
    style: PropTypes.object,
    successValue : PropTypes.string,
    warningValue : PropTypes.string,
  }

  onChange(item, e) {
    e.persist();
    let value = typeof(e) === 'string' ? item : item.value;
    this.setState({value:value}, () => this.props.onChange && this.props.onChange(value, e))
  }

  render () {
    const { id,label,value,type,helpText,
      required,items,
      validationState,validationMessage,
      onChange,onFocus,onBlur,
      disabled,readOnly,hidden,style,successValue, warningValue} = this.props
    let workItems = [];
    let checked, bstyle = 'default';
    if(items) {
      items.map((item,index)=>{
        if (typeof(item) === "string") {
          checked = typeof(item.value) === 'string' && item.value !== undefined && this.state.value !== undefined ? item.value.toLowerCase() === this.state.value.toLowerCase() : item.value === this.state.value;
          bstyle = successValue && this.state.value === successValue ? 'success' : warningValue && this.state.value === warningValue ? 'warning' : 'default';
          workItems.push(<Button key={id+'_'+index} onClick={(e) => this.onChange(item,e)} onFocus={onFocus} onBlur={onBlur} name={id} value={item} disabled={disabled} active={checked} bsStyle={bstyle}>{item}</Button>);
        } else {
            // console.log("SegmentedControl, item.value & state.value", item.value, this.state.value )
          checked = typeof(item.value) === 'string' && item.value !== undefined && this.state.value !== undefined ? item.value.toLowerCase() === this.state.value.toLowerCase() : item.value === this.state.value;
          bstyle = successValue && this.state.value === successValue ? 'success' : warningValue && this.state.value === warningValue ? 'warning' : 'default';
          workItems.push(<Button key={id+'_'+index} onClick={(e) => this.onChange(item,e)} onFocus={onFocus} onBlur={onBlur} name={id} value={item.value} disabled={disabled} active={checked} bsStyle={bstyle}>{item.text}</Button>);
        }
      });
    }
    return (
        <div className={hidden ? 'hidden' : 'show'}>
            <ButtonGroup>
              {workItems}
            </ButtonGroup>
        </div>

    )
  }
}

SegmentedControl.defaultProps = {
};
