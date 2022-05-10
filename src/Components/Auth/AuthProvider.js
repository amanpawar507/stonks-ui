import {useEffect, useState} from 'react'
import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {LOGIN_USER} from "../../graphql/queries";
import {useMutation} from "@apollo/client";
import {useStoreActions} from "easy-peasy";
import Loading from "../Loading/Loading";
import {firebaseConfig} from "../../config/firebase";


const AuthUserProvider = ({children}) => {
    const [processing, setProcessing] = useState(true)
    const [fetchUser] = useMutation(LOGIN_USER)

    const setUserDetails = useStoreActions(actions => actions.user.setUserDetails)
    useEffect(() => {
        const firebaseInit = initializeApp(firebaseConfig)

        if (firebaseInit) {
            const auth = getAuth(firebaseInit)
            let unsubscribe = auth.onAuthStateChanged((user) => {
                if (user) {
                    user.getIdTokenResult(true) // 1
                        .then((idTokenResult) => {
                            console.log(idTokenResult.token)
                            if ("stonks" in idTokenResult.claims && idTokenResult.claims.stonks !== null) {
                                localStorage.setItem("stonks69", idTokenResult.token)
                                fetchUser({
                                    variables: {
                                        token: user.accessToken
                                    }
                                }).then(r => {
                                    if (r && r.data && r.data.login) {
                                        setUserDetails({...r.data.login})
                                        setProcessing(false)
                                    }

                                })
                            } else {
                                auth.signOut().then(() => {
                                    setProcessing(false)
                                    localStorage.setItem("stonks69", "")
                                    sessionStorage.clear()
                                })

                            }
                        })

                } else {
                    setProcessing(false)
                    setUserDetails({})
                    localStorage.setItem("stonks69", "")

                }
            })
            return (() => {
                unsubscribe()
            })
        }

    }, [fetchUser, setUserDetails]);


    if (processing) return <Loading/>;
    return children
}

export default AuthUserProvider