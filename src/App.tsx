import { useEffect, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";

function App() {
  useEffect(() => {
    const socket = io("http://localhost:8000/", {});
    return () => {
      socket.close();
    };
  }, []);

  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");

  const sendMessage = async (message: string) => {
    try {
      const res = await fetch(
        "http://localhost:8000/messages/send/<RECEIVER_USER_ID_GOES_HERE>",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        }
      );

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages([...messages, data]);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <label>
        Enter message
        <input
          placeholder="place message here"
          type="text"
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>
      <button
        onClick={(e) => {
          e.preventDefault();
          sendMessage(message);
        }}
      >
        send
      </button>

      <div>
        {messages}
      </div>
    </>
  );
}

export default App;
