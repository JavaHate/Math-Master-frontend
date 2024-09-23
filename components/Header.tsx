import Link from "next/link";


const Header: React.FC = () => {
    return (
        <div className="bg-[#22333B] max-w-full max-h-20 flex flex-row justify-between">

            <div className="flex">

                <img src="/img/logo.png" alt="logo" className="max-h-16 my-2 ml-2 rounded-lg" />
                <h1 className="text-[#EAF0CE] font-bold text-5xl my-auto ml-5">
                    MathMaster
                </h1>
            </div>
            <nav className="flex flex-row my-auto mr-4 text-[#eaf0ce]">
                <Link className="mx-2 px-2 py-1 transition-colors duration-300 hover:bg-[#1a282e] rounded" href="/">home</Link>
                <Link className="mx-2 px-2 py-1 transition-colors duration-300 hover:bg-[#1a282e] rounded" href="/auth/login">log in</Link>
            </nav>
        </div>
    )
}

export default Header;