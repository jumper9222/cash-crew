import { createSelector } from "@reduxjs/toolkit";
import { DateTime } from "luxon";

export const getTransactions = state => state.transactions.transactions;
export const getSplits = state => state.transactions.splits;
export const getComments = state => state.transactions.comments;
export const getLoading = state => state.transactions.loading;
export const getSettings = state => state.currentUser.settings;

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
        console.log('checking if splits exists: ', splits, Object.entries(transactions), user_id)
        let splitTransactionIds = []
        const nonSplitTotal = Object.values(transactions).reduce((total, { is_split, total_amount, id }) => {
            if (!is_split) {
                return total + parseFloat(total_amount)
            } else {
                console.log('hello', id)
                splitTransactionIds.push(id)
                return total
            }
        }, 0);
        const splitsTotal = splitTransactionIds.reduce((total, transaction_id) => {
            console.log(splits[transaction_id][user_id], transaction_id)
            return total + parseFloat(splits[transaction_id][user_id].split_amount)
        }, 0)

        return nonSplitTotal + splitsTotal
    }
)

export const calculateTotalPersonalExpenseByCategory = (user_id) => createSelector(
    [getTransactions, getSplits],
    (transactions, splits) => {
        let totals = {};
        let splitTransactionIds = [];
        Object.values(transactions).map(({ is_split, total_amount, category, id }) => {
            if (!is_split) {
                return totals[category] = !totals[category] ? parseFloat(total_amount) : totals[category] + parseFloat(total_amount)
            } else {
                return splitTransactionIds.push(id)
            }
        },);
        Object.values(splitTransactionIds).map((transactionId) => {
            const { category, split_amount } = splits[transactionId][user_id];
            return totals[category] = !totals[category] ? parseFloat(split_amount) : totals[category] + parseFloat(split_amount)
        });
        console.log(totals)
        return totals;
    }
)

export const calculateTotalPersonalExpenseByMonth = (user_id, month, year) => createSelector(
    [getTransactions, getSplits, getSettings],
    (transactions, splits, settings) => {
        const transactionsThisMonth = Object.values(transactions).filter((transaction) => {
            const date = DateTime.fromISO(transaction.date)
            return date.month === month && date.year === year && transaction.currency === settings.defaultCurrency
        })
        let splitTransactionIds = []
        const nonSplitTotal = transactionsThisMonth.reduce((total, { is_split, total_amount, id }) => {
            if (!is_split) {
                return total + parseFloat(total_amount)
            } else {
                console.log('hello', id)
                splitTransactionIds.push(id)
                return total
            }
        }, 0);
        const splitsTotal = splitTransactionIds.reduce((total, transaction_id) => {
            console.log(splits[transaction_id][user_id], transaction_id)
            return total + parseFloat(splits[transaction_id][user_id].split_amount)
        }, 0)

        return nonSplitTotal + splitsTotal
    }
)

export const calculateTotalPersonalExpenseByCategoryByMonth = (user_id, month, year) => createSelector(
    [getTransactions, getSplits, getSettings],
    (transactions, splits, settings) => {
        //Get the categories object from currentUser slice
        const categories = settings.categories;

        //filter out the transactions for the current month and year
        const transactionsThisMonth = Object.values(transactions).filter((transaction) => {
            const date = DateTime.fromISO(transaction.date)
            //Returns transactions from the current month and year with the default currency only
            return date.month === month && date.year === year && transaction.currency === settings.defaultCurrency
        })

        //Initialize an empty object to store the totals for each category
        let totals = {};
        let splitTransactionIds = [];

        //Iterate through the transactions for the current month and year, 
        transactionsThisMonth.forEach(({ is_split, total_amount, category, id }) => {
            //If main category, adds total to main category and creates a subcategory of the main category
            if (!is_split && !categories[category].parentCategory) {
                totals[category] = totals[category] || { total: 0, subCategory: {} };
                totals[category].total = !totals[category].total ? parseFloat(total_amount) : totals[category].total + parseFloat(total_amount);
                totals[category].subCategory[category] = !totals[category].subCategory[category] ? parseFloat(total_amount) : totals[category].subCategory[category] + parseFloat(total_amount)
            } else if (!is_split && categories[category].parentCategory) { //If subcategory, adds total to the main category and subcategory
                //Get the parent category ID
                const parentCategoryID = categories[category].parentCategoryID;

                //If the parent category does not exist in the totals object, create it
                totals[parentCategoryID] = totals[parentCategoryID] || { total: 0, subCategory: {} };

                //Add the total amount to the parent category
                totals[parentCategoryID].total += parseFloat(total_amount);

                //If the subcategory does not exist in the parent category, create it
                totals[parentCategoryID].subCategory[category] = totals[parentCategoryID].subCategory[category] || 0;

                //Add the total amount to the subcategory
                totals[parentCategoryID].subCategory[category] += parseFloat(total_amount);
            } else {
                splitTransactionIds.push(id)
            }
        });

        splitTransactionIds.map((transactionId) => {
            const { category, split_amount } = splits[transactionId][user_id];
            return totals[category] = !totals[category] ? parseFloat(split_amount) : totals[category] + parseFloat(split_amount)
        });
        console.log(totals)
        return totals;
    }
)

export const groupPersonalTransactionsByDate = (user_id) => createSelector(
    [getTransactions, getSplits],
    (transactions, splits) => {
        const groupedTransactions = Object.values(transactions).reduce((accu, transaction) => {
            const { total_amount, is_split, id, date, ...rest } = transaction
            if (!is_split) {
                accu[date] = accu[date] ? [...accu[date], transaction] : [transaction];
                return accu
            } else {
                accu[date] = accu[date] ? [...accu[date], { total_amount: splits[id][user_id].split_amount, is_split, id, date, ...rest }] : [{ total_amount: splits[id][user_id].split_amount, is_split, id, date, ...rest }];
                return accu
            }
        }, {});

        const transactionsArray = Object.entries(groupedTransactions).sort(([keyA, valueA], [keyB, valueB]) => {
            const dateA = DateTime.fromISO(keyA);
            const dateB = DateTime.fromISO(keyB);
            return dateB - dateA
        });
        console.log(transactionsArray)
        return transactionsArray
    }
)

export const getLatestDateModified = createSelector(
    [getTransactions],
    (transactions) => {
        const dates = Object.values(transactions).reduce((accu, transaction) => {
            if (transaction.date_modified) {
                accu.push(transaction.date_modified)
            }
            return accu
        }, []);
        const latestDate = dates.length > 0 ? new Date(Math.max(...dates.map(date => new Date(date)))).toISOString() : new Date(0).toISOString();
        return latestDate
    }
)