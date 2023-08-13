// --------------------------------------------------------------
// Card react component.
// --------------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'

import settingsIcn from '../../assets/icons/settings.svg'

type CardProps = {
    categories: string[]
    title: string
    description: string
    date: string
}

function Card(props: CardProps) {
    const { categories, title, description, date } = props

    return (
        <div id="card">
            <div id="card-info-settings">
                <div id="priority"></div>
                <div id="card-settings">
                    <img src={settingsIcn} alt="Icon for settings" />
                </div>
            </div>
            <div id="card-body">
                <div id="card-title">{title}</div>
                <div id="card-description">{description}</div>
            </div>
            <div id="bottom">
                <p>View More</p>
            </div>
        </div>
    )
}

Card.propTypes = {
    categories: PropTypes.arrayOf(PropTypes.string),
    class: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    date: PropTypes.string,
}

Card.defaultProps = {
    categories: ['Main', 'Work'],
    title: 'Finish Website',
    description: 'Finish the website by the end of the week.',
    date: '18/08/2023',
}

export default Card

{
    /* <div id="card-categories">
                    {categories.map((category) => (
                        <div className="category">{category}</div>
                    ))}
                </div> */
}
