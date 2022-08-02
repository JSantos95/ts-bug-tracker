import { UseMutationResult } from "react-query"

export interface User {
    _id?: string,
    username: string,
    email?: string,
    password: string,
    companyId?: string,
}

export interface Company {
    _id: string,
    companyName: string,
    owner?: number,
}

export interface Bug {
    _id: string,
    bugName: string,
    type: string,
    description: string,
    status: string,
    priority: string,
    reporterId: string,
    assigneeId: string
}

export interface Employees {
    _id: string,
    username: string,
}

export interface AddProps {
    addBugMutation: any
}

export interface Check {
    message: string,
    doThis: () => void,
    idTag: string
}

export interface LoginProps {
    newUser?: boolean,
    expired?: boolean,
}