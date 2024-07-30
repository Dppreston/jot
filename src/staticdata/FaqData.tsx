export let faqData: {
  id: number;
  question: string;
  body: string;
  opened: boolean;
  linkText?: string;
  link?: string;
}[] = [
  {
    id: 1,
    question: "What is Jot?",
    body: "Jot is a platform that offers users the opportunity to create short, informative articles tailored to specific interests or categories that fosters a sense of community and facilitates knowledge exchange. This can be particularly valuable for individuals looking to learn more about niche topics or seeking quick insights on various subjects. Plus, by enabling users to share their interests and knowledge, Jot contributes to the democratization of information and encourages collaborative learning experiences.",
    opened: false,
  },
  {
    id: 2,
    question: "Who created Jot and why?",
    body: `Jot was created by Dane Preston, an aspiring software engineer. It was developed as a project for his portfolio and aided in his development journey. Its purpose was to be the most complex project he had undertaken at the time.`,
    opened: false,
    linkText: "You can view his portfolio",
    link: "https://daneprestonwd.com/home",
  },
  {
    id: 3,
    question: "Is Jot free to use?",
    body: "Yes, Jot is completely free for users to use.",
    opened: false,
  },
  {
    id: 4,
    question: "What types of articles can I write on Jot?",
    body: "You can write articles on any topic of interest, ranging from hobbies and interests to professional expertise and academic subjects.",
    opened: false,
  },
  {
    id: 5,
    question: "How long should my articles be on Jot?",
    body: "Articles on Jot are typically short-reads, so aim for concise content that gets straight to the point. Posts are limited to 500 words, so make them count!",
    opened: false,
  },
  {
    id: 6,
    question: "How do I find articles on topics I'm interested in?",
    body: "You can explore articles on Jot by browsing through categories, using search functionality, or following specific users whose content interests you.",
    opened: false,
  },
  {
    id: 7,
    question: "Can I interact with other users on Jot?",
    body: "Yes, Jot facilitates interaction among users through comments, likes, follows and messages",
    opened: false,
  },
  {
    id: 8,
    question: "Can I use Jot without an account?",
    body: "Yes, you can browse Jot as a guest, although creating an account is recommended to experience all the features Jot offers.",
    opened: false,
  },
  {
    id: 9,
    question: "How can I report inappropriate content on Jot?",
    body: "Users can report inappropriate content by using the platform's reporting features or contacting support.",
    opened: false,
  },
  {
    id: 10,
    question: "Are there any guidelines or rules for content creation on Jot?",
    body: "Yes, Jot may have community guidelines or terms of service that users must adhere to when creating content.",
    linkText: "View our terms of service",
    link: `${window.location.origin}/info/terms-of-service`,
    opened: false,
  },
];
