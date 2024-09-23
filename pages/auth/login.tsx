//TODO: implement this page and it's components

import LoginForm from "@/components/auth/LoginForm";
import Header from "@/components/Header";
import Head from "next/head";

const login: React.FC = () => {
    return(
        <>
            <Head>
                <title>
                    login | MathMaster
                </title>
            </Head>
            <Header />
            <LoginForm></LoginForm>
        </>
    )
};

export default login;