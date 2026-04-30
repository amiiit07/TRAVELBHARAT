// require('dotenv').config();
// const mongoose = require('mongoose');
// const { State, City, Place, Admin } = require('./models');

// const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/travelbharat';

// // Using placeholder image service for reliability
// const IMG = (id) => `https://picsum.photos/800/600?random=${id}`;

// mongoose.connect(mongoURI).then(async () => {
//   console.log('Connected to MongoDB');
  
//   await State.deleteMany({});
//   await City.deleteMany({});
//   await Place.deleteMany({});
//   await Admin.deleteMany({});
  
//   const states = await State.insertMany([
//     { name: 'Tamil Nadu', slug: 'tamil-nadu', image: IMG(1), description: 'Tamil Nadu is famous for its magnificent temples and classical dance forms.' },
//     { name: 'Kerala', slug: 'kerala', image: IMG(2), description: 'Known as Gods Own Country with serene backwaters.' },
//     { name: 'Maharashtra', slug: 'maharashtra', image: IMG(3), description: 'The financial powerhouse with ancient caves and beaches.' },
//     { name: 'Rajasthan', slug: 'rajasthan', image: IMG(4), description: 'The Land of Kings with royal palaces and deserts.' },
//     { name: 'Uttar Pradesh', slug: 'uttar-pradesh', image: IMG(5), description: 'Home to the Taj Mahal and Varanasi.' },
//     { name: 'West Bengal', slug: 'west-bengal', image: IMG(6), description: 'Cultural capital with colonial heritage.' },
//     { name: 'Karnataka', slug: 'karnataka', image: IMG(7), description: 'Ancient temples and tech hubs.' },
//     { name: 'Goa', slug: 'goa', image: IMG(8), description: 'Beach paradise with Portuguese heritage.' },
//     { name: 'Uttarakhand', slug: 'uttarakhand', image: IMG(9), description: 'Land of Gods with Himalayan grandeur.' },
//     { name: 'Delhi', slug: 'delhi', image: IMG(10), description: 'Capital city with thousand-year history.' }
//   ]);

//   const cities = await City.insertMany([
//     { name: 'Chennai', slug: 'chennai', state: states[0]._id, image: IMG(11), description: 'Capital of Tamil Nadu.' },
//     { name: 'Mumbai', slug: 'mumbai', state: states[2]._id, image: IMG(12), description: 'Financial capital of India.' },
//     { name: 'Jaipur', slug: 'jaipur', state: states[3]._id, image: IMG(13), description: 'Pink City of Rajasthan.' },
//     { name: 'Agra', slug: 'agra', state: states[4]._id, image: IMG(14), description: 'Home to Taj Mahal.' },
//     { name: 'Kolkata', slug: 'kolkata', state: states[5]._id, image: IMG(15), description: 'Cultural capital.' }
//   ]);

