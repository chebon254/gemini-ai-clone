import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response;

    if (prompt !== undefined) {
      // When prompt is provided
      response = await run(prompt);
      setRecentPrompt(prompt); // Set the recent prompt
      // Check if prompt is not already in previous prompts
      setPrevPrompts((prev) => {
        if (!prev.includes(prompt)) {
          console.log("Updated previous prompts:", [...prev, prompt]);
          return [...prev, prompt]; // Only add if it doesn't exist
        }
        return prev; // Return the existing array if it exists
      });
    } else {
      // When prompt is not defined, use the input
      response = await run(input);
      setRecentPrompt(input); // Set the recent input
      // Add input to previous prompts only if it's not already there
      setPrevPrompts((prev) => {
        if (!prev.includes(input)) {
          const newPrevPrompts = [...prev, input];
          console.log("Updated previous prompts:", newPrevPrompts);
          return newPrevPrompts;
        }
        return prev; // Return the existing array if it exists
      });
    }

    // setRecentPrompt(input)
    // setPrevPrompts(prev=>[...prev, input])
    // const response = await run(input);
    let responseArray = response.split("**");
    let newResponse = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResponse += responseArray[i];
      } else {
        newResponse += "<br/><b>" + responseArray[i] + "</b>";
      }
    }
    let newResponse2 = newResponse.split("*").join("</br>");
    let newResponseArray = newResponse2.split(" ");
    for (let i = 0; i < newResponseArray.length; i++) {
      const nextWord = newResponseArray[i];
      delayPara(i, nextWord + " ");
    }
    setLoading(false);
    setInput("");
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
