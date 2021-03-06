import React from 'react'
import PropTypes from 'prop-types'
import { Button, Tooltip } from 'antd'

const buttonStyle = {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    zIndex: 9
}

const FloatButton = ({history, label, to}) => (
    <Tooltip placement="left" title={label}>
        <Button style={buttonStyle} className="floatButton" type="primary" icon="plus" onClick={() => to ? history.push(to) : null} size="large" shape="circle" />
    </Tooltip>
)

FloatButton.propTypes = {
    history: PropTypes.object,
    label: PropTypes.string,
    to: PropTypes.string
}

export default FloatButton