import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const BASE_URL = 'http://localhost:3001';

export const fetchTransactionsByUser = createAsyncThunk(
    "transactions/fetchTransactionsByUser",
    async (user_id) => {
        const response = await axios.get(`${BASE_URL}/transactions/${user_id}`)
        return { transactions: response.data };
    }
);

export const fetchComments = createAsyncThunk(
    "transactions/fetchComments",
    async (user_id) => {
        const response = await axios.get(`${BASE_URL}/transactions/${user_id}`)
        return response.data;
    }
);

export const postTransaction = createAsyncThunk(
    "transactions/postTransaction",
    async ({ transactionData, user_id }) => {
        console.log(user_id)
        const response = await axios.post(`${BASE_URL}/transaction/${user_id}`, transactionData)
        return response.data;
    }
);

export const postComment = createAsyncThunk(
    "transactions/postComment",
    async (data) => {
        const { transaction_id, comment } = data
        const response = await axios.post(`${BASE_URL}/comment/${transaction_id}`, comment)
        return response.data;
    }
);

export const updateTransaction = createAsyncThunk(
    "transactions/updateTransaction",
    async ({ transactionData, user_id }) => {
        const response = await axios.put(`${BASE_URL}/transaction/${user_id}/${transactionData.transaction_id}`, transactionData)
        return response.data;
    }
)

export const updateComment = createAsyncThunk(
    "transactions/updateComment",
    async (newComment) => {
        const response = await axios.put(`${BASE_URL}/comment/${transaction_id}/${comment_id}`, newComment)
        return response.data;
    }
)

export const deleteTransaction = createAsyncThunk(
    "transactions/deleteTransaction",
    async ({ transaction_id, user_id }) => {
        const response = await axios.delete(`${BASE_URL}/transaction/${user_id}/${transaction_id}`);
        return response.data;
    }
)
