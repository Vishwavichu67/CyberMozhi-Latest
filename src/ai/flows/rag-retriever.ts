/**
 * @fileOverview RAG Retriever for CyberMozhi — server-safe version.
 * Data is embedded directly here (no Lucide icon imports) so this file
 * can safely run inside server-side Genkit flows without React errors.
 */

export interface RetrievedChunk {
  type: 'law' | 'glossary';
  title: string;
  content: string;
  section?: string;
  act?: string;
  penalty?: string;
}

interface LawEntry {
  id: string; title: string; act: string; section: string;
  category: string; summary: string; details: string; penalty: string;
}

interface GlossaryEntry {
  id: string; term: string; definition: string; category: string;
}

const LAW_DATA: LawEntry[] = [
  {
    "id": "1",
    "title": "Tampering with Computer Source Documents",
    "act": "IT Act, 2000",
    "section": "Section 65",
    "category": "IT Act, 2000",
    "summary": "Prohibits intentionally concealing, destroying, or altering computer source code used for a computer, computer program, computer system or computer network, when the source code is required to be kept or maintained by law.",
    "details": "This section aims to protect the integrity of software and ensure that critical source code, vital for the functioning and understanding of computer systems, is not maliciously altered or hidden.",
    "penalty": "Imprisonment up to three years, or with fine up to two lakh rupees, or with both."
  },
  {
    "id": "2",
    "title": "Hacking with Computer Systems / Computer Related Offences",
    "act": "IT Act, 2000",
    "section": "Section 66 (referencing Sec 43)",
    "category": "IT Act, 2000",
    "summary": "Addresses various computer-related offenses if committed dishonestly or fraudulently. This includes unauthorized access, data damage, introducing viruses, etc., as detailed in Section 43.",
    "details": "Section 43 outlines penalties for damage to computer, computer system, etc. This includes unauthorized access, downloading, copying, or extracting data, introducing contaminants or viruses, damaging or disrupting systems, denying access, and other related activities. Section 66 makes these acts criminal if done with fraudulent or dishonest intent.",
    "penalty": "Imprisonment up to three years, or with fine up to five lakh rupees, or with both."
  },
  {
    "id": "3",
    "title": "Punishment for Identity Theft",
    "act": "IT Act, 2000",
    "section": "Section 66C",
    "category": "IT Act, 2000",
    "summary": "Criminalizes the fraudulent or dishonest use of another person's electronic signature, password, or any other unique identification feature.",
    "details": "This section specifically targets identity theft in the digital realm, such as stealing someone's digital signature or login credentials, where impersonation can lead to significant financial or reputational harm.",
    "penalty": "Imprisonment of either description for a term which may extend to three years and shall also be liable to fine which may extend to rupees one lakh."
  },
  {
    "id": "4",
    "title": "Punishment for Cheating by Personation by using Computer Resource",
    "act": "IT Act, 2000",
    "section": "Section 66D",
    "category": "IT Act, 2000",
    "summary": "Punishes cheating by personation using any communication device or computer resource.",
    "details": "This targets individuals who impersonate others online (e.g., creating fake social media profiles for fraudulent purposes) to deceive and cheat victims.",
    "penalty": "Imprisonment of either description for a term which may extend to three years and shall also be liable to fine which may extend to rupees one lakh."
  },
  {
    "id": "5",
    "title": "Punishment for violation of privacy",
    "act": "IT Act, 2000",
    "section": "Section 66E",
    "category": "IT Act, 2000",
    "summary": "Criminalizes capturing, publishing, or transmitting images of a private area of any person without their consent, under circumstances violating their privacy.",
    "details": "This section is crucial for protecting personal privacy against voyeurism and non-consensual image sharing (e.g. upskirting, hidden cameras) in the digital age.",
    "penalty": "Imprisonment which may extend to three years or with fine not exceeding two lakh rupees, or with both."
  },
  {
    "id": "6",
    "title": "Punishment for Cyber Terrorism",
    "act": "IT Act, 2000",
    "section": "Section 66F",
    "category": "IT Act, 2000",
    "summary": "Deals with acts of cyber terrorism, including denying access to authorized persons, unauthorized access to or penetration of a computer resource, or introducing contaminants with intent to threaten national security, unity, integrity, or sovereignty, or to strike terror.",
    "details": "This is a serious offense targeting large-scale attacks that can cripple critical infrastructure or threaten national security.",
    "penalty": "Imprisonment for life."
  },
  {
    "id": "7",
    "title": "Punishment for publishing or transmitting obscene material in electronic form",
    "act": "IT Act, 2000",
    "section": "Section 67",
    "category": "IT Act, 2000",
    "summary": "Punishes the publication or transmission of material which is lascivious or appeals to the prurient interest or if its effect is such as to tend to deprave and corrupt persons.",
    "details": "This section addresses the dissemination of pornographic or obscene content online. It has different penalties for first conviction and subsequent convictions.",
    "penalty": "First conviction: imprisonment up to three years and fine up to five lakh rupees. Subsequent conviction: imprisonment up to five years and fine up to ten lakh rupees."
  },
  {
    "id": "8",
    "title": "Penalty for Damage to Computer, Computer System, etc.",
    "act": "IT Act, 2000",
    "section": "Section 43",
    "category": "IT Act, 2000",
    "summary": "Prescribes penalties for unauthorized actions such as accessing, downloading, or damaging computer systems, introducing viruses, or denying access.",
    "details": "This section covers a range of civil wrongs including hacking, virus attacks, data theft, denial of service, and using a computer resource without permission of the owner. Compensation not exceeding one crore rupees to the person so affected.",
    "penalty": "Liable to pay damages by way of compensation, not exceeding one crore rupees to the person so affected."
  },
  {
    "id": "9",
    "title": "Publishing or Transmitting Sexually Explicit Material",
    "act": "IT Act, 2000",
    "section": "Section 67A",
    "category": "IT Act, 2000",
    "summary": "Specifically punishes publishing or transmitting material containing sexually explicit acts or conduct in electronic form.",
    "details": "This section is more specific than Section 67 and focuses on material depicting sexual acts involving adults.",
    "penalty": "First conviction: imprisonment up to five years and fine up to ten lakh rupees. Subsequent conviction: imprisonment up to seven years and fine up to ten lakh rupees."
  },
  {
    "id": "10",
    "title": "Publishing or Transmitting Material Depicting Children in Sexually Explicit Act",
    "act": "IT Act, 2000",
    "section": "Section 67B",
    "category": "IT Act, 2000",
    "summary": "Punishes publishing, transmitting, or creating material depicting children in sexually explicit acts (Child Pornography). Also covers possession and distribution.",
    "details": "This section imposes stringent penalties for offences related to child pornography and aims to protect children from sexual exploitation online.",
    "penalty": "First conviction: imprisonment up to five years and fine up to ten lakh rupees. Subsequent conviction: imprisonment up to seven years and fine up to ten lakh rupees. Stricter penalties for certain aggravated forms."
  },
  {
    "id": "11",
    "title": "Powers to Intercept, Monitor, or Decrypt Information",
    "act": "IT Act, 2000",
    "section": "Section 69",
    "category": "IT Act, 2000",
    "summary": "Grants powers to the Central or State Government to issue directions for interception, monitoring, or decryption of any information transmitted through any computer resource.",
    "details": "This power can be exercised in the interest of the sovereignty or integrity of India, defense of India, security of the State, friendly relations with foreign States, public order, or for preventing incitement to the commission of any cognizable offence relating to above or for investigation of any offence.",
    "penalty": "Failure to comply can lead to imprisonment up to seven years and fine."
  },
  {
    "id": "12",
    "title": "Protection of Critical Information Infrastructure",
    "act": "IT Act, 2000",
    "section": "Section 70",
    "category": "IT Act, 2000",
    "summary": "Provides for the declaration of any computer resource which directly or indirectly affects the facility of Critical Information Infrastructure, as a protected system.",
    "details": "Unauthorized access or attempt to access such protected systems is an offense. Critical Information Infrastructure includes facilities like power, telecom, banking, transportation, etc., whose incapacitation would have a debilitating impact on national security, economy, public health or safety.",
    "penalty": "Imprisonment up to ten years and fine."
  },
  {
    "id": "13",
    "title": "Breach of Confidentiality and Privacy",
    "act": "IT Act, 2000",
    "section": "Section 72",
    "category": "IT Act, 2000",
    "summary": "Punishes any person who, having secured access to any electronic record, book, register, correspondence, information, document or other material without the consent of the person concerned, discloses such material to any other person.",
    "details": "This applies when a person has gained access in pursuance of powers conferred under the IT Act or its rules, and then discloses it without consent, causing wrongful loss or gain.",
    "penalty": "Imprisonment up to two years, or with fine up to one lakh rupees, or with both."
  },
  {
    "id": "14",
    "title": "Exemption for Intermediaries",
    "act": "IT Act, 2000",
    "section": "Section 79",
    "category": "IT Act, 2000",
    "summary": "Provides conditional exemption from liability for intermediaries (like social media platforms, ISPs) for any third-party information, data, or communication link made available or hosted by them.",
    "details": "This \"safe harbour\" protection is contingent upon the intermediary observing due diligence and obeying government guidelines, including expeditiously removing unlawful content upon receiving actual knowledge or being notified by the appropriate government or its agency.",
    "penalty": "Loss of exemption and potential liability for hosted content if due diligence is not followed."
  },
  {
    "id": "15",
    "title": "Sale, etc., of Obscene Books (Materials)",
    "act": "Indian Penal Code (IPC)",
    "section": "Section 292",
    "category": "Indian Penal Code (IPC)",
    "summary": "Although an old law, it is used in cyber porn cases for the sale, distribution, public exhibition, or possession of obscene materials, including in electronic form.",
    "details": "This section is often invoked alongside the IT Act for cases involving pornographic content, especially when commercial distribution is involved.",
    "penalty": "First conviction: imprisonment up to two years and fine. Subsequent conviction: imprisonment up to five years and fine."
  },
  {
    "id": "16",
    "title": "Cyberstalking",
    "act": "Indian Penal Code (IPC)",
    "section": "Section 354D",
    "category": "Indian Penal Code (IPC)",
    "summary": "Criminalizes stalking, including monitoring the use by a woman of the internet, email or any other form of electronic communication.",
    "details": "This section specifically addresses online stalking, persistent following, or attempts to contact a woman despite clear indication of disinterest, causing fear or distress.",
    "penalty": "First conviction: imprisonment up to three years and fine. Subsequent conviction: imprisonment up to five years and fine."
  },
  {
    "id": "17",
    "title": "Theft (Data Theft)",
    "act": "Indian Penal Code (IPC)",
    "section": "Section 379",
    "category": "Indian Penal Code (IPC)",
    "summary": "General provision for theft, which can be applied to data theft where intangible property like data is stolen with dishonest intention.",
    "details": "While data itself is intangible, its theft can be prosecuted under this section if it involves moving it from someone's possession dishonestly.",
    "penalty": "Imprisonment up to three years, or fine, or both."
  },
  {
    "id": "18",
    "title": "Cheating and Dishonestly Inducing Delivery of Property (Online Fraud)",
    "act": "Indian Penal Code (IPC)",
    "section": "Section 420",
    "category": "Indian Penal Code (IPC)",
    "summary": "Addresses cheating and online fraud where victims are dishonestly induced to deliver property or consent to retention of property.",
    "details": "This is a commonly invoked section for various online financial frauds, scams, and deceptions leading to monetary loss.",
    "penalty": "Imprisonment up to seven years and fine."
  },
  {
    "id": "19",
    "title": "Forgery (Fake Emails, Documents)",
    "act": "Indian Penal Code (IPC)",
    "section": "Sections 465 & 468",
    "category": "Indian Penal Code (IPC)",
    "summary": "Section 465 provides punishment for forgery. Section 468 punishes forgery for the purpose of cheating.",
    "details": "These sections are used in cases involving creation of fake electronic documents, emails, or digital signatures to commit fraud or cause damage.",
    "penalty": "Sec 465: Imprisonment up to two years, or fine, or both. Sec 468: Imprisonment up to seven years and fine."
  },
  {
    "id": "20",
    "title": "Defamation (Online Defamation)",
    "act": "Indian Penal Code (IPC)",
    "section": "Section 499",
    "category": "Indian Penal Code (IPC)",
    "summary": "Defines defamation as making or publishing any imputation concerning any person intending to harm, or knowing or having reason to believe that such imputation will harm, the reputation of such person.",
    "details": "This applies to online defamation through social media, blogs, websites, or emails. Punishment is under Section 500.",
    "penalty": "Under Sec 500: Simple imprisonment up to two years, or fine, or both."
  },
  {
    "id": "21",
    "title": "Criminal Intimidation (Cyber Threats and Blackmail)",
    "act": "Indian Penal Code (IPC)",
    "section": "Section 503",
    "category": "Indian Penal Code (IPC)",
    "summary": "Defines criminal intimidation as threatening another with injury to their person, reputation, or property, to cause alarm or to cause them to do any act which they are not legally bound to do, or to omit to do any act which they are legally entitled to do.",
    "details": "This is applicable to cyber threats, online blackmail, and extortion. Punishment is under Section 506.",
    "penalty": "Under Sec 506: Imprisonment up to two years, or fine, or both. If threat is to cause death or grievous hurt, etc., imprisonment up to seven years, or fine, or both."
  },
  {
    "id": "22",
    "title": "Admissibility of Electronic Records",
    "act": "Indian Evidence Act, 1872",
    "section": "Sections 65A & 65B",
    "category": "Other Key Acts & Policies",
    "summary": "Allows electronic records (e-mails, logs, CCTV footage, etc.) to be treated as evidence in court proceedings.",
    "details": "Sections 65A and 65B lay down the conditions for the admissibility of electronic evidence, ensuring its authenticity and integrity. A certificate under 65B is often required.",
    "penalty": "Not a penal provision, but governs how digital evidence is used in trials."
  },
  {
    "id": "23",
    "title": "Cybersecurity Compliance for Companies",
    "act": "Companies Act, 2013",
    "section": "Relevant Sections",
    "category": "Other Key Acts & Policies",
    "summary": "Mandates cybersecurity compliance for companies, especially those handling financial data. May require appointment of cyber risk officers.",
    "details": "The Act includes provisions for maintaining proper books of account in electronic mode, data security, and director responsibilities related to IT governance. Penalties exist for data breaches and non-compliance.",
    "penalty": "Varies based on the specific non-compliance; can include fines on company and officers."
  },
  {
    "id": "24",
    "title": "National Cyber Security Policy, 2013",
    "act": "Policy Document",
    "section": "N/A",
    "category": "Other Key Acts & Policies",
    "summary": "A strategic framework to safeguard Indian cyberspace. It is not a law but a guiding policy.",
    "details": "Promotes creation of a secure cyber ecosystem, awareness, R&D, and incident response through CERT-In. Aims to build capabilities to prevent and respond to cyber threats.",
    "penalty": "Not a penal document, but sets direction for legal and regulatory measures."
  },
  {
    "id": "25",
    "title": "DPDP Act: Core Principles & Application",
    "act": "Digital Personal Data Protection Act, 2023",
    "section": "Chapters 1-2",
    "category": "Data Protection & Privacy",
    "summary": "India’s dedicated law on personal data protection. It applies to the processing of digital personal data within India, and also outside India if related to offering goods or services to individuals in India.",
    "details": "The DPDP Act is built on principles like Lawfulness, Fairness, Transparency, Purpose Limitation, Data Minimisation, Accuracy, Storage Limitation, and Accountability. It establishes the rights of Data Principals (individuals) and the obligations of Data Fiduciaries (entities processing data).",
    "penalty": "Penalties for non-compliance are significant, decided by the Data Protection Board of India."
  },
  {
    "id": "41",
    "title": "DPDP Act: Consent & User Rights",
    "act": "Digital Personal Data Protection Act, 2023",
    "section": "Sections 6-13",
    "category": "Data Protection & Privacy",
    "summary": "Consent must be free, specific, informed, and unambiguous. Users (Data Principals) have the right to access, correct, erase their data, and nominate someone to exercise these rights in case of death or incapacity.",
    "details": "A key feature is the \"Consent Manager\" framework, an interoperable platform to help individuals give, manage, and withdraw their consent. Users also have the Right to Grievance Redressal, allowing them to complain to the Data Fiduciary before approaching the Board.",
    "penalty": "Penalties up to ₹200 crore for failure to fulfill obligations for children. ₹10,000 fine for a user filing a false or frivolous complaint."
  },
  {
    "id": "42",
    "title": "DPDP Act: Obligations of Companies (Data Fiduciaries)",
    "act": "Digital Personal Data Protection Act, 2023",
    "section": "Sections 4-10",
    "category": "Data Protection & Privacy",
    "summary": "Companies (Data Fiduciaries) must ensure data accuracy, implement security safeguards to prevent breaches, and erase personal data once the purpose for which it was collected is met.",
    "details": "In case of a personal data breach, the company must notify both the Data Protection Board of India and the affected individuals. They are also responsible for the actions of their data processors (third-party vendors). Special, more stringent obligations apply when processing children's data.",
    "penalty": "Penalties up to ₹250 crore for failure to take reasonable security safeguards to prevent data breaches."
  },
  {
    "id": "26",
    "title": "Cyber Regulations Appellate Tribunal (CRAT)",
    "act": "IT Act, 2000",
    "section": "Relevant Sections (e.g., Sec 48)",
    "category": "Other Key Acts & Policies",
    "summary": "Handles appeals against the orders of adjudicating officers appointed under the IT Act.",
    "details": "CRAT provides a judicial forum for challenging decisions made by adjudicating officers regarding compensation claims for contraventions under the IT Act (e.g., Section 43).",
    "penalty": "Not a penal body itself, but an appellate authority."
  },
  {
    "id": "27",
    "title": "CERT-In Rules (Incident Reporting)",
    "act": "IT Act, 2000 (CERT-In Directions)",
    "section": "Relevant Directions",
    "category": "Other Key Acts & Policies",
    "summary": "The Indian Computer Emergency Response Team (CERT-In) issues directions mandating organizations to report various types of cybersecurity incidents.",
    "details": "Incidents to be reported include data breaches, DDoS attacks, system compromise, ransomware attacks, botnet activity, unauthorized access to IT systems/data, etc., within a stipulated timeframe (e.g., 6 hours). Non-compliance can lead to penalties.",
    "penalty": "Penalties under Section 70B(7) of IT Act for non-compliance with CERT-In directions."
  },
  {
    "id": "28",
    "title": "RBI Guidelines for Digital Payments & Cyber Frauds",
    "act": "RBI Guidelines & Circulars",
    "section": "Various",
    "category": "Financial & Transaction Regulations",
    "summary": "The Reserve Bank of India issues guidelines and regulations for banking and online transaction security.",
    "details": "Covers KYC norms, fraud reporting mechanisms, security of digital wallets & UPI, mandatory 2FA (two-factor authentication), customer liability limits in case of unauthorized transactions, and cybersecurity preparedness for banks and payment system operators.",
    "penalty": "Financial penalties and operational restrictions on regulated entities for non-compliance."
  },
  {
    "id": "29",
    "title": "Reporting Suspicious Digital Transactions",
    "act": "Income Tax Act, 1961",
    "section": "Section 285BA (Statement of Financial Transactions)",
    "category": "Financial & Transaction Regulations",
    "summary": "Mandates reporting of specified high-value or suspicious digital transactions to the income tax authorities.",
    "details": "This helps in tracking large financial movements and curbing tax evasion or illicit activities conducted through digital channels.",
    "penalty": "Penalties for non-furnishing or inaccurate furnishing of the statement."
  },
  {
    "id": "30",
    "title": "Infringement of Copyright (Digital Piracy)",
    "act": "Copyright Act, 1957",
    "section": "Sections 51, 63, 63A, 65A, 65B",
    "category": "General & Consumer Rights",
    "summary": "Protects original literary, dramatic, musical, artistic works, films, and sound recordings. Making or distributing unauthorized copies (piracy) online is a criminal offense.",
    "details": "The Act criminalizes the use of infringing copies of computer programs, films, and music. It also criminalizes the circumvention of technical protection measures (like DRM) and tampering with rights management information embedded in digital works. This is the primary law against digital piracy of software, movies, music, etc.",
    "penalty": "For most copyright infringements (Sec 63): Imprisonment for at least six months up to three years, and a fine of at least ₹50,000 up to ₹2 lakh. For repeat offenders (Sec 63A), penalties are higher."
  },
  {
    "id": "31",
    "title": "Government Monitoring Powers",
    "act": "Telegraph Act, 1885",
    "section": "Section 5(2)",
    "category": "General & Consumer Rights",
    "summary": "Although an old law, this section (along with IT Act Sec 69) provides powers to the government for lawful interception of messages in specific situations.",
    "details": "These powers are invoked for reasons of public safety, national security, etc., and are subject to procedural safeguards.",
    "penalty": "Misuse can lead to legal challenges."
  },
  {
    "id": "32",
    "title": "Protection for Online Buyers (E-commerce Rules)",
    "act": "Consumer Protection Act, 2019",
    "section": "E-commerce Rules under the Act",
    "category": "General & Consumer Rights",
    "summary": "Provides rules and regulations to protect online buyers from fraud, unfair trade practices, and deficient services by e-commerce platforms.",
    "details": "Includes provisions for clear display of seller information, country of origin, grievance redressal mechanisms, and rules for flash sales and misleading advertisements.",
    "penalty": "Penalties on e-commerce entities for violations."
  },
  {
    "id": "33",
    "title": "Aadhaar Data Security and Misuse",
    "act": "Aadhaar (Targeted Delivery of Financial and Other Subsidies, Benefits and Services) Act, 2016",
    "section": "Relevant Sections",
    "category": "Data Protection & Privacy",
    "summary": "Governs the use of Aadhaar numbers and data, with provisions for data security, privacy, and penalties for misuse of Aadhaar details.",
    "details": "The Act criminalizes unauthorized access to the Aadhaar database, disclosure of identity information, and impersonation using Aadhaar.",
    "penalty": "Imprisonment and fines for violations."
  },
  {
    "id": "34",
    "title": "Protection of Critical Infrastructure (NCIIPC)",
    "act": "NCIIPC Guidelines (under IT Act)",
    "section": "N/A",
    "category": "Other Key Acts & Policies",
    "summary": "The National Critical Information Infrastructure Protection Centre (NCIIPC) issues guidelines for the protection of critical infrastructure sectors like power, telecom, transport, banking, etc.",
    "details": "These guidelines aim to enhance the resilience of critical sectors against cyber attacks and ensure their continuous operation.",
    "penalty": "Compliance is generally enforced through sector-specific regulators and IT Act provisions."
  },
  {
    "id": "35",
    "title": "Cyberbullying",
    "act": "Various (IPC, IT Act)",
    "section": "e.g., IPC Sec 507, 354D; IT Act Sec 66E, 67",
    "category": "Special Cybercrime Focus Areas",
    "summary": "Involves using electronic communication to bully a person, typically by sending messages of an intimidating or threatening nature, or spreading rumors.",
    "details": "Can be addressed under laws related to criminal intimidation, stalking, defamation, violation of privacy, or transmission of obscene material depending on the nature of bullying.",
    "penalty": "Varies based on the specific offence invoked."
  },
  {
    "id": "36",
    "title": "Revenge Porn",
    "act": "IT Act, IPC",
    "section": "e.g., IT Act Sec 66E, 67, 67A; IPC Sec 292, 354C, 509",
    "category": "Special Cybercrime Focus Areas",
    "summary": "Distribution of sexually explicit images or videos of individuals without their consent, often by ex-partners.",
    "details": "Covered under laws related to violation of privacy, publishing obscene or sexually explicit material, voyeurism, and outraging modesty of a woman.",
    "penalty": "Varies, can include imprisonment and significant fines."
  },
  {
    "id": "37",
    "title": "Deepfake Crimes",
    "act": "IT Act, IPC",
    "section": "e.g., IT Act Sec 66D, 66E, 67/67A; IPC Sec 465, 499, 500",
    "category": "Special Cybercrime Focus Areas",
    "summary": "Creation and distribution of synthetic media where a person in an existing image or video is replaced with someone else's likeness, often for malicious purposes.",
    "details": "Can involve identity theft, cheating by impersonation, violation of privacy, defamation, or publishing obscene/explicit content, depending on the deepfake's nature and intent.",
    "penalty": "Varies based on the specific offence committed."
  },
  {
    "id": "38",
    "title": "Online Gaming Fraud",
    "act": "IT Act, IPC",
    "section": "e.g., IT Act Sec 43, 66; IPC Sec 420",
    "category": "Special Cybercrime Focus Areas",
    "summary": "Involves various fraudulent activities related to online gaming, such as account hijacking, theft of in-game virtual items, or scams related to game currency.",
    "details": "Can be treated as hacking, cheating, or theft depending on the specifics. Some states also have specific gaming laws.",
    "penalty": "Varies based on the offence."
  },
  {
    "id": "39",
    "title": "Dark Web Surveillance & Crimes",
    "act": "Various (IT Act, NDPS Act, IPC)",
    "section": "Multiple",
    "category": "Special Cybercrime Focus Areas",
    "summary": "The Dark Web is often used for illicit activities like drug trafficking, arms dealing, sale of stolen data, and child exploitation material. Law enforcement monitors and investigates such activities.",
    "details": "Crimes committed using the Dark Web are prosecuted under relevant laws (e.g., Narcotic Drugs and Psychotropic Substances Act for drug offenses, IT Act for cybercrimes, IPC for various offenses).",
    "penalty": "Severe penalties, including long imprisonment terms, depending on the crime."
  },
  {
    "id": "40",
    "title": "Child Exploitation (POCSO Act Overlap)",
    "act": "POCSO Act, IT Act, IPC",
    "section": "POCSO Sections, IT Act Sec 67B",
    "category": "Special Cybercrime Focus Areas",
    "summary": "Online child sexual abuse and exploitation, including grooming, sextortion, and creation/distribution of Child Sexual Abuse Material (CSAM).",
    "details": "The Protection of Children from Sexual Offences (POCSO) Act, 2012, is the primary law, often used in conjunction with IT Act Section 67B. These laws prescribe stringent punishments.",
    "penalty": "Severe penalties, including lengthy imprisonment and fines."
  }
];

