import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {Button} from "@mui/material";
import React from "react";
import AddCoin from "../component/UserCoin/AddCoin"
import UpdateCoin from "../component/UserCoin/updateCoin";
import DeleteCoin from "../component/UserCoin/deleteCoin"
import UserProfile from "../component/Users/userProfile";

export default function Home() {
    const [open,setOpen] = React.useState(false)
    const [openUpdate,setOpenUpdate] = React.useState(false)
    const [openDelete,setOpenDelete] = React.useState(false)
    return (<div className={styles.container}>
        <Button onClick={() => {
            setOpen(true)
        }}>
            Add Coin
        </Button>
        <AddCoin open={open} setOpen={setOpen}/>
        <Button onClick={() => {
            setOpenUpdate(true)
        }}>
            Update Coin
        </Button>
        <UpdateCoin open={openUpdate} setOpen={setOpenUpdate}/>
        <Button onClick={() => {
            setOpenDelete(true)
        }}>
            Delete Coin
        </Button>
        <DeleteCoin open={openDelete} setOpen={setOpenDelete}/>
        <UserProfile userId={"TdMkKfnBugN2yAQSksi3K7772b22"}/>
        <Head>
            <title>Create Next App</title>
            <meta name="description" content="Generated by create next app"/>
            <link rel="icon" href="/favicon.ico"/>
        </Head>

        <main className={styles.main}>
            <h1 className={styles.title}>
                Welcome to <a href="https://nextjs.org">Next.js!</a>
            </h1>

            <p className={styles.description}>
                Get started by editing{' '}
                <code className={styles.code}>pages/index.js</code>
            </p>

            <div className={styles.grid}>
                <a href="https://nextjs.org/docs" className={styles.card}>
                    <h2>Documentation &rarr;</h2>
                    <p>Find in-depth information about Next.js features and API.</p>
                </a>

                <a href="https://nextjs.org/learn" className={styles.card}>
                    <h2>Learn &rarr;</h2>
                    <p>Learn about Next.js in an interactive course with quizzes!</p>
                </a>

                <a
                    href="https://github.com/vercel/next.js/tree/canary/examples"
                    className={styles.card}
                >
                    <h2>Examples &rarr;</h2>
                    <p>Discover and deploy boilerplate example Next.js projects.</p>
                </a>

                <a
                    href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    className={styles.card}
                >
                    <h2>Deploy &rarr;</h2>
                    <p>
                        Instantly deploy your Next.js site to a public URL with Vercel.
                    </p>
                </a>
            </div>
        </main>

        <footer className={styles.footer}>
            <a
                href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
            >
                Powered by{' '}
                <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16}/>
          </span>
            </a>
        </footer>
    </div>)
}
