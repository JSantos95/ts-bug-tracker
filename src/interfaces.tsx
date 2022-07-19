import { UseMutationResult } from "react-query"

export interface User {
    userId?: number,
    username: string,
    email?: string,
    password: string,
    company?: number,
}

export interface Company {
    companyId: number,
    companyName: string,
    owner?: number,
}

export interface Bug {
    bugId: number,
    bugName: string,
    type: string,
    description: string,
    status: string,
    priority: string,
    reporterId: number,
    assigneeId: number
}

export interface Employees {
    userId: number, 
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