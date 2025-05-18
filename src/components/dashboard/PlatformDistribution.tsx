import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { useData } from '../../context/DataContext';

const PlatformDistribution: React.FC = () => {
  const { offers } = useData();
  
  // Contar ofertas por plataforma
  const platformCounts = offers.reduce((acc, offer) => {
    acc[offer.platform] = (acc[offer.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Preparar dados para o gráfico de pizza
  const pieData = Object.entries(platformCounts).map(([platform, count]) => ({
    name: platform.charAt(0).toUpperCase() + platform.slice(1),
    value: count,
    percentage: Math.round((count / offers.length) * 100)
  }));
  
  // Cores para cada fatia
  const COLORS = [
    '#3B82F6', // blue
    '#8B5CF6', // purple  
    '#10B981', // green
    '#F59E0B', // yellow
    '#EF4444', // red
    '#6366F1', // indigo
    '#EC4899', // pink
    '#14B8A6', // teal
  ];
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {data.value} ofertas ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card>
      <CardHeader 
        title="Distribuição por Plataforma" 
        subtitle="Ofertas monitoradas por plataforma" 
      />
      <CardBody>
        {pieData.length > 0 ? (
          <>
            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Lista de plataformas */}
            <div className="space-y-2">
              {pieData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {item.value} ({item.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>Nenhuma oferta cadastrada</p>
            <p className="text-sm mt-1">Adicione ofertas para ver a distribuição</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default PlatformDistribution;