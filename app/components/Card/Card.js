import "./Card.css";
export default function Card(props) {
  const productData = props.product;
  const animationDelay = `${props.Delay}s`;

  const rating = Math.round(productData.rating);
  const discount = (productData.price * productData.discountPercentage) / 100;
  return (
    <a
      className="card animate__animated animate__fadeInUp"
      style={{ animationDelay: animationDelay }}
      href={`/Product/${productData.id}`}
    >
      <img src={productData.thumbnail} className="card-img-top" alt="..." />
      <div className="card-body">
        <h5 className="card-title">{productData.title}</h5>
        {!productData.Offer && <p className="Price">{productData.price}$</p>}
        {productData.Offer && (
          <div className="Price-wrapper">
            <span className="OldPrice">{productData.price}$</span>
            <span>{productData.price - Math.round(discount)}$</span>
          </div>
        )}
        <div className="CardRating">
          <img src={rating >= 1 ? "/star-filled.png" : "/star-empty.png"}></img>
          <img src={rating >= 2 ? "/star-filled.png" : "/star-empty.png"}></img>
          <img src={rating >= 3 ? "/star-filled.png" : "/star-empty.png"}></img>
          <img src={rating >= 4 ? "/star-filled.png" : "/star-empty.png"}></img>
          <img src={rating >= 5 ? "/star-filled.png" : "/star-empty.png"}></img>
        </div>
      </div>
    </a>
  );
}
