import React, { useState } from 'react'

interface IntermediateValues {
    categories: string[]
    title: string
    desc: string
    dueDate: string
    priority: string
}

interface EditCardProviderProps {
    children: React.ReactNode
}

export const EditCardContext = React.createContext<{
    intermediateValues: IntermediateValues
    setIntermediateValues: React.Dispatch<
        React.SetStateAction<IntermediateValues>
    >
}>({
    intermediateValues: {
        categories: [''],
        title: '',
        desc: '',
        dueDate: '',
        priority: '',
    },
    setIntermediateValues: () => {},
})

export const EditCardProvider: React.FC<EditCardProviderProps> = ({
    children,
}) => {
    const [intermediateValues, setIntermediateValues] =
        useState<IntermediateValues>({
            categories: [''],
            title: '',
            desc: '',
            dueDate: '',
            priority: '',
        })

    return (
        <EditCardContext.Provider
            value={{ intermediateValues, setIntermediateValues }}
        >
            {children}
        </EditCardContext.Provider>
    )
}
