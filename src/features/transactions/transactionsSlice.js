import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../components/AuthProvider";

const BASE_URL = 'http://localhost:3001';

export const fetchTransactionsByUser = createAsyncThunk(
    "transactions/fetchTransactionsByUser",
    async (user_id) => {
        const response = await axios.get(`${BASE_URL}/transactions/${user_id}`)
        return response.data;
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
    async (transactionData) => {
        const user_id = useContext(AuthContext.currentUser.uid)
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

const transactionsSlice = createSlice({
    name: "transactions",
    initialState: {
        transactions: [],
        comments: [], //may need to remove this
        splits: [], //may need to remove this
        loading: {
            transactions: false,
            comments: false,
        }
    },
    reducers: {},
    extraReducers: (builder) => {
        //Fetch transactions
        builder.addCase(fetchTransactionsByUser.pending, (state) => {
            console.log("Fetching transactions...")
            state.loading.transactions = true;
        });
        builder.addCase(fetchTransactionsByUser.fulfilled, (state, action) => {
            console.log("Transactions fetched successfully")
            state.transactions = action.payload;
            state.loading.transactions = false;
        });
        builder.addCase(fetchTransactionsByUser.rejected, (state, action) => {
            console.error("Error fetching transactions", action.payload);
            state.loading.transactions = false;
        });

        //Fetch comments
        builder.addCase(fetchComments.pending, (state) => {
            console.log("Fetching comments...")
            state.loading.comments = true;
        });
        builder.addCase(fetchComments.fulfilled, (state, action) => {
            console.log("Comments fetched successfully")
            const comments = action.payload.sort((a, b) => { a.date_created - b.date_created });
            state.transactions = state.transactions.map(transaction => {
                if (transaction.id === action.payload[0].transaction_id) {
                    return { ...transaction, comments }
                } else {
                    return transaction
                }
            });
            state.loading.comments = false;
        });
        builder.addCase(fetchComments.rejected, (state, action) => {
            console.error("Error fetching comments", action.payload);
            state.loading.comments = false;
        });

        //Post transactions
        builder.addCase(postTransaction.pending, (state) => {
            console.log("Posting transaction...")
            state.loading.transactions = true;
        });
        builder.addCase(postTransaction.fulfilled, (state, action) => {
            console.log("Transaction posted successfully.")
            state.transactions = [...state.transactions, action.payload.transaction]
            if (action.payload.splits) {
                state.splits = [...transactions, ...action.payload.splits]
            }
            state.loading.transactions = false;
        });
        builder.addCase(postTransaction.rejected, (state, action) => {
            console.error("Error posting transaction", action.payload);
            state.loading.transactions = false;
        });

        //Post comments
        builder.addCase(postComment.pending, (state) => {
            console.log("Posting comment...")
            state.loading.comments = true;
        });
        builder.addCase(postComment.fulfilled, (state, action) => {
            console.log("Comment posted successfully.")
            const transactions = state.transactions
            const index = transactions.findIndex(transaction => transaction.id === action.payload.transasction_id);
            const transaction = transactions[index]
            const comments = transaction?.comments || null
            if (comments) {
                comments = [...comments, action.payload]
            } else {
                transaction = { ...transaction, comments: [...action.payload] }
            }
            state.loading.comments = false;
        });
        builder.addCase(postComment.rejected, (state, action) => {
            console.error("Error posting comment", action.payload);
            state.loading.comments = false;
        });

        //Update transactions
        builder.addCase(updateTransaction.pending, (state) => {
            console.log("Updating transaction...")
            state.loading.transactions = true;
        });
        builder.addCase(updateTransaction.fulfilled, (state, action) => {
            console.log("Transaction updated successfully.")
            const transactions = state.transactions;
            const index = transactions.findIndex(transaction => transaction.id === action.payload.transasction.id);
            const transaction = transactions[index]
            transaction = {}
            if (comments) {
                comments = [...comments, action.payload]
            } else {
                transaction = { ...transaction, comments: [...action.payload] }
            }
            state.loading.transactions = false;
        });
        builder.addCase(updateTransaction.rejected, (state, action) => {
            console.error("Error updating transaction", action.payload);
            state.loading.transactions = false;
        });

        //Update comment
        builder.addCase(updateComment.pending, (state) => {
            state.loading.comments = true;
        })
    }
});

export default transactionsSlice.reducer;