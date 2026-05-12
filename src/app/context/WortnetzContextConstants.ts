import { PhysicsKeyframe } from './WortnetzContextTypes';

export const EMPTY_PHYSICS_KFS = { 
  'phys-rep': [] as PhysicsKeyframe[], 
  'phys-spk': [] as PhysicsKeyframe[], 
  'phys-dmp': [] as PhysicsKeyframe[],
  'phys-min': [] as PhysicsKeyframe[],
  'phys-lnk': [] as PhysicsKeyframe[],
  'phys-grv': [] as PhysicsKeyframe[],
  'phys-trb': [] as PhysicsKeyframe[],
  'phys-vto': [] as PhysicsKeyframe[],
  'phys-pls': [] as PhysicsKeyframe[]
};

export const PHYS_TRACK_PARAM: Record<string, string> = { 
  'phys-rep': 'repulsion', 
  'phys-spk': 'springK', 
  'phys-dmp': 'damping',
  'phys-min': 'minSpeed',
  'phys-lnk': 'linkDistance',
  'phys-grv': 'gravity',
  'phys-trb': 'turbulence',
  'phys-vto': 'verticalOrder',
  'phys-pls': 'pulse'
};
