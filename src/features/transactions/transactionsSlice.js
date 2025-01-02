import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit"
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

const transactionsSlice = createSlice({
    name: "transactions",
    initialState: {
        transactions: {},
        comments: {},
        splits: {},
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
            const { transactions } = action.payload
            console.log("Transactions fetched successfully")
            state.transactions = transactions.reduce((acc, { transaction_id, title, description, date, total_amount, currency, paid_by, category, is_split }) => {
                if (!acc[transaction_id]) {
                    acc[transaction_id] = { title, description, date, total_amount, currency, paid_by, category, is_split }
                }
                return acc
            }, {});
            state.splits = transactions.reduce((acc, { transaction_id, split_id, split_uid, split_amount, split_category, is_split }) => {
                if (is_split) {
                    if (!acc[transaction_id]) {
                        acc[transaction_id] = {};
                    }
                    acc[transaction_id][split_id] = {
                        user_id: split_uid,
                        amount: split_amount,
                        category: split_category,
                    }
                }
                return acc
            }, {})
            console.log(action.payload)
            console.log({ transactions: state.transactions, splits: state.splits })
            state.loading.transactions = false;
        });
        builder.addCase(fetchTransactionsByUser.rejected, (state, action) => {
            console.error("Error fetching transactions", action.error.message);
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
            console.error("Error fetching comments", action.error.message);
            state.loading.comments = false;
        });

        //Post transactions
        builder.addCase(postTransaction.pending, (state) => {
            console.log("Posting transaction...")
            state.loading.transactions = true;
        });
        builder.addCase(postTransaction.fulfilled, (state, action) => {
            console.log("Transaction posted successfully.")
            const { transaction, splits } = action.payload
            const { transaction_id, ...rest } = transaction
            console.log("action payload: ", action.payload)

            state.transactions[transaction_id] = { ...rest }
            if (splits) {
                state.splits[transaction_id] = splits.reduce((accu, { id, ...rest }) => {
                    return accu[id] = { ...rest }
                }, {})
            }
            state.loading.transactions = false;
        });
        builder.addCase(postTransaction.rejected, (state, action) => {
            console.error("Error posting transaction", action.error.message);
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
            console.error("Error posting comment", action.error.message);
            state.loading.comments = false;
        });

        //Update transactions
        builder.addCase(updateTransaction.pending, (state) => {
            console.log("Updating transaction...")
            state.loading.transactions = true;
        });
        builder.addCase(updateTransaction.fulfilled, (state, action) => {
            console.log('Action payload: ', action.payload)
            const {
                id: transaction_id,
                user_id: paid_by,
                ...rest
            } = action.payload.transaction
            state.transactions[transaction_id] = { ...rest, paid_by }
            console.log(state.transactions[transaction_id])
            const splits = action.payload.splits;
            if (splits.length > 0) {
                state.splits[transaction_id] = splits.reduce((accu, { id, ...rest }) => {
                    return accu[id] = { ...rest }
                }, {})
            }
            console.log("Transaction updated successfully.")
            state.loading.transactions = false;
        });
        builder.addCase(updateTransaction.rejected, (state, action) => {
            console.error("Error updating transaction", action.error.message);
            state.loading.transactions = false;
        });

        //Update comment
        builder.addCase(updateComment.pending, (state) => {
            state.loading.comments = true;
        })

        //Delete transaction
        builder.addCase(deleteTransaction.pending, (state) => {
            state.loading.transactions = true;
        })
        builder.addCase(deleteTransaction.fulfilled, (state, action) => {
            state.loading.transactions = false;
            console.log("action.payload: ", action.payload)
            delete state.transactions[action.payload.id]
            delete state.splits[action.payload.id]
        })
        builder.addCase(deleteTransaction.rejected, (state) => {
            state.loading.transactions = false;
            console.error("There was an error deleting the transaction")
        })
    }
});

//Selectors
export const fetchTransactionFromId = (transaction_id) => createSelector(
    [
        state => state.transactions.transactions,
        state => state.transactions.splits
    ],
    (transactions, splits) => {
        const transaction = transactions[transaction_id];
        let splitsObject = {}
        if (transaction && transaction.is_split) {
            splitsObject = splits[transaction_id] || {}
        }
        return { transaction, splits: splitsObject }
    },
)

export default transactionsSlice.reducer;