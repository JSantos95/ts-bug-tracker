import axios from "axios";  
import { Bug, User } from "../interfaces";

const bugTrackerApi = axios.create({
    baseURL: "https://localhost:7216/api/",
})

//For Bug Table
export const getBugs = async (auth: any) => {
    const response = await bugTrackerApi.get('Bug', { headers: { 'Authorization': `Bearer ${auth}` } });
    return response.data;
}

export const getBugsById = async (id: string, auth:any) => {
    const response = await bugTrackerApi.get('Bug/' + id, { headers: { 'Authorization': `Bearer ${auth}` } });
    return response.data;
}

export const getAllUserBugs = async (userId:string, auth:any) => {
    const response = await bugTrackerApi.get('Bug/user/' + userId, { headers: { 'Authorization': `Bearer ${auth}` } });
    return response.data;
}

export const getAllBugsByToken = async (token: any) => {
    const response = await bugTrackerApi.get('Bug/user/token/' + token, { headers: { 'Authorization': `Bearer ${token}` } });
    return response.data as Bug[];
}

export const addBug = async (bug: Bug, auth:any) => {
    return await bugTrackerApi.post('Bug', bug, { headers: { 'Authorization': `Bearer ${auth}` } });
}

export const updateBug = async (bug: Bug, auth:any) => {
    return await bugTrackerApi.put('Bug', bug, { headers: { 'Authorization': `Bearer ${auth}` } });
}

export const deleteBug = async (id: string, auth:any) => {
    return await bugTrackerApi.delete('Bug/' + id, { headers: { 'Authorization': `Bearer ${auth}` } });
}


//For User Table
export const getAllUser = async () => {
    const res = await bugTrackerApi.get('User');
    return res.data;
}

export const register = async (user: User) => {
    const res = await bugTrackerApi.post('User', user);
    return res.data;
}

export const login = async (user: User) => {
    const res = await bugTrackerApi.post('User/login', user);
    return res.data;
}

export const updateUser = async (user: User, auth: any) => {
    return await bugTrackerApi.put('User', user, { headers: { 'Authorization': `Bearer ${auth}` } });
}

export const deleteUser = async (id: string, auth: any) => {
    return await bugTrackerApi.delete('User/' + id, { headers: { 'Authorization': `Bearer ${auth}` } });
}

export const getUserById = async (id: string, auth: any) => {
    const res = await bugTrackerApi.get('User/' + id, { headers: { 'Authorization': `Bearer ${auth}` } });
    return res.data;
}

export const getAllCompanyUsersByToken = async (token: any) => {
    const res = await bugTrackerApi.get('User/company/' + token, { headers: { 'Authorization': `Bearer ${token}` } });
    return res.data;
}

export const getUserByToken = async (token: any) => {
    const res = await bugTrackerApi.post('User/auth/' + token, token, { headers: { 'Authorization': `Bearer ${token}` } });
    return res.data as User;
}

//For Company Table 
export const getAllCompanys = async () => {
    const res = await bugTrackerApi.get('Company')
    return res.data;
}