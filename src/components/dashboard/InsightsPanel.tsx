import React from 'react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { useData } from '../../context/DataContext';
import { useInsights } from '../../hooks/useInsights';

const InsightsPanel: React.FC = () => {
  const { offers, adCounts } = useData();
  const insights = useInsights(offers, adCounts);

  if (insights.length === 0) {
    return (
      <Card>
        <CardHeader title="🧠 Insights Inteligentes" />
        <CardBody>
          <div className="text-center py-6">
            <p className="text-gray-500 dark:text-gray-400">
              Nenhum insight disponível no momento. Adicione mais dados para gerar insights.
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title="🧠 Insights Inteligentes" />
      <CardBody>
        <div className="space-y-4">
          {insights.map(insight => (
            <div key={insight.id} className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <div className="flex items-start">
                <insight.icon className="mt-1 mr-3 text-blue-600 dark:text-blue-400" size={20} />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {insight.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {insight.description}
                  </p>
                  {insight.action && (
                    <button 
                      onClick={insight.action.onClick}
                      className="mt-2 text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline"
                    >
                      {insight.action.label}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default InsightsPanel;