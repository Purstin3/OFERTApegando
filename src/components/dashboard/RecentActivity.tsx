import React from 'react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useData } from '../../context/DataContext';
import { 
  InfoIcon, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  ExternalLink
} from 'lucide-react';

const RecentActivity: React.FC = () => {
  const { timelineEvents, offers } = useData();
  
  // Get latest events, sorted by date (newest first)
  const latestEvents = [...timelineEvents]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  // Map event types to icons and badge variants
  const eventTypeInfo = {
    info: { icon: <InfoIcon size={16} />, variant: 'info' as const },
    warning: { icon: <AlertTriangle size={16} />, variant: 'warning' as const },
    success: { icon: <CheckCircle size={16} />, variant: 'success' as const },
    error: { icon: <XCircle size={16} />, variant: 'danger' as const }
  };
  
  const getOfferTitle = (offerId: string) => {
    return offers.find(offer => offer.id === offerId)?.title || 'Unknown Offer';
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader 
        title="Recent Activity" 
        subtitle="Latest events from monitored offers"
        action={
          <a href="#" className="text-sm text-blue-600 dark:text-blue-400 flex items-center">
            View all <ExternalLink size={14} className="ml-1" />
          </a>
        }
      />
      <CardBody>
        <div className="space-y-4">
          {latestEvents.length > 0 ? (
            latestEvents.map(event => {
              const { icon, variant } = eventTypeInfo[event.type];
              
              return (
                <div key={event.id} className="flex items-start">
                  <div className="flex-shrink-0 mr-3 mt-1">
                    <Badge variant={variant}>{icon}</Badge>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {event.title}
                      </h4>
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(event.date)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {event.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Offer: {getOfferTitle(event.offerId)}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No recent activity to display
            </p>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default RecentActivity;