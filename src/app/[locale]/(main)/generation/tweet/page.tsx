import React from "react";
import TweetForm from "./tweet-form";

const TweetPage = () => {
  return (
    <div className="mx-auto w-full justify-center space-y-4 px-4 pt-4 sm:px-8 sm:pt-8">
      <TweetForm />
    </div>
  );
};

export default TweetPage;
