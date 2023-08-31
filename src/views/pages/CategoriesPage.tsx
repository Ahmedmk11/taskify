// --------------------------------------------------------------
// Categories page frontend code.
// --------------------------------------------------------------

import React, { useEffect, useRef, useState } from 'react'
import NavBar from '../components/NavBar'
import ToolBar from '../components/ToolBar'
import ActionBar from '../components/ActionBar'
import Footer from '../components/Footer'
import { User } from '../../app/User'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
    addNewCategoryToCurrentUser,
    deleteCategoryFromUser,
    readUserDataFromDb,
} from '../../firebase'
import labelIcn from '../../assets/icons/label.svg'
import { CloseOutlined } from '@ant-design/icons'
import { Button, Input, List, Skeleton, Typography, message } from 'antd'

function CategoriesPage() {
    const [user, setUser] = useState(null as unknown as User)
    const [isLoading, setIsLoading] = useState(true)
    const [categoryStatus, setCategoryStatus] = useState(false)
    const [alreadyExistsMsg, setAlreadyExistsMsg] = useState(false)
    const [categoryValue, setCategoryValue] = useState('')
    const [allCats, setAllCats] = useState(user ? user.categories : [])
    const [isAdding, setIsAdding] = useState(false)

    const tasks = user ? user.taskArray : []
    const inputRef = useRef<any>(null)

    const LabelIcon = () => (
        <img style={{ width: 24, height: 24 }} src={labelIcn} />
    )

    async function fetchUserData() {
        const auth = getAuth()
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userData = await readUserDataFromDb(
                    getAuth().currentUser!.uid
                )
                setUser(userData!)
                setIsLoading(false)
            }
        })
    }

    useEffect(() => {
        async function fetchData() {
            await fetchUserData()
        }
        fetchData()
    }, [])

    useEffect(() => {
        const hideFiltersContainer = () => {
            const filtersContainer =
                document.getElementById('filters-container')
            if (filtersContainer) {
                filtersContainer.classList.add('visibility-hidden')
            }
        }
        hideFiltersContainer()
        if (user) {
            setAllCats(user.categories)
        }
    }, [user])

    useEffect(() => {
        const newCatInput = document.getElementById('new-cat-input')
        if (isAdding) {
            newCatInput?.setAttribute('style', 'display: flex; opacity: 0;')
            setTimeout(() => {
                newCatInput?.classList.add('show-input')
            }, 150)
        } else {
            newCatInput?.classList.remove('show-input')
            setTimeout(() => {
                newCatInput?.setAttribute('style', 'display: none;')
            }, 200)
        }
    }, [isAdding])

    const CustomMessage = ({ msg }: { msg: string }) => (
        <div className="feedback-msg">{msg}</div>
    )

    const showMessage = (msg: string) => {
        message.open({
            content: <CustomMessage msg={msg} />,
            duration: 1.5,
        })
    }

    function saveCategory(value: string) {
        if (categoryValue.trim().length >= 2) {
            if (!allCats.includes(categoryValue)) {
                console.log('Category saved:', categoryValue.trim())
                setIsAdding(false)
                setCategoryStatus(false)
                setAllCats([...allCats, value])
                addNewCategoryToCurrentUser(value)
                showMessage(`New category added: ${categoryValue}`)
                setCategoryValue('')
                setAlreadyExistsMsg(false)
            } else {
                setCategoryStatus(true)
                setAlreadyExistsMsg(true)
            }
        } else {
            setCategoryStatus(true)
            setAlreadyExistsMsg(false)
        }
    }
    function deleteCategory(ev: any) {
        const catElement = ev.target.closest('[id^="category-"]')
        if (catElement) {
            const cat = catElement.id.split('category-')[1]
            if (cat) {
                deleteCategoryFromUser(cat)
                const updatedCats = allCats.filter(
                    (category) => category !== cat
                )
                setAllCats(updatedCats)
                showMessage(`Category deleted: ${cat}`)
            }
        }
    }

    function cancelCategory() {
        setIsAdding(false)
        setCategoryValue('')
        setCategoryStatus(false)
        setAlreadyExistsMsg(false)
    }

    return (
        <div id="categories-page-body">
            <ToolBar loading={isLoading} />
            <div id="categories-page-content">
                <NavBar currentPage={'categories'} />
                <div id="categories-page-main">
                    <ActionBar title="My Categories" />
                    <div id="categories-page-main-content">
                        <div id="user-categories">
                            <List
                                id="all-categories"
                                bordered
                                style={{ width: '85%' }}
                                dataSource={
                                    isLoading
                                        ? ['x', 'x', 'x', 'x', 'x']
                                        : allCats
                                }
                                renderItem={(item) =>
                                    isLoading ? (
                                        <Skeleton.Input
                                            style={{ width: '85%' }}
                                            active
                                            block
                                        />
                                    ) : (
                                        <List.Item id={`category-${item}`}>
                                            <Typography.Text
                                                mark
                                            ></Typography.Text>
                                            <div className="list-item">
                                                {item}
                                                <CloseOutlined
                                                    onClick={(ev: any) => {
                                                        deleteCategory(ev)
                                                    }}
                                                />
                                            </div>
                                        </List.Item>
                                    )
                                }
                            />
                            {!isLoading && (
                                <Button
                                    onClick={() => {
                                        setIsAdding(true)
                                    }}
                                >
                                    Add new category
                                </Button>
                            )}
                            <div id="new-cat-input">
                                <Input
                                    allowClear
                                    style={{ width: '400px' }}
                                    size="large"
                                    placeholder="Add a new category"
                                    prefix={<LabelIcon />}
                                    value={categoryValue}
                                    onChange={(ev) =>
                                        setCategoryValue(ev.target.value)
                                    }
                                    onKeyDown={(ev: any) => {
                                        if (ev.key === 'Enter') {
                                            saveCategory(ev.target.value)
                                        }
                                    }}
                                    status={categoryStatus ? 'error' : ''}
                                    ref={inputRef}
                                />
                                {alreadyExistsMsg && (
                                    <p
                                        style={{
                                            margin: 5,
                                            fontSize: 12,
                                            color: 'red',
                                        }}
                                    >
                                        This category already exists.
                                    </p>
                                )}
                                <div id="new-cat-buttons">
                                    <Button
                                        danger
                                        onClick={() => {
                                            cancelCategory()
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="primary"
                                        onClick={(ev: any) => {
                                            saveCategory(categoryValue)
                                        }}
                                    >
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default CategoriesPage
