// --------------------------------------------------------------
// Home page frontend code.
// --------------------------------------------------------------

import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import NavBar from '../components/NavBar'
import ToolBar from '../components/ToolBar'
import ActionBar from '../components/ActionBar'
import Filter from '../components/Filter'
import plusIcn from '../../assets/icons/plus.svg'
import Card from '../components/Card'
import ReactDOM from 'react-dom'

type HomeProps = {
    currentPage: string
}

function Home(props: HomeProps) {
    const { currentPage } = props
    const [targetCardID, setTargetCardID] = useState<string>('')
    const [isDraggedOnce, setIsDraggedOnce] = useState([true, true, true])
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        document
            .getElementById('filters-container')
            ?.classList.add('visibility-hidden')
    }, [])

    function onHover(ev: any) {
        const targetCard =
            targetCardID == ''
                ? 'nograb'
                : document.getElementById(targetCardID)
        if (targetCard == 'nograb') {
            return
        }
        const targetColumn = ev.target.closest('.column')
        const targetCardHeight = targetCard!.offsetHeight
        const targetColumnHeight = targetColumn!.offsetHeight
        const index = targetColumn.id.split('-')[1] - 1
        if (ev.buttons === 1 && isDraggedOnce[index]) {
            targetColumn.style.height = `${
                targetColumnHeight + targetCardHeight
            }px`
            isDraggedOnce[index] = false
            setIsDraggedOnce(isDraggedOnce)
        }
    }

    function allowDrop(ev: any) {
        ev.preventDefault()
    }

    function createCardPop(col = 'col-1') {
        const chk = document.getElementById('create-new-task')
        chk?.remove()
        const colEl = document.getElementById(col)
        const container = document.createElement('div')
        container.id = 'create-new-task'
        ReactDOM.render(<Card type="create" />, container)
        const cards = colEl!.querySelector('.cards')
        cards!.insertBefore(container, cards!.childNodes[0])
    }

    const createCard = (id: string) => {
        const ccid = `draggable-card-${id}`
        const cid = `card-${id}`
        return (
            <div
                className="draggable-card"
                id={ccid}
                draggable="true"
                onDragStart={drag}
                onDragEnd={handleDragEnd}
            >
                <Card id={cid} />
            </div>
        )
    }

    const showFilters = () => {
        setIsVisible(true)
        document
            .getElementById('filters-container')
            ?.classList.remove('visibility-hidden')
    }

    const hideFilters = () => {
        setIsVisible(false)
        setTimeout(() => {
            document
                .getElementById('filters-container')
                ?.classList.add('visibility-hidden')
        }, 300)
    }

    function drop(ev: any) {
        ev.preventDefault()
        const data = ev.dataTransfer.getData('text')
        const draggedElement = document.getElementById(data)
        const targetColumn = ev.target.closest('.column')
        const targetCardsContainer = targetColumn.querySelector('.cards')
        const targetCard = ev.target.closest('[id^="draggable-card"]')
        if (targetCard) {
            const targetCardRect = targetCard.getBoundingClientRect()
            const dropPosition = ev.clientY
            if (dropPosition < targetCardRect.top + targetCardRect.height / 2) {
                targetCardsContainer.insertBefore(draggedElement, targetCard)
            } else {
                targetCardsContainer.insertBefore(
                    draggedElement,
                    targetCard.nextSibling
                )
            }
        } else {
            targetCardsContainer.appendChild(draggedElement)
        }
    }

    function drag(ev: any) {
        const target = ev.target.closest('[id^="draggable-card"]')
        setTargetCardID(target.id)
        ev.dataTransfer.setData('text', target.id)
    }

    function handleDragEnd() {
        setTargetCardID('')
        const columns = document.querySelectorAll(
            '.column'
        ) as NodeListOf<HTMLElement>
        columns.forEach((column) => {
            column.style.height = 'fit-content'
        })
        setIsDraggedOnce([true, true, true])
    }

    return (
        <div id="home-body">
            <ToolBar />
            <div id="home-content">
                <NavBar currentPage={currentPage} />
                <div id="home-main">
                    <ActionBar
                        isDisabled={false}
                        handleCreate={createCardPop}
                        handleFilters={showFilters}
                    />
                    <div
                        id="home-main-content"
                        className={
                            isVisible
                                ? 'show-filter-container'
                                : 'hide-filter-container'
                        }
                    >
                        <Filter
                            className={isVisible ? '' : 'hide-filters'}
                            hideFilters={hideFilters}
                            categories={['Main', 'Work', 'UI Design']}
                        />
                        <div
                            id="col-1"
                            onDrop={drop}
                            onDragEnter={onHover}
                            className="column"
                            onDragOver={allowDrop}
                        >
                            <div className="cards-status">
                                <p>Todo</p>
                                <div className="image-container">
                                    <img
                                        onClick={() => {
                                            createCardPop('col-1')
                                        }}
                                        src={plusIcn}
                                        alt="plus icon"
                                    />
                                </div>
                            </div>
                            <div className="cards"></div>
                        </div>
                        <div
                            id="col-2"
                            onDrop={drop}
                            onDragEnter={onHover}
                            className="column"
                            onDragOver={allowDrop}
                        >
                            <div className="cards-status">
                                <p>In Progress</p>
                                <div className="image-container">
                                    <img
                                        onClick={() => {
                                            createCardPop('col-2')
                                        }}
                                        src={plusIcn}
                                        alt="plus icon"
                                    />
                                </div>
                            </div>
                            <div className="cards"></div>
                        </div>
                        <div
                            id="col-3"
                            onDrop={drop}
                            onDragEnter={onHover}
                            className="column"
                            onDragOver={allowDrop}
                        >
                            <div className="cards-status">
                                <p>Done</p>
                                <div className="image-container">
                                    <img
                                        onClick={() => {
                                            createCardPop('col-3')
                                        }}
                                        src={plusIcn}
                                        alt="plus icon"
                                    />
                                </div>
                            </div>
                            <div className="cards"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

Home.propTypes = {
    currentPage: PropTypes.string,
}

Home.defaultProps = {
    currentPage: 'home',
}

export default Home