const GLOSSARY_DATA: GlossaryEntry[] = [
  {
    "id": "1",
    "term": "Phishing",
    "definition": "A fraudulent attempt to obtain sensitive information like usernames, passwords, or credit card details by impersonating a trustworthy entity in an email or message. Example: An email appearing to be from Netflix asking you to update your payment details via a malicious link.",
    "category": "Cyber Attacks"
  },
  {
    "id": "2",
    "term": "Spear Phishing",
    "definition": "A highly targeted phishing attack aimed at a specific individual or organization, often using personalized information to appear more credible. Example: An attacker emailing a company's accountant, pretending to be the CEO and urgently requesting a money transfer.",
    "category": "Cyber Attacks"
  },
  {
    "id": "3",
    "term": "Vishing",
    "definition": "Voice phishing; the use of phone calls to deceive people into revealing personal information. Example: A scammer calling you, pretending to be from your bank's fraud department, and asking for your card details to \"stop a fraudulent transaction\".",
    "category": "Cyber Attacks"
  },
  {
    "id": "4",
    "term": "Smishing",
    "definition": "Phishing conducted via SMS text messages. Example: A text message claiming you have a package delivery and must click a link and pay a small fee, which steals your credit card info.",
    "category": "Cyber Attacks"
  },
  {
    "id": "5",
    "term": "Spoofing",
    "definition": "Disguising a communication from an unknown source as being from a known, trusted source. This can apply to emails, phone numbers, or websites. Example: An email that appears to be from \"support@microsoft.com\" but is actually from an attacker.",
    "category": "Cyber Attacks"
  },
  {
    "id": "6",
    "term": "DDoS",
    "definition": "A Distributed Denial of Service attack floods a server with internet traffic from many different sources to prevent legitimate users from accessing it. Example: A group of attackers using thousands of infected computers to overwhelm a gaming server, making it unavailable for players.",
    "category": "Cyber Attacks"
  },
  {
    "id": "7",
    "term": "MITM",
    "definition": "A Man-In-The-Middle attack where an attacker secretly intercepts and relays messages between two parties who believe they are directly communicating with each other. Example: An attacker on a public Wi-Fi network intercepting your data as you log into your online banking.",
    "category": "Cyber Attacks"
  },
  {
    "id": "8",
    "term": "SQL Injection",
    "definition": "A code injection technique used to attack data-driven applications, in which malicious SQL statements are inserted into an entry field for execution. Example: An attacker entering malicious code into a website's login form to bypass authentication and access the database.",
    "category": "Cyber Attacks"
  },
  {
    "id": "9",
    "term": "XSS",
    "definition": "Cross-Site Scripting involves injecting malicious scripts into trusted websites, which then run on a victim's browser. Example: A hacker posting a malicious script in a comment on a blog, which then steals session cookies from other users who view the comment.",
    "category": "Cyber Attacks"
  },
  {
    "id": "10",
    "term": "Ransomware",
    "definition": "A type of malware that encrypts a victim's files, making them inaccessible. The attacker then demands a ransom to restore access. Example: The WannaCry attack that locked files on computers in hospitals and businesses worldwide, demanding Bitcoin for their release.",
    "category": "Cyber Attacks"
  },
  {
    "id": "11",
    "term": "Malware",
    "definition": "An umbrella term for any malicious software designed to harm or exploit any programmable device, service or network. This includes viruses, worms, trojans, ransomware, and spyware.",
    "category": "Cyber Attacks"
  },
  {
    "id": "12",
    "term": "Adware",
    "definition": "Software that generates revenue for its developer by automatically generating unwanted online advertisements in the user interface of the software or on a screen. Example: A free program that, once installed, constantly shows pop-up ads in your web browser.",
    "category": "Cyber Attacks"
  },
  {
    "id": "13",
    "term": "Spyware",
    "definition": "Malware that secretly observes the user's activities on their computer and gathers information without their consent. Example: A program that records your browsing history and login credentials and sends them to an attacker.",
    "category": "Cyber Attacks"
  },
  {
    "id": "14",
    "term": "Trojan Horse",
    "definition": "Malware that misleads users of its true intent by disguising itself as a legitimate program. Example: A file that looks like a free game installer but, when run, also installs a keylogger on your system.",
    "category": "Cyber Attacks"
  },
  {
    "id": "15",
    "term": "Rootkit",
    "definition": "A collection of malicious software tools that enable an unauthorized user to gain control of a computer system without being detected. Example: A rootkit could hide a keylogger from the operating system and antivirus software.",
    "category": "Cyber Attacks"
  },
  {
    "id": "16",
    "term": "Botnet",
    "definition": "A network of private computers infected with malicious software and controlled as a group without the owners' knowledge, e.g., to send spam or launch DDoS attacks. Example: The Mirai botnet infected thousands of IoT devices (like cameras) to launch massive DDoS attacks.",
    "category": "Cyber Attacks"
  },
  {
    "id": "17",
    "term": "Zero-Day",
    "definition": "A vulnerability in a system or device that has been disclosed but is not yet patched. An exploit that attacks a zero-day vulnerability is called a zero-day exploit. Example: An attacker discovers a new flaw in an operating system and uses it to hack systems before the software vendor can release a fix.",
    "category": "Cyber Attacks"
  },
  {
    "id": "18",
    "term": "Drive-by Download",
    "definition": "The unintentional download of software to a computer, which can happen by visiting a malicious website, opening a malicious email, or clicking a deceptive pop-up window. Example: Visiting a compromised website that automatically installs malware on your computer in the background.",
    "category": "Cyber Attacks"
  },
  {
    "id": "19",
    "term": "Brute Force Attack",
    "definition": "A trial-and-error method used to decode encrypted data such as passwords or data files, through exhaustive effort rather than intellectual strategies. Example: A script repeatedly trying all possible character combinations to guess your email password.",
    "category": "Cyber Attacks"
  },
  {
    "id": "20",
    "term": "Dictionary Attack",
    "definition": "A form of brute force attack that uses a large list of common words and phrases (a \"dictionary\") to guess a password. Example: An attacker trying \"password123\", \"qwerty\", and other common passwords from a list to break into an account.",
    "category": "Cyber Attacks"
  },
  {
    "id": "21",
    "term": "Keylogger",
    "definition": "A type of spyware that records every keystroke made on a computer. This can be used to steal passwords and other sensitive information. Example: A hardware device plugged into a keyboard cable, or software installed on a PC, that logs everything a user types.",
    "category": "Cyber Attacks"
  },
  {
    "id": "22",
    "term": "Clickjacking",
    "definition": "A malicious technique of tricking a user into clicking on something different from what the user perceives, thus potentially revealing confidential information or taking control of their computer. Example: A fake \"Win a Prize\" button placed invisibly over the \"Like\" button of a Facebook page.",
    "category": "Cyber Attacks"
  },
  {
    "id": "23",
    "term": "Logic Bomb",
    "definition": "A piece of code intentionally inserted into a software system that will set off a malicious function when specified conditions are met. Example: A disgruntled employee inserting code that deletes all company files if their name is removed from the employee payroll system.",
    "category": "Cyber Attacks"
  },
  {
    "id": "24",
    "term": "Session Hijacking",
    "definition": "An attack where an attacker takes control of a user's session to gain unauthorized access to a system or service. Example: Stealing a user's session cookie from their browser to access their logged-in social media account without needing the password.",
    "category": "Cyber Attacks"
  },
  {
    "id": "25",
    "term": "Watering Hole Attack",
    "definition": "A strategy where an attacker compromises a website frequently visited by a specific group of users, rather than attacking the targets directly. Example: An attacker hacking a popular industry news website to infect the computers of employees from a specific company who visit that site.",
    "category": "Cyber Attacks"
  },
  {
    "id": "26",
    "term": "CIA Triad",
    "definition": "A foundational model for information security policies, covering three core principles: Confidentiality (restricting access), Integrity (ensuring data is not altered), and Availability (ensuring systems are accessible). Example: A bank must keep your account details secret (Confidentiality), ensure your balance is accurate (Integrity), and allow you to access your account via ATM anytime (Availability).",
    "category": "Security Concepts"
  },
  {
    "id": "27",
    "term": "Authentication",
    "definition": "The process of verifying the identity of a user or system, confirming that they are who they claim to be. Example: Entering your password to log into your email account.",
    "category": "Security Concepts"
  },
  {
    "id": "28",
    "term": "Authorization",
    "definition": "The process of granting or denying a user or system specific permissions to access resources after they have been authenticated. Example: A regular employee can view company files, but only a manager is authorized to edit or delete them.",
    "category": "Security Concepts"
  },
  {
    "id": "29",
    "term": "Encryption",
    "definition": "The process of converting data into a code (ciphertext) to prevent unauthorized access. Only users with the correct key can read it. Example: WhatsApp uses end-to-end encryption to ensure only the sender and receiver can read messages.",
    "category": "Security Concepts"
  },
  {
    "id": "30",
    "term": "Decryption",
    "definition": "The process of converting encrypted data (ciphertext) back into its original, readable form (plaintext) using a specific key. Example: Your phone using a key to turn an encrypted WhatsApp message back into readable text.",
    "category": "Security Concepts"
  },
  {
    "id": "31",
    "term": "Hashing",
    "definition": "A one-way process that converts an input of any size into a fixed-size string of text. It's not reversible. Example: Websites store a hash of your password instead of the password itself. When you log in, they hash your input and compare it to the stored hash.",
    "category": "Security Concepts"
  },
  {
    "id": "32",
    "term": "Salt",
    "definition": "A random piece of data added to a password before it is hashed. This ensures that even identical passwords will have different hashes, making them harder to crack. Example: Adding \"aXyZ123\" to a password before hashing it.",
    "category": "Security Concepts"
  },
  {
    "id": "33",
    "term": "Digital Signature",
    "definition": "An electronic, encrypted stamp of authentication on digital information such as email messages, macros, or electronic documents. It ensures the information originated from the signer and has not been altered. Example: Companies using a digital signature to sign official electronic documents like invoices.",
    "category": "Security Concepts"
  },
  {
    "id": "34",
    "term": "Non-repudiation",
    "definition": "The assurance that someone cannot deny the validity of something. It provides proof of the origin, integrity, and submission of data. Example: A digital signature on a contract ensures the signer cannot later deny they signed it.",
    "category": "Security Concepts"
  },
  {
    "id": "35",
    "term": "Access Control",
    "definition": "Security policies and procedures that control who can access what resources in a computing environment. Example: A system that allows only authenticated users with specific permissions to access sensitive project files.",
    "category": "Security Concepts"
  },
  {
    "id": "36",
    "term": "MFA",
    "definition": "Multi-Factor Authentication is a security method that requires the user to provide two or more verification factors to gain access to a resource. Example: Logging into your Google account with your password (something you know) and a code sent to your phone (something you have).",
    "category": "Security Concepts"
  },
  {
    "id": "37",
    "term": "Biometric Authentication",
    "definition": "A security process that relies on the unique biological characteristics of an individual to verify their identity. Example: Unlocking your smartphone using your fingerprint or Face ID.",
    "category": "Security Concepts"
  },
  {
    "id": "38",
    "term": "IDS",
    "definition": "An Intrusion Detection System is a device or software application that monitors a network for malicious activity or policy violations and reports it. Example: An IDS alerts a system administrator when it detects a potential hacking attempt on the company network.",
    "category": "Security Concepts"
  },
  {
    "id": "39",
    "term": "IPS",
    "definition": "An Intrusion Prevention System is a network security tool that not only detects malicious activity but also takes automated action to block it. Example: An IPS automatically blocks traffic from a suspicious IP address that is trying to scan the network for vulnerabilities.",
    "category": "Security Concepts"
  },
  {
    "id": "40",
    "term": "Firewall",
    "definition": "A network security system that monitors and controls incoming and outgoing network traffic based on predetermined security rules. Example: A firewall on your home router blocking unauthorized connection attempts from the internet.",
    "category": "Security Concepts"
  },
  {
    "id": "41",
    "term": "Honeypot",
    "definition": "A decoy computer system set up to attract and trap cyberattackers, allowing security professionals to study their methods. Example: A fake, vulnerable server designed to look like a real company server to see how hackers try to break in.",
    "category": "Security Concepts"
  },
  {
    "id": "42",
    "term": "VPN",
    "definition": "A Virtual Private Network creates a secure, encrypted connection over a less secure network, such as the public internet. Example: Using a company VPN to securely access internal files while working from home.",
    "category": "Security Concepts"
  },
  {
    "id": "43",
    "term": "Proxy Server",
    "definition": "An intermediary server that separates end users from the websites they browse, acting on their behalf. Example: A school using a proxy server to filter and block students from accessing inappropriate websites.",
    "category": "Security Concepts"
  },
  {
    "id": "44",
    "term": "Security Policy",
    "definition": "A formal document that outlines the rules, regulations, and procedures for protecting an organization's assets from threats. Example: A company policy that requires all employees to use strong passwords and change them every 90 days.",
    "category": "Security Concepts"
  },
  {
    "id": "45",
    "term": "Security Audit",
    "definition": "A systematic evaluation of the security of a company's information system by measuring how well it conforms to a set of established criteria. Example: An external firm being hired to review a bank's security practices and find weaknesses.",
    "category": "Security Concepts"
  },
  {
    "id": "46",
    "term": "Risk Assessment",
    "definition": "The process of identifying, analyzing, and evaluating potential risks to an organization's information assets. Example: A company analyzing the financial and reputational damage that would result from a data breach.",
    "category": "Security Concepts"
  },
  {
    "id": "47",
    "term": "Vulnerability",
    "definition": "A weakness or flaw in a computer system, security procedure, or internal control that could be exploited by a threat actor. Example: Outdated software that has not been patched with the latest security updates.",
    "category": "Security Concepts"
  },
  {
    "id": "48",
    "term": "Exploit",
    "definition": "A piece of software, data, or sequence of commands that takes advantage of a bug or vulnerability to cause unintended behavior on a computer system. Example: A program specifically designed to take advantage of an unpatched software flaw to gain control of a system.",
    "category": "Security Concepts"
  },
  {
    "id": "49",
    "term": "Incident Response",
    "definition": "An organized approach to addressing and managing the aftermath of a security breach or cyberattack. The goal is to handle the situation in a way that limits damage and reduces recovery time and costs. Example: A company's predefined plan for what to do when a ransomware attack is discovered.",
    "category": "Security Concepts"
  },
  {
    "id": "50",
    "term": "Patch",
    "definition": "A piece of software code designed to update a program or its supporting data, typically to fix security vulnerabilities or other bugs. Example: Microsoft releasing a \"Windows Update\" to fix a newly discovered security flaw.",
    "category": "Security Concepts"
  },
  {
    "id": "51",
    "term": "Wireshark",
    "definition": "A popular and free open-source packet analyzer used for network troubleshooting, analysis, and communications protocol development. Example: A network admin using Wireshark to inspect network traffic and diagnose a connectivity issue.",
    "category": "Tools & Technologies"
  },
  {
    "id": "52",
    "term": "Nmap",
    "definition": "A free and open-source network scanner for network discovery and security auditing. It can identify what hosts are available on the network, what services those hosts are offering, and what operating systems they are running. Example: A security analyst running an Nmap scan to identify all open ports on a server.",
    "category": "Tools & Technologies"
  },
  {
    "id": "53",
    "term": "Metasploit",
    "definition": "A widely used penetration testing framework that makes hacking simpler for attackers and defenders. It contains a suite of tools to test for vulnerabilities. Example: An ethical hacker using Metasploit to simulate an attack on a company's network to find weaknesses.",
    "category": "Tools & Technologies"
  },
  {
    "id": "54",
    "term": "Burp Suite",
    "definition": "An integrated platform for performing security testing of web applications. Its tools work together to support the entire testing process. Example: A tester using Burp Suite to intercept and modify traffic between their browser and a web application to find flaws.",
    "category": "Tools & Technologies"
  },
  {
    "id": "55",
    "term": "Nessus",
    "definition": "A popular and proprietary vulnerability scanner that scans for potential vulnerabilities in computer systems. Example: An IT team using Nessus to automatically scan all company computers for missing security patches.",
    "category": "Tools & Technologies"
  },
  {
    "id": "56",
    "term": "Nikto",
    "definition": "An open-source web server scanner that performs comprehensive tests against web servers for multiple items, including dangerous files/programs and outdated software versions. Example: Running Nikto against a website to find outdated server software.",
    "category": "Tools & Technologies"
  },
  {
    "id": "57",
    "term": "OWASP ZAP",
    "definition": "The Zed Attack Proxy is a free, open-source penetration testing tool for finding vulnerabilities in web applications. Example: A developer using ZAP to automatically scan their web application for common security issues like SQL Injection.",
    "category": "Tools & Technologies"
  },
  {
    "id": "58",
    "term": "John the Ripper",
    "definition": "A free, open-source password cracking tool used by security professionals to test password strength. Example: Using \"John\" to try and crack a list of hashed passwords to see how many are weak.",
    "category": "Tools & Technologies"
  },
  {
    "id": "59",
    "term": "Hydra",
    "definition": "A parallelized network login cracker which supports numerous protocols to attack. It is very fast and flexible. Example: An ethical hacker using Hydra to test if a login form is vulnerable to rapid, automated password guessing (a brute-force attack).",
    "category": "Tools & Technologies"
  },
  {
    "id": "60",
    "term": "Aircrack-ng",
    "definition": "A complete suite of tools to assess Wi-Fi network security. It focuses on monitoring, attacking, testing, and cracking Wi-Fi security. Example: A security professional using Aircrack-ng to test the strength of a company's Wi-Fi password.",
    "category": "Tools & Technologies"
  },
  {
    "id": "61",
    "term": "Maltego",
    "definition": "A tool for open-source intelligence (OSINT) and graphical link analysis for gathering and connecting information. Example: An investigator using Maltego to visually map relationships between people, companies, and websites from public data.",
    "category": "Tools & Technologies"
  },
  {
    "id": "62",
    "term": "Shodan",
    "definition": "A search engine that lets the user find specific types of computers (webcams, routers, servers, etc.) connected to the internet. Example: A researcher using Shodan to find out how many unsecured webcams are publicly accessible online.",
    "category": "Tools & Technologies"
  },
  {
    "id": "63",
    "term": "OpenVAS",
    "definition": "A full-featured vulnerability scanner. Its capabilities include unauthenticated testing, authenticated testing, various high-level and low-level Internet and industrial protocols. Example: A system admin using OpenVAS to get a detailed report of vulnerabilities on their network.",
    "category": "Tools & Technologies"
  },
  {
    "id": "64",
    "term": "Snort",
    "definition": "An open-source intrusion prevention system (IPS) and intrusion detection system (IDS). It can perform real-time traffic analysis and packet logging. Example: Setting up Snort to monitor network traffic and send an alert if it detects a known malware signature.",
    "category": "Tools & Technologies"
  },
  {
    "id": "65",
    "term": "ClamAV",
    "definition": "An open-source antivirus engine for detecting trojans, viruses, malware, and other malicious threats. Example: Integrating ClamAV into a mail server to scan all incoming emails for viruses.",
    "category": "Tools & Technologies"
  },
  {
    "id": "66",
    "term": "Autopsy",
    "definition": "A digital forensics platform and graphical interface to The Sleuth Kit and other digital forensics tools. Example: A forensic investigator using Autopsy to analyze a hard drive image and recover deleted files from a suspect's computer.",
    "category": "Tools & Technologies"
  },
  {
    "id": "67",
    "term": "FTK",
    "definition": "The Forensic Toolkit is a computer forensics software that scans a hard drive looking for various information. Example: Law enforcement using FTK Imager to create a forensic copy of a computer's hard drive for evidence.",
    "category": "Tools & Technologies"
  },
  {
    "id": "68",
    "term": "TheHarvester",
    "definition": "A tool for gathering open-source intelligence (OSINT) such as e-mail accounts, subdomains, and user names from public sources. Example: A penetration tester using TheHarvester to find employee email addresses of a target company.",
    "category": "Tools & Technologies"
  },
  {
    "id": "69",
    "term": "SQLMap",
    "definition": "An open-source penetration testing tool that automates the process of detecting and exploiting SQL injection flaws. Example: Using sqlmap to automatically test if a website parameter is vulnerable to SQL injection and extracting database information.",
    "category": "Tools & Technologies"
  },
  {
    "id": "70",
    "term": "Netcat",
    "definition": "A networking utility for reading from and writing to network connections using TCP or UDP. It is known as the \"Swiss-army knife for TCP/IP\". Example: Using Netcat to test if a specific port is open on a remote server.",
    "category": "Tools & Technologies"
  },
  {
    "id": "71",
    "term": "Tor",
    "definition": "The Onion Router is free and open-source software for enabling anonymous communication by directing Internet traffic through a free, worldwide, volunteer overlay network. Example: A journalist using the Tor Browser to research sensitive topics without revealing their location.",
    "category": "Tools & Technologies"
  },
  {
    "id": "72",
    "term": "SELinux",
    "definition": "Security-Enhanced Linux is a Linux kernel security module that provides a mechanism for supporting access control security policies. Example: Configuring SELinux on a web server to restrict the web server process from accessing files outside its designated directories.",
    "category": "Tools & Technologies"
  },
  {
    "id": "73",
    "term": "GnuPG",
    "definition": "Gnu Privacy Guard is a free implementation of the OpenPGP standard that allows you to encrypt and sign your data and communications. Example: Using GnuPG to encrypt an email to ensure only the intended recipient can read it.",
    "category": "Tools & Technologies"
  },
  {
    "id": "74",
    "term": "Kali Linux",
    "definition": "A Debian-derived Linux distribution designed for digital forensics and penetration testing. It comes preinstalled with numerous security tools. Example: A cybersecurity student using Kali Linux in a virtual machine to practice ethical hacking techniques.",
    "category": "Tools & Technologies"
  },
  {
    "id": "75",
    "term": "Parrot OS",
    "definition": "Another Debian-based Linux distribution geared towards security, privacy, and development. It provides a suite of tools for penetration testing and digital forensics. Example: A security researcher using Parrot OS for its anonymity tools and development environment.",
    "category": "Tools & Technologies"
  },
  {
    "id": "76",
    "term": "Cyber Hygiene",
    "definition": "A set of practices that computer users should do regularly to maintain the health and security of their devices and data. Example: Regularly changing passwords, using two-factor authentication, and being cautious about opening suspicious emails.",
    "category": "General Cyber Terms"
  },
  {
    "id": "77",
    "term": "Threat Actor",
    "definition": "An individual or group that performs a cyberattack. They can range from individual hackers to organized crime groups or state-sponsored entities. Example: A nation-state group that targets another country's government agencies to steal classified information.",
    "category": "General Cyber Terms"
  },
  {
    "id": "78",
    "term": "Insider Threat",
    "definition": "A security risk that originates from within the targeted organization. It can be a current or former employee, contractor, or business partner. Example: A disgruntled employee selling confidential company data to a competitor.",
    "category": "General Cyber Terms"
  },
  {
    "id": "79",
    "term": "Social Engineering",
    "definition": "The psychological manipulation of people into performing actions or divulging confidential information. Example: An attacker calling an employee, pretending to be from IT support, to trick them into revealing their password.",
    "category": "General Cyber Terms"
  },
  {
    "id": "80",
    "term": "Dark Web",
    "definition": "A part of the World Wide Web that exists on darknets, overlay networks that use the internet but require specific software, configurations, or authorization to access. Example: Illegal marketplaces selling stolen credit card data or drugs operate on the Dark Web.",
    "category": "General Cyber Terms"
  },
  {
    "id": "81",
    "term": "Deep Web",
    "definition": "The part of the World Wide Web whose contents are not indexed by standard web search engines. Example: Your online banking portal, email inbox, and company-internal websites are all part of the Deep Web.",
    "category": "General Cyber Terms"
  },
  {
    "id": "82",
    "term": "Surface Web",
    "definition": "The portion of the World Wide Web that is readily available to the general public and searchable with standard web search engines. Example: Public websites like Wikipedia, news sites, and blogs.",
    "category": "General Cyber Terms"
  },
  {
    "id": "83",
    "term": "Payload",
    "definition": "The component of a piece of malware that performs the intended malicious action, such as destroying data, sending spam, or encrypting files. Example: The payload of a ransomware virus is the code that encrypts the victim's files.",
    "category": "General Cyber Terms"
  },
  {
    "id": "84",
    "term": "Breach",
    "definition": "An incident that results in the confirmed disclosure—not just potential exposure—of data to an unauthorized party. Example: A hacker successfully bypassing security and downloading a database of customer information.",
    "category": "General Cyber Terms"
  },
  {
    "id": "85",
    "term": "Cyber Espionage",
    "definition": "The use of computer networks to gain illicit access to confidential information, typically held by a government or other organization. Example: A foreign government hacking into a defense contractor's network to steal new weapon designs.",
    "category": "General Cyber Terms"
  },
  {
    "id": "86",
    "term": "Cyber Terrorism",
    "definition": "The use of the internet to conduct violent acts that result in, or threaten, loss of life or significant bodily harm, in order to achieve political or ideological gains through threat or intimidation. Example: Hacking into a country's power grid to cause a massive blackout.",
    "category": "General Cyber Terms"
  },
  {
    "id": "87",
    "term": "Data Exfiltration",
    "definition": "The unauthorized copying, transfer, or retrieval of data from a computer or server. Example: Malware on a corporate laptop secretly sending copies of sensitive documents to an external server controlled by an attacker.",
    "category": "General Cyber Terms"
  },
  {
    "id": "88",
    "term": "Sandbox",
    "definition": "A secure, isolated environment in which a program or file can be executed without affecting the application or system on which it runs. Example: Security software opening a suspicious email attachment in a sandbox to see if it behaves like malware.",
    "category": "General Cyber Terms"
  },
  {
    "id": "89",
    "term": "Bug Bounty",
    "definition": "A reward offered by many websites, organizations and software developers to individuals who find and report security exploits and vulnerabilities. Example: Google paying a researcher thousands of dollars for discovering a critical vulnerability in their web browser.",
    "category": "General Cyber Terms"
  },
  {
    "id": "90",
    "term": "Data Leak",
    "definition": "The accidental exposure of sensitive information due to an internal error, misconfiguration, or failure of security controls. Example: A company accidentally leaving a database with customer information on a publicly accessible server without a password.",
    "category": "General Cyber Terms"
  },
  {
    "id": "91",
    "term": "Data Breach",
    "definition": "An incident where information is stolen or taken from a system without the knowledge or authorization of the system’s owner. This is often the result of a targeted cyberattack. Example: A hacker actively breaking into a company's servers to steal customer data.",
    "category": "General Cyber Terms"
  },
  {
    "id": "92",
    "term": "Eavesdropping",
    "definition": "The act of secretly listening to the private communication of others without their consent. In cybersecurity, this refers to intercepting data traffic. Example: An attacker using a packet sniffer on an unsecure Wi-Fi network to read unencrypted emails.",
    "category": "General Cyber Terms"
  },
  {
    "id": "93",
    "term": "Threat Intelligence",
    "definition": "Evidence-based knowledge, including context, mechanisms, indicators, implications, and actionable advice, about an existing or emerging menace or hazard to assets. Example: A report that details the specific hacking tools and IP addresses used by a particular cybercrime group.",
    "category": "General Cyber Terms"
  },
  {
    "id": "94",
    "term": "Security Posture",
    "definition": "An organization's overall cybersecurity strength and resilience. It includes network security, information security, employee training, and data protection policies. Example: A company with a strong security posture has up-to-date software, well-trained employees, and a robust incident response plan.",
    "category": "General Cyber Terms"
  },
  {
    "id": "95",
    "term": "ISO 27001",
    "definition": "An international standard on how to manage information security. It details requirements for establishing, implementing, maintaining and continually improving an Information Security Management System (ISMS). Example: A company becoming ISO 27001 certified to prove to its customers that it has high security standards.",
    "category": "General Cyber Terms"
  },
  {
    "id": "96",
    "term": "GDPR",
    "definition": "The General Data Protection Regulation is a law on data protection and privacy in the European Union and the European Economic Area. It has influenced data protection laws globally. Example: Any company that processes data of EU citizens must comply with GDPR rules for consent and data handling.",
    "category": "General Cyber Terms"
  },
  {
    "id": "97",
    "term": "DPDP Act",
    "definition": "The Digital Personal Data Protection Act, 2023, is India’s comprehensive law for the protection of digital personal data. It outlines the rights of individuals and the obligations of entities that process data. Example: Under the DPDP Act, an Indian company must obtain clear consent from a user before collecting and using their personal data.",
    "category": "General Cyber Terms"
  },
  {
    "id": "98",
    "term": "Penetration Testing",
    "definition": "Also known as a pen test, it is an authorized simulated cyberattack on a computer system, performed to evaluate the security of the system. Example: Hiring ethical hackers to try and break into your company's website to find vulnerabilities before real hackers do.",
    "category": "General Cyber Terms"
  },
  {
    "id": "99",
    "term": "Red Team",
    "definition": "A group of security professionals who act as adversaries to test an organization's security. They simulate the tactics and techniques of real-life attackers. Example: A bank's red team attempting to bypass security and access sensitive data to test the bank's defenses.",
    "category": "General Cyber Terms"
  },
  {
    "id": "100",
    "term": "Blue Team",
    "definition": "A group of security professionals who have the responsibility for defending an enterprise's information systems against threats and attacks. Example: The blue team at a company monitors security alerts and responds to any detected intrusion attempts.",
    "category": "General Cyber Terms"
  }
];

