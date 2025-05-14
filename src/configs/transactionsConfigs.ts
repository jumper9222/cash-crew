export const initialState: TransactionsState = {
    transactions: {},
    transactionIds: [],
    comments: {},
    splits: {},
    loading: {
        transactions: false,
        fetchingTransactions: false,
        comments: false,
    }
}