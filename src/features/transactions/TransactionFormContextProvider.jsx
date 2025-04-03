import { DateTime } from "luxon";
import { createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchCurrencies } from "../../utilities/currencyUtils";
import { categoriesArray } from "../current-user/currentUserSelector";

export const TransactionFormContext = createContext(null);

export default function TransactionFormContextProvider({ children }) {
    const [showModal, setShowModal] = useState('');
    const transactions = useSelector(state => state.transactions.transactions);
    const { transaction_id } = useParams();
    const defaultCurrency = useSelector(state => state.currentUser.settings.defaultCurrency);
    const categories = useSelector(categoriesArray);

    const formDataInitialState = {
        title: '',
        description: '',
        date: DateTime.local().toFormat('yyyy-MM-dd'),
        totalAmount: 0.00,
        currency: '',
        category: '',
        isSplit: false,
        image: null,
        splits: []
    }

    const [formData, setFormData] = useState(formDataInitialState);
    const [currencies, setCurrencies] = useState([]);

    const showNewTransModal = () => {
        setShowModal('new')
    };

    const showEditTransModal = () => {
        setShowModal('edit')
    };

    const onHide = () => {
        setShowModal('')
        setFormData(formDataInitialState)
    }

    const updateForm = (field, value) => {
        setFormData(prevState => ({
            ...prevState,
            [field]: value
        }))
    }

    useEffect(() => {
        fetchCurrencies()
            .then((currencies) => {
                setCurrencies(currencies);
            })
    }, [])

    useEffect(() => {
        if (showModal === 'edit') {
            const transactionData = transactions[transaction_id]
            setFormData({
                transaction_id,
                title: transactionData.title,
                description: transactionData.description,
                date: DateTime.fromISO(transactionData.date).toFormat('yyyy-MM-dd'),
                totalAmount: transactionData.total_amount,
                currency: currencies.find(c => c.value === transactionData.currency),
                category: categories.find(c => c.value === transactionData.category),
                isSplit: transactionData.is_split,
                paidBy: transactionData.paid_by,
                image: null,
                photoURL: transactionData.photo_url,
                splits: []
            });
        } else if (showModal === 'new') {
            updateForm('currency', currencies.find(c => c.value === defaultCurrency));
        }
    }, [showModal])

    return (
        <TransactionFormContext.Provider value={{
            formData,
            updateForm,
            currencies,
            showModal,
            showNewTransModal,
            showEditTransModal,
            onHide,
            categories
        }}>
            {children}
        </TransactionFormContext.Provider>
    )
}