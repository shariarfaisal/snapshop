"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

const PublicNavbar = ({
    showApplyButton = true,
    variant = "transparent", // "transparent" or "solid"
    className = ""
}) => {
    const router = useRouter();

    const handleApplyClick = () => {
        router.push("/registration");
    };

    const handleHomeClick = () => {
        router.push("/");
    };

    const baseClasses = variant === "transparent"
        ? "absolute top-0 left-0 right-0 z-50 p-6"
        : "relative bg-white shadow-sm p-6";

    const logoTextColor = variant === "transparent" ? "text-white" : "text-gray-800";
    const linkTextColor = variant === "transparent"
        ? "text-gray-300 hover:text-white"
        : "text-gray-600 hover:text-gray-800";
    const menuTextColor = variant === "transparent" ? "text-white" : "text-gray-800";

    return (
        <nav className={`${baseClasses} ${className}`}>
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                <div
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={handleHomeClick}
                >
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">E</span>
                    </div>
                    <span className={`${logoTextColor} font-semibold text-xl`}>EduManage</span>
                </div>

                <div className="hidden md:flex items-center space-x-8">
                    <Link
                        href="/#about"
                        className={`${linkTextColor} cursor-pointer transition-colors`}
                    >
                        <span className="text-purple-400 text-sm">ABOUT</span>
                    </Link>
                    <Link
                        href="/#services"
                        className={`${linkTextColor} cursor-pointer transition-colors`}
                    >
                        <span className="text-purple-400 text-sm">SERVICES</span>
                    </Link>
                    <Link
                        href="/#notice"
                        className={`${linkTextColor} cursor-pointer transition-colors`}
                    >
                        <span className="text-purple-400 text-sm">NOTICE</span>
                    </Link>
                    <Link
                        href="/#contact"
                        className={`${linkTextColor} cursor-pointer transition-colors`}
                    >
                        <span className="text-purple-400 text-sm">CONTACT</span>
                    </Link>
                    {showApplyButton && (
                        <button
                            onClick={handleApplyClick}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                        >
                            Apply
                        </button>
                    )}
                </div>

                <button className={`md:hidden ${menuTextColor}`}>
                    <span className="text-sm">MENU</span>
                </button>
            </div>
        </nav>
    );
};

export default PublicNavbar;