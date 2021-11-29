import { initializeAp, initializeApp } from 'firebase/app';
import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc,
    query, where
} from 'firebase/firestore'
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAQK5urzK3Wq4JGGk9e5yGBRBEsWRcLFEg",
    authDomain: "net-ninja-tutorial-cd309.firebaseapp.com",
    projectId: "net-ninja-tutorial-cd309",
    storageBucket: "net-ninja-tutorial-cd309.appspot.com",
    messagingSenderId: "56031981826",
    appId: "1:56031981826:web:ad8a7f6f6cb2bb6f84d21b",
    measurementId: "G-B506LDP1EX"
};

initializeApp(firebaseConfig)

const db = getFirestore()


// collection ref
const colRef = collection(db, 'books')

// queries
const q = query(colRef, where("author", "==", "Rowling"))

// accessing collection
// getDocs(colRef)
//     .then((snapshot) => {
//         let books = []
//         snapshot.docs.forEach((doc) => {
//             books.push({ ...doc.data(), id: doc.id })
//         })
//         console.log(books)
//     })
//     .catch(err => {
//         console.log(err.message)
//     })

// real time collection through subscription
onSnapshot(q, (snapshot) => {
    let books = []
    snapshot.docs.forEach(doc => {
        books.push({ ...doc.data(), id: doc.id })
    })
    console.log(books)
})

// adding docs
const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit', (e) => {
    e.preventDefault()

    addDoc(colRef, {
        title: addBookForm.title.value,
        author: addBookForm.author.value,
    })
        .then(() => {
            addBookForm.reset()
        })
})

// deleting docs
const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const docRef = doc(db, 'books', deleteBookForm.id.value)

    deleteDoc(docRef)
        .then(() => {
            deleteBookForm.reset()
        })
})