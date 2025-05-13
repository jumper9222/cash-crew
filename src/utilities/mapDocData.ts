import { DocumentSnapshot } from "firebase/firestore/dist/firestore";
import { DocumentData } from "firebase/firestore/dist/firestore";

export function mapDocsData(docs: DocumentSnapshot<DocumentData>[]) {
  const mappedData = docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
    };
  });
  return mappedData;
}
