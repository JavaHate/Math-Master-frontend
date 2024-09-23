import Link from "next/link";
import { useState } from "react";

const loginForm: React.FC = () => {

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [repeatPassword, setRepeatPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const validate = () => {
        if (!username || !email || !password || !repeatPassword) {
            setError("Please fill in all fields");
            return false;
        }
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return false;
        }
        if (password !== repeatPassword) {
            setError("Passwords do not match");
            return false;
        }
        return true
    }

    const submitForm = (e: React.FormEvent) => {
        console.log("logging in...");
        e.preventDefault();
        if(!validate()) {
            return;   
        }
        // handle valid registration
    }

    return (
        <div className="bg-[#7d8491] rounded-lg border-2 border-[#22333b] mx-auto my-12 max-w-3xl">
            <h2 className="text-[#22333B] font-semibold text-5xl max-w-lg mx-auto pt-8 text-center mt-20">Register to MathMaster</h2>

            <form className="flex flex-col p-5 max-w-lg mx-auto pt-8" onSubmit={submitForm}>

                <label className="text-[#22333B] font-semibold text-2xl pt-8" htmlFor="Username">Username</label>
                <input
                    className="border border-[#22333b] p-2 bg-[#eaf0ce]"
                    type="text"
                    name="Username"
                    id="Username"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                ></input>

                <label className="text-[#22333B] font-semibold text-2xl pt-8" htmlFor="email">Email</label>
                <input
                    className="border border-[#22333b] p-2 bg-[#eaf0ce]"
                    type="email"
                    name="email"
                    id="email"
                    placeholder="example@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                ></input>

                <label className="text-[#22333B] font-semibold text-2xl pt-8" htmlFor="Password">Password</label>
                <input
                    className="border border-[#22333b] p-2 bg-[#eaf0ce]"
                    type="password"
                    name="Password"
                    id="Password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                ></input>

                <label className="text-[#22333B] font-semibold text-2xl pt-8" htmlFor="Password2">Repeat password</label>
                <input
                    className="border border-[#22333b] p-2 bg-[#eaf0ce]"
                    type="password"
                    name="Password2"
                    id="Password2"
                    placeholder="Password"
                    onChange={(e) => setRepeatPassword(e.target.value)}
                ></input>

                {error && <p className="m-auto text-xl max-w-lg text-center text-red-600">{error}</p>}
                
                <button className="bg-[#22333B] text-white font-semibold text-xl rounded-lg p-3 mt-10 max-w-[130px] ml-auto" type="submit">register</button>
            </form>
            <p className="m-auto text-xl max-w-lg text-center mb-20">Already have an account? - <Link className="underline" href="/auth/login">Log in</Link></p>
        </div>
    )
}

export default loginForm;