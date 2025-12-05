const servicesData = {
    wedding: {
        name: "Wedding Photography",
        description:
            "Our premier wedding package ensures every precious moment is captured.",
        packageInfo: [
            {
                name: "Silver Package",
                price: "₱ 35,000",
                features: [
                    "1 Photographer & 1 Videographer",
                    "Full day coverage (10 hours)",
                    "Basic Photo Album",
                    "Digital Files via USB"
                ]
            },
            {
                name: "Gold Package",
                price: "₱ 50,000",
                features: [
                    "2 Photographers & 1 Videographer",
                    "12 hours coverage",
                    "Premium Album",
                    "Same-Day-Edit Video",
                    "Digital Files via USB"
                ]
            }
        ],
        sampleImages: [
            "https://images.unsplash.com/photo-1758905728020-a888617aecd0?w=600&q=80",
            "https://images.unsplash.com/photo-1658243862459-145b453dd74e?w=600&q=80",
            "https://images.unsplash.com/photo-1594967394334-03a119532824?w=600&q=80",
            "https://images.unsplash.com/photo-1529124239851-d4198c692ffc?w=600&q=80"
        ]
    },

    debut: {
        name: "Debut Photography",
        description:
            "Celebrate your 18th birthday with stunning photos and full-event coverage.",
        packageInfo: [
            {
                name: "Basic Debut",
                price: "₱ 20,000",
                features: [
                    "1 Photographer",
                    "Event Coverage (8 hours)",
                    "Photo Booth add-on available",
                    "Digital Files"
                ]
            },
            {
                name: "Premium Debut",
                price: "₱ 30,000",
                features: [
                    "1 Photographer & 1 Videographer",
                    "Pre-Debut Shoot (3 hours)",
                    "Full Event Coverage (10 hours)",
                    "Mini Album"
                ]
            }
        ],
        sampleImages: [
            "https://images.unsplash.com/photo-1761331051932-c3fdd6c3e661?w=600&q=80",
            "https://images.unsplash.com/photo-1519782806282-3d75c0296767?w=600&q=80",
            "https://images.unsplash.com/photo-1522033621980-60b6b23b4991?w=600&q=80",
            "https://images.unsplash.com/photo-1517431358913-75ff0d1f77d6?w=600&q=80"
        ]
    },

    portrait: {
        name: "Portrait Sessions",
        description:
            "Perfect for headshots, graduation pictures, or artistic portraits.",
        packageInfo: [
            {
                name: "Standard Session",
                price: "₱ 5,000",
                features: ["1 Hour Shoot", "10 Edited Photos", "1 Outfit Change", "Digital Files"]
            },
            {
                name: "Premium Session",
                price: "₱ 8,500",
                features: [
                    "2 Hour Shoot",
                    "20 Edited Photos",
                    "3 Outfit Changes",
                    "Full Resolution Files"
                ]
            }
        ],
        sampleImages: [
            "https://images.unsplash.com/photo-1544124094-8aea0374da93?w=600&q=80",
            "https://images.unsplash.com/photo-1529124239851-d4198c692ffc?w=600&q=80",
            "https://images.unsplash.com/photo-1534063223011-85e33d061f25?w=600&q=80",
            "https://images.unsplash.com/photo-1508685097486-cf761da0c598?w=600&q=80"
        ]
    },

    events: {
        name: "Special Events Photography",
        description:
            "Coverage for birthdays, anniversaries, corporate events, and more.",
        packageInfo: [
            {
                name: "Basic Event",
                price: "₱ 15,000",
                features: ["1 Photographer", "4 Hours Coverage", "Digital Files"]
            },
            {
                name: "Extended Event",
                price: "₱ 25,000",
                features: [
                    "1 Photographer & Assistant",
                    "6 Hours Coverage",
                    "On-site Printing",
                    "Digital Files"
                ]
            }
        ],
        sampleImages: [
            "https://images.unsplash.com/photo-1758738180856-7538f9dd4ac4?w=600&q=80",
            "https://images.unsplash.com/photo-1555543788-b2a382e259b3?w=600&q=80",
            "https://images.unsplash.com/photo-1535451674488-812e96492938?w=600&q=80",
            "https://images.unsplash.com/photo-1501741549429-b68427f71e54?w=600&q=80"
        ]
    }
};

export default servicesData;
