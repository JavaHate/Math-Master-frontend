import Link from "next/link";

const loginForm: React.FC = () => {

    const submitForm = (e: React.FormEvent) => {
        console.log("logging in...");
        e.preventDefault();
    }

    return (
        <div className="bg-[#7d8491] rounded-lg border-2 border-[#22333b] mx-auto mt-12 max-w-3xl">
            <h2 className="text-[#22333B] font-semibold text-5xl max-w-lg mx-auto pt-8 text-center">Log in to your MathMaster account</h2>
            <form className="flex flex-col p-5 max-w-lg mx-auto pt-8" onSubmit={submitForm}>
                <label className="text-[#22333B] font-semibold text-2xl" htmlFor="Username">Username</label>
                <input className="border border-[#22333b] p-2 bg-[#eaf0ce]" type="text" name="Username" id="Username" placeholder="Username"></input>
                <label className="text-[#22333B] font-semibold text-2xl pt-8" htmlFor="Password">Password</label>
                <input className="border border-[#22333b] p-2 bg-[#eaf0ce]" type="password" name="Password" id="Password" placeholder="Password"></input>
                <button className="bg-[#22333B] text-white font-semibold text-xl rounded-lg p-4 mt-8 max-w-[130px] ml-auto" type="submit">sign in</button>
            </form>
            <p className="m-auto text-xl max-w-lg text-center">
                <Link className="m-auto text-xl max-w-lg underline text-center" href="/">forgot password?</Link>
            </p>
            <p className="m-auto text-xl max-w-lg text-center">New user? - <Link className="underline" href="/auth/register">Register</Link></p>
        </div>
    )
}

export default loginForm;