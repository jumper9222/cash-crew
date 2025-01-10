import { createSelector } from "@reduxjs/toolkit";

export const getTransactions = state => state.transactions.transactions;
export const getSplits = state => state.transactions.splits;
export const getComments = state => state.transactions.comments;
export const getLoading = state => state.transactions.loading;

export const fetchTransactionFromId = (transaction_id) => createSelector(
    [getTransactions, getSplits],
    (transactions, splits) => {
        const transaction = transactions[transaction_id];
        let splitsObject = {}
        if (transaction && transaction.is_split) {
            splitsObject = splits[transaction_id] || {}
        }
        return { transaction, splits: splitsObject }
    },
)

export const sortTransactionsByDate = () => createSelector(
    [getTransactions],
    (transactions) => {
        const transactionsArray = Object.entries(transactions).map(([key, values]) => {
            return { id: key, ...values }
        })
        console.log(`Sorted transactions: ${transactionsArray}`)
        return transactionsArray.sort((a, b) => {
            new Date(b.date) - new Date(a.date)
        })
    }
)

export const calculateTotalPersonalExpense = (user_id) => createSelector(
    [getTransactions, getSplits],
    (transactions, splits) => {
        let splitTransactionIds = []
        const nonSplitTotal = Object.values(transactions).reduce((total, { is_split, total_amount }) => {
            if (!is_split) {
                return total + parseFloat(total_amount)
            } else {
                splitTransactionIds.push(id)
            }
        }, 0);
        const splitsTotal = splitTransactionIds.reduce((total, transaction_id) => {
            return total + parseFloat(splits[transaction_id][user_id].amount)
        }, 0)

        return nonSplitTotal + splitsTotal
    }
)

export const calculateTotalPersonalExpenseByCategory = (user_id) => createSelector(
    [getTransactions, getSplits],
    (transactions, splits) => {
        let totals = {};
        let splitTransactionIds = [];
        Object.values(transactions).map(({ is_split, total_amount, category }) => {
            if (!is_split) {
                return totals[category] = !totals[category] ? parseFloat(total_amount) : totals[category] + parseFloat(total_amount)
            } else {
                return splitTransactionIds.push(transaction.id)
            }
        },);
        Object.values(splitTransactionIds).map((transactionId) => {
            const { category, amount } = splits[transactionId][user_id];
            return totals[category] = totals[category] + parseFloat(amount)
        });
        console.log(totals)
        return totals;
    }
)