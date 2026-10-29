const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const menuItems = [
  {
    id: 1,
    name: 'Smoky BBQ Burger',
    category: 'burgers',
    price: 15.9,
    rating: 4.9,
    description: 'Beef patty, cheddar, caramelized onions, smoked BBQ sauce.',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    name: 'Crispy Chicken Crunch',
    category: 'burgers',
    price: 13.5,
    rating: 4.8,
    description: 'Crispy chicken, slaw, pickles, and spicy mayo on brioche.',
    image:
      'https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    name: 'Power Protein Bowl',
    category: 'bowls',
    price: 16.4,
    rating: 4.9,
    description: 'Grilled chicken, quinoa, greens, avocado, and lemon dressing.',
    image:
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    name: 'Mediterranean Feast',
    category: 'bowls',
    price: 14.8,
    rating: 4.7,
    description: 'Hummus, falafel, couscous, roasted veggies, and tahini.',
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 5,
    name: 'Salmon Sunset Roll',
    category: 'sushi',
    price: 17.2,
    rating: 4.9,
    description: 'Fresh salmon, avocado, cucumber, and sesame crunch.',
    image:
      'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 6,
    name: 'Tokyo Dragon Roll',
    category: 'sushi',
    price: 18.5,
    rating: 5.0,
    description: 'Tempura shrimp, spicy mayo, eel sauce, and scallions.',
    image:
      'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 7,
    name: 'Choco Lava Cake',
    category: 'desserts',
    price: 8.9,
    rating: 4.8,
    description: 'Warm chocolate cake with molten center and vanilla cream.',
    image:
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 8,
    name: 'Berry Cheesecake',
    category: 'desserts',
    price: 7.4,
    rating: 4.7,
    description: 'Creamy cheesecake layered with berry compote and biscuit crust.',
    image:
      'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=80',
  },
];

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Bistro Byte backend running' });
});

app.get('/api/menu', (req, res) => {
  res.json(menuItems);
});

app.post('/api/orders', (req, res) => {
  const { customer, items, total } = req.body;

  if (!customer || !items || !Array.isArray(items) || !total) {
    return res.status(400).json({ error: 'Missing order details' });
  }

  const order = {
    id: Date.now(),
    customer,
    items,
    total,
    createdAt: new Date().toISOString(),
  };

  res.status(201).json({
    message: 'Order placed successfully',
    order,
  });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
