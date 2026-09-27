import React from 'react';
import { DiagramData, DiagramType } from '../../types/math';
import { CoordinateDiagram } from './CoordinateDiagram';
import { TriangleDiagram } from './TriangleDiagram';
import { NumberLineDiagram } from './NumberLineDiagram';
import { TwoVarInequalityDiagram } from './TwoVarInequalityDiagram';
import { BoxplotDiagram } from './BoxplotDiagram';

interface Props {
  type: DiagramType;
  data?: DiagramData;
}

export const DiagramRenderer: React.FC<Props> = ({ type, data }) => {
  if (!data || type === 'none') return null;

  switch (type) {
    case 'coordinate-plane':
      return <CoordinateDiagram data={data as any} />;
    case 'triangle':
      return <TriangleDiagram data={data as any} />;
    case 'number-line':
      return <NumberLineDiagram data={data as any} />;
    case 'two-var-inequality':
      return <TwoVarInequalityDiagram data={data as any} />;
    case 'boxplot':
      return <BoxplotDiagram data={data as any} />;
    default:
      return null;
  }
};
