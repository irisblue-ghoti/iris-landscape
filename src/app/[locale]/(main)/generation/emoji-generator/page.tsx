import React from "react";
import EmojiGeneratorForm from "./emoji-generator-form";

const emojiGeneratorPage = () => {
  return (
    <div className="mx-auto w-full justify-center space-y-4 px-4 pt-4 sm:px-8 sm:pt-8">
      <EmojiGeneratorForm />
    </div>
  );
};

export default emojiGeneratorPage;