//   await Place.insertMany([
//     { name: 'Meenakshi Temple', slug: 'meenakshi-temple', state: states[0]._id, city: cities[0]._id, category: 'religious', images: [IMG(16)], description: 'Historic Hindu temple in Madurai with intricate Dravidian architecture.', historicalImportance: 'Built in 6th century, one of the oldest temples in South India.', bestTimeToVisit: 'October to March', entryFee: 'Free', timings: '5AM-10PM', rating: 4.8, isPopular: true, featured: true },
//     { name: 'Marina Beach', slug: 'marina-beach', state: states[0]._id, city: cities[0]._id, category: 'beaches', images: [IMG(17)], description: 'One of the longest urban beaches in the world stretching 13km.', bestTimeToVisit: 'October to March', entryFee: 'Free', timings: '24/7', rating: 4.5, isPopular: true },
//     { name: 'Gateway of India', slug: 'gateway-of-india', state: states[2]._id, city: cities[1]._id, category: 'heritage', images: [IMG(18)], description: 'Iconic monument overlooking Mumbai harbor built in 1924.', historicalImportance: 'Arch-shaped gateway monument.', bestTimeToVisit: 'October to April', entryFee: 'Free', timings: '24/7', rating: 4.6, isPopular: true },
//     { name: 'Taj Mahal', slug: 'taj-mahal', state: states[4]._id, city: cities[3]._id, category: 'heritage', images: [IMG(19)], description: 'UNESCO World Heritage Site and one of the Seven Wonders of the World.', historicalImportance: 'Built by Shah Jahan in 1653 as a mausoleum for his wife.', bestTimeToVisit: 'October to March', entryFee: '₹1100', timings: '6AM-7PM', rating: 4.9, isPopular: true, featured: true },
//     { name: 'Jaipur City Palace', slug: 'jaipur-city-palace', state: states[3]._id, city: cities[2]._id, category: 'heritage', images: [IMG(20)], description: 'Royal palace showcasing Mughal and Western architecture blend.', historicalImportance: 'Built in 1729 by Maharaja Sawai Jai Singh II.', bestTimeToVisit: 'September to March', entryFee: '₹500', timings: '9:30AM-4:45PM', rating: 4.7, isPopular: true },
//     { name: 'Hawa Mahal', slug: 'hawa-mahal', state: states[3]._id, city: cities[2]._id, category: 'heritage', images: [IMG(21)], description: 'Pink five-story structure with 953 small windows for royal ladies to observe streets.', historicalImportance: 'Built in 1799 during Maharaja Sawai Pratap Singh reign.', bestTimeToVisit: 'October to March', entryFee: '₹200', timings: '9AM-5:30PM', rating: 4.4, isPopular: true },
//     { name: 'Varanasi Ghats', slug: 'varanasi-ghats', state: states[4]._id, city: cities[4]._id, category: 'religious', images: [IMG(22)], description: 'Sacred riverfront steps along Ganges with spiritual significance.', historicalImportance: 'Oldest continuously inhabited city, pilgrimage site for Hindu and Buddhist.', bestTimeToVisit: 'October to March', entryFee: 'Free', timings: '24/7', rating: 4.6, isPopular: true },
//     { name: 'Allahabad Fort', slug: 'allahabad-fort', state: states[4]._id, city: cities[4]._id, category: 'heritage', images: [IMG(23)], description: 'Ancient fort at the confluence of three rivers built by Akbar.', historicalImportance: 'Constructed in 1583, significant Mughal military structure.', bestTimeToVisit: 'October to March', entryFee: '₹300', timings: '6AM-5PM', rating: 4.3, isPopular: false },
//     { name: 'Agra Fort', slug: 'agra-fort', state: states[4]._id, city: cities[3]._id, category: 'heritage', images: [IMG(24)], description: 'Red sandstone fortress containing Mughal palaces and gardens.', historicalImportance: 'Built by Akbar in 1566, residence of Mughal emperors.', bestTimeToVisit: 'October to March', entryFee: '₹550', timings: '6AM-7PM', rating: 4.5, isPopular: true },
//     { name: 'Backwaters of Kerala', slug: 'backwaters-kerala', state: states[1]._id, city: cities[1]._id, category: 'nature', images: [IMG(25)], description: 'Network of lagoons and lakes with stunning houseboat cruises.', bestTimeToVisit: 'September to May', entryFee: '₹500-2000', timings: '6AM-6PM', rating: 4.7, isPopular: true, featured: true },
//     { name: 'Munnar Tea Gardens', slug: 'munnar-tea-gardens', state: states[1]._id, city: cities[1]._id, category: 'nature', images: [IMG(26)], description: 'Picturesque tea plantations nestled in misty hills.', bestTimeToVisit: 'October to May', entryFee: 'Free', timings: '24/7', rating: 4.6, isPopular: true },
//     { name: 'Ezhara Beach', slug: 'ezhara-beach', state: states[1]._id, city: cities[1]._id, category: 'beaches', images: [IMG(27)], description: 'Serene beach with golden sands and coconut palms.', bestTimeToVisit: 'September to March', entryFee: 'Free', timings: '24/7', rating: 4.4, isPopular: false },
//     { name: 'Elephanta Caves', slug: 'elephanta-caves', state: states[2]._id, city: cities[1]._id, category: 'heritage', images: [IMG(28)], description: 'Island with ancient rock-cut Hindu and Buddhist temples.', historicalImportance: 'Created between 5th-8th century CE.', bestTimeToVisit: 'October to May', entryFee: '₹600', timings: '9AM-5:30PM', rating: 4.5, isPopular: false },
//     { name: 'Ajanta Caves', slug: 'ajanta-caves', state: states[2]._id, city: cities[1]._id, category: 'heritage', images: [IMG(29)], description: 'UNESCO site with 30 rock-cut Buddhist caves showcasing art and architecture.', historicalImportance: 'Carved 2000 years ago during 2nd century BCE.', bestTimeToVisit: 'October to April', entryFee: '₹600', timings: '9AM-5:30PM', rating: 4.7, isPopular: true },
//     { name: 'Goa Beaches', slug: 'goa-beaches', state: states[7]._id, city: cities[1]._id, category: 'beaches', images: [IMG(30)], description: 'Famous beaches with tropical atmosphere and water sports.', bestTimeToVisit: 'November to February', entryFee: 'Free', timings: '24/7', rating: 4.6, isPopular: true },
//     { name: 'Basilica of Bom Jesus', slug: 'basilica-bom-jesus', state: states[7]._id, city: cities[1]._id, category: 'religious', images: [IMG(31)], description: 'UNESCO heritage church with Portuguese baroque architecture.', historicalImportance: 'Built in 1605, contains relics of Saint Francis Xavier.', bestTimeToVisit: 'November to February', entryFee: 'Free', timings: '9AM-6:30PM', rating: 4.5, isPopular: true },
//     { name: 'Dudhsagar Waterfall', slug: 'dudhsagar-waterfall', state: states[7]._id, city: cities[1]._id, category: 'nature', images: [IMG(32)], description: 'Spectacular four-tiered waterfall in Western Ghats mountains.', bestTimeToVisit: 'June to December', entryFee: 'Free', timings: '6AM-6PM', rating: 4.5, isPopular: true },
//     { name: 'Mysore Palace', slug: 'mysore-palace', state: states[6]._id, city: cities[1]._id, category: 'heritage', images: [IMG(33)], description: 'Magnificent palace with Indo-Saracenic architecture and ornate interiors.', historicalImportance: 'Royal residence of the Wadiyar dynasty, built in 1912.', bestTimeToVisit: 'June to May', entryFee: '₹600', timings: '10AM-5:30PM', rating: 4.6, isPopular: true, featured: true },
//     { name: 'Hampi Ruins', slug: 'hampi-ruins', state: states[6]._id, city: cities[1]._id, category: 'heritage', images: [IMG(34)], description: 'UNESCO World Heritage site with temples and bazaars from ancient kingdom.', historicalImportance: 'Capital of Vijayanagara Empire, 14th-16th century.', bestTimeToVisit: 'October to February', entryFee: 'Free', timings: '6AM-6PM', rating: 4.7, isPopular: true },
//     { name: 'Jog Falls', slug: 'jog-falls', state: states[6]._id, city: cities[1]._id, category: 'nature', images: [IMG(35)], description: 'Second highest plunge waterfall in India with scenic beauty.', bestTimeToVisit: 'June to November', entryFee: 'Free', timings: '7AM-6PM', rating: 4.4, isPopular: false },
//     { name: 'Rishikesh', slug: 'rishikesh', state: states[8]._id, city: cities[1]._id, category: 'religious', images: [IMG(36)], description: 'Yoga and spiritual capital with ashrams and ghats on Ganges.', historicalImportance: 'Sacred pilgrimage site with spiritual significance.', bestTimeToVisit: 'October to March', entryFee: 'Free', timings: '24/7', rating: 4.5, isPopular: true },
//     { name: 'Auli Skiing', slug: 'auli-skiing', state: states[8]._id, city: cities[1]._id, category: 'adventure', images: [IMG(37)], description: 'Himalayan skiing destination with snow-covered peaks.', bestTimeToVisit: 'December to February', entryFee: '₹2000-5000', timings: '8AM-4PM', rating: 4.3, isPopular: false },
//     { name: 'Chopta', slug: 'chopta', state: states[8]._id, city: cities[1]._id, category: 'nature', images: [IMG(38)], description: 'Scenic hill station with lush meadows and pine forests.', bestTimeToVisit: 'March to May', entryFee: 'Free', timings: '6AM-6PM', rating: 4.4, isPopular: false },
//     { name: 'Victoria Memorial', slug: 'victoria-memorial', state: states[5]._id, city: cities[4]._id, category: 'heritage', images: [IMG(39)], description: 'White marble monument dedicated to Queen Victoria with museum.', historicalImportance: 'Built in 1906, symbol of British colonial architecture.', bestTimeToVisit: 'October to March', entryFee: '₹600', timings: '10AM-6PM', rating: 4.5, isPopular: true },
//     { name: 'Darjeeling Tea Gardens', slug: 'darjeeling-tea', state: states[5]._id, city: cities[4]._id, category: 'nature', images: [IMG(40)], description: 'Terraced tea gardens with Kanchenjunga mountain views.', bestTimeToVisit: 'March to May', entryFee: 'Free', timings: '6AM-6PM', rating: 4.6, isPopular: true },
//     { name: 'Jaldapara Wildlife Sanctuary', slug: 'jaldapara-wildlife', state: states[5]._id, city: cities[4]._id, category: 'nature', images: [IMG(41)], description: 'Protected area home to Indian rhinoceros and wild elephants.', bestTimeToVisit: 'September to May', entryFee: '₹500', timings: '6AM-5PM', rating: 4.3, isPopular: false },
//     { name: 'Rajasthani Fort', slug: 'rajasthani-fort', state: states[3]._id, city: cities[2]._id, category: 'heritage', images: [IMG(42)], description: 'Imposing sandstone fort with panoramic desert views.', historicalImportance: 'Medieval fortress showcasing Rajasthani architecture.', bestTimeToVisit: 'October to March', entryFee: '₹200', timings: '7AM-6PM', rating: 4.4, isPopular: false },
//     { name: 'Mehrangarh Fort', slug: 'mehrangarh-fort', state: states[3]._id, city: cities[2]._id, category: 'heritage', images: [IMG(43)], description: 'Majestic fort perched on 125m cliff with intricate carvings.', historicalImportance: 'Built in 1459, dominates Jodhpur city.', bestTimeToVisit: 'September to March', entryFee: '₹600', timings: '9AM-5PM', rating: 4.6, isPopular: true },
//     { name: 'Lake Palace', slug: 'lake-palace', state: states[3]._id, city: cities[2]._id, category: 'heritage', images: [IMG(44)], description: 'Stunning marble palace built on island in Pichola Lake.', historicalImportance: 'Built in 1743, now luxury hotel.', bestTimeToVisit: 'October to March', entryFee: '₹500', timings: '9AM-6PM', rating: 4.7, isPopular: true },
//     { name: 'Pushkar Lake', slug: 'pushkar-lake', state: states[3]._id, city: cities[2]._id, category: 'religious', images: [IMG(45)], description: 'Sacred Hindu pilgrimage site with 52 ghats and temples.', historicalImportance: 'Brahma temple, one of few dedicated to Brahma.', bestTimeToVisit: 'October to November', entryFee: 'Free', timings: '24/7', rating: 4.4, isPopular: true },
//     { name: 'Desert Safari', slug: 'desert-safari', state: states[3]._id, city: cities[2]._id, category: 'adventure', images: [IMG(46)], description: 'Camel trekking and camping in the golden sands of Thar Desert.', bestTimeToVisit: 'October to March', entryFee: '₹1500-3000', timings: '4PM-10PM', rating: 4.5, isPopular: true },
//     { name: 'Ranthambore National Park', slug: 'ranthambore-national-park', state: states[3]._id, city: cities[2]._id, category: 'nature', images: [IMG(47)], description: 'Tiger reserve with ancient fort ruins and diverse wildlife.', bestTimeToVisit: 'October to June', entryFee: '₹200', timings: '6AM-6PM', rating: 4.6, isPopular: true },
//     { name: 'Jodhpur Blue City', slug: 'jodhpur-blue-city', state: states[3]._id, city: cities[2]._id, category: 'heritage', images: [IMG(48)], description: 'Scenic walled city with distinctive indigo-colored buildings.', historicalImportance: 'Built by Rao Jodha in 1459.', bestTimeToVisit: 'September to March', entryFee: 'Free', timings: '24/7', rating: 4.5, isPopular: true },
//     { name: 'Amber Fort', slug: 'amber-fort', state: states[3]._id, city: cities[2]._id, category: 'heritage', images: [IMG(49)], description: 'Magnificent fort-palace complex with stunning views.', historicalImportance: 'Built in 1592 by Raja Man Singh I.', bestTimeToVisit: 'September to March', entryFee: '₹600', timings: '8AM-6PM', rating: 4.7, isPopular: true, featured: true },
//     { name: 'Jaisalmer Fort', slug: 'jaisalmer-fort', state: states[3]._id, city: cities[2]._id, category: 'heritage', images: [IMG(50)], description: 'Golden sandstone fort rising from desert with beautiful architecture.', historicalImportance: 'Built in 1156, UNESCO World Heritage Site.', bestTimeToVisit: 'October to March', entryFee: '₹300', timings: '9AM-5PM', rating: 4.6, isPopular: true },
//     { name: 'Sam Sand Dunes', slug: 'sam-sand-dunes', state: states[3]._id, city: cities[2]._id, category: 'nature', images: [IMG(51)], description: 'Vast sand dunes perfect for camel rides and sunset views.', bestTimeToVisit: 'October to March', entryFee: 'Free', timings: '5AM-9PM', rating: 4.5, isPopular: true },
//     { name: 'Galtaji Temple', slug: 'galtaji-temple', state: states[3]._id, city: cities[2]._id, category: 'religious', images: [IMG(52)], description: 'Temple complex with natural hot springs and scenic valleys.', historicalImportance: 'Built in 17th century, sacred Hindu site.', bestTimeToVisit: 'October to March', entryFee: 'Free', timings: '6AM-6PM', rating: 4.4, isPopular: false },
//     { name: 'Nahargarh Fort', slug: 'nahargarh-fort', state: states[3]._id, city: cities[2]._id, category: 'heritage', images: [IMG(53)], description: 'Fort overlooking Jaipur city with panoramic sunset views.', historicalImportance: 'Built in 1734 for defense purposes.', bestTimeToVisit: 'October to March', entryFee: '₹200', timings: '9AM-5:30PM', rating: 4.3, isPopular: false },
//     { name: 'Red Fort Delhi', slug: 'red-fort-delhi', state: states[9]._id, city: cities[4]._id, category: 'heritage', images: [IMG(54)], description: 'UNESCO World Heritage Site with red sandstone walls and Mughal architecture.', historicalImportance: 'Built by Shah Jahan in 1648, served as Mughal capital.', bestTimeToVisit: 'October to March', entryFee: '₹600', timings: '7AM-5PM', rating: 4.5, isPopular: true },
//     { name: 'India Gate', slug: 'india-gate', state: states[9]._id, city: cities[4]._id, category: 'heritage', images: [IMG(55)], description: 'War memorial arch in heart of Delhi with surrounding lawns.', historicalImportance: 'Built in 1931 to commemorate Indian soldiers.', bestTimeToVisit: 'October to March', entryFee: 'Free', timings: '24/7', rating: 4.4, isPopular: true },
//     { name: 'Qutub Minar', slug: 'qutub-minar', state: states[9]._id, city: cities[4]._id, category: 'heritage', images: [IMG(56)], description: 'UNESCO site with towering minaret and surrounding monuments.', historicalImportance: 'Built in 1193, oldest and tallest minaret in India.', bestTimeToVisit: 'October to March', entryFee: '₹600', timings: '7AM-5PM', rating: 4.6, isPopular: true },
//     { name: 'Humayun Tomb', slug: 'humayun-tomb', state: states[9]._id, city: cities[4]._id, category: 'heritage', images: [IMG(57)], description: 'First garden-tomb in India with stunning Mughal architecture.', historicalImportance: 'Built in 1572 for Emperor Humayun.', bestTimeToVisit: 'October to March', entryFee: '₹600', timings: '7AM-6PM', rating: 4.5, isPopular: true },
//     { name: 'Lotus Temple', slug: 'lotus-temple', state: states[9]._id, city: cities[4]._id, category: 'religious', images: [IMG(58)], description: 'Bahai House of Worship with lotus-shaped architecture.', historicalImportance: 'Built in 1986, prominent Bahai temple.', bestTimeToVisit: 'October to March', entryFee: 'Free', timings: '10AM-5PM', rating: 4.6, isPopular: true },
//     { name: 'Kachakallan Temple', slug: 'kachakallan-temple', state: states[0]._id, city: cities[0]._id, category: 'religious', images: [IMG(59)], description: 'Ancient temple with intricate stone carvings and spiritual atmosphere.', bestTimeToVisit: 'October to May', entryFee: 'Free', timings: '5AM-8PM', rating: 4.3, isPopular: false },
//     { name: 'Tirupati Temple', slug: 'tirupati-temple', state: states[0]._id, city: cities[0]._id, category: 'religious', images: [IMG(60)], description: 'One of the richest Hindu temples with pilgrims from across world.', historicalImportance: 'Ancient temple dedicated to Lord Venkateswara.', bestTimeToVisit: 'October to March', entryFee: 'Free', timings: '6AM-9PM', rating: 4.7, isPopular: true }
//   ]);

