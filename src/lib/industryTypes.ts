export const industryCategories = [
  {
    category: "Retail & Commerce",
    industries: [
      "Retail Shops",
      "Supermarkets",
      "Clothing & Apparel",
      "Jewelry Stores",
      "Electronics Stores",
      "E-commerce Sellers",
      "D2C Brands"
    ]
  },
  {
    category: "Food & Hospitality",
    industries: [
      "Restaurants",
      "Cloud Kitchens",
      "Cafes",
      "Hotels & Resorts",
      "Bars & Lounges",
      "Catering Services",
      "Food Delivery Businesses"
    ]
  },
  {
    category: "Healthcare & Wellness",
    industries: [
      "Hospitals",
      "Clinics",
      "Diagnostic Labs",
      "Telemedicine Providers",
      "Fitness Trainers",
      "Yoga Centers",
      "Nutrition Coaches"
    ]
  },
  {
    category: "Education & Learning",
    industries: [
      "Schools",
      "Colleges",
      "Coaching Institutes",
      "EdTech Startups",
      "Online Course Creators",
      "Training Institutes"
    ]
  },
  {
    category: "Agriculture & Rural Services",
    industries: [
      "Farmer Producer Organizations",
      "Agri Marketplaces",
      "Input Supply Stores",
      "IoT-based Agri Companies",
      "Weather & Satellite Insights Providers"
    ]
  },
  {
    category: "Real Estate & Construction",
    industries: [
      "Real Estate Agencies",
      "Builders & Developers",
      "Property Management Firms",
      "Architecture Firms",
      "Interior Designers"
    ]
  },
  {
    category: "Manufacturing & Industrial",
    industries: [
      "Manufacturing Units",
      "Factories",
      "Industrial Automation Firms",
      "Machinery Dealers",
      "Automotive Parts Manufacturers"
    ]
  },
  {
    category: "Logistics, Transport & Supply Chain",
    industries: [
      "Courier Companies",
      "Delivery Providers",
      "Fleet Management Firms",
      "Warehousing Companies",
      "Freight Forwarders"
    ]
  },
  {
    category: "Technology & IT",
    industries: [
      "IT Service Companies",
      "SaaS Startups",
      "App Development Firms",
      "AI/ML Startups",
      "Blockchain Startups",
      "Robotics Firms",
      "IT Consultants"
    ]
  },
  {
    category: "Marketing, Media & Creative",
    industries: [
      "Digital Marketing Agencies",
      "Advertising Agencies",
      "Influencers",
      "Content Creators",
      "Photographers & Videographers",
      "PR Firms",
      "Social Media Managers"
    ]
  },
  {
    category: "Finance, Banking & Insurance",
    industries: [
      "FinTech Startups",
      "NBFCs",
      "Microfinance Agencies",
      "Insurance Agents",
      "Wealth Advisors"
    ]
  },
  {
    category: "Professional Services",
    industries: [
      "Solopreneurs",
      "Freelancers",
      "Chartered Accountants",
      "Lawyers & Legal Firms",
      "Consultants",
      "HR Firms"
    ]
  },
  {
    category: "Public Sector & Government",
    industries: [
      "Government Departments",
      "Smart City Programs",
      "NGOs",
      "Nonprofit Organizations",
      "Rural Development Programs"
    ]
  },
  {
    category: "Events & Entertainment",
    industries: [
      "Event Planners",
      "Wedding Planners",
      "Entertainment Companies",
      "Artists",
      "Music Production Houses"
    ]
  },
  {
    category: "Others",
    industries: [
      "Home-Based Businesses",
      "Startups (General)",
      "Custom Category"
    ]
  }
];

export const flatIndustryList = industryCategories.flatMap(cat => 
  cat.industries.map(ind => `${cat.category} - ${ind}`)
);

export const industryCategoryOptions = industryCategories.map(cat => ({
  value: cat.category.toLowerCase().replace(/[^a-z0-9]/g, '-'),
  label: cat.category,
  industries: cat.industries
}));
