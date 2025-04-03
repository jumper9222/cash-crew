import { useState } from "react";

export const useSplitsManagement = () => {
    //split states
    const [splits, setSplits] = useState([{ user_id: uid, split_amount: 0, category }]);
    const [suggestions, setSuggestions] = useState([]);
    const [splitUsers, setSplitUsers] = useState([email]);
    const [splitType, setSplitType] = useState('Equally');
    //Split for calculating split history when set to "as amounts"
    const [splitCalcHistory, setSplitCalcHistory] = useState({ totalModified: 0, indexesModified: [] });
    const [focusIndex, setFocusIndex] = useState(0);
    const [splitsAreValid, setSplitsAreValid] = useState(true);

    const divideAmountsEqually = () => {
        setSplitCalcHistory({ totalModified: 0, indexesModified: [] })
        setSplits(splits.map((split) => {
            return { ...split, split_amount: parseFloat(totalAmount / splits.length).toFixed(2) }
        }))
    }

    //Define split modified history function
    const updateSplitModHistory = (index) => {
        const { indexesModified } = splitCalcHistory;
        //Add modified index number if it doesn't already exist in the array
        const newModifiedIndexes = indexesModified.includes(index) ? indexesModified : [...indexesModified, index]
        //Iterate through modified split indices and calculate new modified total from modhistory state
        const newModifiedTotal = newModifiedIndexes.reduce((total, index) => {
            return total + parseFloat(splits[index].split_amount)
        }, 0)
        //Set new total modified and new modified indices
        setSplitCalcHistory(() => ({ totalModified: newModifiedTotal, indexesModified: newModifiedIndexes }))
        console.log("Split history", splitCalcHistory,)
    }
    return {
        splits,
        setSplits,
        suggestions,
        setSuggestions,
        splitUsers,
        setSplitUsers,
        splitType,
        setSplitType,
        splitCalcHistory,
        setSplitCalcHistory,
        focusIndex,
        setFocusIndex,
        splitsAreValid,
        setSplitsAreValid,
        divideAmountsEqually,
        updateSplitModHistory
    }
}