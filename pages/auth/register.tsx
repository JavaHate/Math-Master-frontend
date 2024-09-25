import RegisterForm from "@/components/auth/RegisterForm";
import Header from "@/components/Header";
import Head from "next/head";

const register: React.FC = () => {
    return (
        <>
            <Head>
                <title>
                    register | MathMaster
                </title>
            </Head>
            <Header />
            <RegisterForm></RegisterForm>
        </>
    )
};

export default register;