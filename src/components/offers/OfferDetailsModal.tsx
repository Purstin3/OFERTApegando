import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  X,
  ExternalLink,
  Calendar,
  TrendingUp,
  TrendingDown,
  Edit,
  Pause,
  Play,
  BarChart3,
  Clock,
  Activity
} from 'lucide-react';
import { Offer, AdCount, TimelineEvent } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card, CardHeader, CardBody } from '../ui/Card';

interface OfferDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: Offer;
  adCounts: AdCount[];
  timelineEvents: TimelineEvent[];
  onEdit?: (offer: Offer) => void;
  onPause?: (offerId: string) => void;
  onResume?: (offerId: string) => void;
}

const OfferDetailsModal: React.FC<OfferDetailsModalProps> = ({
  isOpen,
  onClose,
  offer,
  adCounts,
  timelineEvents,
  onEdit,
  onPause,
  onResume
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'timeline'>('overview');

  if (!isOpen) return null;

  // Processar dados para o gráfico
  const chartData = React.useMemo(() => {
    // Últimos 30 dias
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }

    return days.map(date => {
      const dayCount = adCounts.find(count =>
        new Date(count.date).toISOString().split('T')[0] === date
      );

      return {
        date: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        count: dayCount ? dayCount.count : 0,
        fullDate: date
      };
    });
  }, [adCounts]);

  // Estatísticas
  const stats = React.useMemo(() => {
    if (adCounts.length === 0) {
      return { current: 0, trend: 0, max: 0, min: 0, avg: 0, dataPoints: 0 };
    }

    const sortedCounts = [...adCounts].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const current = sortedCounts[0]?.count || 0;
    const previous = sortedCounts[1]?.count || 0;
    const max = Math.max(...adCounts.map(c => c.count));
    const min = Math.min(...adCounts.map(c => c.count));
    const avg = Math.round(adCounts.reduce((sum, c) => sum + c.count, 0) / adCounts.length);

    const trend = previous > 0
      ? Math.round(((current - previous) / previous) * 100)
      : 0;

    return { current, trend, max, min, avg, dataPoints: adCounts.length };
  }, [adCounts]);

  // Platform info
  const platformInfo = {
    facebook: { name: 'Facebook', color: 'bg-blue-500', icon: '📘' },
    instagram: { name: 'Instagram', color: 'bg-pink-500', icon: '📷' },
    google: { name: 'Google', color: 'bg-red-500', icon: '🔍' },
    youtube: { name: 'YouTube', color: 'bg-red-600', icon: '📹' },
    tiktok: { name: 'TikTok', color: 'bg-black', icon: '🎵' },
    linkedin: { name: 'LinkedIn', color: 'bg-blue-700', icon: '💼' },
    twitter: { name: 'Twitter', color: 'bg-blue-400', icon: '🐦' },
    snapchat: { name: 'Snapchat', color: 'bg-yellow-400', icon: '👻' },
    pinterest: { name: 'Pinterest', color: 'bg-red-700', icon: '📌' },
    other: { name: 'Other', color: 'bg-gray-500', icon: '📱' }
  };

  const platform = platformInfo[offer.platform as keyof typeof platformInfo] || platformInfo.other;
  const isPaused = (offer as any).isPaused || false;

  // Timeline events filtrados para esta oferta
  const offerEvents = timelineEvents.filter(event => event.offerId === offer.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{platform.icon}</span>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {offer.title}
                </h2>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="primary">{platform.name}</Badge>
                  {isPaused && (
                    <Badge variant="warning">Pausado</Badge>
                  )}
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Criado em {new Date(offer.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                icon={<Edit size={16} />}
                onClick={() => onEdit(offer)}
              >
                Editar
              </Button>
            )}

            {!isPaused && onPause && (
              <Button
                variant="outline"
                size="sm"
                icon={<Pause size={16} />}
                onClick={() => onPause(offer.id)}
              >
                Pausar
              </Button>
            )}

            {isPaused && onResume && (
              <Button
                variant="primary"
                size="sm"
                icon={<Play size={16} />}
                onClick={() => onResume(offer.id)}
              >
                Retomar
              </Button>
            )}

            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {[
            { key: 'overview', label: 'Visão Geral', icon: <BarChart3 size={16} /> },
            { key: 'history', label: 'Histórico', icon: <Clock size={16} /> },
            { key: 'timeline', label: 'Timeline', icon: <Activity size={16} /> }
          ].map(tab => (
            <button
              key={tab.key}
              className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab(tab.key as any)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardBody className="text-center p-4">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.current}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Anúncios Atuais
                    </div>
                    <div className="flex items-center justify-center mt-1">
                      {stats.trend > 0 ? (
                        <span className="flex items-center text-green-500 text-xs">
                          <TrendingUp size={12} className="mr-1" />
                          +{stats.trend}%
                        </span>
                      ) : stats.trend < 0 ? (
                        <span className="flex items-center text-red-500 text-xs">
                          <TrendingDown size={12} className="mr-1" />
                          {stats.trend}%
                        </span>
                      ) : (
                        <span className="text-gray-500 text-xs">Sem mudança</span>
                      )}
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody className="text-center p-4">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.max}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Pico Máximo
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody className="text-center p-4">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.avg}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Média
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody className="text-center p-4">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.dataPoints}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Pontos de Dados
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Chart */}
              <Card>
                <CardHeader title="Evolução - Últimos 30 Dias" />
                <CardBody>
                  <div className="h-64">
                    {chartData.length > 0 ? (
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
                              borderRadius: '8px'
                            }}
                            labelFormatter={(value, payload) => {
                              const fullDate = payload?.[0]?.payload?.fullDate;
                              return fullDate ? new Date(fullDate).toLocaleDateString('pt-BR') : value;
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#3B82F6' }}
                            activeDot={{ r: 6, fill: '#3B82F6' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        Nenhum dado disponível para gráfico
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>

              {/* Info */}
              <Card>
                <CardHeader title="Informações da Oferta" />
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Descrição
                      </label>
                      <p className="text-gray-900 dark:text-white mt-1">
                        {offer.description}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        URL da Biblioteca de Anúncios
                      </label>
                      
                        href={offer.adLibraryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 dark:text-blue-400 hover:underline mt-1"
                      >
                        Abrir Ad Library <ExternalLink size={14} className="ml-1" />
                      </a>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Última Atualização
                      </label>
                      <p className="text-gray-900 dark:text-white mt-1">
                        {new Date(offer.updatedAt).toLocaleString('pt-BR')}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Status
                      </label>
                      <div className="mt-1">
                        <Badge variant={isPaused ? 'warning' : 'success'}>
                          {isPaused ? 'Pausado' : 'Ativo'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {activeTab === 'history' && (
            <Card>
              <CardHeader title="Histórico de Contagens" />
              <CardBody>
                <div className="overflow-x-auto">
                  {adCounts.length > 0 ? (
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                            Data
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                            Contagem
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                            Variação
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                            Notas
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {adCounts
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .map((count, index) => {
                            const prevCount = adCounts
                              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[index + 1];
                            const variation = prevCount
                              ? count.count - prevCount.count
                              : 0;

                            return (
                              <tr key={count.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="py-3 px-4">
                                  <div className="flex items-center">
                                    <Calendar size={14} className="mr-2 text-gray-400" />
                                    {new Date(count.date).toLocaleString('pt-BR')}
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="font-semibold text-gray-900 dark:text-white">
                                    {count.count}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  {variation !== 0 && (
                                    <span className={`flex items-center ${
                                      variation > 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                      {variation > 0 ? (
                                        <TrendingUp size={14} className="mr-1" />
                                      ) : (
                                        <TrendingDown size={14} className="mr-1" />
                                      )}
                                      {variation > 0 ? '+' : ''}{variation}
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                                  {count.notes || '-'}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      Nenhum dado de contagem disponível
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === 'timeline' && (
            <Card>
              <CardHeader title="Timeline de Eventos" />
              <CardBody>
                <div className="space-y-4">
                  {offerEvents.length > 0 ? (
                    offerEvents.map(event => {
                      const eventIcons = {
                        info: <Activity className="text-blue-500" size={16} />,
                        warning: <Activity className="text-yellow-500" size={16} />,
                        success: <Activity className="text-green-500" size={16} />,
                        error: <Activity className="text-red-500" size={16} />
                      };

                      return (
                        <div key={event.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                          <div className="mt-1">
                            {eventIcons[event.type]}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {event.title}
                              </h4>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(event.date).toLocaleString('pt-BR')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              {event.description}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      Nenhum evento registrado para esta oferta
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferDetailsModal;