'use client';

import { useMemo } from 'react';

interface PieChartProps {
  data: Array<{
    categoria: string;
    total: number;
    percentual: number;
    cor: string;
  }>;
}

export default function PieChart({ data }: PieChartProps) {
  console.log('PieChart data:', data); // Debug

  const chartData = useMemo(() => {
    if (data.length === 0) return [];

    let cumulativeAngle = 0;
    
    return data.map((item, index) => {
      const angle = (item.percentual / 100) * 360;
      const startAngle = cumulativeAngle;
      const endAngle = cumulativeAngle + angle;
      
      cumulativeAngle += angle;
      
      // Configurações do SVG
      const radius = 70;
      const centerX = 100;
      const centerY = 100;
      
      // Converte ângulos para radianos (começando do topo)
      const startAngleRad = (startAngle - 90) * (Math.PI / 180);
      const endAngleRad = (endAngle - 90) * (Math.PI / 180);
      
      // Calcula pontos do arco
      const x1 = centerX + radius * Math.cos(startAngleRad);
      const y1 = centerY + radius * Math.sin(startAngleRad);
      const x2 = centerX + radius * Math.cos(endAngleRad);
      const y2 = centerY + radius * Math.sin(endAngleRad);
      
      // Flag para arcos grandes (>50%)
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      // Cria path SVG para fatia
      const pathData = [
        `M ${centerX} ${centerY}`, // Move para centro
        `L ${x1} ${y1}`,            // Linha para início do arco
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`, // Arco
        'Z'                         // Fecha o path
      ].join(' ');
      
      return {
        ...item,
        pathData,
        startAngle,
        endAngle,
        angle
      };
    });
  }, [data]);

  if (data.length === 0) {
    return (
      <div style={{
        width: '180px',
        height: '180px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#64748b',
        fontSize: '0.875rem',
        textAlign: 'center',
        border: '2px dashed #e2e8f0',
        borderRadius: '50%',
        margin: '0 auto'
      }}>
        Nenhum dado para exibir
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      width: '100%',
      height: '280px',
      position: 'relative'
    }}>
      <svg 
        width="280" 
        height="280" 
        viewBox="0 0 200 200"
        style={{ 
          backgroundColor: 'transparent',
          overflow: 'visible'
        }}
      >
        {/* Background circle */}
        <circle
          cx="100"
          cy="100"
          r="70"
          fill="none"
          stroke="#f1f5f9"
          strokeWidth="2"
        />
        
        {/* Pie segments */}
        {chartData.map((segment, index) => (
          <g key={index}>
            <path
              d={segment.pathData}
              fill={segment.cor || `hsl(${index * 60}, 70%, 60%)`}
              stroke="white"
              strokeWidth="2"
              style={{
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                transformOrigin: '100px 100px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.filter = 'brightness(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.filter = 'brightness(1)';
              }}
            >
              <title>{`${segment.categoria}: ${segment.percentual.toFixed(1)}% (R$ ${segment.total.toFixed(2)})`}</title>
            </path>
          </g>
        ))}
        
        {/* Inner circle for donut effect */}
        <circle
          cx="100"
          cy="100"
          r="35"
          fill="white"
          stroke="#e2e8f0"
          strokeWidth="2"
        />
        
        {/* Central text */}
        <text
          x="100"
          y="92"
          textAnchor="middle"
          fontSize="11"
          fill="#64748b"
          fontWeight="500"
        >
          Despesas
        </text>
        <text
          x="100"
          y="108"
          textAnchor="middle"
          fontSize="12"
          fill="#1e293b"
          fontWeight="600"
        >
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }).format(data.reduce((sum, item) => sum + item.total, 0))}
        </text>
      </svg>
    </div>
  );
}