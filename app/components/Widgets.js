import React, {Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import _ from 'lodash';
import t from 'tcomb-form';
import classnames from 'classnames'
import SegmentedControl from './SegmentedControl'

import Icon from 'react-icons-kit';
import { ic_clear } from 'react-icons-kit/md/ic_clear';

const SizedIcon = props => <Icon size={props.size || 30} icon={props.icon} style={{margin:"5px"}} />;


const Form = t.form.Form
const Nil = t.Nil

//const formatNumber = (number,dp=0) => numeral(number).format("0,0" + ( dp > 0 ? "." + Array(dp+1).join('0') : '' )) ;
const formatNumber = (number, dp=0) => new Intl.NumberFormat('en',{style:'decimal', minimumFractionDigits: dp}).format(number) 
const getBreakpoints = (breakpoints) => {
  const className = {}
  for (const size in breakpoints) {
    if (breakpoints.hasOwnProperty(size)) {
      className['col-' + size + '-' + breakpoints[size]] = true
    }
  }
  return className
}

const getCol = (breakpoints, content) => {
  const className = classnames(getBreakpoints(breakpoints))
  return <div className={className}>{content}</div>
}
const getClassName = (locals) => {
  const len = locals.path.length
  let className = `fieldset fieldset-depth-${len}`
  if (len > 0) {
    className += ` fieldset-${locals.path.join('-')}`
  }
  if (locals.className) {
    className += ` ${classnames(locals.className)}`
  }
  return className
}
const getLabel = ({label, breakpoints, htmlFor, id}) => {
  if (label) {
    const className = breakpoints ? breakpoints.getLabelClassName() : {}
    className['control-label'] = true
    return (
      <label htmlFor={htmlFor} id={id} className={classnames(className)}>{label}</label>
    )
  }
}
export class Textbox extends t.form.Textbox {
    getTemplate() {
        let self = this;
        const template = t.form.Form.templates.textbox.clone({
            renderLabel: (locals) => {
                return self.props.options.hasLabel === false ?  "" : getLabel({
                  label: locals.label,
                  htmlFor: locals.attrs.id,
                  breakpoints: locals.config.horizontal
              });
            }
        });
        return template;
    }
}
export class Datetime extends t.form.Datetime {
    getTemplate() {
        let self = this;
        const template = t.form.Form.templates.date.clone({
            renderLabel: (locals) => {
                return self.props.options.hasLabel === false ?  "" : getLabel({
                  label: locals.label,
                  htmlFor: locals.attrs.id,
                  breakpoints: locals.config.horizontal
              });
            }
        });
        return template;
    }
}
export class Decimal extends Textbox {
    getTransformer() {
        let dp = this.props.options.dp ? this.props.options.dp : 0 ;
        const numberTransformer = {
          format: (value) => {
            if (Nil.is(value)) return '';
            if (value === undefined || value === null) return '';
            if ( !value ) { return value }
            let res =  formatNumber(value, dp);
            return res;
          },
          parse: function (str) {
            if ( _.isString(str) && str.length > 0) {
                return parseFloat( str.replace(/,/g,'') );
            } else { return undefined }
          }
        };
      return numberTransformer;
    }
}

export class Select extends t.form.Select {
    getTemplate() {
        let self = this;
        const template = t.form.Form.templates.select.clone({
            renderLabel: (locals) => {
                return self.props.options.hasLabel === false ?  "" : getLabel({
                  label: locals.label,
                  htmlFor: locals.attrs.id,
                  breakpoints: locals.config.horizontal
              });
            }
        });
        return template;
    }
}
export class SegControl extends t.form.Select {
    onValueChange(item){
      let val = this.getTransformer().parse(item);
      this.getLocals().onChange(val);
    }
    getTemplate() {
        let self = this;
        const template = t.form.Form.templates.select.clone({
            renderSelect: (locals) => {
                let key = self.getId();
                let nullOption = self.getNullOption();
                let options = locals.options
                let nullIndex = locals.options.findIndex((opt) => nullOption && nullOption.value === opt.value )
                if (nullIndex >= 0)  options.splice(nullIndex,1);
                const successValue = self.props.options.successValue ? self.props.options.successValue : null;
                const warningValue = self.props.options.warningValue ? self.props.options.warningValue : null;
                return (
                    <SegmentedControl id={key} successValue={successValue} warningValue={warningValue} items={options} onChange={(item, e) => this.onValueChange(item)}/>
                )
            },
            renderFieldset: (children,locals) => {
                    return null;
            },
            renderLabel: (locals) => {
                return self.props.options.hasLabel === false ?  "" : getLabel({
                  label: locals.label,
                  htmlFor: locals.attrs.id,
                  breakpoints: locals.config.horizontal
                })
            },
        });
        return template;
    }
}
export class YesNo extends t.form.Select {
    onValueChange(item){
      let val = this.getTransformer().parse(item);
      this.getLocals().onChange(val);
    }
    getTemplate() {
        let self = this;
        const template = t.form.Form.templates.select.clone({
            renderSelect: (locals) => {
                let key = self.getId();
                let nullOption = self.getNullOption();
                let options = locals.options
                let nullIndex = locals.options.findIndex((opt) => nullOption && nullOption.value === opt.value )
                if (nullIndex >= 0)  options.splice(nullIndex,1);
                const successValue = self.props.options.successValue ? self.props.options.successValue : null;
                const warningValue = self.props.options.warningValue ? self.props.options.warningValue : null;
                return (
                    <SegmentedControl id={key} items={options} successValue={successValue} warningValue={warningValue} onChange={(item, e) => this.onValueChange(item)}/>
                )
            },
            renderLabel: (locals) => {
                return self.props.options.hasLabel === false ?  "" : getLabel({
                  label: locals.label,
                  htmlFor: locals.attrs.id,
                  breakpoints: locals.config.horizontal
                })
            }
        });
        return template;
    }
}
export class List extends t.form.List {
    getTemplate() {
        let self = this;
        const template = t.form.Form.templates.list.clone({
            renderFieldset: (children, locals) => {
                const legend = null; // locals.label ? <legend>{locals.label}</legend> : null
                const props = {
                  className: getClassName(locals),
                  disabled: locals.disabled
                }
                return React.createElement.apply(null, [
                  'div',
                  props,
                  legend
                ].concat(children))
            },
            renderRow : (row, locals) => {
                return (
                  <div className="row">
                    {getCol({sm: 10, xs: 10}, row.input)}
                    {getCol({sm: 2, xs: 2}, template.renderButtonGroup(row.buttons, locals))}
                  </div>
                )
            },
            renderButtonGroup: (buttons) => {
              const renderBtn = (button) => {
                  return <button key={button.type} style={{top:'10px'}} type="button" className={`btn btn-info btn-${button.type}`} onClick={button.click}>{button.label}</button>
              }
              return <div className="btn-group">{buttons.map(renderBtn)}</div>
            },
            renderAddButton: (locals) => {
                const button = locals.add
                const label = self.props.options.addText ? self.props.options.addText : button.label ;
                return (
                  <div className="row">
                    <div className="col-sm-12 col-xs-12">
                      <div style={{marginBottom: '15px', marginTop:'10px'}}>
                        <button type="button" className={`btn btn-info btn-block btn-${button.type}`} onClick={button.click}>{label}</button>
                      </div>
                    </div>
                  </div>
                )
            }
        });
        return template;
    }
}

export class SimpleList extends t.form.List {
    getTemplate() {
        let self = this;
        const template = t.form.Form.templates.list.clone({
            renderFieldset: (children, locals) => {
                const legend = null; // locals.label ? <legend>{locals.label}</legend> : null
                const props = {
                  className: getClassName(locals),
                  disabled: locals.disabled
                }
                return React.createElement.apply(null, [
                  'div',
                  props,
                  legend
                ].concat(children))
            },
            renderRow : (row, locals) => {
                return (
                  <div className="row">
                    {getCol({sm: 10, xs: 10}, row.input)}
                    {getCol({sm: 1, xs: 1}, template.renderButtonGroup(row.buttons, locals))} 
                  </div>
                )
            },
            renderButtonGroup: (buttons) => {
              const renderBtn = (button) => {
                  return button.type === 'remove' ? <span key={button.type} onClick={button.click}><SizedIcon icon={ic_clear} /></span> : null

                //   return <button key={button.type} style={{top:'10px'}} type="button" className={`btn btn-info btn-${button.type}`} onClick={button.click}>{button.label}</button>
              }
              return <div className="btn-group">{buttons.map(renderBtn)}</div>
            },
            renderAddButton: (locals) => {
                const button = locals.add
                const handler = self.props.options.addItemHandler ? () => self.props.options.addItemHandler(button) : button.click
                const label = self.props.options.addText ? self.props.options.addText : button.label ;
                return (
                  <div className="row">
                    <div className="col-sm-12 col-xs-12">
                      <div style={{marginBottom: '15px', marginTop:'10px'}}>
                        <button type="button" className={`btn btn-info btn-block btn-${button.type}`} onClick={handler}>{label}</button>
                      </div>
                    </div>
                  </div>
                )
            }
        });
        return template;
    }
}
export class CheckBox extends t.form.Checkbox {
  getTemplate() {
      let self = this;
      const template = t.form.Form.templates.checkbox.clone({

        renderCheckbox: (locals) => {
          const attrs = template.getAttrs(locals)
          const className = {
            checkbox: true,
            disabled: attrs.disabled
          }
          let style = attrs.style || {}
          style.width = '25px'
          style.height = '25px'
          style.bottom = '5px'
          attrs.style = style
          return (
            <div className={classnames(className)}>
              <label htmlFor={attrs.id}>
                <input {...attrs} /> {self.props.options.hasLabel === false ?  "" : locals.label}
              </label>
            </div>
          )
        }
      });
      return template;
  }
}
