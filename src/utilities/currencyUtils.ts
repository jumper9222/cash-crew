import axios from "axios"

export const fetchCurrencies = async (): Promise<{ value: string, label: string }[]> => {
    const currencies = await axios.get<{ [key: string]: string }>('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.min.json')
    const currencyArray = Object.entries(currencies.data).filter(([_, value]) => {
        return value
    }).map(([key, value]) => {
        return { value: key.toUpperCase(), label: key.toUpperCase() + ' - ' + value }
    })
    console.log(currencyArray)
    return currencyArray
}