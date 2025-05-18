import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Search, Filter, Download } from 'lucide-react';
import { Button } from './Button';
import { Column } from '../../types';

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  filterable?: boolean;
  exportable?: boolean;
  pageSize?: number;
}

export function DataTable<T>({ 
  data, 
  columns, 
  searchable = true,
  filterable = true,
  exportable = true,
  pageSize = 10 
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{field: keyof T; direction: 'asc' | 'desc'} | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, any>>({});

  const filteredAndSortedData = useMemo(() => {
    let result = data;

    // Aplicar busca
    if (searchTerm) {
      result = result.filter(item =>
        columns.some(col => {
          const value = item[col.field];
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Aplicar filtros
    Object.entries(filters).forEach(([field, value]) => {
      if (value) {
        result = result.filter(item => item[field as keyof T] === value);
      }
    });

    // Aplicar ordenação
    if (sortConfig) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.field];
        const bVal = b[sortConfig.field];
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, filters, sortConfig, columns]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedData.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize);

  return (
    <div className="space-y-4">
      {/* Controles */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {searchable && (
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
          )}
          
          {filterable && (
            <Button variant="outline" icon={<Filter size={16} />}>
              Filtros
            </Button>
          )}
        </div>
        
        {exportable && (
          <Button variant="outline" icon={<Download size={16} />}>
            Exportar
          </Button>
        )}
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {columns.map(column => (
                <th
                  key={String(column.field)}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => {
                    if (column.sortable) {
                      setSortConfig(prev => ({
                        field: column.field,
                        direction: prev?.field === column.field && prev.direction === 'asc' ? 'desc' : 'asc'
                      }));
                    }
                  }}
                >
                  <div className="flex items-center">
                    {column.header}
                    {column.sortable && (
                      <span className="ml-1">
                        {sortConfig?.field === column.field ? (
                          sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                        ) : (
                          <ChevronDown size={16} className="opacity-50" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {paginatedData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                {columns.map(column => (
                  <td key={String(column.field)} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {column.render ? column.render(item) : String(item[column.field])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Mostrando {((currentPage - 1) * pageSize) + 1} a {Math.min(currentPage * pageSize, filteredAndSortedData.length)} de {filteredAndSortedData.length} resultados
        </span>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Anterior
          </Button>
          
          <span className="flex items-center px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
            {currentPage} de {totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
}