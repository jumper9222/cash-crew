export interface TransactionsState {
    transactions: {
        [key: string]: Transaction;
    };
    transactionIds: string[];
    comments: {
        [key: string]: Comment;
    };
    splits: {
        [key: string]: Split;
    };
    loading: {
        transactions: boolean;
        fetchingTransactions: boolean;
        comments: boolean;
    };
}

export interface Transaction {
    id: string;
    title: string;
    description: string;
    amount: number;
    currency: Currency;
    date: Date;
    paidBy: string;
    isSplit: boolean;
    category: string;
    date_created: Date;
    date_modified: Date;
    photoURL: string;
}
export interface Comment {
    id: string;
    text: string;
    createdAt: string;
}

export interface Split {
    id: string;
    user_id: string;
    transaction_id: string;
    split_amount: number;
    currency: Currency;
    category: string;
}

