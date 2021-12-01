import { initializeAp, initializeApp } from 'firebase/app';
import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc,
    query, where,
    orderBy, serverTimestamp,
    getDoc, updateDoc
} from 'firebase/firestore'

import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut, signInWithEmailAndPassword,
    onAuthStateChanged
} from 'firebase/auth'
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
const auth = getAuth()


// collection ref
const colRef = collection(db, 'books')

// queries
const q = query(colRef, orderBy('createdAt'))

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
const unsubCol = onSnapshot(q, (snapshot) => {
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
        createdAt: serverTimestamp()
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

// get a single document
const docRef = doc(db, 'books', 'WiZAEr90YpKGaL8Agii9')


const unsubDoc = onSnapshot(docRef, (doc) => {
    console.log(doc.data(), doc.id)
})

// updating a document
const updateForm = document.querySelector('.update')
updateForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const docRef = doc(db, 'books', updateForm.id.value)

    updateDoc(docRef, {
        title: 'updated title'
    })
        .then(() => {
            updateForm.reset
        })

})

// signup users
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = signupForm.email.value
    const password = signupForm.password.value

    createUserWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            // console.log('user created:', cred.user)
            signupForm.reset()
        })
        .catch((err) => {
            console.log(err.message)
        })
})

// logging in and out
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            // console.log('the user signed out')
        })
        .catch((err) => {
            console.log(err.message)
        })
})

const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = loginForm.email.value
    const password = loginForm.password.value

    signInWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            // console.log('user logged in: ', cred.user)
        })
        .catch((err) => {
            console.log(err.message)
        })
})

//subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
    console.log('user status changed: ', user)
})

// unsubscribing from changes (auth & db)
const unsubButton = document.querySelector('.unsubscribe')
unsubButton.addEventListener('click', () => {
    console.log('unsubscribing')
    unsubCol()
    unsubDoc()
    unsubAuth()
})