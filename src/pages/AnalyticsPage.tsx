import React from 'react';
import CompetitorAnalysis from '../components/analytics/CompetitorAnalysis';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { DataTable } from '../components/ui/DataTable';
import { useData } from '../context/DataContext';
import { Column } from '../types';
import { Badge } from '../components/ui/Badge';
import { formatDate, calculateTrend } from '../utils/helpers';

const AnalyticsPage: React.FC = () => {
  const { offers, adCounts } = useData();
  
  // Preparar dados para a tabela
  const tableData = offers.map(offer => {
    const offerCounts = adCounts.filter(count => count.offerId === offer.id);
    const latestCount = offerCounts
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    
    const trend = calculateTrend(offerCounts, 7);
    
    return {
      id: offer.id,
      title: offer.title,
      platform: offer.platform,
      currentAds: latestCount?.count || 0,
      trend,
      lastUpdate: offer.updatedAt
    };
  });
  
  const columns: Column<typeof tableData[0]>[] = [
    {
      field: 'title',
      header: 'Oferta',
      sortable: true
    },
    {
      field: 'platform',
      header: 'Plataforma',
      sortable: true,
      render: (item) => (
        <Badge variant="primary" className="capitalize">
          {item.platform}
        </Badge>
      )
    },
    {
      field: 'currentAds',
      header: 'Anúncios Ativos',
      sortable: true,
      render: (item) => (
        <span className="font-semibold">{item.currentAds}</span>
      )
    },
    {
      field: 'trend',
      header: 'Tendência (7d)',
      sortable: true,
      render: (item) => (
        <span className={`font-medium ${
          item.trend > 0 
            ? 'text-green-600' 
            : item.trend < 0 
              ? 'text-red-600' 
              : 'text-gray-600'
        }`}>
          {item.trend > 0 ? '+' : ''}{item.trend}%
        </span>
      )
    },
    {
      field: 'lastUpdate',
      header: 'Última Atualização',
      sortable: true,
      render: (item) => formatDate(item.lastUpdate)
    }
  ];

  return (
    <div className="space-y-6">
      <CompetitorAnalysis />
      
      <Card>
        <CardHeader 
          title="📈 Análise Detalhada" 
          subtitle="Visão completa de todas as ofertas monitoradas"
        />
        <CardBody>
          <DataTable
            data={tableData}
            columns={columns}
            searchable={true}
            filterable={true}
            exportable={true}
            pageSize={15}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default AnalyticsPage;