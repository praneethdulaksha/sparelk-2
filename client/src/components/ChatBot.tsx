import { useEffect, useRef, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai"
import { getPromt } from "../data/chatbot";
import { Link } from "react-router-dom";
import { FiLink } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface Message {
    sender: "user" | "bot";
    text: any;
}

export default function ChatBot() {
    const [chatOpen, setChatOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const chatRef = useRef<HTMLDivElement>(null);

    const { cartId } = useSelector((root: RootState) => root.cart);
    const { user } = useSelector((root: RootState) => root.user);

    const genAI = new GoogleGenerativeAI("AIzaSyCO12PlmLawcTlm2vitVPfY_wnjjOFLUEM");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);
        await getAiRespond(userMessage.text);
        setIsTyping(false);
    };

    const getAiRespond = async (input: string) => {
        const { response } = await model.generateContent(getPromt(input, cartId!, user!));
        const botMessage: Message = { sender: "bot", text: response.text() };
        setMessages((prev) => [...prev, botMessage]);
    };


    return (
        <div className='fixed right-20 bottom-16 z-50'>
            <div className="size-16 group">
                <button onClick={() => setChatOpen(!chatOpen)} className='size-16 rounded-full border border-gray-800 overflow-hidden shadow-lg shadow-black'>
                    <img src="/chat.png" alt="chatbot" className="scale-150 hover:scale-[2] hover:rotate-12 hover:animate-pulse duration-100 ease-in-out" />
                </button>
                {!chatOpen && <div className="w-40 rounded-lg text-center absolute bottom-[120%] right-0 shadow-lg shadow-black py-2 bg-main text-light origin-bottom-right scale-0 duration-75 group-hover:scale-100">Need Help?</div>}
            </div>


            {/* chat */}
            <div
                className={`w-[500px] h-[700px] flex flex-col ${chatOpen ? 'scale-100' : 'scale-0'} duration-150 ease-in-out origin-bottom-right absolute border-2 border-gray-400 right-12 bottom-12 bg-white rounded-lg shadow-lg shadow-gray-400`}>
                <div className="bg-main text-white p-3 text-center font-semibold rounded-t-lg">
                    Chatbot
                </div>

                {/* Messages */}
                <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-2 text-sm">
                    {messages.map((msg, index) => (
                        msg.sender == "user" ? <div key={index} className={`flex justify-end`}>
                            <div className={`p-2 max-w-xs rounded-lg bg-main text-light`}>
                                {msg.text}
                            </div>
                        </div>
                            : <div key={index} className={`flex justify-start`}>
                                <div className={`p-2 max-w-xs rounded-lg bg-light text-main border border-main`}>
                                    {msg.text}
                                    {/* {msg.text[0]}
                                    {
                                        msg.text[1] && msg.text[1].length > 0 && <div className="mt-2 space-y-2">
                                            {msg.text[1].map((link: any) => (
                                                <Link onClick={() => setChatOpen(false)} to={link[1]} key={link[1]} className="text-blue-600 text-xs flex gap-1 pl-2 items-center">
                                                    <FiLink className="" /> {link[0]}
                                                </Link>
                                            ))}
                                        </div>
                                    } */}
                                </div>
                            </div>

                    ))}
                    {isTyping && <p className="text-gray-500 text-sm animate-pulse">Bot is typing...</p>}
                </div>

                {/* Input Box */}
                <div className="p-3 flex items-center border-t border-gray-400">
                    <input
                        type="text"
                        className="flex-1 border border-gray-400 rounded-lg p-2 outline-none"
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button className="ml-3 px-4 py-2 text-lg bg-blue-600 text-white rounded-lg" onClick={sendMessage}>
                        Send
                    </button>
                </div>
            </div>

            {chatOpen && <div onClick={() => setChatOpen(false)} className={`w-[150vw] backdrop-blur-sm h-[150vh] bg-black/40 -z-10 fixed -right-20 -bottom-20`}></div>}
        </div>
    )
}
