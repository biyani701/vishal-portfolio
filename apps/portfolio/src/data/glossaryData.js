// glossaryData.js
// Data structure for glossary items

const glossaryData = [
  {
    id: "70418545",
    acronym: "ADC",
    fullForm: "Authorization Decision Control",
    details: "Authorization Decision Control",
    category: "General",
    icon: "info",
  },
  {
    id: "70483991",
    acronym: "ATC",
    fullForm: "Application Transaction Counter",
    details:
      "* **Purpose:** The ATC serves as a unique identifier for each transaction, helping to prevent replay attacks and ensure transaction integrity.\n\n* **Incrementing:** The card chip increments the ATC at the beginning of each transaction.\n\n* **Value Range:** The ATC value ranges from 0x0000 to 0xFFFF (0 to 65535).\n\n* **Security:** If a transaction attempts to use an ATC value that's already been used or is lower than the last used ATC, the transaction may be denied as a potential replay attack or clone card issue, as Pismo Developers Portal explains.\n\n* **ATC Update:** Issuers can update the ATC maintained at their end with the latest ATC from the chip on the card, according to Mastercard.",
    category: "General",
    icon: "info",
  },
  {
    id: "89686032",
    acronym: "CAVV",
    fullForm: "Cardholder Authentication Verification Value",
    details:
      "The Cardholder Authentication Verification Value (CAVV) is a cryptographic value generated during Visa Secure authentication, specifically within the 3-D Secure protocol. It serves as evidence that the cardholder's identity has been verified and links the issuer's authentication response with the subsequent authorization message. The CAVV is unique for each authentication transaction and is provided by the acquirer to the issuer during the authorization process",
    category: "General",
    icon: "info",
  },
  {
    id: "89686078",
    acronym: "TPDU",
    fullForm: "Transaction Protocol Data Unit",
    details:
      "The Transaction Protocol Data Unit (TPDU) is an old-school packet-based protocol designed for transaction-oriented applications. On the OSI model it stands between the Transport Layer (e.g. X.25, TCP or UDP) and the Application Layer. It was originally designed for X.25-based dial-up payment devices to provide the ability to concentrate a large number of these into one central host connection.\n\nTPDU message has 3 parts:\n\n* **Protocol ID** – Access protocol for a TPDU message  \n* **Destination Address** – Routing information for reaching message’s destination  \n* **Source Address** – Routing information for getting back to message’s origin",
    category: "Technology",
    icon: "computer",
  },
  {
    id: "89718822",
    acronym: "FCRA",
    fullForm: "Fair Credit Reporting Act",
    details:
      "The Fair Credit Reporting Act was originally passed in 1970. It was intended to shield consumers from the willful and/or negligent inclusion of erroneous data in their credit reports.",
    category: "Finance",
    icon: "payments",
  },
  {
  "id": "89718856",
  "acronym": "OTB",
  "fullForm": "Open To Buy",
  "details": "**OTB** (*Open To Buy*) refers to the **available credit** a cardholder can still spend on their credit card. It is calculated as:\n\n`OTB = Credit Limit - Current Balance`\n\nIn the context of credit cards:\n- **Credit Limit**: The maximum amount the issuer allows you to borrow.\n- **Current Balance**: The total of all posted transactions, including purchases, fees, and pending payments.\n\nFor example, if your credit limit is ₹1,00,000 and you've already spent ₹60,000, your OTB is ₹40,000. \n\n> 💡 *OTB helps track how much spending power remains on the card before reaching the limit.*",
  "category": "Finance",
  "icon": "info"
},
  {
  id: "89718869",
  acronym: "IPM",
  "fullForm": "Integrated Product Messages",
  "details": "**IPM** (*Integrated Product Messages*) is a data exchange format used by **Mastercard** to communicate detailed clearing and settlement information for transactions. \n\nIt includes:\n- Transaction-level data (amount, date, location, currency)\n- Interchange fee details\n- Chargeback and dispute data\n\n**IPM files** are essential for reconciling transactions, reporting, and ensuring compliance across Mastercard's global payment network.\n\n> 📊 IPM ensures financial institutions and processors receive rich, structured data for each transaction in the Mastercard ecosystem.",
  "category": "Payments",
  "icon": "account_balance"
},
 {
  "id": "89751559",
  "acronym": "UCAF",
  "fullForm": "Universal Cardholder Authentication Field",
  "details": "**UCAF** (*Universal Cardholder Authentication Field*) is a standardized authentication data field developed by **Mastercard** and supported by global card networks including **Visa**, **Verve**, and others through the **EMVCo** framework.\n\nIt is a critical part of the **3-D Secure (3DS)** ecosystem, used in **card-not-present** (CNP) transactions to:\n\n- Carry authentication data from the **Access Control Server (ACS)** to the card issuer\n- Embed cardholder identity verification results directly in the **authorization message**\n- Improve issuer decision-making and reduce **fraud and chargebacks**\n\nUCAF is used across multiple 3DS implementations:\n- **Mastercard** → Identity Check (3DS)\n- **Visa** → Visa Secure\n- **Verve** → Verve e-commerce 3DS via EMVCo-compliant solutions\n\n**Transaction Lifecycle with UCAF in 3DS**:\n1. Cardholder initiates a payment online.\n2. The ACS performs authentication (e.g., OTP, biometrics).\n3. The result (pass/fail, method) is encoded into the **UCAF**.\n4. UCAF is sent to the **issuer** as part of the authorization message.\n5. The issuer uses this to **approve/decline** the transaction.\n\n> 🔐 **UCAF** enables **frictionless, secure digital commerce** by ensuring authenticated transaction data is shared seamlessly across networks.",
  "category": "Payments",
  "icon": "shield"
}
,
  {
    id: "89784337",
    acronym: "AEVV",
    fullForm: "American Express Verification Value",
    details:
      "CSC is a series of numbers that, in addition to thebank card number, is printed (but notembossed) on acreditordebit card. CSC is used as a security feature forcard not present transactions, where apersonal identification number(PIN) cannot be manually entered by the cardholder.",
    category: "General",
    icon: "info",
  },
  {
    id: "96239617",
    acronym: "FEMA",
    fullForm: "Federal Emergency Management Agency",
    details:
      "The agency's primary purpose is to coordinate the response to a disaster that has occurred in the United States. The governor of the state in which the disaster occurs must declare astate of emergency. FEMA is part of the Department of Homeland Security.",
    category: "General",
    icon: "info",
  },
  {
    id: "96337922",
    acronym: "SCRA",
    fullForm: "The SERVICEMEMBERS CIVIL RELIEF ACT",
    details:
      "The Servicemembers Civil Relief Act of 1940 protects U.S. citizens serving with allied military forces for the duration of a military conflict involving the United States. Its origins can be traced as far back as theCivil War.",
    category: "Business",
    icon: "business",
  },
  {
    id: "96337933",
    acronym: "AAV",
    fullForm: "Account Authentication Value",
    details:
      "Credit card authentication is the process of confirming that a person who is attempting to use a credit card for a transaction is who they say they are. It is not the same as credit card authorization, which also verifies other information, such as that the card account has a sufficientcredit lineto cover the transaction.",
    category: "Finance",
    icon: "payments",
  },
  {
    id: "111476737",
    acronym: "MID",
    fullForm: "Merchant Identification Number",
    details:
      "Merchant category codes (MCCs) are four-digit numbers that credit card issuers use to classify individual purchases. The codes serve a variety of purposes, including the calculation and issuance ofcredit card rewards.",
    category: "General",
    icon: "info",
  },
  {
    id: "111476782",
    acronym: "MCC",
    fullForm:
      "Acceptor Business Code. Earlier it was known as merchant category code",
    details:
      "Amerchant category code (MCC) is a four-digit number used for retail financial services to classify a business by the types of goods or services it provides. MCCs are assigned either by merchant type (e.g., one for hotels, one for office supply stores, etc.) or by merchant name.",
    category: "Technology",
    icon: "computer",
  },
  {
    id: "111509540",
    acronym: "MTI",
    fullForm: "Message Type Indicator",
    details:
      "The vast majority of transactions made when a customer uses a card to make a payment in a store (EFTPOS) use ISO 8583 at some point in the communication chain. In particular, theMastercard,VisaandVervenetworks base their authorization communications on the standard.",
    category: "General",
    icon: "info",
  },
  {
    id: "111509570",
    acronym: "MDES",
    fullForm: "MasterCard Digital Enablement Service",
    details:
      "Verifone sells merchant-operated, consumer-facing and self-service payment systems to the financial, retail, hospitality, petroleum, government and healthcare industries. Its products process a range of payment types, including signature and personal identification number (PIN)-baseddebit cards.",
    category: "Technology",
    icon: "computer",
  },
  {
    id: "111509591",
    acronym: "BIN",
    fullForm: "Bank Identification Number",
    details:
      "The BIN system helps financial institutions identify fraudulent or stolen payment cards and can help prevent identity theft. BINs can be found on various payment cards, including credit cards, charge cards, and debit cards. This set of numbers identifies thefinancial institutionthat issues the card.",
    category: "General",
    icon: "info",
  },
  {
    id: "111575083",
    acronym: "TID",
    fullForm: "Terminal Identification Number",
    details:
      "The PIN has been the key to facilitating theprivate dataexchange between different data-processing centers in computer networks. PINs may be used to authenticate banking systems with cardholders, governments with citizens, enterprises with employees, and computers with users, among other uses.",
    category: "General",
    icon: "info",
  },
  {
    id: "111575133",
    acronym: "GCMS",
    fullForm: "Global Clearing Management System",
    details:
      "Clearing is necessary for the matching of all buy and sell orders in the market. It provides smoother and more efficient markets as parties can make transfers to the clearing corporation. Non-cleared trades can result insettlement risk.",
    category: "Technology",
    icon: "computer",
  },
  {
    id: "111673399",
    acronym: "MDS",
    fullForm: "MasterCard Debit Switch",
    details:
      "Switch was launched in 1988 byMidland Bank,National Westminster BankandThe Royal Bank of Scotland. It was then merged withMaestro, which is owned byMasterCard. Since then, Switch has been out of circulation.",
    category: "Finance",
    icon: "payments",
  },
  {
    id: "187301893",
    acronym: "OCL",
    fullForm: "Original Credit Limit",
    details:
      "A credit limit is the maximum amount of credit a financial institution extends to a client on a credit card or aline of credit. Lenders usually set credit limits based on specific information about the credit-seeking applicant, including their income and employment status.",
    category: "Finance",
    icon: "payments",
  },
  {
    id: "208142337",
    acronym: "PHP",
    fullForm: "Payment History Profile",
    details:
      "FICO scores range from 300 and 850, with anything 670 or above considered good or better. If your score is much lower than that, you will probably find it difficult to borrow money.",
    category: "Finance",
    icon: "payments",
  },
  {
    id: "219906049",
    acronym: "DDA",
    fullForm: "Dynamic Data Authentication",
    details:
      'EMV stands for "Europay,Mastercard, andVisa", the three companies that created the standard. Payment cards which comply with the EMV standard are often calledchip and PINorchip and signaturecards.',
    category: "Technology",
    icon: "computer",
  },
  {
    id: "219906064",
    acronym: "AIP",
    fullForm: "Application Interchange Profile",
    details:
      'EMV stands for "Europay,Mastercard, andVisa", the three companies that created the standard. Payment cards which comply with the EMV standard are often calledchip and PINorchip and signaturecards.',
    category: "General",
    icon: "info",
  },
  {
    id: "264208385",
    acronym: "CIT",
    fullForm: "Change In terms",
    details:
      "Change is a commonly used term in the world of finance, though it has many names. In general, a change refers to a price difference that occurs between two points in time. Another word for change is volatility.",
    category: "General",
    icon: "info",
  },
  {
    id: "264208396",
    acronym: "SRB",
    fullForm: "Statement Revolving Balance",
    details:
      "Revolving credit refers to a type of credit account that allows the borrower to repeatedly borrow up to a certain limit. Making payments reduces the balance owed and frees up credit, which can be used again.",
    category: "General",
    icon: "info",
  },
  {
    id: "280035333",
    acronym: "CFPB",
    fullForm: "Consumer Financial Protection Bureau",
    details:
      "CFPB's jurisdiction includesbanks,credit unions, securities firms,payday lenders, mortgage-servicing operations,foreclosurerelief services,debt collectors, and for-profit colleges.",
    category: "General",
    icon: "info",
  },
  {
    id: "281641209",
    acronym: "STIP",
    fullForm: "Stand-In Processing",
    details:
      "An ATM controller is key infrastructure in aninterbank network. A message may enter an ATMC from an ATM, another ATMC or a third party. An ATMC will examine the message, validate the PIN block if present, and then route the message according to the leading digits of the account number referenced.",
    category: "General",
    icon: "info",
  },
  {
    id: "353140737",
    acronym: "FPAN",
    fullForm: "Funding Primary Account Number",
    details:
      "Primary account numbers are not random numbers. They are made up of several sets of numbers, which serve specific purposes. The first six or eight digits in a PAN are theissuer identification number, or IIN.",
    category: "Finance",
    icon: "payments",
  },
  {
    id: "353173508",
    acronym: "DPAN",
    fullForm:
      "Device Primary Account Number a.k.a Digital Primary Account Number",
    details:
      "SIMs are used to identify and authenticate subscribers on mobile devices. SIMs are transferable between different mobile devices by removing the card itself. SIM cards are always used on GSMphones; forCDMAphones, they are needed only forLTE-capable handsets.",
    category: "Finance",
    icon: "payments",
  },
  {
    id: "378339329",
    acronym: "SMART",
    fullForm: "Specific, Measurable, Achievable, Realistic and Time-bound",
    details:
      "S.M.A.R.T. is an acronym for Specific, measurable, assignable, realistic, and time-bound goals. The term was first proposed by George T. Doran in the November 1981 issue ofManagement Review.",
    category: "General",
    icon: "info",
  },
  {
    id: "378765313",
    acronym: "FED",
    fullForm: "Floor Expiry Date",
    details:
      "Caps and floors can be used tohedgeagainst interest rate fluctuations. For example, a borrower who is paying the LIBOR rate on a loan can protect himself against a rise in rates by buying a cap.",
    category: "General",
    icon: "info",
  },
  {
    id: "378765324",
    acronym: "IMK",
    fullForm: "Issuer Master Key",
    details:
      "An issuer is a legal entity that develops, registers and sells securities to finance its operations. Issuers may be corporations,investment trusts, or domestic or foreign governments.",
    category: "General",
    icon: "info",
  },
  {
    id: "378798098",
    acronym: "CMK",
    fullForm: "Card Master Key",
    details:
      "Master keyed lock systems generally reduce overall security. Amaster keyoperates a set of several locks. Usually, there is nothing different about the key. The differences are in the locks the key will operate.",
    category: "General",
    icon: "info",
  },
  {
    id: "379224065",
    acronym: "VCN",
    fullForm: "Virtual Card Number",
    details:
      "Virtual credit card is an alias for an ordinary credit card number. It can only be used for a limited number of transactions. The number is generated through the use of either a Web application or a specialized client program, interacting with the card issuer's computer.",
    category: "General",
    icon: "info",
  },
  {
    id: "379289615",
    acronym: "ICCP",
    fullForm: "In Control for Commercial Payments",
    details:
      'Credit control, also called credit policy, is the strategy used by a business to accelerate sales of products or services. Businesses prefer to extend credit to those with "good" credit and limit credit to riskier borrowers who may have a history of delinquency.',
    category: "Finance",
    icon: "payments",
  },
  {
    id: "379682817",
    acronym: "FR Y-14M",
    fullForm:
      "The FR Y-14M report collects monthly detailed data on bank holding companies' (BHCs), savings and loan holding companies' (SLHCs), and intermediate holding companies' (IHCs) loan portfolios.",
    details: ".",
    category: "Finance",
    icon: "payments",
  },
  {
    id: "380141580",
    acronym: "ATO",
    fullForm: "Account Takeovers",
    details:
      "Takeovers are typically initiated by a larger company seeking to take over a smaller one. They can be voluntary, meaning they are the result of a mutual decision between the two companies. Takeovers are also commonly done through themerger and acquisitionprocess.",
    category: "Finance",
    icon: "payments",
  },
  {
    id: "382664705",
    acronym: "HMAC",
    fullForm: "hash-based message authentication codes",
    details:
      "An HMAC is a type of keyed hash function that can also be used in a key derivation scheme or a key stretching scheme. An HMAC can provide authentication using ashared secretinstead of usingdigital signatures.",
    category: "Technology",
    icon: "computer",
  },
  {
    id: "382861313",
    acronym: "Recidivism rate",
    fullForm:
      "The rate at which cards move backward in the process. If a task moves to done but it's not complete or has bugs, it's moved back, thus causing the recidivism rate to go up. If you use B to represent the number of times a card moves backward and F to represent the number of times a card moves forward, then recidivism can be calculated with the formula (B / (F + B)) * 100.",
    details: ".",
    category: "General",
    icon: "info",
  },
  {
    id: "396525569",
    acronym: "ECOA",
    fullForm: "Equal Credit Opportunity Act",
    details:
      "The Equal Credit Opportunity Act was enacted October 28, 1974. It makes it unlawful for any creditor to discriminate against any applicant. The law applies to any person who, in the ordinary course of business, regularly participates in a credit decision.",
    category: "Finance",
    icon: "payments",
  },
  {
    id: "396525583",
    acronym: "UDAAP",
    fullForm: "Unfair deceptive or abusive acts or practices",
    details:
      "It is illegal to engage in unfair, deceptive, or abusive acts or practices (UDAAP) The Dodd-Frank Wall Street Reform and Consumer Protection Act defined and outlawed UDAAP.",
    category: "General",
    icon: "info",
  },
  {
    id: "396591133",
    acronym: "FDCPA",
    fullForm: "Fair Debt Collections Practices Act",
    details:
      "The Fair Debt Collection Practices Act was approved on September 20, 1977. The Act creates guidelines under which debt collectors may conduct business, defines rights of consumers involved with debt collectors, and prescribes penalties and remedies for violations of the Act.",
    category: "General",
    icon: "info",
  },
  {
    id: "396689429",
    acronym: "TILA",
    fullForm: "Truth In Lending Act",
    details:
      "TILA gives consumers the right to cancel certain credit transactions that involve alien on a consumer's principal dwelling. With the exception of certain high-costmortgage loans, TILA does not regulate the charges that may be imposed for consumer credit.",
    category: "General",
    icon: "info",
  },
  {
    id: "408616961",
    acronym: "ABA",
    fullForm: "American Bankers Association Routing Numbers",
    details:
      "The American Bankers Association (ABA) developed the system in 1910. An ABA RTN is a nine-digit code printed on the bottom of a check. The ABA has partnered with a series of registrars to manage the system.",
    category: "General",
    icon: "info",
  },
  {
    id: "423329793",
    acronym: "OFAC",
    fullForm: "The Office of Foreign Assets Control",
    details:
      "OFAC administers and enforces economic and tradesanctions in support of U.S. national security. OFAC carries out its activities against foreign governments, organizations (including terrorist groups and drug cartels)",
    category: "General",
    icon: "info",
  },
  {
    id: "425263105",
    acronym: "RRC",
    fullForm: "Rewards Reversal Charge",
    details:
      "A void transaction is a debit or credit card transaction that is canceled by the merchant before it is settled by the cardholder's bank. Transactions are often voided when customers or merchants discover that an error has occurred or when fraud is suspected.",
    category: "General",
    icon: "info",
  },
  {
    id: "451313665",
    acronym: "TLID",
    fullForm: "Transaction Link ID",
    details:
      "Unique Transaction Identifier (UTI) is a globallyunique identifier. USIs were introduced in late 2012 in the U.S. in the context ofDodd–Frankregulation.",
    category: "General",
    icon: "info",
  },
  {
    id: "457834504",
    acronym: "MM",
    fullForm: "Mini-Miranda Rights",
    details:
      "Mini-Miranda rights are required when a debt collector contacts you by phone, letter, or in person. You must be informed of who is calling, what they are calling about, and that they may not harass you.",
    category: "General",
    icon: "info",
  },
  {
    id: "457965584",
    acronym: "ACMI",
    fullForm: "Apple Card Monthly Installment",
    details:
      "Apple and Goldman Sachs were fined more than $89 million Wednesday. The fine follows an investigation into the Apple Card, a credit card that worked with the iPhone maker's Apple Pay platform.",
    category: "General",
    icon: "info",
  },
  {
    id: "458424323",
    acronym: "CCC",
    fullForm: "Compliance Condition Code",
    details:
      "Regulatory compliancedescribes the goal that organizations aspire to achieve in their efforts to ensure that they are aware of and take steps to comply with relevantlaws, policies, andregulations. In general,compliancemeans conforming to a rule, such as a specification,policy,standardorlaw.",
    category: "Technology",
    icon: "computer",
  },
  {
  "id": "458457089",
  "acronym": "ACDV",
  "fullForm": "Automated Credit Dispute Verification",
  "details": "**ACDV** stands for *Automated Credit Dispute Verification*. It is a standardized electronic process used by credit reporting agencies and data furnishers to communicate and resolve consumer credit disputes. \n\nThe ACDV process is part of the **e-OSCAR** system (Online Solution for Complete and Accurate Reporting), where: \n- Credit bureaus receive disputes from consumers. \n- The bureau creates an ACDV form and sends it electronically to the original data furnisher (e.g., a bank). \n- The furnisher reviews and responds with corrections or verification. \n\nThis workflow ensures that disputed credit items are investigated and corrected or validated in a timely and consistent manner.",
  "category": "Finance",
  "icon": "payments"
},
  {
    id: "458620929",
    acronym: "AUD",
    fullForm: "Automated Universal Data Form",
    details:
      'JetFormCorporation first used the term "enterprise forms automation" in the mid 1990s to describe their solution to automating paperwork. This process was later acquired byAdobe Systems and is now part of theAdobe LiveCyclesuite of products.',
    category: "Technology",
    icon: "computer",
  },
  {
    id: "470941701",
    acronym: "BIC",
    fullForm: "Bank Identification Code",
    details:
      "The BIN system helps financial institutions identify fraudulent or stolen payment cards and can help prevent identity theft. BINs can be found on various payment cards, including credit cards, charge cards, and debit cards. This set of numbers identifies thefinancial institutionthat issues the card.",
    category: "Technology",
    icon: "computer",
  },
  {
    id: "470941765",
    acronym: "PAN",
    fullForm: "Primary Account Number",
    details:
      "Primary account numbers are not random numbers. They are made up of several sets of numbers, which serve specific purposes. The first six or eight digits in a PAN are theissuer identification number, or IIN.",
    category: "Finance",
    icon: "payments",
  },
  {
    id: "471007239",
    acronym: "IBAN",
    fullForm: "International Bank Account Number",
    details:
      "An IBAN uniquely identifies the account of a customer at a financial institution. By July 2024, 88 countries were using the IBAN numbering system. The IBAN consists of up to 34 alphanumeric characters.",
    category: "Finance",
    icon: "payments",
  },
  {
    id: "471040006",
    acronym: "ICA",
    fullForm: "Interbank Card Association",
    details:
      "Mastercard is an American company that issues credit cards. The company was founded in 1979 and is based in New York City.",
    category: "General",
    icon: "info",
  },
  {
    id: "471695363",
    acronym: "TMS",
    fullForm: "Terminal Management System",
    details:
      "ATerminal Operating System, or TOS, is a key part of a supply chain. It primarily aims to control the movement and storage of various types ofcargo. The systems also enables better use of assets, labour and equipment.",
    category: "Technology",
    icon: "computer",
  },
  {
    id: "471826434",
    acronym: "MMS",
    fullForm: "Merchant Management System",
    details:
      "Merchant services are services that businesses can use to accept and process electronic payments from their customers. These transactions may involve a combination of point-of-sale (POS) systems, credit card readers, payment gateways, and online transaction processing, among others.",
    category: "Technology",
    icon: "computer",
  },
  {
    id: "471826466",
    acronym: "How to create a Glossary",
    fullForm: "Steps for creating a glossary page in confluence",
    details:
      "Landforms are categorized by characteristic physical attributes such as their creating process, shape, elevation, slope, orientation, rock exposure, and soil type.",
    category: "General",
    icon: "info",
  },
  {
    id: "472055812",
    acronym: "DUKPT",
    fullForm: "derived unique key per transaction",
    details:
      "Derived Unique Key Per Transaction (DUKPT) is a key managementscheme in which for every transaction, a uniquekey is used. The current (as of May 2024) version of the standard (ANSI X9.24-3-2017) was released in 2017.",
    category: "General",
    icon: "info",
  },
  {
    id: "472055831",
    acronym: "RSA",
    fullForm: "Rivest Shamir Adleman",
    details:
      'The RSA cryptosystem is one of the oldest widely used for secure data transmission. Messages can be encrypted by anyone, via the public key, but can only be decrypted by someone who knows the private key. The security of RSA relies on the practical difficulty offactoring the product of two largeprime numbers, the "factoring problem"',
    category: "General",
    icon: "info",
  },
  {
    id: "476545129",
    acronym: "RRN",
    fullForm: "Retrieval Reference Number",
    details:
      "Run River North is an indie folk-rock band from Los Angeles, California. RRN is a key to uniquely identify a card transaction based on the ISO 8583standard.",
    category: "General",
    icon: "info",
  },
  {
    id: "476545148",
    acronym: "SRN",
    fullForm: "Source Registration Number",
    details:
      "Aregistered identification number (orRN) is a number issued by theFederal Trade Commission. Such businesses are not required to have RNs. They may, however, use the RN in place of a name on the label or tag that is required to be affixed to their products.",
    category: "General",
    icon: "info",
  },
  {
    id: "476577843",
    acronym: "3DS",
    fullForm: "3D Secure",
    details:
      "Amerchant plug-in(MPI) is a software module designed to facilitate3-D Secureverifications to help preventcredit card fraud. The MPI identifies the account number and queries the servers of the card issuer.",
    category: "General",
    icon: "info",
  },
  {
    id: "476577947",
    acronym: "OCT",
    fullForm: "Original Credit Transaction",
    details:
      "A letter of credit is a letter from a bank guaranteeing that a buyer's payment to a seller will be received on time and for the correct amount. If the buyer is unable to make a payment, the bank will be required to cover the full or remaining amount.",
    category: "Finance",
    icon: "payments",
  },
  {
    id: "476807169",
    acronym: "ARN",
    fullForm: "Acquirer Reference Number",
    details:
      "Anacquiring bank is an institution that processescreditordebit cardpayments on behalf of a merchant. The acquiring bank accepts the risk that the merchant will remainsolvent. The main source of risk to the acquiring bank is fund reversals.",
    category: "General",
    icon: "info",
  },
  {
    id: "477429764",
    acronym: "TCC",
    fullForm: "Transaction Category Codes",
    details:
      "Amerchant category code (MCC) is a four-digit number used for retail financial services to classify a business by the types of goods or services it provides. MCCs are assigned either by merchant type (e.g., one for hotels, one for office supply stores, etc.) or by merchant name.",
    category: "Technology",
    icon: "computer",
  },
];

export default glossaryData;
