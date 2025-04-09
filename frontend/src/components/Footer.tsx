import { Link } from "react-router-dom";

const Footer = () => {
    return ( 
    <footer className="flex bg-violet-300 justify-between lg:p-20 py-10 px-2">
        <article className="flex w-1/3 items-center gap-5">
            <img src="/images/Ico.svg" alt="coffee cup icon" />
            <p className="lg:text-3xl font-medium">Rezeptwelt</p>
        </article>
        <article className="lg:pr-70 flex-col">
            <p className="font-medium lg:pb-5 pb-2 lg:text-xl">Social Media</p>
            <article className="flex lg:gap-5 gap-2">
                <Link to={""} className="bg-violet-200 p-1 rounded-lg">
                <img src="/images/Youtube.svg" alt="Youtube Icon" />
                </Link>
                <Link to={""} className="bg-violet-200 p-1 rounded-lg">
                <img src="/images/Twitter.svg" alt="Twitter Icon" />
                </Link>
                <Link to={""} className="bg-violet-200 p-1 rounded-lg">
                <img src="/images/Browser.svg" alt="Browser Icon" />
                </Link>
                <Link to={""} className="bg-violet-200 p-1 rounded-lg">
                <img src="/images/Pinterest.svg" alt="Pinterest Icon" />
                </Link>
            </article>
        </article>
    </footer> 
);
}
 
export default Footer;