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
    included: ['100MB Storage', 'Basic Features', 'Marketplace', 'Directory'],
    notIncluded: [
      'Unlimited Listings',
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
        description: 'The monthly premium plan',
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
  name: 'Free',
  description: 'Free forever, with basic features.',
  features: {
    included: ['600MB Storage', 'Basic Features', 'Email Support'],
    notIncluded: ['Premium Features', '24/7 Chat Support', 'Unlimited Access'],
  },
  plans: [
    {
      name: '',
      description: '',
      price: '$0/month',
      planId: 'price_1PnQOkAT0DdFRzOPRmF4uMSa',
      trial: '',
      storage: '600MB',
    },
  ],
};

export const TEAM_PRICING = [
  FREE_PLAN_TEAM,
  {
    slug: 'BASIC_TEAM',
    name: 'Basic',
    description: 'For basic teams, with basic features.',
    features: {
      included: [
        '100GB Storage',
        'Basic Features',
        'Email Support',
        'Premium Features',
        '24/7 Chat Support',
      ],
      notIncluded: ['Unlimited Access'],
    },
    plans: [
      {
        name: 'Monthly',
        description: 'The monthly premium plan',
        price: '$300/month',
        planId: 'price_1PnQPZAT0DdFRzOP6UjTkwBP', // This is the id that will be used to identify the plan in the payment gateway
        trial: '1 Day',
        storage: '100GB',
      },
    ],
  },
  {
    slug: 'PREMIUM_TEAM',
    name: 'Premium',
    description: 'For premium teams, with premium features.',
    features: {
      included: [
        '500GB Storage',
        'Basic Features',
        'Email Support',
        'Premium Features',
        '24/7 Chat Support',
        'Unlimited Access',
      ],
      notIncluded: [],
    },
    plans: [
      {
        name: 'Monthly',
        description: 'The monthly premium plan',
        price: '$999/month',
        planId: 'price_1PnQQQAT0DdFRzOP9f0PnJl8', // This is the id that will be used to identify the plan in the payment gateway
        trial: '1 Day',
        storage: '500GB',
      },
    ],
  },
];
