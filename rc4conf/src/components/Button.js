import React, { useState } from "react";
import axios from "axios";
import styles from "./styles/Button.module.css";

export const EventButton = ({ bg, margin, strapiFunc, strapiCollName }) => {
  const [joke, setJoke] = useState("");
  const handleClick = async () => {
    try {
      const res = await axios.get("https://api.chucknorris.io/jokes/random");

      console.log("res", res);
      setJoke(res.data.value);
    } catch (e) {
      console.error("Package error", e);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        style={{ backgroundColor: bg, margin: margin }}
        type="warning"
      >
        Event, Click!
      </button>
      {joke && (
        <div className={styles.jokeArea}>
          <textarea
            className={styles.eventButtonText}
            type={"text"}
            value={joke}
            readOnly
          ></textarea>
          <button
            type="danger"
            onClick={() => strapiInit(strapiCollName, strapiFunc, joke)}
          >
            Save to Strapi
          </button>
        </div>
      )}
    </div>
  );
};

export const strapiInit = async (api, strapiFunc, data) => {
  const requestUrl = strapiFunc(`/${api}`);

  const toPost = {
    data: {
      TopPost: data,
    },
  };

  try {
    const res = await axios.post(requestUrl, toPost);
    alert(`Data post successful with the ID - ${res.data.data.id}`);
  } catch (e) {
    console.error("Error while strapi init", e);
  }
};