//   await Admin.create({ username: 'admin', password: 'travelbharat2024' });
  
//   console.log('Database seeded!');
//   process.exit(0);
// }).catch(err => {
//   console.error(err);
//   process.exit(1);
// });

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { State, City, Place, Admin } = require('./models');

const mongoURI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/travelbharat';

const IMG = (id) => `https://picsum.photos/1200/800?random=${id}`;

async function seed() {
  try {
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Connected');

    // Clear old data
    await Promise.all([
      State.deleteMany({}),
      City.deleteMany({}),
      Place.deleteMany({}),
      Admin.deleteMany({})
    ]);

    console.log('🧹 Old data removed');

    // ---------------- STATES ----------------
    const statesData = [
      {
        name: 'Bihar',
        slug: 'bihar',
        image: IMG(1),
        description:
          'Ancient land of Nalanda, Bodh Gaya, rich heritage and spiritual tourism.'
      },
      {
        name: 'Rajasthan',
        slug: 'rajasthan',
        image: IMG(2),
        description:
          'Land of kings, forts, palaces, desert safaris and royal culture.'
      },
      {
        name: 'Goa',
        slug: 'goa',
        image: IMG(3),
        description:
          'India’s beach paradise with nightlife, churches and water sports.'
      },
      {
        name: 'Kerala',
        slug: 'kerala',
        image: IMG(4),
        description:
          'God’s Own Country known for backwaters, tea gardens and Ayurveda.'
      },
      {
        name: 'Uttar Pradesh',
        slug: 'uttar-pradesh',
        image: IMG(5),
        description:
          'Home of Taj Mahal, Varanasi and spiritual heritage.'
      },
      {
        name: 'Delhi',
        slug: 'delhi',
        image: IMG(6),
        description:
          'Capital city with Mughal monuments and modern India vibes.'
      },
      {
        name: 'Jammu and Kashmir',
        slug: 'jammu-kashmir',
        image: IMG(7),
        description:
          'Paradise on earth with valleys, lakes and snow mountains.'
      },
      {
        name: 'West Bengal',
        slug: 'west-bengal',
        image: IMG(8),
        description:
          'Cultural state with Kolkata heritage and Darjeeling hills.'
      }
    ];

    const states = await State.insertMany(statesData);

    const mapState = {};
    states.forEach((s) => (mapState[s.slug] = s));

    // ---------------- CITIES ----------------
    const citiesData = [
      // Bihar
      ['Patna', 'patna', 'bihar'],
      ['Gaya', 'gaya', 'bihar'],
      ['Rajgir', 'rajgir', 'bihar'],

      // Rajasthan
      ['Jaipur', 'jaipur', 'rajasthan'],
      ['Jodhpur', 'jodhpur', 'rajasthan'],
      ['Jaisalmer', 'jaisalmer', 'rajasthan'],

      // Goa
      ['Panaji', 'panaji', 'goa'],
      ['Vasco da Gama', 'vasco-da-gama', 'goa'],

      // Kerala
      ['Alleppey', 'alleppey', 'kerala'],
      ['Munnar', 'munnar', 'kerala'],
      ['Kochi', 'kochi', 'kerala'],

      // UP
      ['Agra', 'agra', 'uttar-pradesh'],
      ['Varanasi', 'varanasi', 'uttar-pradesh'],

      // Delhi
      ['New Delhi', 'new-delhi', 'delhi'],

      // Kashmir
      ['Srinagar', 'srinagar', 'jammu-kashmir'],
      ['Gulmarg', 'gulmarg', 'jammu-kashmir'],

      // Bengal
      ['Kolkata', 'kolkata', 'west-bengal'],
      ['Darjeeling', 'darjeeling', 'west-bengal']
    ];

    const cityDocs = [];

    for (const item of citiesData) {
      cityDocs.push({
        name: item[0],
        slug: item[1],
        state: mapState[item[2]]._id,
        image: IMG(Math.floor(Math.random() * 500)),
        description: `${item[0]} is a major tourist destination.`
      });
    }

    const cities = await City.insertMany(cityDocs);

    const mapCity = {};
    cities.forEach((c) => (mapCity[c.slug] = c));

    // ---------------- PLACES ----------------
    const placesData = [
      // BIHAR
      {
        name: 'Mahabodhi Temple',
        slug: 'mahabodhi-temple',
        state: 'bihar',
        city: 'gaya',
        category: 'religious',
        rating: 4.9,
        featured: true,
        description:
          'UNESCO World Heritage site where Gautam Buddha attained enlightenment.',
        historicalImportance:
          'One of the most sacred Buddhist pilgrimage sites.',
        bestTimeToVisit: 'October to March',
        entryFee: 'Free',
        timings: '5AM - 9PM'
      },
      {
        name: 'Nalanda University Ruins',
        slug: 'nalanda-university-ruins',
        state: 'bihar',
        city: 'rajgir',
        category: 'heritage',
        rating: 4.8,
        featured: true,
        description:
          'Ancient world-famous learning center and UNESCO heritage site.',
        historicalImportance:
          'Founded in 5th century CE, one of the oldest universities.',
        bestTimeToVisit: 'October to March',
        entryFee: '₹40',
        timings: '9AM - 5PM'
      },
      {
        name: 'Golghar',
        slug: 'golghar',
        state: 'bihar',
        city: 'patna',
        category: 'heritage',
        rating: 4.4,
        description:
          'Iconic granary with panoramic city views.',
        bestTimeToVisit: 'October to February',
        entryFee: 'Free',
        timings: '10AM - 5PM'
      },

      // RAJASTHAN
      {
        name: 'Amber Fort',
        slug: 'amber-fort',
        state: 'rajasthan',
        city: 'jaipur',
        category: 'heritage',
        rating: 4.8,
        featured: true,
        description:
          'Magnificent fort palace with Rajput architecture.',
        historicalImportance:
          'Built in 1592 by Raja Man Singh.',
        bestTimeToVisit: 'October to March',
        entryFee: '₹550',
        timings: '8AM - 6PM'
      },
      {
        name: 'Mehrangarh Fort',
        slug: 'mehrangarh-fort',
        state: 'rajasthan',
        city: 'jodhpur',
        category: 'heritage',
        rating: 4.8,
        description:
          'Massive hilltop fort with stunning city views.',
        bestTimeToVisit: 'October to March',
        entryFee: '₹600',
        timings: '9AM - 5PM'
      },
      {
        name: 'Sam Sand Dunes',
        slug: 'sam-sand-dunes',
        state: 'rajasthan',
        city: 'jaisalmer',
        category: 'adventure',
        rating: 4.7,
        description:
          'Camel safari, sunset and desert camping experience.',
        bestTimeToVisit: 'November to February',
        entryFee: '₹1000+',
        timings: '4PM - 10PM'
      },

      // GOA
      {
        name: 'Baga Beach',
        slug: 'baga-beach',
        state: 'goa',
        city: 'panaji',
        category: 'beaches',
        rating: 4.7,
        featured: true,
        description:
          'Popular beach famous for nightlife and water sports.',
        bestTimeToVisit: 'November to February',
        entryFee: 'Free',
        timings: '24/7'
      },
      {
        name: 'Basilica of Bom Jesus',
        slug: 'basilica-of-bom-jesus',
        state: 'goa',
        city: 'panaji',
        category: 'heritage',
        rating: 4.6,
        description:
          'UNESCO church with Portuguese architecture.',
        bestTimeToVisit: 'November to February',
        entryFee: 'Free',
        timings: '9AM - 6PM'
      },

      // KERALA
      {
        name: 'Alleppey Backwaters',
        slug: 'alleppey-backwaters',
        state: 'kerala',
        city: 'alleppey',
        category: 'nature',
        rating: 4.9,
        featured: true,
        description:
          'Houseboat rides through scenic backwaters.',
        bestTimeToVisit: 'September to March',
        entryFee: '₹1500+',
        timings: 'All Day'
      },
      {
        name: 'Munnar Tea Gardens',
        slug: 'munnar-tea-gardens',
        state: 'kerala',
        city: 'munnar',
        category: 'nature',
        rating: 4.8,
        description:
          'Green hills with tea plantations and cool weather.',
        bestTimeToVisit: 'October to March',
        entryFee: 'Free',
        timings: 'All Day'
      },

      // UP
      {
        name: 'Taj Mahal',
        slug: 'taj-mahal',
        state: 'uttar-pradesh',
        city: 'agra',
        category: 'heritage',
        rating: 5.0,
        featured: true,
        description:
          'World-famous marble mausoleum and symbol of love.',
        historicalImportance:
          'Built by Shah Jahan in memory of Mumtaz Mahal.',
        bestTimeToVisit: 'October to March',
        entryFee: '₹1100',
        timings: '6AM - 7PM'
      },
      {
        name: 'Dashashwamedh Ghat',
        slug: 'dashashwamedh-ghat',
        state: 'uttar-pradesh',
        city: 'varanasi',
        category: 'religious',
        rating: 4.8,
        description:
          'Famous Ganga Aarti spiritual experience.',
        bestTimeToVisit: 'October to March',
        entryFee: 'Free',
        timings: '24/7'
      },

      // DELHI
      {
        name: 'Red Fort',
        slug: 'red-fort',
        state: 'delhi',
        city: 'new-delhi',
        category: 'heritage',
        rating: 4.7,
        featured: true,
        description:
          'UNESCO Mughal fort and Independence Day landmark.',
        bestTimeToVisit: 'October to March',
        entryFee: '₹600',
        timings: '9AM - 5PM'
      },
      {
        name: 'India Gate',
        slug: 'india-gate',
        state: 'delhi',
        city: 'new-delhi',
        category: 'modern',
        rating: 4.6,
        description:
          'War memorial and iconic evening hangout.',
        entryFee: 'Free',
        timings: '24/7'
      },

      // KASHMIR
      {
        name: 'Dal Lake',
        slug: 'dal-lake',
        state: 'jammu-kashmir',
        city: 'srinagar',
        category: 'nature',
        rating: 4.9,
        featured: true,
        description:
          'Houseboats, shikara rides and mountain beauty.',
        entryFee: 'Varies',
        timings: 'All Day'
      },
      {
        name: 'Gulmarg Gondola',
        slug: 'gulmarg-gondola',
        state: 'jammu-kashmir',
        city: 'gulmarg',
        category: 'adventure',
        rating: 4.8,
        description:
          'One of the world’s highest cable car rides.',
        bestTimeToVisit: 'December to March',
        entryFee: '₹900+',
        timings: '10AM - 5PM'
      },

      // BENGAL
      {
        name: 'Victoria Memorial',
        slug: 'victoria-memorial',
        state: 'west-bengal',
        city: 'kolkata',
        category: 'heritage',
        rating: 4.7,
        description:
          'White marble museum and iconic Kolkata monument.',
        entryFee: '₹500',
        timings: '10AM - 5PM'
      },
      {
        name: 'Tiger Hill',
        slug: 'tiger-hill',
        state: 'west-bengal',
        city: 'darjeeling',
        category: 'nature',
        rating: 4.8,
        description:
          'Famous sunrise point with Kanchenjunga view.',
        entryFee: '₹100',
        timings: '4AM - 7AM'
      }
    ];

    const finalPlaces = placesData.map((p, index) => ({
      ...p,
      state: mapState[p.state]._id,
      city: mapCity[p.city]._id,
      images: [IMG(index + 100)],
      isPopular: p.rating >= 4.7
    }));

    await Place.insertMany(finalPlaces);

    // ---------------- ADMIN ----------------
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD || 'travelbharat2026',
      10
    );

    await Admin.create({
      username: process.env.ADMIN_USERNAME || 'admin',
      password: hashedPassword
    });

    console.log('🎉 Premium Database Seeded Successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed Error:', error);
    process.exit(1);
  }
}

seed();