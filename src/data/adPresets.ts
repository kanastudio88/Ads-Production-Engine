import { AdFormatPreset } from '../types';

export const AD_PRESETS: AdFormatPreset[] = [
  {
    id: '10x1',
    code: '10x1',
    name: '10x1 (Single Column)',
    widthMm: 30,
    heightMm: 100,
    columns: 1,
    borderWidth: 0.5,
    borderStyle: 'solid',
    fontSize: 5.0,
    lineHeight: 6.8,
    description: '100mm tinggi x 30mm lebar (1 Kolum · 0.5pt line · 5pt font)'
  },
  {
    id: '10x2',
    code: '10x2',
    name: '10x2 (Standard Quarter)',
    widthMm: 63,
    heightMm: 100,
    columns: 2,
    borderWidth: 0.5,
    borderStyle: 'solid',
    fontSize: 5.0,
    lineHeight: 6.8,
    description: '100mm tinggi x 63mm lebar (2 Kolum · 0.5pt line · 5pt font)'
  },
  {
    id: '15x2',
    code: '15x2',
    name: '15x2 (Standard Half-Page V)',
    widthMm: 63,
    heightMm: 150,
    columns: 1,
    borderWidth: 0.5,
    borderStyle: 'solid',
    fontSize: 5.0,
    lineHeight: 6.8,
    description: '150mm tinggi x 63mm lebar (1 Kolum · 0.5pt line · 5pt font)'
  },
  {
    id: '20x2',
    code: '20x2',
    name: '20x2 (Tall Column)',
    widthMm: 63,
    heightMm: 200,
    columns: 2,
    borderWidth: 0.5,
    borderStyle: 'solid',
    fontSize: 5.0,
    lineHeight: 6.8,
    description: '200mm tinggi x 63mm lebar (2 Kolum · 0.5pt line · 5pt font)'
  },
  {
    id: '12x3',
    code: '12x3',
    name: '12x3 (Wide Banner)',
    widthMm: 96,
    heightMm: 120,
    columns: 3,
    borderWidth: 0.5,
    borderStyle: 'solid',
    fontSize: 5.0,
    lineHeight: 6.8,
    description: '120mm tinggi x 96mm lebar (3 Kolum · 0.5pt line · 5pt font)'
  },
  {
    id: '15x4',
    code: '15x4',
    name: '15x4 (Quarter Page Wide)',
    widthMm: 130,
    heightMm: 150,
    columns: 4,
    borderWidth: 0.75,
    borderStyle: 'solid',
    fontSize: 5.0,
    lineHeight: 6.8,
    description: '150mm tinggi x 130mm lebar (4 Kolum · 0.75pt line · 5pt font)'
  },
  {
    id: '25x2',
    code: '25x2',
    name: '25x2 (Full Column Strip)',
    widthMm: 63,
    heightMm: 250,
    columns: 2,
    borderWidth: 0.5,
    borderStyle: 'solid',
    fontSize: 5.0,
    lineHeight: 6.8,
    description: '250mm tinggi x 63mm lebar (Full Height Strip · 5pt font)'
  },
  {
    id: '27x8',
    code: '27x8',
    name: 'Full Page Box',
    widthMm: 195,
    heightMm: 270,
    columns: 4,
    borderWidth: 1.0,
    borderStyle: 'solid',
    fontSize: 6.0,
    lineHeight: 8.0,
    description: '270mm tinggi x 195mm lebar (4 Kolum · 1.0pt line)'
  }
];
