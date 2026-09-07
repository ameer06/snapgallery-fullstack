// All product/service data — edit here to update across the site

export interface Product {
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  keyBenefits: string[];
  specs: { label: string; value: string }[];
  turnaround: string;
  imageAlt: string;
  imageUrl: string;
  icon: string; // Lucide icon name
  featured?: boolean;
}

export const PRODUCTS: Product[] = [
  {
    slug: 'zirconia-crowns',
    name: 'Zirconia Crowns',
    category: 'Fixed Prosthetics',
    shortDescription: 'Monolithic and layered zirconia crowns with micron-level precision milling.',
    fullDescription:
      'Our zirconia crowns are CAD/CAM milled from premium-grade zirconia pucks using multi-axis milling technology. Available in monolithic and layered forms for optimal strength or aesthetics.',
    keyBenefits: [
      'Exceptional marginal integrity',
      'High flexural strength (>1200 MPa monolithic)',
      'Biocompatible and hypoallergenic',
      'Shade-matched with custom staining',
    ],
    specs: [
      { label: 'Material', value: 'Yttria-stabilized Zirconia (YSZ)' },
      { label: 'Tolerance', value: '±0.05mm' },
      { label: 'Turnaround', value: '3–5 Business Days' },
      { label: 'Workflow', value: 'Digital Scan / STL File' },
    ],
    turnaround: '3–5 Business Days',
    imageAlt: 'Precision-milled zirconia dental crown on sterile surface',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3nbJslIhHFrWUPRPP0WNeCVc3MdO5Grl5INO1RfpTG0Y5xlmEBUbgnYElgkT9aOYsGU4PbXgb6a-bZUDs-lrzCBeXipxX1qMxfru4P_Atvf8bzRApIUuPtEQwOZtm8yM52wugz1YbTPiJ_z32679pVWDWArxxXS8PrP9vjk2JDenWp82MRGcQ7aBpswwB0wQVcohLk15STH7tyZJvJjsY7hVNXA0oWsBHPkGjtvH1QnnqGARVFzkFgw',
    icon: 'Crown',
    featured: true,
  },
  {
    slug: 'emax-crowns',
    name: 'E-Max Crowns',
    category: 'Fixed Prosthetics',
    shortDescription: 'Lithium disilicate all-ceramic crowns for superior translucency and aesthetics.',
    fullDescription:
      'E-Max lithium disilicate crowns provide unmatched optical translucency, closely mimicking natural tooth structure. Ideal for anterior restorations and smile aesthetics.',
    keyBenefits: [
      'Superior translucency for lifelike aesthetics',
      'High fracture resistance (~400 MPa)',
      'Minimal tooth preparation required',
      'Excellent long-term clinical performance',
    ],
    specs: [
      { label: 'Material', value: 'Lithium Disilicate (IPS e.max)' },
      { label: 'Tolerance', value: '±0.05mm' },
      { label: 'Turnaround', value: '3–5 Business Days' },
      { label: 'Workflow', value: 'Digital Scan / STL File' },
    ],
    turnaround: '3–5 Business Days',
    imageAlt: 'E-Max lithium disilicate dental crown',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3nbJslIhHFrWUPRPP0WNeCVc3MdO5Grl5INO1RfpTG0Y5xlmEBUbgnYElgkT9aOYsGU4PbXgb6a-bZUDs-lrzCBeXipxX1qMxfru4P_Atvf8bzRApIUuPtEQwOZtm8yM52wugz1YbTPiJ_z32679pVWDWArxxXS8PrP9vjk2JDenWp82MRGcQ7aBpswwB0wQVcohLk15STH7tyZJvJjsY7hVNXA0oWsBHPkGjtvH1QnnqGARVFzkFgw',
    icon: 'Gem',
    featured: true,
  },
  {
    slug: 'pfm-crowns',
    name: 'PFM Crowns',
    category: 'Fixed Prosthetics',
    shortDescription: 'Porcelain-fused-to-metal crowns for strength and reliable clinical performance.',
    fullDescription:
      'PFM crowns combine a metal substructure with layered porcelain for exceptional strength. A proven clinical choice for posterior restorations requiring both durability and aesthetic integration.',
    keyBenefits: [
      'High strength metal framework',
      'Natural porcelain aesthetics',
      'Proven long-term clinical track record',
      'Cost-effective solution',
    ],
    specs: [
      { label: 'Material', value: 'Non-precious / Semi-precious alloy + porcelain' },
      { label: 'Tolerance', value: '±0.1mm' },
      { label: 'Turnaround', value: '4–6 Business Days' },
      { label: 'Workflow', value: 'Digital Scan / Impression' },
    ],
    turnaround: '4–6 Business Days',
    imageAlt: 'PFM porcelain fused to metal dental crown',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3nbJslIhHFrWUPRPP0WNeCVc3MdO5Grl5INO1RfpTG0Y5xlmEBUbgnYElgkT9aOYsGU4PbXgb6a-bZUDs-lrzCBeXipxX1qMxfru4P_Atvf8bzRApIUuPtEQwOZtm8yM52wugz1YbTPiJ_z32679pVWDWArxxXS8PrP9vjk2JDenWp82MRGcQ7aBpswwB0wQVcohLk15STH7tyZJvJjsY7hVNXA0oWsBHPkGjtvH1QnnqGARVFzkFgw',
    icon: 'Layers',
  },
  {
    slug: 'bridges',
    name: 'Dental Bridges',
    category: 'Fixed Prosthetics',
    shortDescription: 'Multi-unit fixed bridges in zirconia, E-Max, or PFM for any span.',
    fullDescription:
      'Our dental bridges are engineered for precise connector sizing and occlusal harmony. Available in full-contour zirconia, lithium disilicate, and PFM for spans from 3 to 6 units.',
    keyBenefits: [
      'Precise connector cross-section design',
      'Multi-unit up to 6-unit spans',
      'CAD-optimized occlusal anatomy',
      'Compatible with all implant systems',
    ],
    specs: [
      { label: 'Material', value: 'Zirconia / E-Max / PFM' },
      { label: 'Span', value: '3–6 Units' },
      { label: 'Turnaround', value: '4–6 Business Days' },
      { label: 'Workflow', value: 'Digital Scan / STL File' },
    ],
    turnaround: '4–6 Business Days',
    imageAlt: 'Multi-unit dental bridge restoration',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3nbJslIhHFrWUPRPP0WNeCVc3MdO5Grl5INO1RfpTG0Y5xlmEBUbgnYElgkT9aOYsGU4PbXgb6a-bZUDs-lrzCBeXipxX1qMxfru4P_Atvf8bzRApIUuPtEQwOZtm8yM52wugz1YbTPiJ_z32679pVWDWArxxXS8PrP9vjk2JDenWp82MRGcQ7aBpswwB0wQVcohLk15STH7tyZJvJjsY7hVNXA0oWsBHPkGjtvH1QnnqGARVFzkFgw',
    icon: 'Bridge',
  },
  {
    slug: 'veneers',
    name: 'Veneers',
    category: 'Aesthetic Dentistry',
    shortDescription: 'Ultra-thin lithium disilicate and zirconia veneers for smile transformations.',
    fullDescription:
      'Dental veneers from Dental Forge are fabricated to sub-0.5mm thickness with precise shade matching. Designed for minimally invasive preparation and maximum aesthetic impact.',
    keyBenefits: [
      'Ultra-thin (0.3–0.5mm)',
      'Precise shade matching',
      'Minimally invasive preparation',
      'Superior surface finish',
    ],
    specs: [
      { label: 'Material', value: 'Lithium Disilicate / Zirconia' },
      { label: 'Thickness', value: '0.3–0.5mm' },
      { label: 'Turnaround', value: '4–5 Business Days' },
      { label: 'Workflow', value: 'Digital Scan / DSD' },
    ],
    turnaround: '4–5 Business Days',
    imageAlt: 'Dental veneers for smile transformation',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3nbJslIhHFrWUPRPP0WNeCVc3MdO5Grl5INO1RfpTG0Y5xlmEBUbgnYElgkT9aOYsGU4PbXgb6a-bZUDs-lrzCBeXipxX1qMxfru4P_Atvf8bzRApIUuPtEQwOZtm8yM52wugz1YbTPiJ_z32679pVWDWArxxXS8PrP9vjk2JDenWp82MRGcQ7aBpswwB0wQVcohLk15STH7tyZJvJjsY7hVNXA0oWsBHPkGjtvH1QnnqGARVFzkFgw',
    icon: 'Sparkles',
    featured: true,
  },
  {
    slug: 'clear-aligners',
    name: 'Clear Aligners',
    category: 'Digital Orthodontics',
    shortDescription: 'Precision thermoformed clear aligner systems with advanced digital treatment planning.',
    fullDescription:
      'Our clear aligner system combines advanced 3D treatment planning software with high-precision thermoforming for predictable orthodontic outcomes. A seamless transition from digital scan to physical perfection.',
    keyBenefits: [
      'Advanced digital treatment planning',
      'High-precision thermoforming',
      'Predictable orthodontic outcomes',
      'Seamless scan-to-aligner workflow',
    ],
    specs: [
      { label: 'Material', value: 'Medical-grade PET-G / TPU' },
      { label: 'Tolerance', value: '±0.05mm' },
      { label: 'Turnaround', value: '5–7 Business Days' },
      { label: 'Workflow', value: 'Digital Scan (TRIOS / iTero / Medit)' },
    ],
    turnaround: '5–7 Business Days',
    imageAlt: 'Clear orthodontic aligner system over digital dental model',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOC97HJd40WiwqGXkm6DDQl38ovkjhkkzeJWX67FFhCEg8afgjx30-oRs9phJvMQNMEJX8IY-EJdAnfUYlrsqKK-iwxY-0u_xj8HM-RRh6Hr6p3aGHdlx0yAyTMrdaCdaYGjB-oiOQF8L4ZNj4AQ4ZyVAl-FVTUAzLNt6mlFbSUauZJIuuBEPXqe_uaTvqoWRsWpKpAosjtCgdnyFURXrMoXarJTEBTlfqfDD2hUPjRjAxiBI4v7QqWQ',
    icon: 'AlignCenter',
    featured: true,
  },
  {
    slug: 'implant-restorations',
    name: 'Implant Restorations',
    category: 'Implantology',
    shortDescription: 'Custom abutments, screw-retained crowns, and implant-supported bridges.',
    fullDescription:
      'Dental Forge produces custom titanium and zirconia abutments, screw-retained crowns, and full-arch implant prosthetics. Compatible with all major implant systems including Nobel Biocare, Straumann, and Osstem.',
    keyBenefits: [
      'Compatible with all major implant systems',
      'Custom titanium and zirconia abutments',
      'Screw-retained and cement-retained options',
      'Full-arch implant prosthetics',
    ],
    specs: [
      { label: 'Material', value: 'Titanium / Zirconia' },
      { label: 'Systems', value: 'Nobel / Straumann / Osstem / Zimmer' },
      { label: 'Turnaround', value: '5–7 Business Days' },
      { label: 'Workflow', value: 'Digital Scan / Scan Body' },
    ],
    turnaround: '5–7 Business Days',
    imageAlt: 'Implant-supported dental crown and abutment',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3nbJslIhHFrWUPRPP0WNeCVc3MdO5Grl5INO1RfpTG0Y5xlmEBUbgnYElgkT9aOYsGU4PbXgb6a-bZUDs-lrzCBeXipxX1qMxfru4P_Atvf8bzRApIUuPtEQwOZtm8yM52wugz1YbTPiJ_z32679pVWDWArxxXS8PrP9vjk2JDenWp82MRGcQ7aBpswwB0wQVcohLk15STH7tyZJvJjsY7hVNXA0oWsBHPkGjtvH1QnnqGARVFzkFgw',
    icon: 'Cog',
  },
  {
    slug: 'dentures',
    name: 'Dentures',
    category: 'Removable Prosthetics',
    shortDescription: 'Digital complete and partial dentures with optimized tooth arrangement.',
    fullDescription:
      'Our digital dentures are designed using CAD software for precise tooth arrangement, flange morphology, and base adaptation. Available as complete dentures, partial dentures, and implant-retained overdentures.',
    keyBenefits: [
      'CAD-designed tooth arrangement',
      'Precise occlusal plane',
      'Duplicate dentures available digitally',
      'Implant-retained overdenture compatible',
    ],
    specs: [
      { label: 'Material', value: 'PMMA / High-Impact Acrylic' },
      { label: 'Type', value: 'Complete / Partial / Overdenture' },
      { label: 'Turnaround', value: '5–7 Business Days' },
      { label: 'Workflow', value: 'Digital Scan / Impression' },
    ],
    turnaround: '5–7 Business Days',
    imageAlt: 'Digital denture prosthetics',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3nbJslIhHFrWUPRPP0WNeCVc3MdO5Grl5INO1RfpTG0Y5xlmEBUbgnYElgkT9aOYsGU4PbXgb6a-bZUDs-lrzCBeXipxX1qMxfru4P_Atvf8bzRApIUuPtEQwOZtm8yM52wugz1YbTPiJ_z32679pVWDWArxxXS8PrP9vjk2JDenWp82MRGcQ7aBpswwB0wQVcohLk15STH7tyZJvJjsY7hVNXA0oWsBHPkGjtvH1QnnqGARVFzkFgw',
    icon: 'Smile',
  },
  {
    slug: 'cadcam-milling',
    name: 'CAD/CAM Milling',
    category: 'Digital Manufacturing',
    shortDescription: 'In-house multi-axis milling for zirconia, wax, PMMA, and composite.',
    fullDescription:
      'Our state-of-the-art multi-axis CNC milling centre produces restorations from zirconia, lithium disilicate, PMMA, wax, and composite blocks with micron-level accuracy.',
    keyBenefits: [
      'Multi-axis CNC precision',
      'Wide material compatibility',
      'Micron-level accuracy',
      'High-volume throughput',
    ],
    specs: [
      { label: 'Materials', value: 'Zirconia, E-Max, PMMA, Wax, Composite' },
      { label: 'Tolerance', value: '±0.02mm' },
      { label: 'Software', value: 'Exocad / 3Shape' },
      { label: 'Workflow', value: 'STL / DCM File' },
    ],
    turnaround: '2–4 Business Days',
    imageAlt: 'CAD/CAM milling machine for dental restorations',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3nbJslIhHFrWUPRPP0WNeCVc3MdO5Grl5INO1RfpTG0Y5xlmEBUbgnYElgkT9aOYsGU4PbXgb6a-bZUDs-lrzCBeXipxX1qMxfru4P_Atvf8bzRApIUuPtEQwOZtm8yM52wugz1YbTPiJ_z32679pVWDWArxxXS8PrP9vjk2JDenWp82MRGcQ7aBpswwB0wQVcohLk15STH7tyZJvJjsY7hVNXA0oWsBHPkGjtvH1QnnqGARVFzkFgw',
    icon: 'Settings',
  },
  {
    slug: '3d-printing',
    name: '3D Printing',
    category: 'Digital Manufacturing',
    shortDescription: 'High-resolution resin printing for surgical guides, models, and temporaries.',
    fullDescription:
      'Using high-resolution DLP and SLA printers, Dental Forge produces accurate surgical guides, study models, temporary restorations, and orthodontic models for efficient clinical workflows.',
    keyBenefits: [
      'High-resolution DLP / SLA printing',
      'Accurate surgical guides',
      'Study and orthodontic models',
      'Rapid prototype temporaries',
    ],
    specs: [
      { label: 'Technology', value: 'DLP / SLA Resin' },
      { label: 'Resolution', value: '25–50 micron layer height' },
      { label: 'Materials', value: 'Surgical Guide / Model / Temporary resin' },
      { label: 'Turnaround', value: '1–2 Business Days' },
    ],
    turnaround: '1–2 Business Days',
    imageAlt: '3D printed dental model and surgical guide',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3nbJslIhHFrWUPRPP0WNeCVc3MdO5Grl5INO1RfpTG0Y5xlmEBUbgnYElgkT9aOYsGU4PbXgb6a-bZUDs-lrzCBeXipxX1qMxfru4P_Atvf8bzRApIUuPtEQwOZtm8yM52wugz1YbTPiJ_z32679pVWDWArxxXS8PrP9vjk2JDenWp82MRGcQ7aBpswwB0wQVcohLk15STH7tyZJvJjsY7hVNXA0oWsBHPkGjtvH1QnnqGARVFzkFgw',
    icon: 'Printer',
  },
  {
    slug: 'digital-smile-design',
    name: 'Digital Smile Design',
    category: 'Aesthetic Dentistry',
    shortDescription: 'Complete DSD workflow — from facial analysis to final restoration design.',
    fullDescription:
      'Our Digital Smile Design service provides dentists with a complete visual communication tool. We analyze facial proportions, smile line, and tooth morphology to create a detailed design preview before fabrication.',
    keyBenefits: [
      'Facial and smile analysis',
      'Predictable aesthetic outcome',
      'Patient-approved design before fabrication',
      'Integrated with veneer and crown workflow',
    ],
    specs: [
      { label: 'Deliverable', value: 'DSD Report + 3D Model + Wax-up' },
      { label: 'Software', value: 'DSD App / Exocad Smile' },
      { label: 'Turnaround', value: '3–5 Business Days' },
      { label: 'Workflow', value: 'Photos + Digital Scan' },
    ],
    turnaround: '3–5 Business Days',
    imageAlt: 'Digital smile design preview and plan',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3nbJslIhHFrWUPRPP0WNeCVc3MdO5Grl5INO1RfpTG0Y5xlmEBUbgnYElgkT9aOYsGU4PbXgb6a-bZUDs-lrzCBeXipxX1qMxfru4P_Atvf8bzRApIUuPtEQwOZtm8yM52wugz1YbTPiJ_z32679pVWDWArxxXS8PrP9vjk2JDenWp82MRGcQ7aBpswwB0wQVcohLk15STH7tyZJvJjsY7hVNXA0oWsBHPkGjtvH1QnnqGARVFzkFgw',
    icon: 'Monitor',
    featured: true,
  },
];

export const PRODUCT_OPTIONS = PRODUCTS.map((p) => p.name);

export const PRODUCT_CATEGORIES = [...new Set(PRODUCTS.map((p) => p.category))];
