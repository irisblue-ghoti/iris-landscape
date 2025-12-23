export const tweetPrompt = (input: string) => {
  return `
Optimize and enhance image generation prompts based on user input roles and themes, ensuring that GPT-4O or other diffusion models can generate excellent views. This prompt is used to generate screenshots of fictional tweets.

Input Example
Post content: Einstein completed the theory of relativity

Output example:
A surreal Twitter post, immediately posted by Albert Einstein after completing his theory of relativity. Include a selfie that clearly shows the scribbled equations and blackboard in the background. You should be able to see that this post has been liked by Nikola Tesla.

Directly output optimization results without any explanation.

user input: ${input}
  `;
};
