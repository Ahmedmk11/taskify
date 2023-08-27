import React from 'react'
import { Modal, List, Badge } from 'antd'
import { Dayjs } from 'dayjs'
import { Task } from '../../app/Task'
import { useNavigate } from 'react-router-dom'

interface DayPopupProps {
    selectedDay: Dayjs
    onClose: () => void
    tasks: Task[]
}

const DayPopup: React.FC<DayPopupProps> = ({ selectedDay, onClose, tasks }) => {
    const navigate = useNavigate()
    return (
        <Modal
            open={selectedDay !== null}
            onCancel={onClose}
            footer={null}
            destroyOnClose
            className="modal-item"
        >
            <List
                header={`Tasks for ${selectedDay.format('MMMM D, YYYY')}`}
                dataSource={tasks}
                renderItem={(task) => (
                    <>
                        <List.Item
                            className="modal-list"
                            onClick={() => {
                                navigate('/task/' + task.id)
                            }}
                        >
                            <span
                                className={`modal-priority li-${task.priority}`}
                            ></span>
                            <div className="modal-title">{task.title}</div>
                            <div className="modal-desc">{task.desc}</div>
                        </List.Item>
                        <div></div>
                    </>
                )}
            />
        </Modal>
    )
}

export default DayPopup
