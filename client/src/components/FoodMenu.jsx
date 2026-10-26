
export default function FoodMenu({ items, cart, onChange }) {
  if (!items || items.length === 0) return null;

  return (
    <>
      <style>{`
        .food-menu-section,
        .food-menu-section * {
          box-sizing: border-box;
        }

        .food-menu-section {
          width: 100%;
          margin-top: 36px;
          color: #f8fafc;
          font-family: Inter, system-ui, -apple-system, sans-serif;
        }

        .food-menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 14px;
          margin-bottom: 22px;
        }

        .food-menu-heading {
          margin: 0;
          color: #f8fafc;
          font-size: clamp(22px, 3vw, 28px);
          font-weight: 800;
          letter-spacing: -0.8px;
        }

        .food-menu-heading span {
          color: #60a5fa;
        }

        .food-menu-subtitle {
          margin: 8px 0 0;
          color: #94a3b8;
          font-size: 13px;
          line-height: 1.7;
        }

        .food-menu-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 13px;
          border: 1px solid #244879;
          border-radius: 10px;
          background: rgba(37, 99, 235, 0.12);
          color: #93c5fd;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
        }

        .food-menu-grid {
          display: grid;
          grid-template-columns: repeat(
            auto-fill,
            minmax(min(100%, 230px), 1fr)
          );
          gap: 16px;
        }

        .food-menu-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          min-width: 0;
          padding: 19px 16px;
          border: 1px solid #1e304c;
          border-radius: 15px;
          background: linear-gradient(145deg, #111c30, #0a1120);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          transition:
            transform 0.22s ease,
            border-color 0.22s ease,
            box-shadow 0.22s ease;
        }

        .food-menu-card:hover {
          transform: translateY(-4px);
          border-color: #3b82f6;
          box-shadow: 0 12px 28px rgba(37, 99, 235, 0.13);
        }

        .food-menu-info {
          flex: 1;
          min-width: 0;
        }

        .food-menu-name {
          margin: 0;
          color: #f1f5f9;
          font-size: 14px;
          font-weight: 750;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }

        .food-menu-price {
          margin-top: 8px;
          color: #7dd3fc;
          font-size: 16px;
          font-weight: 800;
        }

        .food-menu-controls {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 5px;
          border: 1px solid #243650;
          border-radius: 11px;
          background: #080f1d;
        }

        .food-menu-quantity {
          min-width: 20px;
          color: #f8fafc;
          font-size: 14px;
          font-weight: 800;
          text-align: center;
        }

        .food-menu-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          padding: 0;
          border: 1px solid #31517b;
          border-radius: 8px;
          background: #14233b;
          color: #bfdbfe;
          font-size: 20px;
          line-height: 1;
          cursor: pointer;
          transition:
            background 0.18s ease,
            transform 0.18s ease,
            border-color 0.18s ease;
        }

        .food-menu-btn:hover {
          transform: scale(1.06);
          border-color: #60a5fa;
          background: #1d4ed8;
          color: #ffffff;
        }

        .food-menu-btn:active {
          transform: scale(0.95);
        }

        .food-menu-btn:focus-visible {
          outline: 2px solid #60a5fa;
          outline-offset: 3px;
        }

        .food-menu-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none;
        }

        @media (max-width: 520px) {
          .food-menu-section {
            margin-top: 28px;
          }

          .food-menu-grid {
            grid-template-columns: minmax(0, 1fr);
            gap: 12px;
          }

          .food-menu-card {
            padding: 16px 13px;
          }

          .food-menu-heading {
            font-size: 23px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .food-menu-card,
          .food-menu-btn {
            transition: none;
          }
        }
      `}</style>

      <section className="food-menu-section">
        <div className="food-menu-header">
          <div>
            <h3 className="food-menu-heading">
              Snacks <span>& Treats</span> 🍿
            </h3>

            <p className="food-menu-subtitle">
              Make your movie experience even better with your favourites.
            </p>
          </div>

          <div className="food-menu-badge">
            🍿 {items.length} {items.length === 1 ? "Item" : "Items"}
          </div>
        </div>

        <div className="food-menu-grid">
          {items.map((f) => {
            const quantity = cart?.[f._id] || 0;

            return (
              <div className="food-menu-card" key={f._id}>
                <div className="food-menu-info">
                  <h4 className="food-menu-name">{f.name}</h4>

                  <div className="food-menu-price">
                    ₹{f.price}
                  </div>
                </div>

                <div className="food-menu-controls">
                  <button
                    type="button"
                    className="food-menu-btn"
                    aria-label={`Remove one ${f.name}`}
                    disabled={quantity <= 0}
                    onClick={() => onChange(f._id, -1)}
                  >
                    −
                  </button>

                  <span
                    className="food-menu-quantity"
                    aria-label={`Quantity: ${quantity}`}
                  >
                    {quantity}
                  </span>

                  <button
                    type="button"
                    className="food-menu-btn"
                    aria-label={`Add one ${f.name}`}
                    onClick={() => onChange(f._id, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
