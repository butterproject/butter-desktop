import React from 'react';
import PropTypes from 'prop-types'

import style from '../styl/style.styl';

const BackgroundImage = ({url, visible}) => (
    <div className={`${style.backdrop}`}
         style={{
             backgroundImage: `url(${url})`,
             opacity: visible ? 1 : 0,
             transition: `opacity 2s`
         }}>
    </div>)

class RotatingImages extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            idx: 0,
            show: 0,
            hide: -1 % props.imgs.length
        }
    }

    componentWillMount() {

        this.timer = setInterval(() => {
            this.setState((state, props) => ({
                hide: state.idx,
            }))

            setTimeout(() => (
                this.setState((state, props) => ({
                    idx: (state.idx + 1) % props.imgs.length
                }))
            ), this.props.switchTime*10)

            setTimeout(() => (
                this.setState((state, props) => ({
                    show: state.idx
                }))
            ), this.props.switchTime*200)
        }, this.props.switchTime*1000)
    }

    componentWillUnmount() {
        clearTimeout(this.timer)
    }

    render () {
        let {imgs, switchTime} = this.props;
        let {idx, hide, show} = this.state;
        let nextIdx = (idx + 1) % imgs.length;

        return ([
            <BackgroundImage key={idx} url={imgs[idx]} visible={idx !== hide} />,
            <BackgroundImage key={nextIdx} url={imgs[nextIdx]} visible={nextIdx === show} />
        ])
    }
}

RotatingImages.propTypes = {
    imgs: PropTypes.array.isRequired,
    switchTime: PropTypes.number.isRequired
}

RotatingImages.defaultProps = {
    switchTime: 100
}

export {RotatingImages as default}
