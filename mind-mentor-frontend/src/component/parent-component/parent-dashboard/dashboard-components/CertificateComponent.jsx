

// eslint-disable-next-line react/prop-types
function CertificateComponent({ imgSrc, title, description }) {
  return (
    <div className="max-w-xs bg-white rounded-lg shadow-lg overflow-hidden text-center transition-transform transform hover:scale-105 duration-300 ease-in-out">
      <img src={imgSrc} alt="Card" className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-600 text-sm mt-2">{description}</p>
        <button className="mt-4 px-6 py-2 bg-gray-200 text-primary rounded-md hover:bg-purple-400 transition duration-300">
          See Detail
        </button>
      </div>
    </div>
  );
}

export default CertificateComponent;
