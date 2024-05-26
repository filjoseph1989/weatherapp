const GenericWeatherComponent = ({ label, value }) => (
    <div className="flex justify-between items-center">
        <span className="text-left">{label}</span>
        <span className="text-right">{value}</span>
    </div>
)

export default GenericWeatherComponent;