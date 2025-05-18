import React from 'react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { useData } from '../../context/DataContext';
import { useCompetitorAnalysis } from '../../hooks/useCompetitorAnalysis';

const CompetitorAnalysis: React.FC = () => {
  const { offers, adCounts } = useData();
  const analysis = useCompetitorAnalysis(offers, adCounts);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Market Share */}
      <Card>
        <CardHeader title="📊 Share de Mercado (Últimos 30 dias)" />
        <CardBody>
          <div className="space-y-4">
            {analysis.marketShare.slice(0, 5).map(competitor => (
              <div key={competitor.id} className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {competitor.name}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    {competitor.platform}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900 dark:text-white">
                    {competitor.percentage}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {competitor.avgAds} anúncios/dia
                  </div>
                </div>
              </div>
            ))}
            {analysis.marketShare.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                Dados insuficientes para análise
              </p>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Seasonal Patterns */}
      <Card>
        <CardHeader title="📅 Padrões Sazonais" />
        <CardBody>
          <div className="space-y-3">
            {analysis.seasonalPatterns.map((pattern, index) => (
              <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {pattern.period}
                  </span>
                  <span className={`text-sm font-medium ${
                    pattern.trend > 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : pattern.trend < 0 
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {pattern.trend > 0 ? '+' : ''}{pattern.trend}%
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                  {pattern.insight}
                </p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default CompetitorAnalysis;