import React from 'react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { useData } from '../../context/DataContext';

const AdTrendsChart: React.FC = () => {
  const { offers, adCounts } = useData();
  
  // Process data for chart
  const processChartData = () => {
    // Get last 7 days
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    // Prepare series data for each offer
    const series = offers.map(offer => {
      const offerCounts = adCounts.filter(count => count.offerId === offer.id);
      
      const dataPoints = dates.map(date => {
        const matchingCount = offerCounts.find(count => 
          new Date(count.date).toISOString().split('T')[0] === date
        );
        return matchingCount ? matchingCount.count : null;
      });
      
      return {
        name: offer.title,
        data: dataPoints
      };
    });
    
    return { dates, series };
  };
  
  const { dates, series } = processChartData();
  
  // IMPORTANT: In a real app, we would use a charting library like Chart.js or Recharts
  // For this mock-up, we'll create a simple visualization
  
  // Find max value for scaling
  const maxValue = Math.max(...series.flatMap(s => s.data.filter(v => v !== null) as number[]));
  
  // Generate random colors for demo
  const generateColor = (index: number) => {
    const colors = [
      'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-yellow-500',
      'bg-red-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'
    ];
    return colors[index % colors.length];
  };
  
  return (
    <Card className="col-span-2">
      <CardHeader 
        title="Ad Trends" 
        subtitle="Active ads over the last 7 days" 
      />
      <CardBody>
        {/* Simple chart visualization */}
        <div className="mt-4 h-64">
          <div className="flex h-full">
            {/* Y-axis labels */}
            <div className="flex flex-col justify-between text-xs text-gray-500 pr-2">
              <span>{maxValue}</span>
              <span>{Math.round(maxValue * 0.75)}</span>
              <span>{Math.round(maxValue * 0.5)}</span>
              <span>{Math.round(maxValue * 0.25)}</span>
              <span>0</span>
            </div>
            
            {/* Chart bars */}
            <div className="flex-1 flex">
              {dates.map((date, dateIndex) => (
                <div key={date} className="flex-1 flex flex-col justify-end space-y-1 px-1">
                  {series.map((serie, serieIndex) => {
                    const value = serie.data[dateIndex];
                    if (value === null) return null;
                    
                    const heightPercentage = (value / maxValue) * 100;
                    return (
                      <div
                        key={serieIndex}
                        className={`${generateColor(serieIndex)} rounded-t opacity-80`}
                        style={{ height: `${heightPercentage}%` }}
                        title={`${serie.name}: ${value} ads on ${date}`}
                      ></div>
                    );
                  })}
                  <span className="text-xs text-center text-gray-500">
                    {new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4">
          {series.map((serie, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-3 h-3 rounded ${generateColor(index)}`}></div>
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{serie.name}</span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default AdTrendsChart;