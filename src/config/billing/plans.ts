/**
 * This file contains the plans that will be displayed in the billing page
 *
 */
export const FREE_INDIVIDUAL_PLAN_ID = 'price_1PnPe8AT0DdFRzOPU92AjI5D';
export const FREE_TEAM_PLAN_ID = 'price_1PnQOkAT0DdFRzOPRmF4uMSa';

export const FREE_PLAN_USER = {
  slug: 'FREE_USER',
  name: 'Trial',
  description: 'Free forever, with basic features.',
  features: {
    included: ['100MB Storage', 'Basic Features', 'Marketplace', 'Directory', 'One Listing'],
    notIncluded: [
      'Pro Features',
      '24/7 Chat Support'
    ],
  },
  plans: [
    {
      name: '',
      description: '',
      price: '$0/month',
      planId: 'price_1PnPe8AT0DdFRzOPU92AjI5D',
      trial: '',
      storage: '100MB',
    },
  ],
};

export const USER_PRICING = [
  FREE_PLAN_USER,
  {
    slug: 'REALTOR_USER',
    name: 'Realtor',
    description: 'For realtors, with premium features.',
    features: {
      included: [
        '500MB Storage',
        'Basic Features',
        'Marketplace',
        'Directory',
        'Unlimited Listings',
        'Pro Features',
      ],
      notIncluded: ['24/7 Chat Support'],
    },
    plans: [
      {
        name: 'Monthly',
        description: 'The monthly professional plan',
        price: '$10/month',
        planId: 'price_1PxtJjAT0DdFRzOPxCq99UKm', // This is the id that will be used to identify the plan in the payment gateway
        trial: '1 Day',
        storage: '500MB',
      },
    ],
  },
  {
    slug: 'PRPFESSIONAL_USER',
    name: 'Professional',
    description: 'For professional users, with exclusive features.',
    features: {
      included: [
        '1GB Storage',
        'Basic Features',
        'Marketplace',
        'Directory',
        'Unlimited Listings',
        'Pro Features',
        '24/7 Chat Support'
      ],
      notIncluded: [],
    },
    plans: [
      {
        name: 'Yearly',
        description: 'The yearly exclusive plan',
        price: '$100/year',
        planId: 'price_1PxtL6AT0DdFRzOPc2VlxmrT', // This is the id that will be used to identify the plan in the payment gateway
        trial: '1 Day',
        storage: '1GB',
      },
    ],
  },
];

export const FREE_PLAN_TEAM = {
  slug: 'FREE_TEAM',
  name: 'Trial',
  description: 'Free forever, with basic features.',
  features: {
    included: ['300MB Storage', 'Basic Features', 'Marketplace', 'Directory', 'One Listing'],
    notIncluded: [
      'Pro Features',
      '24/7 Chat Support'
    ],
  },
  plans: [
    {
      name: '',
      description: '',
      price: '$0/month',
      planId: 'price_1PnQOkAT0DdFRzOPRmF4uMSa',
      trial: '',
      storage: '300MB',
    },
  ],
};

export const TEAM_PRICING = [
  FREE_PLAN_TEAM,
  {
    slug: 'REALTOR_TEAM',
    name: 'Team',
    description: 'For teams, with premium features.',
    features: {
      included: [
        '1GB Storage',
        'Basic Features',
        'Marketplace',
        'Directory',
        'Unlimited Listings',
        'Pro Features',
      ],
      notIncluded: ['24/7 Chat Support'],
    },
    plans: [
      {
        name: 'Monthly',
        description: 'The monthly premium plan',
        price: '$15/month',
        planId: 'price_1PyFlqAT0DdFRzOPYRJD8PUo', // This is the id that will be used to identify the plan in the payment gateway
        trial: '1 Day',
        storage: '1GB',
      },
    ],
  },
  {
    slug: 'PROFESSIONAL_TEAM',
    name: 'Professional',
    description: 'For professional team, with exclusive features.',
    features: {
      included: [
        '3GB Storage',
        'Basic Features',
        'Marketplace',
        'Directory',
        'Unlimited Listings',
        'Pro Features',
        '24/7 Chat Support'
      ],
      notIncluded: [],
    },
    plans: [
      {
        name: 'Yearly',
        description: 'The yearly professional plan',
        price: '$150/year',
        planId: 'price_1PyFmnAT0DdFRzOPD6RJ64RX', // This is the id that will be used to identify the plan in the payment gateway
        trial: '1 Day',
        storage: '3GB',
      },
    ],
  },
];
