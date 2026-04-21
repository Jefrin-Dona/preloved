export default function ProductCard({ product }) {
  const imageUrl = product.imageUrl 
    ? (product.imageUrl.startsWith('http') 
        ? product.imageUrl 
        : `http://localhost:8080${product.imageUrl}`)
    : null;
  
  const placeholderSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23e5e5e5' width='200' height='200'/%3E%3C/svg%3E`;
  
  const handleImageError = (e) => {
    console.error("❌ Image failed to load:", imageUrl);
    e.target.src = placeholderSvg;
  };
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition group">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={imageUrl || placeholderSvg}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
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