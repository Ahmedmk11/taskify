// --------------------------------------------------------------
// Card react component.
// --------------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'

import settingsIcn from '../../assets/icons/settings.svg'
import dateIcn from '../../assets/icons/date.svg'

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
            <div id="card-container">
                <div id="card-info-settings">
                    {
                        <div id="card-categories">
                            {categories.length >= 2 && (
                                <div className="category">{categories[1]}</div>
                            )}
                            {categories.length >= 3 && (
                                <div className="category">{categories[2]}</div>
                            )}
                        </div>
                    }
                    <div id="card-settings">
                        <img src={settingsIcn} alt="Icon for settings" />
                    </div>
                </div>
                <div id="card-body">
                    <div id="card-title">{title}</div>
                    <div id="card-description">{description}</div>
                </div>
                <div id="card-bottom">
                    <img src={dateIcn} alt="date icon" />
                    <p>Due to: <span>16 May</span></p>
                </div>
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
