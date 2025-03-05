export type ProductContent = {
  title: string
  description: string
  sections: {
    title: string
    content: string
  }[]
  guidelines: {
    title: string
    items: string[]
  }
  contactInfo: {
    name: string
    role: string
    email: string
  }
}

export const productContent: Record<string, ProductContent> = {
  "bank": {
    title: "Banking Products",
    description: "Welcome to the Banking Products intake portal. Here you can submit new ideas and feature requests for our banking solutions.",
    sections: [
      {
        title: "What We Do",
        content: "We provide core banking infrastructure and solutions that power financial services across the organization."
      },
      {
        title: "Current Priorities",
        content: "Our team is focused on modernizing core banking infrastructure and improving system reliability."
      }
    ],
    guidelines: {
      title: "Submission Guidelines",
      items: [
        "Clearly define the business problem you're trying to solve",
        "Include expected impact and benefits",
        "Provide technical requirements if applicable",
        "Identify target users and stakeholders",
        "Outline any regulatory considerations"
      ]
    },
    contactInfo: {
      name: "Jane Smith",
      role: "Banking Products Lead",
      email: "jane.smith@company.com"
    }
  },
  "directed-pay": {
    title: "Directed Pay",
    description: "Submit ideas and feature requests for our directed payment processing solutions and infrastructure.",
    sections: [
      {
        title: "What We Do",
        content: "We manage and optimize payment routing, processing, and reconciliation across multiple payment channels."
      },
      {
        title: "Current Priorities",
        content: "We're focusing on expanding our payment capabilities and improving processing efficiency."
      }
    ],
    guidelines: {
      title: "Submission Guidelines",
      items: [
        "Include payment flow specifications",
        "Specify integration requirements",
        "Detail security considerations",
        "Outline compliance requirements",
        "Provide volume projections"
      ]
    },
    contactInfo: {
      name: "Michael Chen",
      role: "Directed Pay Lead",
      email: "michael.chen@company.com"
    }
  },
  "sso-api": {
    title: "SSO & API Services",
    description: "Submit enhancement requests and ideas for our Single Sign-On and API infrastructure.",
    sections: [
      {
        title: "What We Do",
        content: "We provide secure authentication solutions and API management services across the organization."
      },
      {
        title: "Current Priorities",
        content: "Our focus is on enhancing API security and improving developer experience."
      }
    ],
    guidelines: {
      title: "Submission Guidelines",
      items: [
        "Specify authentication requirements",
        "Include API specifications",
        "Detail security implications",
        "Provide use case examples",
        "Include performance requirements"
      ]
    },
    contactInfo: {
      name: "Sarah Johnson",
      role: "SSO & API Services Lead",
      email: "sarah.johnson@company.com"
    }
  },
  "commercial-pay": {
    title: "Commercial Pay",
    description: "Submit ideas for commercial payment solutions and business payment processing.",
    sections: [
      {
        title: "What We Do",
        content: "We develop and maintain commercial payment solutions for business customers."
      },
      {
        title: "Current Priorities",
        content: "We're focusing on digital transformation of commercial payments."
      }
    ],
    guidelines: {
      title: "Submission Guidelines",
      items: [
        "Define business use case",
        "Include market analysis",
        "Specify integration needs",
        "Outline compliance requirements",
        "Provide ROI projections"
      ]
    },
    contactInfo: {
      name: "David Wilson",
      role: "Commercial Pay Lead",
      email: "david.wilson@company.com"
    }
  },
  "data-engineering": {
    title: "Data Engineering",
    description: "Submit ideas for data infrastructure, pipelines, and analytics solutions.",
    sections: [
      {
        title: "What We Do",
        content: "We build and maintain data infrastructure and analytics capabilities."
      },
      {
        title: "Current Priorities",
        content: "We're focusing on modernizing our data infrastructure and improving data accessibility."
      }
    ],
    guidelines: {
      title: "Submission Guidelines",
      items: [
        "Specify data requirements",
        "Include performance metrics",
        "Detail integration needs",
        "Outline security considerations",
        "Provide scaling projections"
      ]
    },
    contactInfo: {
      name: "Emily Zhang",
      role: "Data Engineering Lead",
      email: "emily.zhang@company.com"
    }
  },
  "commercial-provider": {
    title: "Commercial Provider",
    description: "Submit ideas for commercial provider integration and management solutions.",
    sections: [
      {
        title: "What We Do",
        content: "We manage provider relationships and develop integration solutions for commercial services."
      },
      {
        title: "Current Priorities",
        content: "We're streamlining provider integration processes and enhancing monitoring capabilities."
      }
    ],
    guidelines: {
      title: "Submission Guidelines",
      items: [
        "Specify provider requirements",
        "Include integration details",
        "Outline service level agreements",
        "Detail compliance needs",
        "Provide scalability considerations"
      ]
    },
    contactInfo: {
      name: "Robert Kim",
      role: "Commercial Provider Lead",
      email: "robert.kim@company.com"
    }
  },
  "hba": {
    title: "Health Benefit Administration",
    description: "Submit ideas for health benefit administration systems and processes.",
    sections: [
      {
        title: "What We Do",
        content: "We develop and maintain systems for managing health benefits and claims processing."
      },
      {
        title: "Current Priorities",
        content: "We're focusing on modernizing benefits administration and improving member experience."
      }
    ],
    guidelines: {
      title: "Submission Guidelines",
      items: [
        "Include member impact analysis",
        "Specify compliance requirements",
        "Detail integration needs",
        "Outline performance metrics",
        "Provide security considerations"
      ]
    },
    contactInfo: {
      name: "Lisa Martinez",
      role: "HBA Lead",
      email: "lisa.martinez@company.com"
    }
  },
  "cams-rra": {
    title: "CAMS & RRA",
    description: "Submit ideas for Compliance and Risk Assessment Management solutions.",
    sections: [
      {
        title: "What We Do",
        content: "We provide compliance monitoring and risk assessment tools across the organization."
      },
      {
        title: "Current Priorities",
        content: "We're enhancing our compliance monitoring capabilities and automating risk assessments."
      }
    ],
    guidelines: {
      title: "Submission Guidelines",
      items: [
        "Specify regulatory requirements",
        "Include risk assessment impact",
        "Detail monitoring requirements",
        "Outline reporting needs",
        "Provide compliance considerations"
      ]
    },
    contactInfo: {
      name: "Thomas Anderson",
      role: "CAMS & RRA Lead",
      email: "thomas.anderson@company.com"
    }
  },
  "tools": {
    title: "Development Tools",
    description: "Submit ideas for developer tools and productivity solutions.",
    sections: [
      {
        title: "What We Do",
        content: "We develop and maintain tools that enhance developer productivity and code quality."
      },
      {
        title: "Current Priorities",
        content: "We're focusing on automating development workflows and improving tool integration."
      }
    ],
    guidelines: {
      title: "Submission Guidelines",
      items: [
        "Specify tool requirements",
        "Include developer impact analysis",
        "Detail integration needs",
        "Outline performance expectations",
        "Provide adoption considerations"
      ]
    },
    contactInfo: {
      name: "Alex Turner",
      role: "Developer Tools Lead",
      email: "alex.turner@company.com"
    }
  },
  "phoenix-team": {
    title: "Phoenix Team",
    description: "Submit ideas for system modernization and transformation initiatives.",
    sections: [
      {
        title: "What We Do",
        content: "We lead strategic transformation initiatives and system modernization efforts."
      },
      {
        title: "Current Priorities",
        content: "We're focusing on modernizing core systems and implementing innovative solutions."
      }
    ],
    guidelines: {
      title: "Submission Guidelines",
      items: [
        "Include transformation impact",
        "Specify modernization benefits",
        "Detail technical requirements",
        "Outline risk mitigation",
        "Provide success metrics"
      ]
    },
    contactInfo: {
      name: "Rachel Wong",
      role: "Phoenix Team Lead",
      email: "rachel.wong@company.com"
    }
  }
} 