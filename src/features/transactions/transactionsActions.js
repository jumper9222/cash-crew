import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase";
import { v4 as uuidv4 } from "uuid";
import { DateTime } from "luxon";


const BASE_URL = 'https://cash-crew-api.vercel.app';
// const BASE_URL = 'https://localhost:3001';

export const fetchTransactionsByUser = createAsyncThunk(
    "transactions/fetchTransactionsByUser",
    async ({ user_id, latestDateModified }) => {
        const response = await axios.get(`${BASE_URL}/transactions/${user_id}`, { params: { latestDateModified } });
        return response.data;
    }
);

// export const fetchComments = createAsyncThunk(
//     "transactions/fetchComments",
//     async (user_id) => {
//         const response = await axios.get(`${BASE_URL}/transactions/${user_id}`)
//         return response.data;
//     }
// );

export const postTransaction = createAsyncThunk(
    "transactions/postTransaction",
    async ({ transactionData, user_id }) => {
        const { image, ...rest } = transactionData;
        let photoURL = null;
        console.log('create transaction image: ', image)
        //If new transaction has an image, upload to firestore storage
        if (image) {
            const storageRef = ref(storage, `transaction-photos/${uuidv4()}-${image.name}`)
            await uploadBytes(storageRef, image)
                .then((snapshot) => getDownloadURL(snapshot.ref)
                )
                .then((url) => {
                    photoURL = url
                    console.log(`Transaction photo uploaded to firestore storage successfully.`)
                })
                .catch(error => console.error('Error uploading transaction photo: ', error.message))
        }
        const newTransactionData = { photoURL, ...rest }

        const response = await axios.post(`${BASE_URL}/transaction/${user_id}`, newTransactionData)
        return response.data;
    }
);

// export const postComment = createAsyncThunk(
//     "transactions/postComment",
//     async (data) => {
//         const { transaction_id, comment } = data
//         const response = await axios.post(`${BASE_URL}/comment/${transaction_id}`, comment)
//         return response.data;
//     }
// );

export const updateTransaction = createAsyncThunk(
    "transactions/updateTransaction",
    async ({ transactionData, user_id }) => {
        const { photoURL, image, ...rest } = transactionData;
        let newPhotoURL = photoURL;

        //If there is an existing image (photoURL exists) and there is a new image, delete image.
        if (photoURL && image) {
            const storageRef = ref(storage, photoURL);
            await deleteObject(storageRef)
                .then(() => console.log('Transaction photo has been deleted successfully.'))
                .catch((error) => console.error('There was an error deleting the photo: ', error.message))
        }

        //If there is a new image, upload, getURL and set to newPhotoURL
        if (image) {
            const storageRef = ref(storage, `transaction-photos/${uuidv4()}-${image.name}`)
            await uploadBytes(storageRef, image)
                .then((snapshot) => getDownloadURL(snapshot.ref)
                )
                .then((url) => {
                    newPhotoURL = url
                    console.log(`Transaction photo uploaded to firestore storage successfully.`, url)
                })
                .catch(error => console.error('Error uploading transaction photo: ', error.message))
        }

        const newTransactionData = { photoURL: newPhotoURL, ...rest }
        const response = await axios.put(`${BASE_URL}/transaction/${user_id}/${transactionData.transaction_id}`, newTransactionData)
        return response.data;
    }
)

// export const updateComment = createAsyncThunk(
//     "transactions/updateComment",
//     async (newComment) => {
//         const response = await axios.put(`${BASE_URL}/comment/${transaction_id}/${comment_id}`, newComment)
//         return response.data;
//     }
// )

export const deleteTransaction = createAsyncThunk(
    "transactions/deleteTransaction",
    async ({ transaction_id, user_id, photo_url }) => {

        if (photo_url) {
            const storageRef = ref(storage, photo_url)
            await deleteObject(storageRef)
                .then(() => console.log('Transaction photo has been deleted successfully.'))
                .catch((error) => console.error('There was an error deleting the photo: ', error.message))
        }

        const response = await axios.delete(`${BASE_URL}/transaction/${user_id}/${transaction_id}`);
        return response.data;
    }
)

export const convertToDefaultCurrency = createAsyncThunk(
    "transactions/convertToDefaultCurrency",
    async ({ amount, transactionDate, transactionCurrency, defaultCurrency }) => {
        const now = DateTime.now().toFormat('yyyy-MM-dd')
        let exchangeRateDate = now === transactionDate ? 'latest' : transactionDate
        console.log(now, transactionDate)
        const response = await axios.get(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${exchangeRateDate}/v1/currencies/${transactionCurrency}.json`)
        const conversionRate = parseFloat(response.data[transactionCurrency][defaultCurrency])
        const convertedAmount = amount * conversionRate
        return convertedAmount
    }
)