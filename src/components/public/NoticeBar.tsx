const NoticeBar = ({ message = "New semester registration is now open. Apply before December 31st, 2025" }) => {
    return (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2 px-4">
            <span className="text-sm font-medium">Notice: </span>
            <span className="text-sm">{message}</span>
        </div>
    );
};

export default NoticeBar;