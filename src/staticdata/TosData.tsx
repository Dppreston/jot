export const TosData: {
  id: number;
  title: string;
  body: string;
  list?: boolean;
  listBody?: string[];
  link?: string;
}[] = [
  {
    id: 1,
    title: "Acceptance of Terms",
    body: "By accessing or using Jot, you agree to be bound by these Terms. If you do not agree to these Terms, you may not use Jot.",
  },
  {
    id: 2,
    title: "User Accounts",
    body: "You must create an account to access certain features of Jot. You agree to provide accurate and complete information when creating your account and to keep your account credentials secure. You are responsible for all activity that occurs under your account.",
  },
  {
    id: 3,
    title: "Content",
    body: "You retain ownership of any content you create or upload to Jot. By submitting content to Jot, you grant Jot a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, distribute, and display the content for the purpose of operating and promoting Jot. You agree not to submit any content that is illegal, defamatory, obscene, or infringes on the rights of others.",
  },
  {
    id: 4,
    title: "Intellectual Property",
    body: "Jot and its content, including but not limited to text, graphics, logos, images, and software, are the property of Jot or its licensors and are protected by copyright, trademark, and other intellectual property laws. You may not use Jot's content without permission.",
  },
  {
    id: 5,
    title: "Prohibited Conduct",
    body: "You agree not to:",
    list: true,
    listBody: [
      "Violate any applicable laws or regulations",
      "Interfere with or disrupt the operation of Jot",
      "Impersonate any person or entity",
      "Engage in spamming, phishing, or other fraudulent activities",
      "Collect or store personal data about other users without their consent",
    ],
  },
  {
    id: 6,
    title: "Privacy",
    body: "Jot's Privacy Policy governs the collection, use, and disclosure of your personal information. By using Jot, you consent to the collection and use of your information as described in the Privacy Policy.",
  },
  {
    id: 7,
    title: "Termination",
    body: "We may suspend or terminate your access to Jot at any time, for any reason, without prior notice or liability.",
  },
  {
    id: 8,
    title: "Disclaimer of Warranties",
    body: `Jot is provided "as is" and "as available" without warranties of any kind, express or implied. We do not warrant that Jot will be error-free or uninterrupted.`,
  },
  {
    id: 9,
    title: "Limitation of Liability",
    body: "In no event shall Jot be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to lost profits or data.",
  },
  {
    id: 10,
    title: "Governing Law",
    body: "These Terms shall be governed by and construed in accordance with the laws of Michigan, without regard to its conflict of laws principles.",
  },
  {
    id: 11,
    title: "Changes to Terms",
    body: "We reserve the right to modify or update these Terms at any time. By continuing to use Jot after any changes to these Terms, you agree to be bound by the revised Terms.",
  },
  {
    id: 12,
    title: "Contact Us",
    body: "If you have any questions or concerns about these Terms, please contact us below...",
    link: `${window.location.origin}/info/contact-us`,
  },
];
