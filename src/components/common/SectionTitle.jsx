const SectionTitle = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-10">
      <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-3">{title}</h2>
      {subtitle && <p className="text-base-content/60 max-w-2xl mx-auto">{subtitle}</p>}
      <div className="w-20 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
    </div>
  );
};
export default SectionTitle;
