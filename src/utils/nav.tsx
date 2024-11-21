import {LayoutPanelLeft, WalletMinimal, History, Sprout, BellDot, User2 } from 'lucide-react'

export const Nav = [
    {
        name: 'Overview',
        icon: <LayoutPanelLeft />,
        link: '/',
    },
    {
        name: 'Wallet',
        icon: <WalletMinimal />,
        link: '/wallet',
    },
    {
        name: 'History',
        icon: <History />,
        link: '/history',
    },
    {
        name: 'Plan',
        icon: <Sprout />,
        link: '/plan',
    },
    {
        name: 'Notification',
        icon: <BellDot />,
        link: '/notification',
    },
    {
        name: 'Account',
        icon: <User2 />,
        link: '/account',
    },
]

export const adminNav = [
    {
        name: 'Overview',
        icon: <LayoutPanelLeft />,
        link: '/',
    },
    {
        name: 'Wallet',
        icon: <WalletMinimal />,
        link: '/wallet',
    },
    {
        name: 'History',
        icon: <History />,
        link: '/history',
    },
    {
        name: 'Plan',
        icon: <Sprout />,
        link: '/plan',
    },
    {
        name: 'Notification',
        icon: <BellDot />,
        link: '/notification',
    },
    {
        name: 'Account',
        icon: <User2 />,
        link: '/account',
    },
]

export const cards = [
    {
        name: 'Investment',
        image: '/user.jpg',
        value: '0.00',
        analysis: 10
    },
    {
        name: 'Total Credit',
        image: '/money-bag.png',
        value: '0.00',
        analysis: 10
    },
    {
        name: 'Referal Bonus',
        image: '/user.jpg',
        value: '0.00',
        analysis: 1
    },
]

export const Menu = [
    {
        name: 'Deposit',
        onClick: (setDeposit: React.Dispatch<React.SetStateAction<boolean>>) => setDeposit(true),
    },
    {
        name: 'Withdraw',
        onClick: (setWithdrawal: React.Dispatch<React.SetStateAction<boolean>>) => setWithdrawal(true),
    },
    {
        name: 'Transfer',
        onClick: (setTransfer: React.Dispatch<React.SetStateAction<boolean>>) => setTransfer(true),
    },
];


export const DummyData = [
    {
        id: 1,
        description: 'Deposited to savings',
        amount: 200,
        date: '12-11-2024'
    },
    {
        id: 2,
        description: 'Withdrawal from wallet',
        amount: 300,
        date: '15-11-2024'
    },
]

export const Plan = [
    {
        name: 'Basic',
        amount: '$100 - $499',
        return: '30%',
        duration: '24 hours',
        referralBonus: '2%',
        description: [
            {
                point: 'Earn a 30% return on your investment within 24 hours.'
            },
            {
                point: 'Ideal for beginners or those looking to test the waters.'
            },
            {
                point: 'Enjoy a 2% referral bonus for every person you refer.'
            }
        ]
    },
    {
        name: 'Master',
        amount: '$500 - $999',
        return: '50%',
        duration: '48 hours',
        referralBonus: '3%',
        description: [
            {
                point: 'Receive a 50% return on your deposit within 48 hours.'
            },
            {
                point: 'Perfect for more experienced investors seeking higher returns.'
            },
            {
                point: 'Benefit from a 3% referral bonus for each referred client.'
            }
        ]
    },
    {
        name: 'Premium',
        amount: '$1,000 - $4,999',
        return: '100%',
        duration: '72 hours',
        referralBonus: '4%',
        description: [
            {
                point: 'Double your investment with a 100% return in just 72 hours.'
            },
            {
                point: 'Designed for serious investors aiming for substantial gains.'
            },
            {
                point: 'Earn a 4% referral bonus for every new participant you bring in.'
            }
        ]
    },
    {
        name: 'Elite',
        amount: '$5,000 and above',
        return: '200%',
        duration: '72 hours',
        referralBonus: '5%',
        description: [
            {
                point: 'Achieve a 200% return on investments over $5000 within 72 hours.'
            },
            {
                point: 'Optimal for high-stakes investors looking for maximum returns.'
            },
            {
                point: 'Gain a 5% referral bonus for each referral, maximizing your earnings.'
            }
        ]
    }
];

export const Amount = [
    {
        name: 'Basic',
        amounts: [
            { amount: "$100" },
            { amount: "$200" },
            { amount: "$300" },
            { amount: "$400" },
        ],
    },
    {
        name: 'Master',
        amounts: [
            { amount: "$500" },
            { amount: "$600" },
            { amount: "$700" },
            { amount: "$800" },
        ],
    },
    {
        name: 'Premium',
        amounts: [
            { amount: "$1000" },
            { amount: "$1100" },
            { amount: "$1200" },
            { amount: "$1300" },
        ],
    },
    {
        name: 'Elite',
        amounts: [
            { amount: "$5000" },
            { amount: "$6000" },
        ],
    },
];
