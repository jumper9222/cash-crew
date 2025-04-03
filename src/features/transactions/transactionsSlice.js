import { createSlice } from "@reduxjs/toolkit"
import { DateTime } from "luxon";
import {
    deleteTransaction,
    // fetchComments,
    fetchTransactionsByUser,
    // postComment,
    postTransaction,
    // updateComment,
    updateTransaction
} from "./transactionsActions";

const transactionsSlice = createSlice({
    name: "transactions",
    initialState: {
        transactions: {},
        transactionIds: [],
        comments: {},
        splits: {},
        loading: {
            transactions: false,
            fetchingTransactions: false,
            comments: false,
        }
    },
    reducers: {},
    extraReducers: (builder) => {
        //Fetch transactions
        builder.addCase(fetchTransactionsByUser.pending, (state) => {
            console.log("Fetching transactions...")
            state.loading.fetchingTransactions = true;
        });
        builder.addCase(fetchTransactionsByUser.fulfilled, (state, action) => {
            const transactions = action.payload
            console.log("Transactions fetched successfully")

            //Set fetched transactions into transactions stated
            state.transactions = transactions.reduce((acc, {
                transaction_id,
                title,
                description,
                date,
                total_amount,
                currency,
                paid_by,
                category,
                is_split,
                photo_url
            }) => {
                if (!acc[transaction_id]) {
                    acc[transaction_id] = {
                        id: transaction_id,
                        title,
                        description,
                        date,
                        total_amount,
                        currency,
                        paid_by,
                        category,
                        is_split,
                        photo_url
                    }
                }
                return acc
            }, {});

            //Set fetched transactions into splits state
            state.splits = transactions.reduce((acc, {
                transaction_id,
                split_id,
                split_uid,
                split_amount,
                split_category,
                is_split
            }) => {
                if (is_split) {
                    if (!acc[transaction_id]) {
                        acc[transaction_id] = {};
                    }
                    acc[transaction_id][split_uid] = {
                        id: split_id,
                        split_amount,
                        category: split_category,
                    }
                }
                return acc
            }, {})
            state.transactionIds = Object.values(state.transactions).sort((a, b) =>
                DateTime.fromISO(b.date) - DateTime.fromISO(a.date)
            ).map((transaction) => {
                return transaction.id
            })
            console.log(state.transactions, state.transactionIds)
            state.loading.fetchingTransactions = false;
        });
        builder.addCase(fetchTransactionsByUser.rejected, (state, action) => {
            console.error("Error fetching transactions", action.error.message);
            state.loading.fetchingTransactions = false;
        });

        //Fetch comments
        // builder.addCase(fetchComments.pending, (state) => {
        //     console.log("Fetching comments...")
        //     state.loading.comments = true;
        // });
        // builder.addCase(fetchComments.fulfilled, (state, action) => {
        //     console.log("Comments fetched successfully")
        //     const comments = action.payload.sort((a, b) => { a.date_created - b.date_created });
        //     state.comments = action.payload.reduce((accu, { transaction_id, ...rest }) => {
        //         return accu[transaction_id] = { ...rest }
        //     }, {})
        // });
        // builder.addCase(fetchComments.rejected, (state, action) => {
        //     console.error("Error fetching comments", action.error.message);
        //     state.loading.comments = false;
        // });

        //Post transactions
        builder.addCase(postTransaction.pending, (state) => {
            console.log("Posting transaction...")
            state.loading.transactions = true;
        });
        builder.addCase(postTransaction.fulfilled, (state, action) => {
            console.log("Transaction posted successfully.")
            const { transaction, splits } = action.payload
            const { transaction_id, ...rest } = transaction

            //Add new transaction to transactions state
            state.transactions[transaction_id] = { id: transaction_id, ...rest }

            //Add new splits to splits state if transaction is split
            if (splits) {
                state.splits[transaction_id] = splits.reduce((accu, { user_id, ...rest }) => {
                    return accu[user_id] = { ...rest }
                }, {})
            }

            //Find index of new transaction and insert into transactionIds array
            const newTransactionIndex = state.transactionIds.findIndex(id => {
                const exTransactionDate = state.transactions[id].date
                return new Date(exTransactionDate) < new Date(transaction.date)
            }
            )
            console.log(`new transaction index: ${newTransactionIndex} ${new Date(transaction.date)} ${new Date()}`)
            if (newTransactionIndex === -1) {
                state.transactionIds.push(transaction_id)
            } else { state.transactionIds.splice(newTransactionIndex, 0, transaction_id) }

            state.loading.transactions = false;
        });
        builder.addCase(postTransaction.rejected, (state, action) => {
            console.error("Error posting transaction", action.error.message);
            state.loading.transactions = false;
        });

        //Post comments
        // builder.addCase(postComment.pending, (state) => {
        //     console.log("Posting comment...")
        //     state.loading.comments = true;
        // });
        // builder.addCase(postComment.fulfilled, (state, action) => {
        //     console.log("Comment posted successfully.")
        //     const transactions = state.transactions
        //     const index = transactions.findIndex(transaction => transaction.id === action.payload.transasction_id);
        //     const transaction = transactions[index]
        //     const comments = transaction?.comments || null
        //     if (comments) {
        //         comments = [...comments, action.payload]
        //     } else {
        //         transaction = { ...transaction, comments: [...action.payload] }
        //     }
        //     state.loading.comments = false;
        // });
        // builder.addCase(postComment.rejected, (state, action) => {
        //     console.error("Error posting comment", action.error.message);
        //     state.loading.comments = false;
        // });

        //Update transactions
        builder.addCase(updateTransaction.pending, (state) => {
            console.log("Updating transaction...")
            state.loading.transactions = true;
        });
        builder.addCase(updateTransaction.fulfilled, (state, action) => {
            console.log('Action payload: ', action.payload)
            //Destruction action.payload
            const { transaction, splits } = action.payload
            //Destructure transaction
            const {
                id,
                user_id: paid_by,
                ...rest
            } = transaction

            //Update existing transaction
            state.transactions[id] = { ...rest, paid_by, id }
            console.log(state.transactions[id])

            if (splits.length > 0) {
                state.splits[id] = splits.reduce((accu, { user_id, ...rest }) => {
                    return accu[user_id] = { ...rest }
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
        // builder.addCase(updateComment.pending, (state) => {
        //     state.loading.comments = true;
        // })

        //Delete transaction
        builder.addCase(deleteTransaction.pending, (state) => {
            state.loading.transactions = true;
        })
        builder.addCase(deleteTransaction.fulfilled, (state, action) => {
            const deletedTransactionId = action.payload.id
            const { transactions, splits } = state
            //Remove deleted transaction from transactions, splits and transactionIds states
            delete transactions[deletedTransactionId]
            delete splits[deletedTransactionId]
            state.transactionIds = state.transactionIds.filter(id => id !== deletedTransactionId)
            console.log(`
                        Transaction deleted successfully
                        Deleted Id: ${deletedTransactionId} 
                        Updated transaction ids: ${state.transactionIds}
                        transactions: `, state.transactions)
            state.loading.transactions = false;
        })
        builder.addCase(deleteTransaction.rejected, (state, action) => {
            state.loading.transactions = false;
            console.error("There was an error deleting the transaction: ", action.error.message)
        })
    }
});

export default transactionsSlice.reducer;