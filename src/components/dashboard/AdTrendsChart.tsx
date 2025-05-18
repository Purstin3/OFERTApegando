import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { useData } from '../../context/DataContext';

const AdTrendsChart: React.FC = () => {
  const { offers, adCounts } = useData();
  
  // Processar dados para o gráfico
  const processChartData = () => {
    // Últimos 7 dias
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    // Preparar dados por dia
    const chartData = dates.map(date => {
      const dayData: any = { date: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) };
      
      // Para cada oferta, encontrar o count desse dia
      offers.forEach(offer => {
        const dayCount = adCounts.find(count => 
          count.offerId === offer.id && 
          new Date(count.date).toISOString().split('T')[0] === date
        );
        
        dayData[offer.title] = dayCount ? dayCount.count : 0;
      });
      
      return dayData;
    });
    
    return chartData;
  };
  
  const chartData = processChartData();
  
  // Cores para as linhas
  const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#EC4899', '#14B8A6'];
  
  return (
    <Card className="col-span-2">
      <CardHeader 
        title="Tendência de Anúncios" 
        subtitle="Anúncios ativos nos últimos 7 dias" 
      />
      <CardBody>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                className="text-xs"
                tick={{ fill: 'currentColor' }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: 'currentColor' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--bg-color)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              {offers.map((offer, index) => (
                <Line
                  key={offer.id}
                  type="monotone"
                  dataKey={offer.title}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {offers.length === 0 && (
          <div className="flex items-center justify-center h-80 text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <p className="mb-2">Nenhuma oferta para exibir</p>
              <p className="text-sm">Adicione algumas ofertas para ver as tendências</p>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default AdTrendsChart;