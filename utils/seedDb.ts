import mongoose from "mongoose";
import User from '../models/User';
import Item from '../models/Item';
import dotenv from 'dotenv';

dotenv.config();

const password = "commonPassword123";

const users = [
    { email: "alice@example.com", fullName: "Alice Johnson", password: password },
    { email: "bob@example.com", fullName: "Bob Smith", password: password },
    { email: "carol@example.com", fullName: "Carol Martinez", password: password },
];

const recepies = [
    {
        "name": "Spaghetti Bolognese",
        "description": "Classic Italian pasta dish with meaty tomato sauce",
        "type": "recipe",
        "image": "https://carlsbadcravings.com/wp-content/uploads/2017/02/Weeknight-Spaghtetti-Bolognese-15-500x500.jpg",
    },
    {
      "name": "Chicken Alfredo Pasta",
      "description": "Creamy Alfredo sauce with grilled chicken and pasta",
      "type": "recipe",
      "image": "https://thecozycook.com/wp-content/uploads/2022/08/Chicken-Alfredo-Pasta-2.jpg"
    },
    {
      "name": "Vegetarian Stir-Fry",
      "description": "Healthy stir-fried vegetables with tofu",
      "type": "recipe",
      "image": "https://images.immediate.co.uk/production/volatile/sites/30/2022/10/vegetarian-stir-fry-hero-fe84012.jpg?quality=90&resize=556,505"
    },
    {
      "name": "Beef Tacos",
      "description": "Savory tacos with seasoned beef, lettuce, and cheese",
      "type": "recipe",
      "image": "https://danosseasoning.com/wp-content/uploads/2022/03/Beef-Tacos-768x575.jpg"
    },
    {
      "name": "Caprese Salad",
      "description": "Fresh salad with tomatoes, mozzarella, and basil",
      "type": "recipe",
      "image": "https://whatsgabycooking.com/wp-content/uploads/2023/06/Dinner-Party-__-Traditional-Caprese-1-1200x800-1.jpg"
    },
    {
      "name": "Shrimp Scampi",
      "description": "Garlic butter shrimp served over pasta",
      "type": "recipe",
      "image": "https://recipes.net/wp-content/uploads/2021/09/shrimp-scampi-olive-garden-recipe-copycat.jpg"
    },
    {
      "name": "Vegan Buddha Bowl",
      "description": "Nourishing bowl with quinoa, roasted vegetables, and tahini dressing",
      "type": "recipe",
      "image": "https://elavegan.com/wp-content/uploads/2021/05/vegan-buddha-bowl-with-chickpeas-avocado-colorful-veggies-and-green-dressing-on-the-side.jpg"
    },
    {
      "name": "Homestyle Pizza",
      "description": "Classic pizza with your favorite toppings",
      "type": "recipe",
      "image": "https://media-cdn.tripadvisor.com/media/photo-s/05/77/97/9c/fresh-hot-pizza-from.jpg"
    },
    {
      "name": "Mango Salsa Chicken",
      "description": "Grilled chicken topped with refreshing mango salsa",
      "type": "recipe",
      "image": "https://www.cookingclassy.com/wp-content/uploads/2018/02/slow-cooker-mango-salsa-chicken-coconut-rice-16.jpg"
    },
    {
      "name": "Spinach and Feta Stuffed Chicken",
      "description": "Tender chicken breasts filled with spinach and feta",
      "type": "recipe",
      "image": "https://www.sandravalvassori.com/wp-content/uploads/2022/03/Feta-stuffed-chicken-11133-8.jpg"
    },
    {
      "name": "Pasta Primavera",
      "description": "Colorful pasta with a variety of fresh vegetables",
      "type": "recipe",
      "image": "https://cdn.loveandlemons.com/wp-content/uploads/2022/06/pasta-primavera.jpg"
    },
    {
      "name": "Grilled Salmon",
      "description": "Juicy salmon fillets seasoned and grilled to perfection",
      "type": "recipe",
      "image": "https://www.wholesomeyum.com/wp-content/uploads/2021/06/wholesomeyum-Grilled-Salmon-Recipe-8.jpg"
    },
    {
      "name": "Chicken Caesar Salad",
      "description": "Classic Caesar salad with grilled chicken",
      "type": "recipe",
      "image": "https://www.jessicagavin.com/wp-content/uploads/2022/06/chicken-caesar-salad-28-1200.jpg"
    },
    {
      "name": "Stuffed Bell Peppers",
      "description": "Bell peppers filled with a mix of rice, beans, and spices",
      "type": "recipe",
      "image": "https://bellyfull.net/wp-content/uploads/2021/01/Stuffed-Peppers-blog-768x1024.jpg"
    },
    {
      "name": "Teriyaki Tofu Stir-Fry",
      "description": "Tofu stir-fried with colorful vegetables in teriyaki sauce",
      "type": "recipe",
      "image": "https://www.herwholesomekitchen.com/wp-content/uploads/2021/09/teriyaki-tofu-stir-fry-1-5-1.jpg"
    },
    {
      "name": "Lemon Herb Roast Chicken",
      "description": "Roast chicken seasoned with lemon and herbs",
      "type": "recipe",
      "image": "https://minimalistbaker.com/wp-content/uploads/2022/09/Lemon-Herb-Roasted-Chicken-Thighs-SQUARE.jpg"
    },
    {
      "name": "Eggplant Parmesan",
      "description": "Baked eggplant with marinara sauce and melted cheese",
      "type": "recipe",
      "image": "https://thecozycook.com/wp-content/uploads/2020/06/Eggplant-Parmesan-Recipe-f.jpg"
    },
    {
      "name": "Shrimp Fried Rice",
      "description": "Delicious fried rice with shrimp and vegetables",
      "type": "recipe",
      "image": "https://s23209.pcdn.co/wp-content/uploads/2014/04/IMG_3927edit.jpg"
    },
    {
      "name": "Quinoa Salad",
      "description": "Nutrient-packed salad with quinoa, vegetables, and vinaigrette",
      "type": "recipe",
      "image": "https://www.thissavoryvegan.com/wp-content/uploads/2023/01/mediterranean-quinoa-salad-3.jpg"
    },
    {
      "name": "BBQ Pulled Pork Sandwiches",
      "description": "Slow-cooked pulled pork with barbecue sauce on a bun",
      "type": "recipe",
      "image": "https://saltpepperskillet.com/wp-content/uploads/pulled-pork-sandwiches-on-butcher-paper-horizontal.jpg"
    },
    {
      "name": "Mushroom Risotto",
      "description": "Creamy risotto with sautéed mushrooms and Parmesan",
      "type": "recipe",
      "image": "https://cdn.loveandlemons.com/wp-content/uploads/2023/01/mushroom-risotto-recipe.jpg"
    },
    {
      "name": "Cauliflower Buffalo Wings",
      "description": "Crispy cauliflower bites coated in buffalo sauce",
      "type": "recipe",
      "image": "https://chocolatecoveredkatie.com/wp-content/uploads/2022/03/Buffalo-Cauliflower-Wing-Recipe-jpg.webp"
    },
    {
      "name": "Bruschetta",
      "description": "Toasted bread topped with fresh tomatoes, basil, and garlic",
      "type": "recipe",
      "image": "https://richanddelish.com/wp-content/uploads/2023/01/Bruschetta-recipe-with-mozzarella-2.jpg"
    },
    {
      "name": "Sweet Potato and Black Bean Tacos",
      "description": "Tacos with roasted sweet potato and seasoned black beans",
      "type": "recipe",
      "image": "https://www.thechunkychef.com/wp-content/uploads/2023/04/Sweet-Potato-and-Black-Bean-Tacos-recipe-card.jpg"
    },
    {
      "name": "Pesto Pasta",
      "description": "Pasta tossed in a vibrant pesto sauce with pine nuts",
      "type": "recipe",
      "image": "https://www.dinneratthezoo.com/wp-content/uploads/2018/03/chicken-pesto-pasta-14-1.jpg"
    },
    {
      "name": "Honey Garlic Glazed Salmon",
      "description": "Salmon fillets glazed with a sweet and savory honey garlic sauce",
      "type": "recipe",
      "image": "https://www.thechunkychef.com/wp-content/uploads/2020/01/Honey-Garlic-Salmon-fork.jpg"
    },
    {
      "name": "Vegetable Curry",
      "description": "Hearty vegetable curry with aromatic spices",
      "type": "recipe",
      "image": "https://www.indianhealthyrecipes.com/wp-content/uploads/2023/07/vegetable-curry-recipe.jpg"
    },
    {
      "name": "Greek Salad",
      "description": "Refreshing salad with tomatoes, cucumbers, olives, and feta",
      "type": "recipe",
      "image": "https://www.italianbellavita.com/wp-content/uploads/2022/08/739C7136-CBA2-4DDC-8D56-ECA409F69AB9-3-735x735.jpeg"
    },
    {
      "name": "Tofu Lettuce Wraps",
      "description": "Asian-inspired lettuce wraps with seasoned tofu",
      "type": "recipe",
      "image": "https://pinchofyum.com/wp-content/uploads/Tofu-and-Brown-Rice-Lettuce-Wraps-Square.png"
    },
    {
      "name": "Blueberry Pancakes",
      "description": "Fluffy pancakes with fresh blueberries and maple syrup",
      "type": "recipe",
      "image": "https://www.inspiredtaste.net/wp-content/uploads/2019/02/Easy-Homemade-Blueberry-Pancakes-Recipe-2-1200.jpg"
    }
];