function scoreText(text: string, keywords: string[]): number {
  const lower = text.toLowerCase();
  return keywords.reduce((score, kw) => {
    const count = (lower.split(kw).length - 1);
    return score + count;
  }, 0);
}

function extractKeywords(query: string): string[] {
  const stopWords = new Set([
    'what','is','are','the','a','an','how','do','does','i','my','me','we','you',
    'it','in','on','at','to','for','of','and','or','can','will','about','explain',
    'tell','please','help','section','act','under','law',
  ]);
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w: string) => w.length > 2 && !stopWords.has(w));
}

export function retrieveRelevantChunks(query: string, topK = 5): RetrievedChunk[] {
  const keywords = extractKeywords(query);
  if (keywords.length === 0) return [];

  const scored: Array<{ chunk: RetrievedChunk; score: number }> = [];

  for (const law of LAW_DATA) {
    const text = [law.title, law.section, law.act, law.summary, law.details, law.category]
      .join(' ').toLowerCase();
    const score = scoreText(text, keywords);
    if (score > 0) {
      scored.push({
        score,
        chunk: {
          type: 'law',
          title: law.title,
          section: law.section,
          act: law.act,
          content: law.summary + ' ' + law.details,
          penalty: law.penalty,
        },
      });
    }
  }

  for (const term of GLOSSARY_DATA) {
    const text = [term.term, term.definition, term.category].join(' ').toLowerCase();
    const score = scoreText(text, keywords);
    if (score > 0) {
      scored.push({
        score,
        chunk: {
          type: 'glossary',
          title: term.term,
          content: term.definition,
        },
      });
    }
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(s => s.chunk);
}

export function formatChunksAsContext(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) {
    return 'No specific content found in the CyberMozhi database for this query.';
  }
  return chunks
    .map(chunk => {
      if (chunk.type === 'law') {
        const lines = [
          `--- LAW: ${chunk.title} ---`,
          `Act: ${chunk.act} | Section: ${chunk.section}`,
          `Details: ${chunk.content}`,
        ];
        if (chunk.penalty) lines.push(`Penalty: ${chunk.penalty}`);
        return lines.join('\n');
      } else {
        return `--- TERM: ${chunk.title} ---\nDefinition: ${chunk.content}`;
      }
    })
    .join('\n\n');
}