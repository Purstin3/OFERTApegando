import React from 'react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useData } from '../../context/DataContext';
import { X, Check, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

const AlertsPanel: React.FC = () => {
  const { alerts, acknowledgeAlert, clearAlerts } = useData();
  
  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged);
  
  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <XCircle size={16} className="text-red-500" />;
      case 'medium':
        return <AlertTriangle size={16} className="text-yellow-500" />;
      default:
        return <Info size={16} className="text-blue-500" />;
    }
  };
  
  const getAlertVariant = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'danger' as const;
      case 'medium':
        return 'warning' as const;
      default:
        return 'info' as const;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (unacknowledgedAlerts.length === 0) {
    return (
      <Card>
        <CardHeader title="🔔 Alertas" />
        <CardBody>
          <div className="text-center py-6">
            <CheckCircle size={48} className="mx-auto text-green-500 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              Nenhum alerta pendente
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader 
        title="🔔 Alertas" 
        subtitle={`${unacknowledgedAlerts.length} alerta(s) pendente(s)`}
        action={
          <Button 
            variant="outline" 
            size="sm"
            onClick={clearAlerts}
          >
            Limpar todos
          </Button>
        }
      />
      <CardBody>
        <div className="space-y-3">
          {unacknowledgedAlerts.map(alert => (
            <div 
              key={alert.id} 
              className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start flex-1">
                  <div className="mr-3 mt-0.5">
                    {getAlertIcon(alert.severity)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={getAlertVariant(alert.severity)}>
                        {alert.type.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(alert.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {alert.message}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto text-green-600 hover:text-green-700"
                    onClick={() => acknowledgeAlert(alert.id)}
                  >
                    <Check size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto text-gray-400 hover:text-gray-600"
                    onClick={() => acknowledgeAlert(alert.id)}
                  >
                    <X size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default AlertsPanel;