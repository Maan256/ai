import { useEffect, useMemo, useState } from 'react';

const deliveryFee = 4.99;

export default function App() {
  const [menu, setMenu] = useState([]);
  const [category, setCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/menu')
      .then((res) => res.json())
      .then((data) => setMenu(data))
      .catch(() => setMessage('Could not load menu'));
  }, []);

  const filteredMenu = useMemo(
    () =>
      category === 'all'
        ? menu
        : menu.filter((item) => item.category === category),
    [menu, category],
  );

  const addToCart = (item) => {
    setCart((current) => {
      const existing = current.find((entry) => entry.id === item.id);
      if (existing) {
        return current.map((entry) =>
          entry.id === item.id
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry,
        );
      }
      return [...current, { ...item, quantity: 1 }];
    });

    setMessage(`${item.name} added to cart`);
    window.clearTimeout(addToCart.timer);
    addToCart.timer = window.setTimeout(() => setMessage(''), 1400);
  };

  const updateQty = (id, diff) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + diff } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + deliveryFee;

  const handleCheckout = async () => {
    if (!cart.length) {
      setMessage('Your cart is empty');
      return;
    }

    const payload = {
      customer: { name: 'Guest Customer' },
      items: cart,
      total,
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to place order');
      setCart([]);
      setMessage('Order placed successfully');
    } catch (error) {
      setMessage('Checkout failed. Please try again.');
    }
  };

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="container nav-wrap">
          <div className="brand">
            <div className="brand-mark">B</div>
            <div>
              <p className="brand-name">Bistro Byte</p>
              <small>Kitchen & Grill</small>
            </div>
          </div>

          <nav className="nav">
            <a href="#menu">Menu</a>
            <a href="#features">Why us</a>
            <a href="#reviews">Reviews</a>
          </nav>

          <button className="pill-btn">Order now</button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">Fresh. Fast. Flavor-packed.</span>
              <h1>Order your favorite comfort food in minutes.</h1>
              <p>
                From juicy burgers to handcrafted bowls, we serve chef-curated
                meals prepared fresh and delivered hot to your door.
              </p>
              <div className="hero-actions">
                <a href="#menu" className="primary-btn">Explore menu</a>
                <button className="secondary-btn" onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}>
                  Quick order
                </button>
              </div>
              <div className="hero-stats">
                <div>
                  <strong>15k+</strong>
                  <span>happy diners</span>
                </div>
                <div>
                  <strong>18 min</strong>
                  <span>avg. delivery</span>
                </div>
                <div>
                  <strong>4.9/5</strong>
                  <span>customer rating</span>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="dish-card large-card">
                <img
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80"
                  alt="Signature burger"
                />
                <div className="dish-badge">
                  <span>Chef's pick</span>
                  <strong>Smoky BBQ Burger</strong>
                </div>
              </div>
              <div className="floating-mini mini-one">
                <span>🥤</span>
                <div>
                  <strong>1 free drink</strong>
                  <small>on orders over $25</small>
                </div>
              </div>
              <div className="floating-mini mini-two">
                <span>⚡</span>
                <div>
                  <strong>Fast delivery</strong>
                  <small>12-18 minutes</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="features" id="features">
          <div className="container feature-grid">
            <article>
              <div className="feature-icon">🌿</div>
              <h3>Fresh ingredients</h3>
              <p>Locally sourced produce and premium proteins every day.</p>
            </article>
            <article>
              <div className="feature-icon">🚚</div>
              <h3>Hot delivery</h3>
              <p>Fresh, fast, and tracked straight to your door.</p>
            </article>
            <article>
              <div className="feature-icon">💳</div>
              <h3>Easy checkout</h3>
              <p>Secure ordering with flexible payment and pickup options.</p>
            </article>
          </div>
        </section>

        <section className="menu-section" id="menu">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="eyebrow">Our menu</span>
                <h2>Popular picks</h2>
              </div>
              <div className="filters">
                {['all', 'burgers', 'bowls', 'sushi', 'desserts'].map((item) => (
                  <button
                    key={item}
                    className={`filter ${category === item ? 'active' : ''}`}
                    onClick={() => setCategory(item)}
                  >
                    {item === 'all' ? 'All' : item.charAt(0).toUpperCase() + item.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="menu-grid">
              {filteredMenu.map((item) => (
                <article className="menu-item" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div className="item-body">
                    <div className="item-top">
                      <h3>{item.name}</h3>
                      <span className="item-price">${item.price.toFixed(2)}</span>
                    </div>
                    <p className="meta">{item.description}</p>
                    <div className="item-actions">
                      <span className="rating">★ {item.rating}</span>
                      <button className="add-btn" onClick={() => addToCart(item)}>
                        Add
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="reviews" id="reviews">
          <div className="container">
            <div className="section-head center">
              <span className="eyebrow">The buzz</span>
              <h2>What people are saying</h2>
            </div>
            <div className="review-grid">
              <article>
                <div className="stars">★★★★★</div>
                <p>“The burger was juicy, the fries were golden, and delivery was lightning fast.”</p>
                <strong>— Maya T.</strong>
              </article>
              <article>
                <div className="stars">★★★★★</div>
                <p>“I ordered sushi and dessert together and everything arrived fresh and packed perfectly.”</p>
                <strong>— Alex R.</strong>
              </article>
              <article>
                <div className="stars">★★★★★</div>
                <p>“Bistro Byte feels premium without the premium wait. The quality is consistent.”</p>
                <strong>— Jordan F.</strong>
              </article>
            </div>
          </div>
        </section>
      </main>

      <aside className="cart-panel">
        <div className="cart-header">
          <div>
            <span className="eyebrow">Your order</span>
            <h3>Cart</h3>
          </div>
          <span>{cart.reduce((sum, item) => sum + item.quantity, 0)} items</span>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🛒</div>
              <p>Your cart is empty</p>
              <small>Add some tasty dishes to get started.</small>
            </div>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />
                <div className="item-info">
                  <strong>{item.name}</strong>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <div className="item-controls">
                  <div className="qty-box">
                    <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                    <span>{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="summary-box">
          <div className="summary-row">
            <span>Subtotal</span>
            <strong>${subtotal.toFixed(2)}</strong>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <strong>${deliveryFee.toFixed(2)}</strong>
          </div>
          <div className="summary-row total-row">
            <span>Total</span>
            <strong>${total.toFixed(2)}</strong>
          </div>
        </div>

        <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
      </aside>

      {message && <div className="toast show">{message}</div>}
    </div>
  );
}
