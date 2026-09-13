// domainKnowledgeData.js
// Data structure for domain knowledge categories and topics

const domainKnowledgeData = {
  categories: [
    {
      id: "credit-cards-payments",
      name: "Credit Cards & Payments",
      icon: "credit_card",
      description: "Knowledge related to credit card processing, payment networks, and transaction flows.",
      topics: [
        {
          id: "card-networks",
          title: "Card Networks",
          content: "Card networks like Visa, Mastercard, American Express, and Discover facilitate transactions between merchants and card issuers. They set interchange fees, maintain network infrastructure, and establish operating regulations.",
          icon: "account_balance"
        },
        {
          id: "payment-processing",
          title: "Payment Processing",
          content: "Payment processing involves authorization, clearing, and settlement. Authorization verifies card validity and available funds, clearing transmits transaction details, and settlement transfers funds between financial institutions.",
          icon: "sync"
        },
        {
          id: "fraud-prevention",
          title: "Fraud Prevention",
          content: "Fraud prevention in payments includes technologies like EMV chips, tokenization, 3D Secure, and AI-based fraud detection systems that analyze transaction patterns to identify suspicious activities.",
          icon: "security"
        }
      ]
    },
    {
      id: "market-reference-data",
      name: "Market Reference Data",
      icon: "data_usage",
      description: "Information about market data, reference data management, and financial instruments.",
      topics: [
        {
          id: "security-identifiers",
          title: "Security Identifiers",
          content: "Security identifiers like ISIN, CUSIP, and SEDOL uniquely identify financial instruments across global markets, facilitating accurate trading and settlement.",
          icon: "tag"
        },
        {
          id: "pricing-data",
          title: "Pricing Data",
          content: "Pricing data includes real-time and historical prices, quotes, and indices from various exchanges and market data providers, essential for trading and valuation.",
          icon: "trending_up"
        },
        {
          id: "corporate-actions",
          title: "Corporate Actions",
          content: "Corporate actions are events initiated by companies that affect their securities, such as dividends, stock splits, mergers, and acquisitions, requiring timely processing and adjustments.",
          icon: "business"
        }
      ]
    },
    {
      id: "capital-markets",
      name: "Capital Markets",
      icon: "show_chart",
      description: "Knowledge about capital markets, trading, and investment banking operations.",
      topics: [
        {
          id: "trading-systems",
          title: "Trading Systems",
          content: "Trading systems include order management systems (OMS), execution management systems (EMS), and algorithmic trading platforms that facilitate trade execution across multiple venues.",
          icon: "swap_horiz"
        },
        {
          id: "post-trade-processing",
          title: "Post-Trade Processing",
          content: "Post-trade processing involves trade confirmation, clearing, settlement, and reconciliation to ensure accurate and timely completion of transactions.",
          icon: "done_all"
        },
        {
          id: "risk-management",
          title: "Risk Management",
          content: "Risk management in capital markets includes measuring and mitigating market risk, credit risk, operational risk, and liquidity risk through various models and controls.",
          icon: "shield"
        }
      ]
    }
  ]
};

export default domainKnowledgeData;
