import LoginForm from "@/components/auth/LoginForm";
import Header from "@/components/Header";
import Head from "next/head";

const login: React.FC = () => {
    return(
        <>
            <Head>
                <title>
                    Register | MathMaster
                </title>
            </Head>
            <Header />
            <LoginForm></LoginForm>
        </>
    )
};

export default login;