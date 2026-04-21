export default function ProductCard({ product }) {
  const imageUrl = product.imageUrl 
    ? `http://localhost:8080${product.imageUrl}` 
    : "https://via.placeholder.com/200";
  
  const handleImageError = (e) => {
    console.error("❌ Image failed to load:", imageUrl, e);
    e.target.src = "https://via.placeholder.com/200";
  };
  
  const handleImageLoad = () => {
    console.log("✅ Image loaded successfully:", imageUrl);
  };
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition group">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-800 text-sm truncate">{product.title}</h3>
        <p className="text-gray-600 text-xs mt-1 line-clamp-2">{product.description}</p>
        <p className="text-rose-600 font-bold mt-2">${product.price}</p>
      </div>
    </div>
  );
}