const seedUsers = async () => {
    await mongoose.connect(process.env.MONGO_URI as string);

    await User.deleteMany({});

    for (let user of users) {
      const newUser = new User({ ...user });
      await newUser.save();
    }

    console.log('Users seeded!');
    mongoose.disconnect();
};

const seedRecepies = async () => {
    await mongoose.connect(process.env.MONGO_URI as string);

    const alice = await User.findOne({ email: "alice@example.com" });
    const bob = await User.findOne({ email: "bob@example.com" });
    const carol = await User.findOne({ email: "carol@example.com" });

    const first10Recepies = recepies.slice(0, 10);
    const second10Recepies = recepies.slice(10, 20);
    const third10Recepies = recepies.slice(20, 30);

    if (!alice || !bob || !carol) {
        throw new Error('One or more of the users not found! Cannot seed recepe data!');
    }

    await Item.deleteMany({});

    for (const recepe of first10Recepies) {
        const newRecepe = new Item({ ...recepe, owner: alice._id });
        await newRecepe.save();
    }

    for (const recepe of second10Recepies) {
        const newRecepe = new Item({ ...recepe, owner: bob._id });
        await newRecepe.save();
    }

    for (const recepe of third10Recepies) {
        const newRecepe = new Item({ ...recepe, owner: carol._id });
        await newRecepe.save();
    }

    console.log('Recepies with owners seeded!');
    mongoose.disconnect();
}

const seed = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI as string);
      mongoose.set('strictQuery', true);
  
      await seedUsers(); // Ensure seedUsers function awaits all internal async operations
      await seedRecepies(); // Ensure seedRecepies function awaits all internal async operations
  
      console.log('All data seeded successfully');
    } catch (error) {
      console.error('Error seeding data:', error);
    } finally {
      await mongoose.disconnect();
    }
};
  
seed();