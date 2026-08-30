import { useState } from "react";
import { sendChatMessage } from "../services/chatService";
import { useTranslation } from "react-i18next";

function AiChatWidget() {
    const { t } = useTranslation();

    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState([
        {
            sender: "ai",
            translationKey: "aiChat.welcome",
        },
    ]);

    const [loading, setLoading] = useState(false);

    const sendMessageHandler = async (e) => {
        e.preventDefault();

        if (!message.trim()) return;

        const userMessage = message.trim();

        setMessages((prev) => [
            ...prev,
            { sender: "user", text: userMessage },
        ]);

        setMessage("");
        setLoading(true);

        try {
            const reply = await sendChatMessage(userMessage);

            setMessages((prev) => [
                ...prev,
                { sender: "ai", text: reply },
            ]);
        } catch (error) {
            console.error("CHAT ERROR:", error);

            setMessages((prev) => [
                ...prev,
                {
                    sender: "ai",
                    text: t("aiChat.error"),
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-chat-widget">
            {isOpen && (
                <div className="ai-chat-window">
                    <div className="ai-chat-header">
                        <span>{t("aiChat.title")}</span>

                        <button onClick={() => setIsOpen(false)}>
                            X
                        </button>
                    </div>

                    <div className="ai-chat-messages">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={
                                    msg.sender === "user"
                                        ? "ai-message user-message"
                                        : "ai-message bot-message"
                                }
                            >
                                {msg.translationKey ? t(msg.translationKey) : msg.text}
                            </div>
                        ))}

                        {loading && (
                            <div className="ai-message bot-message">
                                {t("aiChat.thinking")}
                            </div>
                        )}
                    </div>

                    <form
                        className="ai-chat-form"
                        onSubmit={sendMessageHandler}
                    >
                        <input
                            type="text"
                            placeholder={t("aiChat.placeholder")}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />

                        <button type="submit">
                            {t("aiChat.send")}
                        </button>
                    </form>
                </div>
            )}

            <button
                className="ai-chat-toggle"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                💬
            </button>
        </div>
    );
}

export default AiChatWidget;